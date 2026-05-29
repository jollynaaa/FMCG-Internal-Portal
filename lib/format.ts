import type { OutreachMetric, ChartWeek } from './types'

export function formatDate(iso: string): string {
  const normalized = iso.length === 10 ? iso + 'T00:00:00' : iso
  return new Date(normalized).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-SG', {
    style: 'currency',
    currency: 'SGD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + diff)
  return d.toISOString().split('T')[0]
}

export function toChartWeeks(metrics: OutreachMetric[]): ChartWeek[] {
  const byWeek = new Map<string, ChartWeek>()
  for (const m of metrics) {
    const existing = byWeek.get(m.week_starting)
    if (existing) {
      existing.email += m.email_count
      existing.linkedin += m.linkedin_count
      existing.coldCall += m.cold_call_count
    } else {
      const d = new Date(m.week_starting + 'T00:00:00')
      byWeek.set(m.week_starting, {
        label: d.toLocaleDateString('en-SG', { month: 'short', day: 'numeric' }),
        email: m.email_count,
        linkedin: m.linkedin_count,
        coldCall: m.cold_call_count,
      })
    }
  }
  return Array.from(byWeek.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v)
}
