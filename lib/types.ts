export type UserRole = 'admin' | 'sales_rep' | 'viewer'

export interface User {
  id: string
  email: string
  role: UserRole
}

export interface Deck {
  id: string
  title: string
  category: string
  file_url: string
  created_at: string
}

export interface WeeklyUpdate {
  id: string
  title: string
  content: string
  author_id: string
  created_at: string
}

export interface OutreachMetric {
  id: string
  user_id: string
  week_starting: string
  email_count: number
  linkedin_count: number
  cold_call_count: number
}

export interface DealClosed {
  id: string
  client_name: string
  close_date: string
  estimated_gp: number
  owner_id: string
}

export interface ChartWeek {
  label: string
  email: number
  linkedin: number
  coldCall: number
}

export interface KPIData {
  weeklyOutreachLeads: number
  newClientsMTD: number
  estimatedGpMTD: number | null
}
