import { type TaskStatus } from '@/lib/actions/tasks'
import { cn } from '@/lib/utils'

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  Todo: {
    label: 'To-Do',
    className: 'bg-red-100 text-red-700 border border-red-300',
  },
  Progress: {
    label: 'In Progress',
    className: 'bg-amber-100 text-amber-700 border border-amber-300',
  },
  Done: {
    label: 'Done',
    className: 'bg-emerald-100 text-teal-700 border border-teal-300',
  },
}

interface StatusBadgeProps {
  status: TaskStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
