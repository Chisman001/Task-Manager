import { redirect } from 'next/navigation'
import { Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getTasksByStatus } from '@/lib/actions/tasks'
import { TaskListClient } from '@/components/task-list-client'

export default async function DonePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { tasks } = await getTasksByStatus('Done')

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-teal-400 flex items-center justify-center">
          <Check className="w-5 h-5 text-teal-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Completed Tasks</h1>
          <p className="text-sm text-gray-500">{tasks.length} task{tasks.length !== 1 ? 's' : ''} completed</p>
        </div>
      </div>
      <TaskListClient tasks={tasks} emptyMessage="No completed tasks yet" />
    </div>
  )
}
