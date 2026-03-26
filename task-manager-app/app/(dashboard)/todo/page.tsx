import { redirect } from 'next/navigation'
import { FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getTasksByStatus } from '@/lib/actions/tasks'
import { TaskListClient } from '@/components/task-list-client'
import { AddTaskModal } from '@/components/add-task-modal'

export default async function TodoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tasks } = await getTasksByStatus('Todo')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">To-Do Tasks</h1>
            <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <AddTaskModal />
      </div>
      <TaskListClient tasks={tasks} emptyMessage="No to-do tasks" />
    </div>
  )
}
