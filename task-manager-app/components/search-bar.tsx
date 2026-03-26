'use client'

import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { type Task } from '@/lib/actions/tasks'
import { TaskCard } from '@/components/task-card'
import { TaskDetailModal } from '@/components/task-detail-modal'

interface SearchBarProps {
  allTasks: Task[]
}

export function SearchBar({ allTasks }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [, startTransition] = useTransition()

  const filtered = query.trim()
    ? allTasks.filter(
        (t) =>
          t.title.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="relative">
      <div className="flex items-center bg-gray-100 rounded-xl px-4 py-2.5 gap-3">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <Input
          type="text"
          placeholder="Search a task..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border-0 bg-transparent p-0 h-auto focus-visible:ring-0 text-sm placeholder:text-gray-400"
        />
      </div>

      {query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 p-4 text-center">No tasks found</p>
          ) : (
            <div className="p-2 flex flex-col gap-2">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={(t) => {
                    setSelectedTask(t)
                    setQuery('')
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => startTransition(() => setSelectedTask(null))}
        />
      )}
    </div>
  )
}
