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
  const [form, setForm] = useState({ site_id:'', alat_id:'', pm_rule_id:'', engine_hour:'', performed_by:'', performed_at:'', workorder_no:'', notes:'' })
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(()=>{ loadSites(); loadRules(); }, [])

  // Auto-refresh list when filters change — only load when alat is selected
  const firstFilterRun = React.useRef(true)
  useEffect(()=>{
    if (firstFilterRun.current) { firstFilterRun.current = false; return }
    if (filterAlatId) load()
    else setItems([])
  }, [filterSiteId, filterAlatId])
  async function loadSites(){
    try{
      const me = await apiClient('/auth/me').catch(()=>null)
      const userSite = me?.site || me?.data?.site || null
      if (userSite && (userSite.id || userSite.code || userSite.name)){
        const siteObj = { id: userSite.id ?? userSite.site_id ?? userSite.code ?? userSite.name, name: userSite.name || userSite.nama || userSite.label || userSite.code || String(userSite.id) }
        setSites([siteObj])
        setFilterSiteId(siteObj.id)
        setForm(f=>({...f, site_id: siteObj.id}))
        await loadAlats(siteObj.id)
        await loadUsers(siteObj.id)
        return
      }
      const r = await apiClient('/master/sites?limit=1000')
      const list = r?.data || r || []
      setSites(list)
      await loadAlats()
      await loadUsers()
    }catch(e){ console.error(e) }
  }

  async function load(p, explicitSiteId){
    setLoading(true)
    try{
      const qs = []
      qs.push('limit=200')
      const siteToUse = explicitSiteId ?? filterSiteId
      if (siteToUse) qs.push(`site_id=${encodeURIComponent(siteToUse)}`)
      if (filterAlatId) qs.push(`alat_id=${encodeURIComponent(filterAlatId)}`)

      if (typeof p === 'number') qs.push(`page=${p}`)
      const url = `/pm/history${qs.length?('?'+qs.join('&')):''}`
      const res = await apiClient(url)
      const payload = res?.data || res || []
      setItems(Array.isArray(payload) ? payload : (payload?.data || payload?.items || []))
    }catch(e){ console.error(e); setItems([]) }
    finally{ setLoading(false) }
  }

  async function loadAlats(siteId){
    try{
      const qs = siteId ? `?site_id=${encodeURIComponent(siteId)}&page=1&pageSize=1000` : '?page=1&pageSize=1000'
      const r = await apiClient(`/master/alats${qs}`)
      setAlats(r?.data || r || [])
    }catch(e){ console.error(e) }
  }
  async function loadRules(jenis_alat_id){
    try{
      const qs = jenis_alat_id ? `?jenis_alat_id=${encodeURIComponent(jenis_alat_id)}` : ''
      const r = await apiClient(`/pm/rules${qs}`);
      setRules(r?.data || r || [])
    }catch(e){ console.error(e) }
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

      if (editingId) {
        await apiClient(`/pm/history/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) })
      } else {
        await apiClient('/pm/history', { method: 'POST', body: JSON.stringify(payload) })
      }
      setOpen(false)
      setEditingId(null)
      setForm({ site_id:'', alat_id:'', pm_rule_id:'', engine_hour:'', performed_by:'', performed_at:'', workorder_no:'', notes:'' })
      await load()
    }catch(e){ console.error(e); setError('Gagal menyimpan') }
  }

  async function downloadExcel(){
    if (!filterSiteId) return alert('Pilih site terlebih dahulu')
    try{
      // fetch all PM history for selected site (no alat filter)
      const res = await apiClient(`/pm/history?site_id=${encodeURIComponent(filterSiteId)}&limit=10000`)
      const historyAll = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])

      // alats already loaded for the site — just sort them, no re-filter needed
      const siteAlats = [...alats].sort((a,b) =>
        (a.kode||'').localeCompare(b.kode||'') || (a.nama||a.name||'').localeCompare(b.nama||b.name||'')
      )

      // group history by alat_id
      const histByAlat = {}
      historyAll.forEach(h => {
        const aid = String(h.alat_id ?? '')
        if (!histByAlat[aid]) histByAlat[aid] = []
        histByAlat[aid].push(h)
      })

      const statusLabel = { tepat_waktu:'Done (On Time)', terlambat:'Done (Late)', tidak_dikerjakan:'PM Missed' }
      const fmt = d => { if (!d) return ''; const t = new Date(d); return `${String(t.getDate()).padStart(2,'0')}/${String(t.getMonth()+1).padStart(2,'0')}/${t.getFullYear()}` }

      const rows = []
      let no = 1
      for (const alat of siteAlats){
        const hists = histByAlat[String(alat.id)] || []
        if (hists.length === 0){
          rows.push({ 'No':no++, 'Kode Alat':alat.kode||'', 'Nama Alat':alat.nama||alat.name||'', 'Nomor Workorder':'', 'Engine Hour Meter':'', 'Status':'', 'Performed At':'', 'Notes':'' })
        } else {
          for (const h of hists){
            rows.push({
              'No': no++,
              'Kode Alat': alat.kode || h.kode_alat || '',
              'Nama Alat': alat.nama || alat.name || h.nama_alat || '',
              'Nomor Workorder': h.workorder_no || h.workorder || '',
              'Engine Hour Meter': h.engine_hour ?? '',
              'Status': statusLabel[h.pm_tepat_waktu] || '-',
              'Performed At': fmt(h.performed_at),
              'Notes': h.notes || ''
            })
          }
        }
      }

      if (rows.length === 0) return alert('Tidak ada data untuk diexport')

      const XLSX = (await import('xlsx'))
      const lib = XLSX.default || XLSX
      const ws = lib.utils.json_to_sheet(rows)
      ws['!cols'] = [8,16,30,20,18,18,16,30].map(w=>({wch:w}))
      const wb = lib.utils.book_new()
      lib.utils.book_append_sheet(wb, ws, 'PM History')
      const siteName = sites.find(s=> String(s.id) === String(filterSiteId))?.name || filterSiteId
      lib.writeFile(wb, `PM_History_${siteName}.xlsx`)
    }catch(e){ console.error('[downloadExcel]', e); alert('Gagal export Excel: ' + (e?.message || e)) }
  }

  async function handleDelete(id){
    try{
      if (!window.confirm('Yakin ingin menghapus record ini?')) return
      await apiClient(`/pm/history/${id}`, { method: 'DELETE' })
      await load()
    }catch(e){ console.error(e); alert('Gagal menghapus') }
  }

  function handleEdit(it){
    try{
      const mapped = {
        site_id: (it.site_id ?? ((it.site && (it.site.id || it.site.site_id)) || '')),
        alat_id: it.alat_id || it.alat?.id || '',
        pm_rule_id: it.pm_rule_id || it.pm_rule?.id || '',
        engine_hour: it.engine_hour ?? '',
        performed_by: it.performed_by ?? it.performed_by_id ?? '',
        performed_at: it.performed_at ? (new Date(it.performed_at).toISOString().slice(0,16)) : '',
        workorder_no: it.workorder_no || it.workorder || '',
        notes: it.notes || ''
      }
      setForm(mapped)
      setEditingId(it.id)
      // load rules for the alat if possible
      try{
        const a = alats.find(x=> String(x.id) === String(mapped.alat_id)) || null
        const jenisId = a ? (a.jenis_alat_id || (a.jenis && a.jenis.id) || (a.jenis_alat && a.jenis_alat.id) || null) : null
        loadRules(jenisId)
      }catch(e){/* ignore */}
      setOpen(true)
    }catch(e){ console.error('failed to open edit', e) }
  }

  return (
    <Box sx={{p:2}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <div>
          <h3 style={{margin:0}}>PM History</h3>
          <div style={{color:'#666'}}>Record PM performed on equipments</div>
        </div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <TextField select size="small" label="Site" value={filterSiteId} onChange={e=>{ setFilterSiteId(e.target.value); setFilterAlatId(''); }} style={{minWidth:180}}>
            <MenuItem value="">All Sites</MenuItem>
            {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.label || s.id}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Alat" value={filterAlatId} onChange={e=>setFilterAlatId(e.target.value)} style={{minWidth:220}}>
            <MenuItem value="">All Alat</MenuItem>
            {alats.filter(a=>{
              if (!filterSiteId) return true
              return (a.site && String(a.site.id) === String(filterSiteId)) || String(a.site_id) === String(filterSiteId)
            }).map(a=> <MenuItem key={a.id} value={a.id}>{a.nama || a.name} {a.kode? `(${a.kode})` : ''}</MenuItem>)}
          </TextField>
          <Button variant="outlined" onClick={downloadExcel} disabled={!filterSiteId}>Download Excel</Button>
          <Button variant="contained" onClick={()=>{ setEditingId(null); setForm({ site_id:'', alat_id:'', pm_rule_id:'', engine_hour:'', performed_by:'', performed_at:'', workorder_no:'', notes:'' }); setOpen(true); }}>New PM History</Button>
        </div>
      </Box>

      <Paper sx={{p:2}}>
        {loading && <Box sx={{display:'flex',justifyContent:'center',p:4}}><CircularProgress/></Box>}
        {!loading && items.length === 0 && <div style={{color:'#999'}}>{filterAlatId ? 'No PM history for selected equipment' : 'Pilih alat untuk melihat history PM'}</div>}
        {!loading && items.length > 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Alat</TableCell>
                <TableCell>PM Rule</TableCell>
                                <TableCell>Workorder</TableCell>
                <TableCell>Engine Hour</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Performed At</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell>Actions</TableCell>
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
                  <TableCell>
                    {it.pm_tepat_waktu === 'tepat_waktu' && (
                      <span style={{background:'#e8f5e9',color:'#2e7d32',borderRadius:4,padding:'2px 8px',fontSize:12,fontWeight:600}}>Done (On Time)</span>
                    )}
                    {it.pm_tepat_waktu === 'terlambat' && (
                      <span style={{background:'#ffebee',color:'#c62828',borderRadius:4,padding:'2px 8px',fontSize:12,fontWeight:600}}>Done (Late)</span>
                    )}
                    {it.pm_tepat_waktu === 'tidak_dikerjakan' && (
                      <span style={{background:'#212121',color:'#fff',borderRadius:4,padding:'2px 8px',fontSize:12,fontWeight:600}}>PM Missed</span>
                    )}
                    {!it.pm_tepat_waktu && <span style={{color:'#999'}}>-</span>}
                  </TableCell>
                  <TableCell>{it.performed_by_name || it.performed_by || '-'}</TableCell>
                  <TableCell>{it.performed_at ? new Date(it.performed_at).toLocaleString() : '-'}</TableCell>
                  <TableCell>{it.notes || '-'}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={()=>handleEdit(it)}>Edit</Button>
                    <Button size="small" color="error" onClick={()=>handleDelete(it.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={()=>{ setOpen(false); setEditingId(null); }} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit PM History' : 'New PM History'}</DialogTitle>
        <DialogContent>
          {error && <div style={{color:'red',marginBottom:8}}>{error}</div>}
          <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
            <TextField select size="small" label="Site" value={form.site_id || ''} onChange={e=>{ const v = e.target.value; setForm(f=>({...f, site_id: v, alat_id: ''})); loadUsers(v); }}>
              <MenuItem value="">-- Select site --</MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.label || s.id}</MenuItem>)}
            </TextField>

            <TextField select size="small" label="Alat" value={form.alat_id} onChange={e=>{ const v = e.target.value; setForm(f=>({...f, alat_id: v, pm_rule_id: ''})); setFilterAlatId(v); load();
                // load PM rules filtered by selected alat's jenis_alat
                try{
                  const a = alats.find(x=> String(x.id) === String(v)) || null
                  const jenisId = a ? (a.jenis_alat_id || (a.jenis && a.jenis.id) || (a.jenis_alat && a.jenis_alat.id) || null) : null
                  loadRules(jenisId)
                }catch(e){ console.error('failed to load rules by jenis', e) }
              }}>
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
              {(() => {
                const selSite = form.site_id || filterSiteId || ''
                return users
                  .filter(u => {
                    if (!selSite) return true
                    try{
                      if (u.site && (u.site.id || u.site.name || u.site.nama)){
                        if (String(u.site.id) === String(selSite)) return true
                        if (String(u.site.name) === String(selSite)) return true
                        if (String(u.site.nama) === String(selSite)) return true
                      }
                      if (u.site_id && String(u.site_id) === String(selSite)) return true
                      if (u.site && typeof u.site === 'string' && String(u.site) === String(selSite)) return true
                    }catch(e){/* ignore */}
                    return false
                  })
                  .map(u=> <MenuItem key={u.id} value={u.id}>{u.name} {u.nipp ? `(${u.nipp})` : ''}</MenuItem>)
              })()}
            </TextField>
            <TextField size="small" label="Performed At" type="datetime-local" value={form.performed_at} onChange={e=>setForm(f=>({...f, performed_at: e.target.value}))} InputLabelProps={{shrink:true}} />
            <TextField size="small" label="Workorder No" value={form.workorder_no || ''} onChange={e=>setForm(f=>({...f, workorder_no: e.target.value}))} />
            <TextField size="small" label="Notes" multiline minRows={2} value={form.notes || ''} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ setOpen(false); setEditingId(null); }}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
