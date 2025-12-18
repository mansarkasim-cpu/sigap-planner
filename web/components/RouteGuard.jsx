"use client"
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function RouteGuard(){
  const pathname = usePathname()
  const router = useRouter()

  useEffect(()=>{
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    // allow unauthenticated access to public pages
    const publicPaths = ['/login','/']
    if (publicPaths.some(p => pathname === p)) return

    // For all other pages, require token
    if (!token) router.push('/login')
  }, [pathname, router])

  return null
}
