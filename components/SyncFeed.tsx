import ReactMarkdown from 'react-markdown'
import type { WeeklyUpdate } from '@/lib/types'
import { formatDate } from '@/lib/format'

export default function SyncFeed({
  updates,
  emptyLabel,
}: {
  updates: WeeklyUpdate[]
  emptyLabel: string
}) {
  if (updates.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-[#444444]">{emptyLabel}</p>
      </div>
    )
  }

  return (
    <div className="bg-[#09090b] border border-[#1f1f23] rounded-xl p-0 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1f1f23]">
        <h2 className="text-sm font-medium text-white">Weekly Sync Logs</h2>
        <p className="text-xs text-[#666666] mt-0.5">Chronological team updates</p>
      </div>
      <div className="px-5 py-6">
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-0 w-px bg-[#1f1f23]" />
          <ul className="space-y-8">
            {updates.map((update, index) => (
              <li key={update.id} className="relative flex gap-5">
                <div className="shrink-0 mt-1">
                  <div
                    className={`w-[15px] h-[15px] rounded-full border-2 ${
                      index === 0
                        ? 'bg-indigo-500 border-indigo-500'
                        : 'bg-[#09090b] border-[#1f1f23]'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0 pb-2">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <h3 className="text-sm font-medium text-white">{update.title}</h3>
                    <time className="text-[11px] text-[#444444] shrink-0">
                      {formatDate(update.created_at)}
                    </time>
                  </div>
                  <div className="sync-content text-sm text-[#888888] leading-relaxed">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        h2: ({ children }) => (
                          <h2 className="font-semibold text-[#cccccc] text-sm mb-2 mt-3 first:mt-0">
                            {children}
                          </h2>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 space-y-1 mb-2">{children}</ul>
                        ),
                        li: ({ children }) => <li className="text-[#888888]">{children}</li>,
                        strong: ({ children }) => (
                          <strong className="text-white font-medium">{children}</strong>
                        ),
                      }}
                    >
                      {update.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
