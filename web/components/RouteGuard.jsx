"use client"
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function RouteGuard(){
  const pathname = usePathname()
  const router = useRouter()

  useEffect(()=>{
    if (typeof window === 'undefined') return

    // try localStorage first, fallback to cookie check
    let token = null
    try { token = localStorage.getItem('token') } catch (e) { token = null }
    if (!token) {
      try {
        token = document.cookie.split(';').map(s => s.trim()).find(s => s.startsWith('token='))?.split('=')[1] || null
      } catch (e) { token = null }
    }

    // allow unauthenticated access to public pages (use startsWith for routes)
    const publicPaths = ['/login','/']
    if (publicPaths.some(p => pathname && pathname.startsWith(p))) return

    // For all other pages, require token
    if (!token) router.replace('/login')
  }, [pathname, router])

  return null
}
