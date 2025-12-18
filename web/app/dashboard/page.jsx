'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import LogoutIcon from '@mui/icons-material/Logout'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'

import apiClient from '../../lib/api-client'
// Gantt preview removed from dashboard

export default function Dashboard(){
  const router = useRouter()
  const [user, setUser] = useState('Pengguna')
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({ total:0, new:0, assigned:0, ready_to_deploy:0, deployed:0, in_progress:0, completed:0, overdue:0 })
  const [upcoming, setUpcoming] = useState([])
  const [overdueList, setOverdueList] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(()=>{
    if (typeof window === 'undefined') return
    const auth = localStorage.getItem('token')
    if (!auth){ router.push('/login'); return }
    setUser(localStorage.getItem('sigap_user') || 'Pengguna')
    loadDashboard()
    const id = setInterval(() => loadDashboard(), 60*1000)
    return () => clearInterval(id)
  }, [router])

  function logout(){
    try { localStorage.removeItem('token') } catch(e) {}
    try { localStorage.removeItem('sigap_user') } catch(e) {}
    try { localStorage.removeItem('sigap_role') } catch(e) {}
    try { document.cookie = 'token=; Path=/; Max-Age=0' } catch(e) {}
    try { document.cookie = 'sigap_user=; Path=/; Max-Age=0' } catch(e) {}
    try { document.cookie = 'sigap_role=; Path=/; Max-Age=0' } catch(e) {}
    router.push('/login')
  }

  function normalizeStatus(s){
    if (!s) return ''
    return s.toString().toUpperCase().replace(/[-\s]/g,'_')
  }

  async function loadDashboard(){
    setLoading(true)
    try{
      const res = await apiClient('/work-orders?page=1&pageSize=2000')
      const rows = res?.data ?? res ?? []
      const now = Date.now()
      let cnt = { total:0, new:0, assigned:0, ready_to_deploy:0, deployed:0, in_progress:0, completed:0, overdue:0 }
      const up = []
      const od = []
      for (const r of (rows || [])){
        const status = normalizeStatus(r.status || r.raw?.status || r.raw?.doc_status || '')
        cnt.total++
        if (status === 'NEW' || status === 'OPEN') cnt.new++
        if (status === 'ASSIGNED') cnt.assigned++
        if (status === 'READY_TO_DEPLOY') cnt.ready_to_deploy++
        if (status === 'DEPLOYED') cnt.deployed++
        if (status === 'IN_PROGRESS' || status === 'IN-PROGRESS') cnt.in_progress++
        if (status === 'COMPLETED') cnt.completed++

        const sMs = r.start_date ? Date.parse(r.start_date) : null
        const eMs = r.end_date ? Date.parse(r.end_date) : null
        if (eMs && eMs < now && status !== 'COMPLETED') { cnt.overdue++; od.push(r) }
        if (sMs && sMs >= now && sMs <= (now + 7*24*60*60*1000)) up.push(r)
      }

      // sort upcoming by start_date
      up.sort((a,b)=> (Date.parse(a.start_date||'')||0) - (Date.parse(b.start_date||'')||0))
      od.sort((a,b)=> (Date.parse(a.end_date||'')||0) - (Date.parse(b.end_date||'')||0))

      setStats(cnt)
      setUpcoming(up.slice(0,10))
      setOverdueList(od.slice(0,10))
      setLastUpdated(new Date().toLocaleString())
    }catch(err){
      console.error('load dashboard', err)
    }finally{ setLoading(false) }
  }

  return (
    <Box className="dashboard">
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <Typography variant="h5">Planner Dashboard</Typography>
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
          <Typography>Halo, <strong>{user}</strong></Typography>
          <IconButton size="small" onClick={logout} aria-label="Logout">
            <LogoutIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Grid container spacing={2} sx={{mb:2}}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{p:2}}>
            <Typography variant="subtitle2">Total Work Orders</Typography>
            <Typography variant="h5">{stats.total}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Paper sx={{p:2}}>
            <Typography variant="subtitle2">Assigned</Typography>
            <Typography variant="h6">{stats.assigned}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Paper sx={{p:2}}>
            <Typography variant="subtitle2">In Progress</Typography>
            <Typography variant="h6">{stats.in_progress}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={2}>
          <Paper sx={{p:2}}>
            <Typography variant="subtitle2">Deployed</Typography>
            <Typography variant="h6">{stats.deployed}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3} md={3}>
          <Paper sx={{p:2}}>
            <Typography variant="subtitle2">Completed</Typography>
            <Typography variant="h6">{stats.completed}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{p:2}}>
            <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <Typography variant="h6">Upcoming (7 days)</Typography>
              <Button size="small" onClick={loadDashboard}>Refresh</Button>
            </Box>
            <Divider sx={{my:1}} />
            {loading ? <LinearProgress /> : (
              <List dense>
                {upcoming.length === 0 && <ListItem><ListItemText primary="No upcoming work orders" /></ListItem>}
                {upcoming.map((w)=> (
                  <ListItem key={w.id} button onClick={() => router.push(`/work-orders/${w.id}`)}>
                    <ListItemText primary={w.doc_no || w.id} secondary={`${w.asset_name||''} • ${w.start_date ? new Date(w.start_date).toLocaleString() : ''}`} />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{p:2}}>
            <Typography variant="h6">Overdue</Typography>
            <Divider sx={{my:1}} />
            <List dense>
              {overdueList.length === 0 && <ListItem><ListItemText primary="No overdue work orders" /></ListItem>}
              {overdueList.map((w)=> (
                <ListItem key={w.id} button onClick={() => router.push(`/work-orders/${w.id}`)}>
                  <ListItemText primary={w.doc_no || w.id} secondary={`Due: ${w.end_date ? new Date(w.end_date).toLocaleString() : ''}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Gantt preview removed */}
      </Grid>

      <Box sx={{mt:2, fontSize:12, color:'#666'}}>Last updated: {lastUpdated || '-'}</Box>
    </Box>
  )
}
// 'use client'
// import { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

// export default function Dashboard(){
//   const router = useRouter()
//   const [user, setUser] = useState('Pengguna')

//   useEffect(()=>{
//     if (typeof window === 'undefined') return
//     const auth = localStorage.getItem('sigap_auth')
//     if (!auth){ router.push('/login'); return }
//     setUser(localStorage.getItem('sigap_user') || 'Pengguna')
//   }, [router])

//   function logout(){
//     localStorage.removeItem('sigap_auth')
//     localStorage.removeItem('sigap_user')
//     router.push('/login')
//   }

//   return (
//     <div className="dashboard">
//       <div className="dashboard-header">
//         <h1>Dashboard</h1>
//         <div style={{display:'flex',gap:12,alignItems:'center'}}>
//           <div>Halo, <strong>{user}</strong></div>
//           <button className="btn btn-ghost" onClick={logout}>Logout</button>
//         </div>
//       </div>

//       <div className="grid">
//         <div className="card">Tugas Hari Ini</div>
//         <div className="card">Kalender</div>
//         <div className="card">Catatan</div>
//       </div>
//     </div>
//   )
// }
