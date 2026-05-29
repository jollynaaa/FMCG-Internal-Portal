'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase-browser'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const supabase = getSupabaseBrowser()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError) {
        setError(authError.message)
        return
      }
      router.push('/')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-600 rounded-xl mb-4">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white">FMCG Sales Portal</h1>
          <p className="text-sm text-[#666666] mt-1">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#666666] uppercase tracking-widest font-medium">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="bg-[#09090b] border border-[#1f1f23] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333333] outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] text-[#666666] uppercase tracking-widest font-medium">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bg-[#09090b] border border-[#1f1f23] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#333333] outline-none focus:border-indigo-500/60 transition-colors"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg px-4 py-3 transition-colors mt-1"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
