"use client"
import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Chip from '@mui/material/Chip'
import apiClient from '../../lib/api-client'

function toYMD(d){
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return ''
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

export default function Monitor(){
  const today = useMemo(()=>{
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  }, [])

  const [date, setDate] = useState(today)
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState({})
  const [usersCache, setUsersCache] = useState({})

  useEffect(()=>{ load(); }, [date])

  async function load(){
    setLoading(true)
    try{
      const res = await apiClient('/assignments')
      const items = res || []

      // filter by selected date: prefer assignment.scheduledAt, else workorder.start_date, startedAt, or createdAt
      let filtered = (items || []).filter(it => {
        const sched = it.scheduledAt || (it.wo && it.wo.start_date) || it.startedAt || it.createdAt || null
        if (!sched) return false
        return toYMD(sched) === date
      })

      // also fetch work orders and include those scheduled for the date that are NOT deployed
      try{
        const woRes = await apiClient(`/work-orders?page=1&pageSize=2000`)
        const wos = woRes?.data ?? woRes ?? []
        const extra = (wos || []).filter(wo => {
          const s = wo.start_date || wo.raw?.start_date || null
          if (!s) return false
          const matchDate = toYMD(s) === date
          const isDeployed = (String(wo.status || (wo.raw && wo.raw.status) || '').toUpperCase() === 'DEPLOYED')
          return matchDate && !isDeployed
        }).map(wo => {
          // try to extract assigned technician names or nipp from raw.labours
          const assignedNames = []
          try{
            const labs = wo.raw && Array.isArray(wo.raw.labours) ? wo.raw.labours : (wo.raw && Array.isArray(wo.raw.labors) ? wo.raw.labors : [])
            for (const lab of labs){
              const personils = lab && Array.isArray(lab.personils) ? lab.personils : (lab && Array.isArray(lab.personnel) ? lab.personnel : [])
              for (const p of personils){
                const name = p?.personil?.name || p?.name || p?.personil?.displayName || null
                const nip = p?.nipp || p?.nip || p?.personil?.nip || null
                if (name) assignedNames.push(name)
                else if (nip) assignedNames.push(String(nip))
              }
            }
          }catch(e){ /* ignore */ }

          return ({
            id: `wo-${wo.id}`,
            wo,
            assigneeId: undefined,
            scheduledAt: wo.start_date || wo.raw?.start_date || null,
            task_name: null,
            createdAt: wo.createdAt || null,
            assignedNames,
            deployed: false,
          })
        })

        // merge extra into filtered (avoid duplicates by workorder id)
        const existingWoIds = new Set(filtered.map(f => f.wo && f.wo.id ? String(f.wo.id) : f.id))
        for (const e of extra) {
          const wid = e.wo && e.wo.id ? String(e.wo.id) : e.id
          if (!existingWoIds.has(wid)) filtered.push(e)
        }
      }catch(e){ console.warn('failed to load workorders for monitor', e) }

      // load users for assignees
      const ids = Array.from(new Set(filtered.map(f => f.assigneeId).filter(Boolean)))
      const cache = {...usersCache}
      for (const id of ids){
        if (!cache[id]){
          try{
            const ures = await apiClient(`/users/${encodeURIComponent(id)}`)
            cache[id] = ures?.data || ures || { id }
          }catch(e){ cache[id] = { id } }
        }
      }
      setUsersCache(cache)

      // normalize workorder status and ensure assignedNames exists
      // treat READY / ASSIGNED the same as DEPLOYED for display purposes (badge differs)
      for (const it of filtered) {
        const rawStatus = (it.wo && (it.wo.status || (it.wo.raw && it.wo.raw.status))) || it.status || ''
        const norm = String(rawStatus || '').trim().toUpperCase()
        it.woStatus = norm || 'UNKNOWN'
        // show as deployed-like for these statuses so they appear in monitor
        it.deployed = (norm === 'DEPLOYED') || (norm === 'ASSIGNED') || norm.includes('READY')
        if (!Array.isArray(it.assignedNames)) it.assignedNames = []
      }

      // group by assigneeId
      const byUser = {}
      for (const it of filtered){
        const aid = it.assigneeId || 'unassigned'
        if (!byUser[aid]) byUser[aid] = []
        byUser[aid].push(it)
      }
      setGroups(byUser)
    }catch(e){ console.error('load monitor', e) }
    finally{ setLoading(false) }
  }

  return (
    <Box sx={{p:2}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <Typography variant="h5">Monitoring Teknisi</Typography>
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
          <TextField size="small" label="Tanggal" type="date" value={date} onChange={e=>setDate(e.target.value)} InputLabelProps={{shrink:true}} />
          <Button variant="contained" size="small" onClick={load}>Refresh</Button>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {Object.keys(groups).length === 0 && <Grid item xs={12}><Paper sx={{p:2}}>No assignments for selected date.</Paper></Grid>}
        {Object.entries(groups).map(([aid, arr])=>{
          const user = usersCache[aid] || { id: aid, name: aid }
          arr.sort((a,b)=> (new Date(a.scheduledAt||a.wo?.start_date||a.createdAt)).getTime() - (new Date(b.scheduledAt||b.wo?.start_date||b.createdAt)).getTime())
          return (
            <Grid item xs={12} md={6} lg={4} key={aid}>
              <Paper sx={{p:2}}>
                      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                        <Box>
                          <Typography variant="subtitle1">{user.name || user.displayName || user.email || aid}</Typography>
                          {Array.isArray(arr[0]?.assignedNames) && arr[0].assignedNames.length > 0 && (
                            <Typography variant="caption" sx={{color:'#666'}}>{arr[0].assignedNames.join(', ')}</Typography>
                          )}
                        </Box>
                        <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                          <Chip
                            label={arr[0]?.woStatus || (arr[0]?.deployed ? 'DEPLOYED' : 'NOT DEPLOYED')}
                            size="small"
                            color={
                              arr[0]?.woStatus === 'DEPLOYED' ? 'success' :
                              arr[0]?.woStatus === 'ASSIGNED' ? 'info' :
                              (arr[0]?.woStatus || '').includes('READY') ? 'warning' : 'default'
                            }
                          />
                          <Typography variant="caption">{arr.length} tugas</Typography>
                        </Box>
                      </Box>
                <Divider sx={{my:1}} />
                <List dense>
                  {arr.map(it=>{
                    const t = it.scheduledAt || (it.wo && it.wo.start_date) || it.createdAt
                    const timeStr = t ? new Date(t).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}) : '-'
                    const doc = it.wo?.doc_no || (it.wo && it.wo.id) || ''
                    const asset = it.wo?.asset_name || ''
                    return (
                      <ListItem key={it.id} divider>
                        <ListItemText primary={`${timeStr} • ${doc}`} secondary={`${asset} ${it.task_name ? '— '+it.task_name : ''}`} />
                      </ListItem>
                    )
                  })}
                </List>
              </Paper>
            </Grid>
          )
        })}
      </Grid>
    </Box>
  )
}
