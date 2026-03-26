'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export type TaskStatus = 'Todo' | 'Progress' | 'Done'

export interface Task {
  id: string
  user_id: string
  title: string
  description: string
  status: TaskStatus
  due_date: string | null
  reminder_at: string | null
  created_at: string
  updated_at: string
}

export async function createTask(
  title: string,
  description: string,
  dueDate?: string | null,
  reminderAt?: string | null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('tasks').insert({
    user_id: user.id,
    title,
    description,
    status: 'Todo',
    ...(dueDate ? { due_date: dueDate } : {}),
    ...(reminderAt ? { reminder_at: reminderAt } : {}),
  })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function updateTask(
  id: string,
  title: string,
  description: string,
  dueDate?: string | null,
  reminderAt?: string | null,
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .update({
      title,
      description,
      updated_at: new Date().toISOString(),
      due_date: dueDate ?? null,
      reminder_at: reminderAt ?? null,
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function moveTask(id: string, status: TaskStatus) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('tasks')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function deleteTask(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from('tasks').delete().eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function getTasks() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return { error: error.message, tasks: [] as Task[] }

  return { tasks: (data as Task[]) ?? [] }
}

export async function getTasksByStatus(status: TaskStatus) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (error) return { error: error.message, tasks: [] as Task[] }

  return { tasks: (data as Task[]) ?? [] }
}
