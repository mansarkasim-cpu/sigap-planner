import { NextResponse } from 'next/server'

/**
 * Server-side middleware to protect pages by checking for a `token` cookie.
 * If not present, redirect to /login. Public pages: / and /login are allowed.
 */
export function middleware(req) {
  const { pathname } = req.nextUrl

  // allow next internals, static assets and api routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/static') || pathname.startsWith('/api') ) {
    return NextResponse.next()
  }

  // public pages
  const publicPaths = ['/', '/login']
  if (publicPaths.includes(pathname)) return NextResponse.next()

  const tokenCookie = req.cookies.get('token')
  const token = tokenCookie && tokenCookie.value
  if (!token) {
    const loginUrl = new URL('/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  // apply middleware to all routes except assets and static internals
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
