'use client'

import type { UserRole } from '@/lib/types'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  sales_rep: 'Sales Rep',
  viewer: 'Viewer',
}

export default function Header({ role }: { role: UserRole }) {
  function openLogMetric() {
    window.dispatchEvent(new Event('open-log-metric'))
  }

  const canLog = role === 'admin' || role === 'sales_rep'

  return (
    <header className="sticky top-0 z-30 backdrop-blur-sm bg-[#030303]/70 border-b border-[#1f1f23]">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-2 text-xs text-[#444444]">
          <span>FMCG Portal</span>
          <span>/</span>
          <span className="text-[#888888]">Dashboard</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-widest text-[#444444] font-medium border border-[#1f1f23] px-2 py-1 rounded">
            {ROLE_LABELS[role]}
          </span>
          {canLog && (
            <button
              onClick={openLogMetric}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Log Metric
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
