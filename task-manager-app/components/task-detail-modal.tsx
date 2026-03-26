'use client'

import { useState, useTransition } from 'react'
import { FileText, Hourglass, Check, Trash2, Pencil, CalendarDays, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { type Task, type TaskStatus, moveTask, updateTask, deleteTask } from '@/lib/actions/tasks'
import { StatusBadge } from '@/components/status-badge'

interface TaskDetailModalProps {
  task: Task
  open: boolean
  onClose: () => void
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Convert ISO/TIMESTAMPTZ string from DB to value usable in <input type="date"> */
function toDateInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.split('T')[0]
}

/** Convert ISO/TIMESTAMPTZ string from DB to value usable in <input type="datetime-local"> */
function toDateTimeInputValue(iso: string | null): string {
  if (!iso) return ''
  return iso.slice(0, 16)
}

export function TaskDetailModal({ task, open, onClose }: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [showSchedule, setShowSchedule] = useState(false)
  const [dueDate, setDueDate] = useState(toDateInputValue(task.due_date))
  const [reminderAt, setReminderAt] = useState(toDateTimeInputValue(task.reminder_at))
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClose() {
    setIsEditing(false)
    setTitle(task.title)
    setDescription(task.description)
    setShowSchedule(false)
    setDueDate(toDateInputValue(task.due_date))
    setReminderAt(toDateTimeInputValue(task.reminder_at))
    setError(null)
    onClose()
  }

  function handleMove(status: TaskStatus) {
    startTransition(async () => {
      await moveTask(task.id, status)
      handleClose()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTask(task.id)
      handleClose()
    })
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError("Title can't be empty"); return }
    if (!description.trim()) { setError("Description can't be empty"); return }

    startTransition(async () => {
      const result = await updateTask(
        task.id,
        title.trim(),
        description.trim(),
        dueDate || null,
        reminderAt || null,
      )
      if (result?.error) {
        setError(result.error)
      } else {
        setIsEditing(false)
        setShowSchedule(false)
        setError(null)
      }
    })
  }

  const hasDueDate = Boolean(task.due_date)
  const hasReminder = Boolean(task.reminder_at)

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="rounded-2xl w-[90vw] max-w-sm">
        {isEditing ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl">Update Todo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdate} className="space-y-4 mt-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Todo title"
                className="rounded-xl"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={3}
                className="rounded-xl resize-none"
              />

              {/* Schedule toggle */}
              <button
                type="button"
                onClick={() => setShowSchedule((v) => !v)}
                className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                <CalendarDays className="w-4 h-4 text-green-500" />
                <span>Schedule</span>
                {showSchedule
                  ? <ChevronUp className="w-3.5 h-3.5 ml-auto" />
                  : <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                }
              </button>

              {showSchedule && (
                <div className="bg-gray-50 rounded-xl p-3 space-y-3 border border-gray-100">
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <CalendarDays className="w-3.5 h-3.5 text-green-500" />
                      Due date
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="rounded-xl h-9 text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <Bell className="w-3.5 h-3.5 text-amber-500" />
                      Reminder
                    </label>
                    <Input
                      type="datetime-local"
                      value={reminderAt}
                      onChange={(e) => setReminderAt(e.target.value)}
                      className="rounded-xl h-9 text-sm"
                    />
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
                >
                  {isPending ? 'Saving...' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setIsEditing(false); setShowSchedule(false); setError(null) }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between gap-3 pr-6">
                <DialogTitle className="text-xl leading-tight">{task.title}</DialogTitle>
                <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                  <button
                    title="To-Do"
                    onClick={() => handleMove('Todo')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      task.status === 'Todo'
                        ? 'bg-red-500 border-red-500 text-white'
                        : 'bg-red-50 border-red-400 text-red-400 hover:bg-red-100'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                  </button>
                  <button
                    title="In Progress"
                    onClick={() => handleMove('Progress')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      task.status === 'Progress'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-amber-50 border-amber-400 text-amber-400 hover:bg-amber-100'
                    }`}
                  >
                    <Hourglass className="w-3 h-3" />
                  </button>
                  <button
                    title="Done"
                    onClick={() => handleMove('Done')}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      task.status === 'Done'
                        ? 'bg-teal-500 border-teal-500 text-white'
                        : 'bg-teal-50 border-teal-400 text-teal-400 hover:bg-teal-100'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-1">
              <StatusBadge status={task.status} />
            </div>

            <p className="text-gray-600 text-sm mt-2">{task.description}</p>

            {/* Schedule info block — only shown when at least one field is set */}
            {(hasDueDate || hasReminder) && (
              <div className="bg-gray-50 rounded-xl p-3 mt-3 border border-gray-100 space-y-2">
                {hasDueDate && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarDays className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-14">Due</span>
                    <span>{formatDate(task.due_date!)}</span>
                  </div>
                )}
                {hasReminder && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Bell className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide w-14">Remind</span>
                    <span>{formatDateTime(task.reminder_at!)}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-4">
              <Button
                onClick={() => { setIsEditing(true); setShowSchedule(hasDueDate || hasReminder) }}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl gap-1.5"
              >
                <Pencil className="w-3.5 h-3.5" />
                Update
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPending}
                variant="outline"
                className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
