import { redirect } from 'next/navigation'
import { Hourglass } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getTasksByStatus } from '@/lib/actions/tasks'
import { TaskListClient } from '@/components/task-list-client'
import { AddTaskModal } from '@/components/add-task-modal'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tasks } = await getTasksByStatus('Progress')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center">
            <Hourglass className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">In Progress</h1>
            <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <AddTaskModal />
      </div>
      <TaskListClient tasks={tasks} emptyMessage="No tasks in progress" />
    </div>
  )
}
