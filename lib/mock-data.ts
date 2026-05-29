import type { OutreachMetric, DealClosed, Deck, WeeklyUpdate, User } from './types'

export const MOCK_USER: User = {
  id: 'mock-user-1',
  email: 'demo@fmcg.internal',
  role: 'admin',
}

export const MOCK_OUTREACH_METRICS: OutreachMetric[] = [
  { id: '1', user_id: 'mock-user-1', week_starting: '2026-04-20', email_count: 32, linkedin_count: 18, cold_call_count: 10 },
  { id: '2', user_id: 'mock-user-1', week_starting: '2026-04-27', email_count: 41, linkedin_count: 22, cold_call_count: 15 },
  { id: '3', user_id: 'mock-user-1', week_starting: '2026-05-04', email_count: 28, linkedin_count: 30, cold_call_count: 12 },
  { id: '4', user_id: 'mock-user-1', week_starting: '2026-05-11', email_count: 55, linkedin_count: 14, cold_call_count: 20 },
  { id: '5', user_id: 'mock-user-1', week_starting: '2026-05-18', email_count: 47, linkedin_count: 25, cold_call_count: 18 },
  { id: '6', user_id: 'mock-user-1', week_starting: '2026-05-25', email_count: 60, linkedin_count: 33, cold_call_count: 22 },
]

export const MOCK_DEALS: DealClosed[] = [
  { id: 'd1', client_name: 'Meridian Retail Group', close_date: '2026-05-12', estimated_gp: 48500, owner_id: 'mock-user-1' },
  { id: 'd2', client_name: 'SunFresh Distributors', close_date: '2026-05-20', estimated_gp: 31200, owner_id: 'mock-user-1' },
]

export const MOCK_DECKS: Deck[] = [
  { id: 'dk1', title: 'Q2 2026 Category Review', category: 'Strategy', file_url: 'decks/q2-category-review.pdf', created_at: '2026-05-01T09:00:00Z' },
  { id: 'dk2', title: 'Promotions Playbook', category: 'Marketing', file_url: 'decks/promotions-playbook.pdf', created_at: '2026-04-15T09:00:00Z' },
  { id: 'dk3', title: 'New SKU Launch Brief', category: 'Product', file_url: 'decks/sku-launch-brief.pdf', created_at: '2026-04-02T09:00:00Z' },
]

export const MOCK_WEEKLY_UPDATES: WeeklyUpdate[] = [
  {
    id: 'wu1',
    title: 'Week of 26 May — Pipeline Review',
    content: `## Highlights\n- Closed **2 new accounts** this week with combined GP of $79,700\n- Pipeline standing at $210k across 8 active opportunities\n- LinkedIn outreach hit **33 touches** — highest this quarter\n\n## Action Items\n- Follow up with Meridian on Q3 renewal proposal\n- Send revised deck to SunFresh by Thursday`,
    author_id: 'mock-user-1',
    created_at: '2026-05-26T08:00:00Z',
  },
  {
    id: 'wu2',
    title: 'Week of 19 May — Market Update',
    content: `Competitor pricing dropped **8%** on core SKUs. Adjusting pitch deck accordingly.\n\nKey contacts engaged this week:\n- Harper & Co — meeting booked for June 3\n- Pacific Foods — RFQ submitted`,
    author_id: 'mock-user-1',
    created_at: '2026-05-19T08:00:00Z',
  },
  {
    id: 'wu3',
    title: 'Week of 12 May — New Client Onboarding',
    content: `Meridian Retail Group officially signed. Onboarding call scheduled for 15 May.\n\n**Next steps:**\n- Set up account in CRM\n- Coordinate delivery schedule with logistics`,
    author_id: 'mock-user-1',
    created_at: '2026-05-12T08:00:00Z',
  },
]
