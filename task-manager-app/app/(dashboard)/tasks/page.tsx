import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getTasks } from '@/lib/actions/tasks'
import { AddTaskModal } from '@/components/add-task-modal'
import { TaskListClient } from '@/components/task-list-client'

export default async function TasksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tasks } = await getTasks()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Tasks</h1>
        <AddTaskModal />
      </div>

      <TaskListClient tasks={tasks} emptyMessage="No tasks yet. Add your first task!" />
    </div>
  )
}
