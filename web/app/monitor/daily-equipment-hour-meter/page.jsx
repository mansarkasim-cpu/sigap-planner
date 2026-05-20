"use client"
import { useEffect, useState, useMemo } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Alert from '@mui/material/Alert'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import CircularProgress from '@mui/material/CircularProgress'
import apiClient from '../../../lib/api-client'

function toYMD(d){
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

export default function DailyEquipmentHourMeter(){
  const today = useMemo(()=> toYMD(new Date()), [])
  const [siteId, setSiteId] = useState('')
  const [jenisAlatId, setJenisAlatId] = useState('')
  const [date, setDate] = useState(today)
  const [sites, setSites] = useState([])
  const [jenisAlats, setJenisAlats] = useState([])
  const [alats, setAlats] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [total, setTotal] = useState(0)
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editId, setEditId] = useState(null)
  const [editForm, setEditForm] = useState({ site_id: '', alat_id: '', kode_alat: '', nama_alat: '', jenis_alat_id: '', engine_hour: '', teknisi_id: '', jam: '', notes: '' })
  const [form, setForm] = useState({ site_id: '', alat_id: '', kode_alat: '', nama_alat: '', jenis_alat_id: '', engine_hour: '', teknisi_id: '', jam: '' })
  const [formError, setFormError] = useState('')

  useEffect(()=>{ loadSites(); loadJenisAlats(); }, [])

  useEffect(()=>{ loadAlats() }, [])
  // reload users when site filter in form changes
  useEffect(()=>{ if (form.site_id) loadUsers(form.site_id); else loadUsers('') }, [form.site_id])

  useEffect(()=>{ setPage(1); load() }, [siteId, jenisAlatId, date, perPage])

  async function loadSites(){
    try{
      const me = await apiClient('/auth/me').catch(()=>null)
      const userSite = me?.site || me?.data?.site || null
      if (userSite && (userSite.id || userSite.code || userSite.name)){
        const siteObj = { id: userSite.id ?? userSite.site_id ?? userSite.code ?? userSite.name, name: userSite.name || userSite.nama || userSite.label || userSite.code || String(userSite.id) }
        setSites([siteObj])
        setSiteId(siteObj.id)
        setForm(f=>({...f, site_id: siteObj.id}))
        await loadAlats(siteObj.id)
        await load(1, siteObj.id)
        return
      }
      const res = await apiClient('/master/sites')
      setSites(res?.data || res || [])
      await loadAlats()
      await load(1)
    }catch(e){ console.error(e) }
  }

  async function loadJenisAlats(){
    try{ const res = await apiClient('/master/jenis-alat'); setJenisAlats(res?.data || res || []) }catch(e){ console.error(e) }
  }

  async function loadAlats(siteIdForAlats){
    try{
      const qs = siteIdForAlats ? `?site_id=${encodeURIComponent(siteIdForAlats)}&page=1&pageSize=1000` : '?page=1&pageSize=1000'
      const res = await apiClient(`/master/alats${qs}`)
      setAlats(res?.data || res || [])
    }catch(e){ console.error(e) }
  }

  async function loadUsers(siteFilter){
    try{
      // only load users with role=technician; if siteFilter provided, include site filter
      if (siteFilter) {
        const s = sites.find(x=> String(x.id) === String(siteFilter))
        const siteName = s ? (s.name || s.nama) : ''
        const url = siteName ? `/users?site=${encodeURIComponent(siteName)}&role=technician&page=1&pageSize=1000` : '/users?role=technician&page=1&pageSize=1000'
        const res = await apiClient(url)
        const rows = res?.data || res || []
        setUsers(Array.isArray(rows) ? rows.filter(u=> String(u.role).toLowerCase() === 'technician') : [])
      } else {
        const res = await apiClient('/users?role=technician&page=1&pageSize=1000')
        const rows = res?.data || res || []
        setUsers(Array.isArray(rows) ? rows.filter(u=> String(u.role).toLowerCase() === 'technician') : [])
      }
    }catch(e){ console.error(e) }
  }

  async function load(p = page, explicitSiteId){
    setLoading(true)
    try{
      const sid = explicitSiteId ?? siteId
      const qs = []
      if (sid) qs.push(`site_id=${encodeURIComponent(sid)}`)
      if (jenisAlatId) qs.push(`jenis_alat_id=${encodeURIComponent(jenisAlatId)}`)
      if (date) qs.push(`date=${encodeURIComponent(date)}`)
      qs.push(`page=${p}`)
      qs.push(`per_page=${perPage}`)
      const url = `/monitor/equipment-hour-meter${qs.length?('?'+qs.join('&')):''}`
      const res = await apiClient(url)
      const payload = res?.data || res
      if (Array.isArray(payload)){
        setItems(payload)
        setTotal(payload.length)
      }else{
        setItems(payload?.items || payload?.data || [])
        setTotal(payload?.total || payload?.meta?.total || (payload?.items ? payload.items.length : 0))
      }
    }catch(e){ console.error('load', e); setItems([]); setTotal(0) }
    finally{ setLoading(false) }
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / perPage))

  return (
    <Box sx={{p:2}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <Box sx={{display:'flex',flexDirection:'column'}}>
          <Typography variant="h5">Daily Checklist &gt; Daily Equipment Hour Meter</Typography>
          <Typography variant="caption" sx={{color:'text.secondary'}}>Filter by site, jenis alat, and date</Typography>
        </Box>
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
          <TextField select size="small" label="Site" value={siteId} onChange={e=>setSiteId(e.target.value)} sx={{minWidth:220}}>
            <MenuItem value="">All Sites</MenuItem>
            {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.id}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Jenis Alat" value={jenisAlatId} onChange={e=>setJenisAlatId(e.target.value)} sx={{minWidth:220}}>
            <MenuItem value="">All Types</MenuItem>
            {jenisAlats.map(j=> <MenuItem key={j.id} value={j.id}>{j.name || j.nama || j.id}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} InputLabelProps={{shrink:true}} />
          <Button variant="contained" onClick={()=>load(1)}>Search</Button>
          <Button variant="outlined" onClick={()=>{ setCreateOpen(true); setForm({ site_id: siteId || '', alat_id: '', kode_alat: '', nama_alat: '', jenis_alat_id: '', engine_hour: '', teknisi_name: '', jam: '' }); setFormError('') }}>New Entry</Button>
        </Box>
      </Box>

      <Dialog open={createOpen} onClose={()=>setCreateOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Equipment Hour Meter</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{mb:1}}>{formError}</Alert>}
          <Box sx={{display:'flex',flexDirection:'column',gap:1,mt:1}}>
            <TextField select size="small" label="Site" value={form.site_id || ''} onChange={e=>setForm(f=>({...f, site_id: e.target.value}))}>
              <MenuItem value="">-- Select site --</MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama}</MenuItem>)}
            </TextField>

            <TextField select size="small" label="Jenis Alat" value={form.jenis_alat_id || ''} onChange={e=>setForm(f=>({...f, jenis_alat_id: e.target.value}))}>
              <MenuItem value="">-- Select jenis alat --</MenuItem>
              {jenisAlats.map(j=> <MenuItem key={j.id} value={j.id}>{j.nama || j.name}</MenuItem>)}
            </TextField>

            <TextField select size="small" label="Alat" value={form.alat_id} onChange={e=>{
              const val = e.target.value
              const selected = alats.find(a=>String(a.id)===String(val))
              setForm(f=>({ ...f, alat_id: val, kode_alat: selected?.kode || '', nama_alat: selected?.nama || '' }))
            }}>
              <MenuItem value="">-- Select alat --</MenuItem>
              {alats.filter(a=>{
                const matchJenis = !form.jenis_alat_id || (a.jenis_alat && String(a.jenis_alat.id) === String(form.jenis_alat_id)) || String(a.jenis_alat_id) === String(form.jenis_alat_id)
                const matchSite = !form.site_id || (a.site && String(a.site.id) === String(form.site_id)) || String(a.site_id) === String(form.site_id)
                return matchJenis && matchSite
              }).map(a=> <MenuItem key={a.id} value={a.id}>{a.nama} {a.kode? `(${a.kode})` : ''}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Engine/Hour Meter" type="number" value={form.engine_hour} onChange={e=>setForm(f=>({...f, engine_hour: e.target.value}))} />
            <TextField select size="small" label="Teknisi" value={form.teknisi_id || ''} onChange={e=>setForm(f=>({...f, teknisi_id: e.target.value}))}>
              <MenuItem value="">-- Select teknisi --</MenuItem>
              {users.map(u=> <MenuItem key={u.id} value={u.id}>{u.name} {u.nipp? `(${u.nipp})` : ''}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Jam" type="datetime-local" value={form.jam} onChange={e=>setForm(f=>({...f, jam: e.target.value}))} InputLabelProps={{shrink:true}} />
            <TextField size="small" label="Notes" value={form.notes || ''} onChange={e=>setForm(f=>({...f, notes: e.target.value}))} multiline minRows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setCreateOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async ()=>{
            try{
              setFormError('')
                if (!form.alat_id) return setFormError('Silakan pilih alat')
              if (!form.engine_hour) return setFormError('Masukkan nilai engine/hour')
              const payload = {
                    site_id: form.site_id || siteId || undefined,
                alat_id: form.alat_id,
                jenis_alat_id: form.jenis_alat_id,
                engine_hour: form.engine_hour,
                teknisi_id: form.teknisi_id,
                recorded_at: form.jam ? new Date(form.jam).toISOString() : undefined,
                notes: form.notes,
              }
              await apiClient('/monitor/equipment-hour-meter', { method: 'POST', body: JSON.stringify(payload) })
              setCreateOpen(false)
              load(1)
            }catch(e){ console.error(e); setFormError('Failed to create entry') }
          }}>Save</Button>
        </DialogActions>
      </Dialog>

      <Paper sx={{p:2}}>
        {loading && <Box sx={{display:'flex',justifyContent:'center',p:4}}><CircularProgress/></Box>}
        {!loading && items.length === 0 && <Typography>No data</Typography>}
        {!loading && items.length > 0 && (
          <>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>No</TableCell>
                  <TableCell>Actions</TableCell>
                  <TableCell>Kode Alat</TableCell>
                  <TableCell>Nama Alat</TableCell>
                  <TableCell>Jenis Alat</TableCell>
                  <TableCell>Engine/Hour Meter</TableCell>
                  <TableCell>Teknisi</TableCell>
                  <TableCell>Jam</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((it, idx)=> (
                  <TableRow key={it.id || idx}>
                    <TableCell>{(page-1)*perPage + idx + 1}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={()=>{
                        // open edit dialog
                        setEditId(it.id)
                        setEditForm({
                          site_id: it.site?.id || it.site_id || '',
                          alat_id: it.alat?.id || it.alat_id || '',
                          kode_alat: it.alat?.kode || it.kode_alat || '',
                          nama_alat: it.alat?.nama || it.nama_alat || '',
                          jenis_alat_id: it.jenis_alat?.id || it.jenis_alat_id || '',
                          engine_hour: it.engine_hour ?? it.hour_meter ?? it.value ?? '',
                          teknisi_id: (it.teknisi && (it.teknisi.id || it.teknisi.user_id)) ? (it.teknisi.id || it.teknisi.user_id) : (it.teknisi_id || ''),
                          jam: it.recorded_at || it.created_at || it.time || '',
                          notes: it.notes || ''
                        })
                        // ensure teknisi list includes site technicians
                        loadUsers(it.site?.id || it.site_id || '')
                        setEditOpen(true)
                      }}>Edit</Button>
                    </TableCell>
                    <TableCell>{it.alat?.kode || it.alat?.code || it.alat?.serial_no || '-'}</TableCell>
                    <TableCell>{it.alat?.nama || it.alat?.name || '-'}</TableCell>
                    <TableCell>{it.jenis_alat?.nama || it.jenis_alat?.name || it.alat?.jenis_alat?.nama || it.alat?.jenis_alat?.name || it.jenis || '-'}</TableCell>
                    <TableCell>{it.engine_hour ?? it.hour_meter ?? it.value ?? '-'}</TableCell>
                    <TableCell>{it.teknisi?.name || it.teknisi?.nipp || '-'}</TableCell>
                    <TableCell>{formatDateWithTZ(it.recorded_at || it.created_at || it.time, it.site?.timezone)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Box sx={{display:'flex',alignItems:'center',gap:1,mt:2}}>
              <Button size="small" onClick={()=>{ const np = Math.max(1, page-1); setPage(np); load(np) }} disabled={page<=1}>Prev</Button>
              <Typography variant="body2">Page {page} / {totalPages} • {total} items</Typography>
              <Button size="small" onClick={()=>{ const np = Math.min(totalPages, page+1); setPage(np); load(np) }} disabled={page>=totalPages}>Next</Button>
              <Button size="small" onClick={()=>{ setPage(1); load(1) }}>First</Button>
              <Button size="small" onClick={()=>{ setPage(totalPages); load(totalPages) }}>Last</Button>
            </Box>
          </>
        )}
      </Paper>

      <Dialog open={editOpen} onClose={()=>setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Equipment Hour Meter</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error" sx={{mb:1}}>{formError}</Alert>}
          <Box sx={{display:'flex',flexDirection:'column',gap:1,mt:1}}>
            <TextField select size="small" label="Site" value={editForm.site_id || ''} onChange={e=>setEditForm(f=>({...f, site_id: e.target.value}))}>
              <MenuItem value="">-- Select site --</MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama}</MenuItem>)}
            </TextField>

            <TextField select size="small" label="Alat" value={editForm.alat_id} onChange={e=>{ const val = e.target.value; const selected = alats.find(a=>String(a.id)===String(val)); setEditForm(f=>({ ...f, alat_id: val, kode_alat: selected?.kode || '', nama_alat: selected?.nama || '' })) }}>
              <MenuItem value="">-- Select alat --</MenuItem>
              {alats.filter(a=>{
                const matchJenis = !editForm.jenis_alat_id || (a.jenis_alat && String(a.jenis_alat.id) === String(editForm.jenis_alat_id)) || String(a.jenis_alat_id) === String(editForm.jenis_alat_id)
                const matchSite = !editForm.site_id || (a.site && String(a.site.id) === String(editForm.site_id)) || String(a.site_id) === String(editForm.site_id)
                return matchJenis && matchSite
              }).map(a=> <MenuItem key={a.id} value={a.id}>{a.nama} {a.kode? `(${a.kode})` : ''}</MenuItem>)}
            </TextField>

            <TextField size="small" label="Engine/Hour Meter" type="number" value={editForm.engine_hour} onChange={e=>setEditForm(f=>({...f, engine_hour: e.target.value}))} />
            <TextField select size="small" label="Teknisi" value={editForm.teknisi_id || ''} onChange={e=>setEditForm(f=>({...f, teknisi_id: e.target.value}))}>
              <MenuItem value="">-- Select teknisi --</MenuItem>
              {users.map(u=> <MenuItem key={u.id} value={u.id}>{u.name} {u.nipp? `(${u.nipp})` : ''}</MenuItem>)}
            </TextField>
            <TextField size="small" label="Jam" type="datetime-local" value={editForm.jam ? (new Date(editForm.jam)).toISOString().slice(0,16) : ''} onChange={e=>setEditForm(f=>({...f, jam: e.target.value}))} InputLabelProps={{shrink:true}} />
            <TextField size="small" label="Notes" value={editForm.notes || ''} onChange={e=>setEditForm(f=>({...f, notes: e.target.value}))} multiline minRows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={async ()=>{
            try{
              setFormError('')
              if (!editId) return setFormError('Missing id')
              if (!editForm.alat_id) return setFormError('Silakan pilih alat')
              if (!editForm.engine_hour) return setFormError('Masukkan nilai engine/hour')
              const payload = {
                site_id: editForm.site_id || undefined,
                alat_id: editForm.alat_id,
                jenis_alat_id: editForm.jenis_alat_id || undefined,
                engine_hour: Number(editForm.engine_hour),
                teknisi_id: editForm.teknisi_id || undefined,
                recorded_at: editForm.jam ? new Date(editForm.jam).toISOString() : undefined,
                notes: editForm.notes || undefined
              }
              await apiClient(`/monitor/equipment-hour-meter/${editId}`, { method: 'PATCH', body: JSON.stringify(payload) })
              setEditOpen(false)
              load(1)
            }catch(e){ console.error(e); setFormError('Failed to update entry') }
          }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function tzLabel(timezone){
  if (!timezone) return 'WIB'
  if (timezone === 'Asia/Jayapura') return 'WIT'
  if (timezone === 'Asia/Makassar' || timezone === 'Asia/Ujung_Pandang') return 'WITA'
  // Asia/Jakarta, Asia/Pontianak, etc.
  return 'WIB'
}

function formatDateWithTZ(s, timezone){
  if (!s) return '-'
  try{
    const dt = new Date(s)
    if (isNaN(dt.getTime())) return String(s)
    const tz = timezone || 'Asia/Jakarta'
    const fmt = new Intl.DateTimeFormat('id-ID', {
      timeZone: tz,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
    })
    const parts = fmt.formatToParts(dt)
    const get = (type) => parts.find(p => p.type === type)?.value ?? ''
    const formatted = `${get('day')}/${get('month')}/${get('year')}, ${get('hour')}:${get('minute')}:${get('second')}`
    return `${formatted} ${tzLabel(tz)}`
  }catch(e){ return String(s) }
}
