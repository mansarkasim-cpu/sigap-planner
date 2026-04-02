"use client"
import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import apiClient from '../../../lib/api-client'

// Note: backend endpoints expected:
// GET  /api/pm/history?limit=200  -> returns list of pm_history
// POST /api/pm/history             -> create pm_history entry

export default function PMHistoryPage(){
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [alats, setAlats] = useState([])
  const [rules, setRules] = useState([])
  const [users, setUsers] = useState([])
  const [sites, setSites] = useState([])
  const [filterSiteId, setFilterSiteId] = useState('')
  const [filterAlatId, setFilterAlatId] = useState('')
  const [filterStartDate, setFilterStartDate] = useState('')
  const [filterEndDate, setFilterEndDate] = useState('')
  const [form, setForm] = useState({ site_id:'', alat_id:'', pm_rule_id:'', engine_hour:'', performed_by:'', performed_at:'', workorder_no:'', notes:'' })
  const [error, setError] = useState('')

  useEffect(()=>{ load(); loadAlats(); loadRules(); loadUsers(); loadSites(); }, [])

  // Auto-refresh list when filters change (skip initial mount duplicate)
  const firstFilterRun = React.useRef(true)
  useEffect(()=>{
    if (firstFilterRun.current) { firstFilterRun.current = false; return }
    load()
  }, [filterSiteId, filterAlatId, filterStartDate, filterEndDate])

  async function loadSites(){
    try{ const r = await apiClient('/master/sites?limit=1000'); setSites(r?.data || r || []) }catch(e){ console.error(e) }
  }

  async function load(p){
    setLoading(true)
    try{
      const qs = []
      qs.push('limit=200')
      if (filterSiteId) qs.push(`site_id=${encodeURIComponent(filterSiteId)}`)
      if (filterAlatId) qs.push(`alat_id=${encodeURIComponent(filterAlatId)}`)
      if (filterStartDate) qs.push(`start_date=${encodeURIComponent(filterStartDate)}`)
      if (filterEndDate) qs.push(`end_date=${encodeURIComponent(filterEndDate)}`)
      if (typeof p === 'number') qs.push(`page=${p}`)
      const url = `/pm/history${qs.length?('?'+qs.join('&')):''}`
      const res = await apiClient(url)
      const payload = res?.data || res || []
      setItems(Array.isArray(payload) ? payload : (payload?.data || payload?.items || []))
    }catch(e){ console.error(e); setItems([]) }
    finally{ setLoading(false) }
  }

  async function loadAlats(){
    try{ const r = await apiClient('/master/alats?page=1&pageSize=1000'); setAlats(r?.data || r || []) }catch(e){ console.error(e) }
  }
  async function loadRules(){
    try{ const r = await apiClient('/pm/rules'); setRules(r?.data || r || []) }catch(e){ console.error(e) }
  }
  async function loadUsers(siteFilter){
    try{
      if (siteFilter){
        const s = sites.find(x=> String(x.id) === String(siteFilter))
        const siteName = s ? (s.name || s.nama) : ''
        const url = siteName ? `/users?site=${encodeURIComponent(siteName)}&role=technician&page=1&pageSize=1000` : '/users?role=technician&page=1&pageSize=1000'
        const res = await apiClient(url)
        const rows = res?.data || res || []
        setUsers(Array.isArray(rows) ? rows.filter(u=> String(u.role).toLowerCase() === 'technician') : [])
      } else {
        const r = await apiClient('/users?role=technician&page=1&pageSize=1000')
        const rows = r?.data || r || []
        setUsers(Array.isArray(rows) ? rows.filter(u=> String(u.role).toLowerCase() === 'technician') : [])
      }
    }catch(e){ console.error(e) }
  }

  async function save(){
    try{
      setError('')
      if (!form.alat_id) return setError('Pilih alat')
      if (!form.pm_rule_id) return setError('Pilih PM rule')
      if (!form.engine_hour) return setError('Masukkan engine hour')

      const payload = {
        alat_id: form.alat_id,
        pm_rule_id: form.pm_rule_id,
         workorder_no: form.workorder_no || undefined,
        engine_hour: Number(form.engine_hour),
        performed_by: form.performed_by || undefined,
        performed_at: form.performed_at ? new Date(form.performed_at).toISOString() : undefined,
        notes: form.notes || undefined
      }

      await apiClient('/pm/history', { method: 'POST', body: JSON.stringify(payload) })
      setOpen(false)
      setForm({ site_id:'', alat_id:'', pm_rule_id:'', engine_hour:'', performed_by:'', performed_at:'', workorder_no:'', notes:'' })
      await load()
    }catch(e){ console.error(e); setError('Gagal menyimpan') }
  }

  return (
    <Box sx={{p:2}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <div>
          <h3 style={{margin:0}}>PM History</h3>
          <div style={{color:'#666'}}>Record PM performed on equipments</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <TextField select size="small" label="Site" value={filterSiteId} onChange={e=>setFilterSiteId(e.target.value)} style={{minWidth:180}}>
            <MenuItem value="">All Sites</MenuItem>
            {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.label || s.id}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Alat" value={filterAlatId} onChange={e=>setFilterAlatId(e.target.value)} style={{minWidth:220}}>
            <MenuItem value="">All Alat</MenuItem>
            {alats.map(a=> <MenuItem key={a.id} value={a.id}>{a.nama || a.name} {a.kode? `(${a.kode})` : ''}</MenuItem>)}
          </TextField>
          <TextField size="small" label="From" type="date" value={filterStartDate} onChange={e=>setFilterStartDate(e.target.value)} InputLabelProps={{shrink:true}} />
          <TextField size="small" label="To" type="date" value={filterEndDate} onChange={e=>setFilterEndDate(e.target.value)} InputLabelProps={{shrink:true}} />
          <Button variant="contained" onClick={()=>setOpen(true)}>New PM History</Button>
        </div>
      </Box>

      <Paper sx={{p:2}}>
        {loading && <Box sx={{display:'flex',justifyContent:'center',p:4}}><CircularProgress/></Box>}
        {!loading && items.length === 0 && <div>No PM history</div>}
        {!loading && items.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Alat</TableCell>
                <TableCell>PM Rule</TableCell>
                                <TableCell>Workorder</TableCell>
                <TableCell>Engine Hour</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Performed At</TableCell>
                <TableCell>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((it, idx)=> (
                <TableRow key={it.id || idx}>
                  <TableCell>{idx+1}</TableCell>
                  <TableCell>{it.alat?.nama || it.kode_alat || it.nama_alat || it.alat_id}</TableCell>
                  <TableCell>{it.kode_rule || it.pm_rule?.kode_rule || it.pm_rule?.kode || it.pm_rule?.name || it.pm_rule_id}</TableCell>
                                    <TableCell>{it.workorder_no || it.workorder || '-'}</TableCell>
                  <TableCell>{it.engine_hour}</TableCell>
                  <TableCell>{it.performed_by_name || it.performed_by || '-'}</TableCell>
                  <TableCell>{it.performed_at ? new Date(it.performed_at).toLocaleString() : '-'}</TableCell>
                  <TableCell>{it.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New PM History</DialogTitle>
        <DialogContent>
          {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
          <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
            <TextField select size="small" label="Site" value={form.site_id || ''} onChange={e=>{ const v = e.target.value; setForm(f=>({...f, site_id: v, alat_id: ''})); loadUsers(v); }}>
              <MenuItem value="">-- Select site --</MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.label || s.id}</MenuItem>)}
            </TextField>

            <TextField select size="small" label="Alat" value={form.alat_id} onChange={e=>{ const v = e.target.value; setForm(f=>({...f, alat_id: v})); setFilterAlatId(v); load(); }}>
              <MenuItem value="">-- Select --</MenuItem>
              {alats.filter(a=>{
                if (!form.site_id) return true
                return (a.site && String(a.site.id) === String(form.site_id)) || String(a.site_id) === String(form.site_id)
              }).map(a=> <MenuItem key={a.id} value={a.id}>{a.nama || a.name} {a.kode ? `(${a.kode})` : ''}</MenuItem>)}
            </TextField>
            <TextField select size="small" label="PM Rule" value={form.pm_rule_id} onChange={e=>setForm(f=>({...f, pm_rule_id: e.target.value}))}>
              <MenuItem value="">-- Select --</MenuItem>
              {rules.map(r=> {
                const code = r.kode_rule || (r.interval_hours ? `PM${r.interval_hours}` : '')
                const label = code ? `${code} · ${r.label || r.name || `Rule ${r.id}`}` : (r.label || r.name || `Rule ${r.id}`)
                return (<MenuItem key={r.id} value={r.id}>{label}</MenuItem>)
              })}
            </TextField>
            <TextField size="small" label="Engine Hour" type="number" value={form.engine_hour} onChange={e=>setForm(f=>({...f, engine_hour: e.target.value}))} />
            <TextField select size="small" label="Performed By" value={form.performed_by} onChange={e=>setForm(f=>({...f, performed_by: e.target.value}))}>
              <MenuItem value="">-- Select --</MenuItem>
              {users.map(u=> <MenuItem key={u.id} value={u.id}>{u.name} {u.nipp ? `(${u.nipp})` : ''}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Performed At" type="datetime-local" value={form.performed_at} onChange={e=>setForm(f=>({...f, performed_at: e.target.value}))} InputLabelProps={{shrink:true}} />
            <TextField size="small" label="Workorder No" value={form.workorder_no || ''} onChange={e=>setForm(f=>({...f, workorder_no: e.target.value}))} />
            <TextField size="small" label="Notes" multiline minRows={2} value={form.notes || ''} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
