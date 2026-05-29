import Card from './Card'
import { DocumentIcon } from './icons/DocumentIcon'
import DeckDownloadButton from './DeckDownloadButton'
import type { Deck } from '@/lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  Strategy: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  Marketing: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  Product: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Sales: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function getCategoryClass(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
}

export default function DeckList({
  decks,
  emptyLabel,
}: {
  decks: Deck[]
  emptyLabel: string
}) {
  return (
    <Card className="p-0 flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1f1f23]">
        <h2 className="text-sm font-medium text-white">Resource Hub</h2>
        <p className="text-xs text-[#666666] mt-0.5">Company presentation decks</p>
      </div>
      {decks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-12">
          <p className="text-sm text-[#444444]">{emptyLabel}</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#1f1f23]">
          {decks.map(deck => (
            <li
              key={deck.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              <DocumentIcon className="w-5 h-5 text-[#444444] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{deck.title}</p>
                <span
                  className={`inline-block mt-0.5 text-[10px] px-1.5 py-0.5 rounded border font-medium tracking-wide ${getCategoryClass(deck.category)}`}
                >
                  {deck.category}
                </span>
              </div>
              <DeckDownloadButton storagePath={deck.file_url} title={deck.title} />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
