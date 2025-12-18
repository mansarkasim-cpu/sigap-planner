"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import AuthButton from './AuthButton'
import { useEffect, useState } from 'react'
import apiClient from '../lib/api-client'

function isAdminRole(raw) {
  if (!raw) return false
  try {
    if (typeof raw === 'string') {
      // maybe a JSON string
      if (raw.startsWith('[') || raw.startsWith('{')) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) return parsed.map(String).some(r => r.toLowerCase() === 'admin')
        if (typeof parsed === 'string') return parsed.toLowerCase() === 'admin'
        if (parsed && parsed.role) return String(parsed.role).toLowerCase() === 'admin'
      }
      return raw.toLowerCase() === 'admin'
    }
    if (Array.isArray(raw)) return raw.map(String).some(r => r.toLowerCase() === 'admin')
    if (typeof raw === 'object') {
      if (raw.role) return String(raw.role).toLowerCase() === 'admin'
    }
  } catch (e) {}
  return false
}

export default function Nav(){
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(()=>{
    let mounted = true
    async function loadRole(){
      try{
        let raw = localStorage.getItem('sigap_role')
        if (!raw){
          const token = localStorage.getItem('token')
          if (token){
            // try server-side /auth/me to get role
            try{
              const me = await apiClient('/auth/me')
              const roleVal = me?.role || (me?.user && me.user.role) || null
              if (roleVal) {
                const roleStr = typeof roleVal === 'string' ? roleVal : JSON.stringify(roleVal)
                localStorage.setItem('sigap_role', roleStr)
                raw = roleStr
              }
            }catch(e){/* ignore */}
          }
        }
        if (mounted) setIsAdmin(isAdminRole(raw))
      }catch(e){ if (mounted) setIsAdmin(false) }
    }
    loadRole()
    return ()=>{ mounted = false }
  }, [])

  // hide nav on login page
  if (typeof pathname === 'string' && pathname === '/login') return null

  return (
    <nav className="nav">
      <ul className="nav-menu">
        <li className="nav-item"><Link href="/dashboard" className="nav-link">Dashboard</Link></li>

        {isAdmin && (
          <li className="nav-item has-sub">
            <span className="nav-link">Master</span>
            <ul className="sub-menu">
              <li><Link href="/users" className="nav-link">Users</Link></li>
            </ul>
          </li>
        )}

        <li className="nav-item has-sub">
          <span className="nav-link">Konfigurasi</span>
          <ul className="sub-menu">
            <li><Link href="/shifts" className="nav-link">Shift</Link></li>
          </ul>
        </li>

        <li className="nav-item has-sub">
          <span className="nav-link">Work Order</span>
          <ul className="sub-menu">
            <li><Link href="/work-orders" className="nav-link">List</Link></li>
            <li><Link href="/gantt" className="nav-link">Gantt Chart</Link></li>
            <li><Link href="/realisasi" className="nav-link">Realisasi</Link></li>
          </ul>
        </li>

        <li className="nav-item auth-item"><AuthButton /></li>
      </ul>
    </nav>
  )
}
