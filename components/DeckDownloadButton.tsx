'use client'

import { useState } from 'react'
import { getSignedDeckUrl } from '@/lib/data'
import { DownloadIcon } from './icons/DownloadIcon'

export default function DeckDownloadButton({ storagePath, title }: { storagePath: string; title: string }) {
  const [loading, setLoading] = useState(false)

  async function handleDownload() {
    setLoading(true)
    try {
      const url = await getSignedDeckUrl(storagePath)
      if (url) {
        const a = document.createElement('a')
        a.href = url
        a.download = title
        a.target = '_blank'
        a.rel = 'noopener noreferrer'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      title={`Download ${title}`}
      className="p-1.5 text-[#444444] hover:text-white transition-colors rounded disabled:opacity-50"
    >
      <DownloadIcon className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
    </button>
  )
}
