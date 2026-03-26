import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, Hourglass, Check, ThumbsUp, Bell, CalendarDays } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getTasks, type Task } from '@/lib/actions/tasks'
import { SearchBar } from '@/components/search-bar'
import { TaskListClient } from '@/components/task-list-client'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [profileResult, tasksResult] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', user.id).single(),
    getTasks(),
  ])

  const profile = profileResult.data
  const tasks = tasksResult.tasks

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const greeting = getGreeting()

  const todoCount = tasks.filter((t) => t.status === 'Todo').length
  const progressCount = tasks.filter((t) => t.status === 'Progress').length
  const doneCount = tasks.filter((t) => t.status === 'Done').length
  const recentTasks = tasks.slice(0, 3)

  const now = new Date()
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  const upcomingReminders = tasks
    .filter((t): t is Task & { reminder_at: string } =>
      t.reminder_at !== null &&
      t.status !== 'Done' &&
      new Date(t.reminder_at) >= now &&
      new Date(t.reminder_at) <= in24h,
    )
    .slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <p className="text-gray-500 text-sm mb-1">{greeting}, {firstName}!</p>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">
          You have {tasks.length} task{tasks.length !== 1 ? 's' : ''} available{' '}
          <ThumbsUp className="inline w-6 h-6 text-yellow-500" />
        </h1>
      </div>

      {/* Search */}
      <SearchBar allTasks={tasks} />

      {/* Status circles */}
      <div className="flex justify-between gap-2">
        <Link href="/todo" className="flex-1">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-400 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <FileText className="w-7 h-7 text-red-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{todoCount}</p>
              <p className="text-xs text-gray-500">To-Do</p>
            </div>
          </div>
        </Link>

        <Link href="/progress" className="flex-1">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
              <Hourglass className="w-7 h-7 text-amber-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{progressCount}</p>
              <p className="text-xs text-gray-500">Progress</p>
            </div>
          </div>
        </Link>

        <Link href="/done" className="flex-1">
          <div className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-teal-400 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <Check className="w-7 h-7 text-teal-500" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{doneCount}</p>
              <p className="text-xs text-gray-500">Done</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Upcoming reminders — only shown when there are reminders within 24h */}
      {upcomingReminders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-semibold text-amber-800">
              Upcoming Reminders
              <span className="ml-2 bg-amber-200 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded-full">
                {upcomingReminders.length}
              </span>
            </h2>
          </div>
          <ul className="space-y-2">
            {upcomingReminders.map((t) => {
              const reminderDate = new Date(t.reminder_at)
              const diffMs = reminderDate.getTime() - now.getTime()
              const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
              const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
              const timeLabel = diffHrs > 0 ? `in ${diffHrs}h ${diffMins}m` : `in ${diffMins}m`

              return (
                <li key={t.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <CalendarDays className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="text-sm text-amber-900 font-medium truncate">{t.title}</span>
                  </div>
                  <span className="text-xs text-amber-600 flex-shrink-0 font-mono">{timeLabel}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Recent tasks strip */}
      <div className="bg-gradient-to-br from-white to-slate-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-500 bg-clip-text text-transparent">Tasks</h2>
          <Link
            href="/tasks"
            className="text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-100 px-3 py-1 rounded-full transition-all"
          >
            See all
          </Link>
        </div>
        <TaskListClient tasks={recentTasks} variant="horizontal" emptyMessage="No tasks yet" />
      </div>
    </div>
  )
}
