'use client'

import { useState } from 'react'
import { signIn, signUp } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckSquare, Mail } from 'lucide-react'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    setError(null)

    const result = isSignUp ? await signUp(formData) : await signIn(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    if (isSignUp && result && 'email' in result && result.email) {
      setConfirmedEmail(result.email as string)
      setIsLoading(false)
    }
  }

  // Email confirmation screen shown after successful sign-up
  if (confirmedEmail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">TaskFlow</h1>
              <p className="text-xs text-gray-500">Manage your tasks</p>
            </div>
          </div>

          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-green-500" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox!</h2>
          <p className="text-gray-500 text-sm mb-1">We sent a confirmation link to</p>
          <p className="font-semibold text-gray-800 text-sm mb-5 break-all">{confirmedEmail}</p>
          <p className="text-gray-400 text-xs mb-8">
            Click the link in that email to activate your account and start managing your tasks.
          </p>

          <button
            onClick={() => { setConfirmedEmail(null); setIsSignUp(false) }}
            className="text-green-600 text-sm font-medium hover:underline"
          >
            Back to sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-tight">TaskFlow</h1>
            <p className="text-xs text-gray-500">Manage your tasks</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          {isSignUp ? 'Create account' : 'Welcome back'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          {isSignUp
            ? 'Sign up to start managing your tasks'
            : 'Sign in to access your tasks'}
        </p>

        <form action={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <Input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="John Doe"
                required={isSignUp}
                className="rounded-xl"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="rounded-xl"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="rounded-xl"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-11 font-medium"
          >
            {isLoading
              ? 'Please wait...'
              : isSignUp
              ? 'Create account'
              : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null) }}
            className="text-green-600 font-medium hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  )
}
