/**
 * Hand-authored Database type map that matches the SQL schema below.
 *
 * When you want auto-generated types (recommended for production), run:
 *   npx supabase gen types typescript --project-id <your-project-id> \
 *     --schema public > utils/supabase/database.types.ts
 *
 * The shape must match the `Database` generic expected by createServerClient /
 * createBrowserClient from @supabase/ssr.
 */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'admin' | 'sales_rep' | 'viewer'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: UserRole
        }
        Insert: {
          id: string
          email: string
          role?: UserRole
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
        }
      }
      decks: {
        Row: {
          id: string
          title: string
          category: string
          file_url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          file_url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          file_url?: string
          created_at?: string
        }
      }
      weekly_updates: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          created_at?: string
        }
      }
      outreach_metrics: {
        Row: {
          id: string
          user_id: string
          week_starting: string
          email_count: number
          linkedin_count: number
          cold_call_count: number
        }
        Insert: {
          id?: string
          user_id: string
          week_starting: string
          email_count?: number
          linkedin_count?: number
          cold_call_count?: number
        }
        Update: {
          id?: string
          user_id?: string
          week_starting?: string
          email_count?: number
          linkedin_count?: number
          cold_call_count?: number
        }
      }
      deals_closed: {
        Row: {
          id: string
          client_name: string
          close_date: string
          estimated_gp: number
          owner_id: string
        }
        Insert: {
          id?: string
          client_name: string
          close_date: string
          estimated_gp: number
          owner_id: string
        }
        Update: {
          id?: string
          client_name?: string
          close_date?: string
          estimated_gp?: number
          owner_id?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
    }
  }
}
