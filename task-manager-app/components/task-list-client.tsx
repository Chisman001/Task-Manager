'use client'

import { useState } from 'react'
import { type Task } from '@/lib/actions/tasks'
import { TaskCard } from '@/components/task-card'
import { TaskDetailModal } from '@/components/task-detail-modal'
import { ClipboardList } from 'lucide-react'

interface TaskListClientProps {
  tasks: Task[]
  variant?: 'horizontal' | 'vertical'
  emptyMessage?: string
}

export function TaskListClient({ tasks, variant = 'vertical', emptyMessage = 'No tasks yet' }: TaskListClientProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ClipboardList className="w-16 h-16 text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-400">{emptyMessage}</h3>
        <p className="text-sm text-gray-400 mt-1">No tasks have been added yet</p>
      </div>
    )
  }

  return (
    <>
      {variant === 'horizontal' ? (
        <div className="flex flex-row gap-4 overflow-x-auto pb-2 px-1">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={setSelectedTask} variant="horizontal" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={setSelectedTask} variant="vertical" />
          ))}
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          open={!!selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}
