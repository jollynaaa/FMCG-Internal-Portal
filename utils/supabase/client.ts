'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/utils/supabase/database.types'

/**
 * Returns a Supabase client for use inside Client Components ('use client').
 *
 * createBrowserClient reads and writes the session cookie via document.cookie,
 * which is only available in the browser — never import this in a Server
 * Component, Route Handler, or middleware.
 *
 * The singleton pattern prevents multiple GoTrueClient instances from being
 * created during hot-module reloads in development, which would cause
 * duplicate auth listeners and unexpected sign-out behaviour.
 *
 * Usage:
 *   const supabase = createSupabaseBrowserClient()
 *   const { data } = await supabase.from('outreach_metrics').select('*')
 */

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined

export function createSupabaseBrowserClient() {
  if (browserClient) return browserClient

  browserClient = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return browserClient
}
