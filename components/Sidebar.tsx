'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/deals',
    label: 'Deals',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    href: '/outreach',
    label: 'Outreach',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    href: '/decks',
    label: 'Decks',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#09090b] border-r border-[#1f1f23] flex flex-col z-20">
      <div className="px-5 py-6 border-b border-[#1f1f23]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">FMCG Portal</p>
            <p className="text-[10px] text-[#444444] leading-tight">Internal Sales Ops</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[10px] text-[#333333] uppercase tracking-widest font-medium px-2 mb-3">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? 'bg-white/[0.06] text-white'
                      : 'text-[#666666] hover:text-[#aaaaaa] hover:bg-white/[0.03]'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-400' : 'text-[#444444]'}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="px-3 py-4 border-t border-[#1f1f23]">
        <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-indigo-400">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white truncate font-medium">Sales Rep</p>
            <p className="text-[10px] text-[#444444] truncate">Internal User</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
