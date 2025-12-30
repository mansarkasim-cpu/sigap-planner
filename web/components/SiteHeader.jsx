"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Nav from './Nav'
import RouteGuard from './RouteGuard'

export default function SiteHeader(){
  const pathname = usePathname()

  // hide entire header (brand + nav) on login page
  if (typeof pathname === 'string' && pathname === '/login') return null

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand">SigapPlanner</Link>
        <Nav />
        <RouteGuard />
      </div>
    </header>
  )
}
