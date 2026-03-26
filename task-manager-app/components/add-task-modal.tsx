'use client'

import { useState, useTransition } from 'react'
import { Plus, CalendarDays, Bell, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createTask } from '@/lib/actions/tasks'

export function AddTaskModal() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [showSchedule, setShowSchedule] = useState(false)
  const [dueDate, setDueDate] = useState('')
  const [reminderAt, setReminderAt] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleClose() {
    setOpen(false)
    setTitle('')
    setDescription('')
    setShowSchedule(false)
    setDueDate('')
    setReminderAt('')
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError("Title can't be empty")
      return
    }
    if (!description.trim()) {
      setError("Description can't be empty")
      return
    }

    startTransition(async () => {
      const result = await createTask(
        title.trim(),
        description.trim(),
        dueDate || null,
        reminderAt || null,
      )
      if (result?.error) {
        setError(result.error)
      } else {
        handleClose()
      }
    })
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-xl gap-1.5"
      >
        <Plus className="w-4 h-4" />
        Add Task
      </Button>

      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="rounded-2xl w-[90vw] max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Todo</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <Input
                placeholder="Todo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl"
              />
            </div>

            <div>
              <Textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="rounded-xl resize-none"
              />
            </div>

            {/* Schedule toggle */}
            <button
              type="button"
              onClick={() => setShowSchedule((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors group"
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
                    min={new Date().toISOString().split('T')[0]}
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
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl"
              >
                {isPending ? 'Adding...' : 'Add'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
