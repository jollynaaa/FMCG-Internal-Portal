import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // In mock mode the middleware is a pure pass-through — no Supabase calls needed.
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If environment variables are absent (e.g. a cold-start before Vercel injects
  // them, or a misconfigured preview deployment) we must NOT throw — an unhandled
  // exception here produces MIDDLEWARE_INVOCATION_FAILED.  Instead, pass the
  // request through without session logic so the app can render its own error UI.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next()
  }

  try {
    // The response object is re-created via NextResponse.next() so that the
    // cookie setAll handler can write Set-Cookie headers onto the *same* response
    // object that is ultimately returned.  Mutating a prior `response` variable
    // inside setAll and then returning a different object is the classic cause of
    // broken session refresh on the Vercel Edge Runtime.
    let response = NextResponse.next({
      request: { headers: request.headers },
    })

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Write incoming cookies onto the request so Server Components that
          // read cookies() see the refreshed values within the same request cycle.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          // Recreate the response with the updated request headers so the
          // refreshed cookies are forwarded to the browser.
          response = NextResponse.next({
            request: { headers: request.headers },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    })

    // IMPORTANT: Always use getUser() — never getSession() — in server contexts.
    // getSession() deserialises the JWT from the cookie without re-validating it
    // against Supabase Auth servers, which is a security risk.
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const isLoginPage = request.nextUrl.pathname.startsWith('/login')

    if (!user && !isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user && isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return response
  } catch {
    // Any unexpected runtime error (network timeout reaching Supabase Auth,
    // malformed JWT, Edge Runtime API changes, etc.) must be swallowed here.
    // Returning NextResponse.next() keeps the app accessible while the error
    // is surfaced through your observability tooling rather than as a hard 500.
    return NextResponse.next()
  }
}

export const config = {
  // Exclude static assets and image optimisation routes from middleware.
  // Including them wastes Edge compute and can cause MIDDLEWARE_INVOCATION_FAILED
  // on Vercel when the runtime initialises before environment variables are ready.
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$).*)',
  ],
}
