'use server'

import { getSupabaseServer } from './supabase-server'
import type { OutreachMetric, DealClosed, Deck, WeeklyUpdate, KPIData, User } from './types'
import {
  MOCK_OUTREACH_METRICS,
  MOCK_DEALS,
  MOCK_DECKS,
  MOCK_WEEKLY_UPDATES,
  MOCK_USER,
} from './mock-data'
import { getWeekStart } from './format'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getAuthUser(): Promise<User | null> {
  if (USE_MOCK) {
    const roleOverride = process.env.NEXT_PUBLIC_MOCK_ROLE as User['role'] | undefined
    const validRoles: User['role'][] = ['admin', 'sales_rep', 'viewer']
    const role = roleOverride && validRoles.includes(roleOverride) ? roleOverride : MOCK_USER.role
    return { ...MOCK_USER, role }
  }
  try {
    const supabase = await getSupabaseServer()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()
    if (profileError || !profile) return null
    return { id: user.id, email: profile.email as string, role: profile.role as User['role'] }
  } catch {
    return null
  }
}

export async function getKPIs(userId: string, role: User['role']): Promise<KPIData> {
  const thisWeek = getWeekStart()
  const mtdStart = new Date().toISOString().substring(0, 7) + '-01'

  if (USE_MOCK) {
    const weekMetrics = MOCK_OUTREACH_METRICS.filter(m => m.week_starting === thisWeek)
    const fallbackMetrics = MOCK_OUTREACH_METRICS.slice(-1)
    const activeMetrics = weekMetrics.length > 0 ? weekMetrics : fallbackMetrics
    const weeklyOutreachLeads = activeMetrics.reduce(
      (s, m) => s + m.email_count + m.linkedin_count + m.cold_call_count,
      0
    )
    const mtdDeals = MOCK_DEALS.filter(d => d.close_date >= mtdStart)
    const estimatedGpMTD =
      role === 'viewer' ? null : mtdDeals.reduce((s, d) => s + d.estimated_gp, 0)
    return {
      weeklyOutreachLeads,
      newClientsMTD: mtdDeals.length,
      estimatedGpMTD,
    }
  }

  try {
    const supabase = await getSupabaseServer()
    const metricsQuery = supabase
      .from('outreach_metrics')
      .select('email_count, linkedin_count, cold_call_count')
      .eq('week_starting', thisWeek)

    if (role !== 'admin') {
      metricsQuery.eq('user_id', userId)
    }

    const [metricsRes, dealsRes] = await Promise.all([
      metricsQuery,
      supabase.from('deals_closed').select('estimated_gp').gte('close_date', mtdStart),
    ])

    const weeklyOutreachLeads = (metricsRes.data ?? []).reduce(
      (s, m) => s + (m.email_count as number) + (m.linkedin_count as number) + (m.cold_call_count as number),
      0
    )
    const newClientsMTD = (dealsRes.data ?? []).length
    const estimatedGpMTD =
      role === 'viewer'
        ? null
        : (dealsRes.data ?? []).reduce((s, d) => s + Number(d.estimated_gp), 0)

    return { weeklyOutreachLeads, newClientsMTD, estimatedGpMTD }
  } catch {
    return { weeklyOutreachLeads: 0, newClientsMTD: 0, estimatedGpMTD: null }
  }
}

export async function getOutreachMetrics(): Promise<OutreachMetric[]> {
  if (USE_MOCK) return MOCK_OUTREACH_METRICS
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('outreach_metrics')
      .select('*')
      .order('week_starting', { ascending: true })
      .limit(12)
    if (error) return []
    return (data ?? []) as OutreachMetric[]
  } catch {
    return []
  }
}

export async function getDecks(): Promise<Deck[]> {
  if (USE_MOCK) return MOCK_DECKS
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('decks')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return []
    return (data ?? []) as Deck[]
  } catch {
    return []
  }
}

export async function getWeeklyUpdates(): Promise<WeeklyUpdate[]> {
  if (USE_MOCK) return MOCK_WEEKLY_UPDATES
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from('weekly_updates')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) return []
    return (data ?? []) as WeeklyUpdate[]
  } catch {
    return []
  }
}

export async function getSignedDeckUrl(storagePath: string): Promise<string | null> {
  if (USE_MOCK) return `https://example.com/mock-download/${storagePath}`
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.storage
      .from('decks')
      .createSignedUrl(storagePath, 60)
    if (error) return null
    return data.signedUrl
  } catch {
    return null
  }
}

export async function logOutreachMetric(payload: {
  email_count: number
  linkedin_count: number
  cold_call_count: number
}): Promise<{ error: string | null }> {
  if (USE_MOCK) return { error: null }
  try {
    const supabase = await getSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }
    const { error } = await supabase.from('outreach_metrics').upsert(
      {
        user_id: user.id,
        week_starting: getWeekStart(),
        ...payload,
      },
      { onConflict: 'user_id,week_starting' }
    )
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}

export async function logDealClosed(payload: {
  client_name: string
  estimated_gp: number
}): Promise<{ error: string | null }> {
  if (USE_MOCK) return { error: null }
  try {
    const supabase = await getSupabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return { error: 'Not authenticated' }
    const { error } = await supabase.from('deals_closed').insert({
      client_name: payload.client_name,
      close_date: new Date().toISOString().split('T')[0],
      estimated_gp: payload.estimated_gp,
      owner_id: user.id,
    })
    return { error: error?.message ?? null }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Unknown error' }
  }
}
