import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutDashboard, ListTodo, Settings } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { UserAvatar } from '@/components/user-avatar'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <ListTodo className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900 text-lg">TaskFlow</span>
        </div>
        <Link href="/settings">
          <UserAvatar
            fullName={profile?.full_name}
            avatarUrl={profile?.avatar_url}
            className="w-9 h-9 cursor-pointer hover:ring-2 hover:ring-green-400 transition-all"
          />
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-lg mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-10">
        <div className="max-w-lg mx-auto flex">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center gap-1 py-3 text-gray-500 hover:text-green-600 transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
