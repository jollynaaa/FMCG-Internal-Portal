'use client'

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <h2 className="text-lg font-semibold text-white">Something went wrong</h2>
      <p className="text-sm text-[#666666]">{error.message}</p>
      <button
        onClick={reset}
        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors border border-indigo-500/20 px-4 py-2 rounded-lg"
      >
        Try again
      </button>
    </div>
  )
}
