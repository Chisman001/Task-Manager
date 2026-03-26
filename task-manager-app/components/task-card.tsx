import { CalendarDays, Bell } from 'lucide-react'
import { type Task } from '@/lib/actions/tasks'
import { StatusBadge } from '@/components/status-badge'

interface TaskCardProps {
  task: Task
  onClick: (task: Task) => void
  variant?: 'horizontal' | 'vertical'
}

const horizontalColors: Record<string, string> = {
  Todo: 'bg-gradient-to-br from-red-400 to-rose-600',
  Progress: 'bg-gradient-to-br from-amber-400 to-orange-500',
  Done: 'bg-gradient-to-br from-teal-400 to-emerald-600',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TaskCard({ task, onClick, variant = 'vertical' }: TaskCardProps) {
  if (variant === 'horizontal') {
    return (
      <button
        onClick={() => onClick(task)}
        className={`min-w-[180px] h-[120px] ${horizontalColors[task.status]} rounded-xl p-4 text-left text-white shadow-lg hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-200 flex-shrink-0`}
      >
        <h3 className="font-bold text-base mb-1 line-clamp-1">{task.title}</h3>
        <p className="text-white/80 text-sm line-clamp-2">{task.description}</p>
      </button>
    )
  }

  const hasDueDate = Boolean(task.due_date)
  const hasReminder = Boolean(task.reminder_at)

  return (
    <button
      onClick={() => onClick(task)}
      className="w-full text-left bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 min-h-[100px]"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>

      {(hasDueDate || hasReminder) && (
        <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-red-100">
          {hasDueDate && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <CalendarDays className="w-3 h-3 text-green-500" />
              {formatDate(task.due_date!)}
            </span>
          )}
          {hasReminder && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Bell className="w-3 h-3 text-amber-500" />
              {formatDateTime(task.reminder_at!)}
            </span>
          )}
        </div>
      )}
    </button>
  )
}
