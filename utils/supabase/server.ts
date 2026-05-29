import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/utils/supabase/database.types'

/**
 * Returns a Supabase client that runs exclusively in server contexts:
 * Server Components, Route Handlers, and Server Actions.
 *
 * It forwards the user's session cookie so every query runs under the
 * correct JWT and Row Level Security policies are enforced automatically.
 *
 * Usage:
 *   const supabase = await createSupabaseServerClient()
 *   const { data } = await supabase.from('deals_closed').select('*')
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // Inside a pure Server Component the response has already been
          // committed, so cookie writes will throw.  The try/catch is
          // intentional: session refresh is handled by middleware.ts; this
          // client is read-oriented and the thrown error is safe to discard.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // No-op in Server Components — middleware keeps the session alive.
          }
        },
      },
    }
  )
}
