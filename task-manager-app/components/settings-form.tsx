'use client'

import { useState, useTransition } from 'react'
import { updateProfile, updatePassword } from '@/lib/actions/profile'
import { signOut } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { UserAvatar } from '@/components/user-avatar'
import { LogOut, Save, Lock } from 'lucide-react'

interface SettingsFormProps {
  fullName: string | null
  avatarUrl: string | null
  email: string
}

export function SettingsForm({ fullName, avatarUrl, email }: SettingsFormProps) {
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [previewAvatar, setPreviewAvatar] = useState(avatarUrl)
  const [isPendingProfile, startProfileTransition] = useTransition()
  const [isPendingPassword, startPasswordTransition] = useTransition()
  const [isPendingSignOut, startSignOutTransition] = useTransition()

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileMsg(null)
    const formData = new FormData(e.currentTarget)
    startProfileTransition(async () => {
      const result = await updateProfile(formData)
      if (result?.error) {
        setProfileMsg({ type: 'error', text: result.error })
      } else {
        setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
      }
    })
  }

  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordMsg(null)
    const formData = new FormData(e.currentTarget)
    startPasswordTransition(async () => {
      const result = await updatePassword(formData)
      if (result?.error) {
        setPasswordMsg({ type: 'error', text: result.error })
      } else {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully!' })
        ;(e.target as HTMLFormElement).reset()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Profile</h2>

        <div className="flex items-center gap-4 mb-5">
          <UserAvatar fullName={fullName} avatarUrl={previewAvatar} className="w-14 h-14" />
          <div>
            <p className="font-medium text-gray-900">{fullName ?? 'No name set'}</p>
            <p className="text-sm text-gray-500">{email}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <Input
              name="full_name"
              defaultValue={fullName ?? ''}
              placeholder="Your full name"
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <Input
              name="avatar_url"
              defaultValue={avatarUrl ?? ''}
              placeholder="https://example.com/avatar.jpg"
              className="rounded-xl"
              onChange={(e) => setPreviewAvatar(e.target.value || null)}
            />
          </div>

          {profileMsg && (
            <p className={`text-sm p-3 rounded-xl ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {profileMsg.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPendingProfile}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl gap-2"
          >
            <Save className="w-4 h-4" />
            {isPendingProfile ? 'Saving...' : 'Save changes'}
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <Input
              name="new_password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              className="rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <Input
              name="confirm_password"
              type="password"
              placeholder="••••••••"
              minLength={6}
              required
              className="rounded-xl"
            />
          </div>

          {passwordMsg && (
            <p className={`text-sm p-3 rounded-xl ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
              {passwordMsg.text}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPendingPassword}
            variant="outline"
            className="w-full rounded-xl gap-2 border-gray-200"
          >
            <Lock className="w-4 h-4" />
            {isPendingPassword ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>

      {/* Sign Out */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-2">Account</h2>
        <p className="text-sm text-gray-500 mb-4">Signed in as {email}</p>
        <form action={async () => {
          startSignOutTransition(async () => { await signOut() })
        }}>
          <Button
            type="submit"
            disabled={isPendingSignOut}
            variant="outline"
            className="w-full rounded-xl gap-2 border-red-200 text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            {isPendingSignOut ? 'Signing out...' : 'Sign out'}
          </Button>
        </form>
      </div>
    </div>
  )
}
