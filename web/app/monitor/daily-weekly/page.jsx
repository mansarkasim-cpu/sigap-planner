"use client"
import { useEffect, useState, useMemo, useRef } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import apiClient from '../../../lib/api-client'
import IconButton from '@mui/material/IconButton'
import Link from 'next/link'
import Tooltip from '@mui/material/Tooltip'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CloseIcon from '@mui/icons-material/Close'
import PrintIcon from '@mui/icons-material/Print'
import SortIcon from '@mui/icons-material/Sort'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'
import RefreshIcon from '@mui/icons-material/Refresh'
// SpeedIcon removed — auto-scroll UI hidden
import Stack from '@mui/material/Stack'

function getMonday(d){
  const dt = new Date(d)
  const day = dt.getDay()
  const diff = (day + 6) % 7
  dt.setDate(dt.getDate()-diff)
  dt.setHours(0,0,0,0)
  return dt
}

function toYMD(d){
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`
}

function weekdayName(ymd){
  try{
    const dt = new Date(ymd + 'T00:00:00')
    return dt.toLocaleDateString(undefined, { weekday: 'short' }) // e.g., Mon
  }catch(e){ return '' }
}

function formatDateTime(s){
  if (!s) return '-'
  const dt = new Date(s)
  if (isNaN(dt.getTime())) return String(s)
  const mm = String(dt.getMonth()+1).padStart(2,'0')
  const dd = String(dt.getDate()).padStart(2,'0')
  const yyyy = dt.getFullYear()
  const hh = String(dt.getHours()).padStart(2,'0')
  const min = String(dt.getMinutes()).padStart(2,'0')
  return `${dd}-${mm}-${yyyy} ${hh}:${min}`
}

// Normalize media URLs so that non-http paths are prefixed with origin or API base
function normalizeMediaUrl(p){
  if (!p) return ''
  try{
    const s = String(p).trim()
    if (!s) return ''
    // treat already absolute HTTP/S, data, or blob URLs as-is
    if (/^(https?:|data:|blob:)/i.test(s)) return s
    // detect Windows local absolute paths like C:/ or C:\ and file: scheme
    if (/^[a-zA-Z]:[\\/]/.test(s) || /^file:\/\//i.test(s)) return ''
    const base = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_API_URL || '')) || process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? window.location.origin : '')
    if (!base) return s.startsWith('/') ? s : `/${s}`
    return String(base).replace(/\/$/, '') + (s.startsWith('/') ? s : `/${s}`)
  }catch(e){ return String(p) }
}

export default function WeeklyMonitoring(){
  const today = useMemo(()=> toYMD(new Date()), [])
  const [siteId, setSiteId] = useState('')
  const [weekStart, setWeekStart] = useState(toYMD(getMonday(new Date())))
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailData, setDetailData] = useState(null)
  const [jenisAlatId, setJenisAlatId] = useState('')
  const [alatId, setAlatId] = useState('')
  const [jenisAlats, setJenisAlats] = useState([])
  const [masterAlats, setMasterAlats] = useState([])
  const detailItemsSorted = useMemo(()=>{
    const items = detailData?.items ? [...detailData.items] : []
    const getIndex = (x)=>{
      const q = x?.question || {}
      const candidates = [q.index, q.index_number, q.order, q.position, x.index, x.order, q.id, x.id]
      for (const v of candidates){
        if (v === undefined || v === null) continue
        const n = Number(v)
        if (!isNaN(n)) return n
      }
      return 9999
    }
    items.sort((a,b)=> getIndex(a) - getIndex(b))
    return items
  }, [detailData?.items])

  const filteredAlats = useMemo(()=>{
    const all = Array.isArray(data?.alats) ? data.alats : []
    let result = all
    if (jenisAlatId) result = result.filter(a => String(a.jenis_alat_id) === String(jenisAlatId))
    if (alatId) result = result.filter(a => String(a.id) === String(alatId))
    return result
  }, [data, jenisAlatId, alatId])

  const alatOptions = useMemo(()=>{
    if (!jenisAlatId) return masterAlats
    return masterAlats.filter(a => String(a.jenis_alat_id ?? a.jenis_alat?.id) === String(jenisAlatId))
  }, [masterAlats, jenisAlatId])

  const todaySummary = useMemo(()=>{
    const res = { done: 0, doneWithNotes: 0, total: 0 }
    try{
      res.total = filteredAlats.length
      for (const a of filteredAlats) {
        try{
          const s = a?.statuses?.[today]
          if (s && s.done) {
            res.done++
            if (s.notes || s.catatan || s.has_false) res.doneWithNotes++
          }
        }catch(e){}
      }
    }catch(e){}
    return res
  }, [filteredAlats, today])

  const daySummaries = useMemo(()=>{
    const days = Array.isArray(data?.days) ? data.days : []
    return days.map(d => {
      let done = 0, total = 0, doneWithNotes = 0
      for (const a of filteredAlats) {
        total++
        const s = a?.statuses?.[d]
        if (s && s.done) {
          done++
          if (s.notes || s.catatan || s.has_false) doneWithNotes++
        }
      }
      return { date: d, done, total, doneWithNotes }
    })
  }, [data, filteredAlats])
  const siteName = useMemo(()=>{
    try{
      if (!siteId) return 'All Sites'
      const s = Array.isArray(sites) ? sites.find(x=> String(x.id) === String(siteId)) : null
      return s ? (s.name || s.nama || s.id) : siteId
    }catch(e){ return siteId || 'All Sites' }
  }, [siteId, sites])
  const containerRef = useRef(null)
  const [autoScroll, setAutoScroll] = useState(false)
  const autoRef = useRef({interval: null})
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [speed, setSpeed] = useState('normal') // options: slow, normal, fast
  // pagination + auto-advance for alternative view
  const [usePagedView, setUsePagedView] = useState(true)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [currentPage, setCurrentPage] = useState(1)
  const [autoPage, setAutoPage] = useState(false)
  const autoPageRef = useRef(null)
  const AUTO_PAGE_MS = 10000
  const [autoRefresh, setAutoRefresh] = useState(true)
  const autoRefreshRef = useRef(null)
  const AUTO_REFRESH_MS = 60000
  const [sortBy, setSortBy] = useState('alat')
  const [sortDir, setSortDir] = useState('asc')

  // start auto-scroll hook
  useAutoScroll(containerRef, autoScroll, speed)

  // keep isFullscreen state in sync when user exits fullscreen via ESC or browser UI
  useEffect(()=>{
    function onFullscreenChange(){
      try{
        const el = containerRef.current
        const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement
        const nowFs = !!fsEl && el && fsEl === el
        setIsFullscreen(!!nowFs)
      }catch(e){ /* ignore */ }
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    document.addEventListener('mozfullscreenchange', onFullscreenChange)
    document.addEventListener('MSFullscreenChange', onFullscreenChange)
    return ()=>{
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
      document.removeEventListener('mozfullscreenchange', onFullscreenChange)
      document.removeEventListener('MSFullscreenChange', onFullscreenChange)
    }
  }, [containerRef])

  useEffect(()=>{ loadSites(); loadJenisAlats() }, [])

  // load alats whenever site or jenis alat filter changes
  useEffect(()=>{ loadMasterAlats() }, [siteId, jenisAlatId])

  // reset alat selection when site or jenis alat filter changes
  useEffect(()=>{ setAlatId('') }, [siteId, jenisAlatId])

  // reload immediately when site or weekStart changes (e.g., user selects site or date)
  useEffect(()=>{
    try{ load() }catch(e){}
  }, [siteId, weekStart])

  // clamp currentPage when filtered alats or rowsPerPage change
  useEffect(()=>{
    if (!usePagedView) return;
    const total = filteredAlats.length
    const pages = Math.max(1, Math.ceil(total / rowsPerPage))
    setCurrentPage(p => Math.min(Math.max(1, p), pages))
  }, [filteredAlats, rowsPerPage, usePagedView])

  // auto-advance page effect
  useEffect(()=>{
    if (!usePagedView) return;
    if (autoPage) {
      // clear existing
      if (autoPageRef.current) { clearInterval(autoPageRef.current); autoPageRef.current = null }
      autoPageRef.current = setInterval(()=>{
        try{
          const total = filteredAlats.length
          const pages = Math.max(1, Math.ceil(total / rowsPerPage))
          setCurrentPage(p => (p >= pages ? 1 : p + 1))
        }catch(e){}
      }, AUTO_PAGE_MS)
    } else {
      if (autoPageRef.current) { clearInterval(autoPageRef.current); autoPageRef.current = null }
    }
    return ()=>{ if (autoPageRef.current) { clearInterval(autoPageRef.current); autoPageRef.current = null } }
  }, [autoPage, usePagedView, filteredAlats, rowsPerPage])

  async function loadSites(){
    try{
      const me = await apiClient('/auth/me').catch(()=>null)
      const userSite = me?.site || me?.data?.site || null
      if (userSite && (userSite.id || userSite.code || userSite.name)){
        const siteObj = { id: userSite.id ?? userSite.site_id ?? userSite.code ?? userSite.name, name: userSite.name || userSite.nama || userSite.label || userSite.code || String(userSite.id) }
        setSites([siteObj])
        setSiteId(siteObj.id)
        await load(siteObj.id)
        return
      }
      const res = await apiClient('/master/sites')
      setSites(res?.data || res || [])
      await load()
    }catch(e){ console.error('load sites', e) }
  }

  async function loadJenisAlats(){
    try{ const res = await apiClient('/master/jenis-alat'); setJenisAlats(res?.data || res || []) }catch(e){ console.error('load jenis alats', e) }
  }

  async function loadMasterAlats(){
    try{
      const qs = []
      if (siteId) qs.push(`site_id=${encodeURIComponent(siteId)}`)
      if (jenisAlatId) qs.push(`jenis_alat_id=${encodeURIComponent(jenisAlatId)}`)
      const url = `/master/alats${qs.length ? ('?' + qs.join('&')) : ''}`
      const res = await apiClient(url)
      setMasterAlats(Array.isArray(res) ? res : (res?.data || []))
    }catch(e){ console.error('load master alats', e) }
  }

  async function load(explicitSiteId){
    setLoading(true)
    try{
      const sid = explicitSiteId ?? siteId
      const qs = []
      if (sid) qs.push(`site_id=${encodeURIComponent(sid)}`)
      if (weekStart) qs.push(`week_start=${encodeURIComponent(weekStart)}`)
      const url = `/monitoring/daily-weekly${qs.length?('?'+qs.join('&')):''}`
      const res = await apiClient(url)
      setData(res?.data || res)
    }catch(e){ console.error('load monitoring', e); setData(null) }
    finally{ setLoading(false) }
  }

  // auto-refresh effect: reload data every AUTO_REFRESH_MS when enabled
  useEffect(()=>{
    if (!autoRefresh) {
      if (autoRefreshRef.current) { clearInterval(autoRefreshRef.current); autoRefreshRef.current = null }
      return
    }
    // clear existing and set new interval
    if (autoRefreshRef.current) { clearInterval(autoRefreshRef.current); autoRefreshRef.current = null }
    autoRefreshRef.current = setInterval(()=>{ try{ load() }catch(e){} }, AUTO_REFRESH_MS)
    return ()=>{ if (autoRefreshRef.current) { clearInterval(autoRefreshRef.current); autoRefreshRef.current = null } }
  }, [autoRefresh, siteId, weekStart])

  const printChecklist = () => {
    if (!detailData || !detailData.checklist) return;
    const checklist = detailData.checklist;
    const items = detailItemsSorted || detailData.items || detailData.checklist_items || [];
    const htmlItems = (Array.isArray(items) ? items : []).map((it, idx) => {
      const rawVal = (it?.option?.option_text ?? it?.option?.name ?? it?.answer_text ?? (it?.answer_number !== undefined ? String(it.answer_number) : ''));
      const qtext = it?.question?.question_text || it?.question?.text || it?.question || '';
      const low = rawVal == null ? null : String(rawVal).toLowerCase();
      let ans = '-';
      let noteHtml = '';
      if (low === null) ans = 'N/A';
      else if (['true','1','yes','y'].includes(low)) ans = '<strong style="color:#2e7d32">OK</strong>';
      else if (['false','0','no','n'].includes(low)) {
        ans = '<strong style="color:#d32f2f">NOT OK</strong>';
        const note = it.evidence_note || it.evidence_description || it.notes || it.note || it.answer_text || '';
        if (note) noteHtml = `<div style="margin-top:6px;font-size:12px;color:#444">Note: ${String(note).replace(/\n/g,'<br/>')}</div>`;
      } else ans = String(rawVal);

      // evidence image
      let imgHtml = '';
      try{
        const ev = it.evidence_photo_url || it.evidence_photo_path || it.evidence_photo || null;
        const url = ev ? normalizeMediaUrl(ev) : null;
        if (url) imgHtml = `<div style="margin-top:8px"><img src="${url}" style="max-width:200px;max-height:150px;border:1px solid #ddd;padding:2px;border-radius:4px"/></div>`;
      }catch(e){ imgHtml = '' }

      return `<tr><td style="vertical-align:top;padding:6px;border:1px solid #ddd;width:40px">${idx+1}</td><td style="padding:6px;border:1px solid #ddd">${qtext}${noteHtml}${imgHtml}</td><td style="padding:6px;border:1px solid #ddd">${ans}</td></tr>`;
    }).join('');

    const html = `
      <html><head><title>Checklist ${checklist.id || ''}</title>
      <meta charset="utf-8" />
      <style>
        body{font-family:Arial,Helvetica,sans-serif;padding:20px;color:#222}
        h1{font-size:18px;margin-bottom:6px}
        .meta{margin-bottom:12px}
        table{border-collapse:collapse;width:100%;margin-top:8px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}
        th{background:#f5f5f5}
        .small{font-size:13px;color:#444}
      </style>
      </head><body>
        <h1>Checklist Report</h1>
        <div class="meta small">
          <div><strong>Teknisi:</strong> ${checklist.teknisi_name || '-'}</div>
          <div><strong>Performed at:</strong> ${formatDateTime ? formatDateTime(checklist.performed_at) : (checklist.performed_at||'-')}</div>
          <div><strong>Alat:</strong> ${checklist.alat?.nama || checklist.alat?.name || '-'}</div>
          <div style="margin-top:6px"><strong>Notes:</strong> ${checklist.notes ? String(checklist.notes).replace(/\n/g,'<br/>') : '-'}</div>
        </div>
        <table>
          <thead><tr><th style="width:40px">#</th><th>Question</th><th>Answer</th></tr></thead>
          <tbody>${htmlItems}</tbody>
        </table>
      </body></html>
    `;

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();
      // give the iframe a moment to render, then print
      setTimeout(()=>{
        try{
          iframe.contentWindow.focus();
          // Some browsers block iframe.print(); if it fails, fallback to new window
          iframe.contentWindow.print();
        }catch(e){
          try{
            const win = window.open('', '_blank', 'noopener,noreferrer');
            if (!win) { alert('Pop-up blocked. Please allow popups for this site.'); return; }
            win.document.write(html);
            win.document.close();
            win.focus();
            win.print();
          }catch(_){}
        }finally{
          setTimeout(()=>{ try{ document.body.removeChild(iframe); }catch(_){} }, 800);
        }
      }, 300);
    } catch (e) {
      try{
        const win = window.open('', '_blank', 'noopener,noreferrer');
        if (!win) { alert('Pop-up blocked. Please allow popups for this site.'); return; }
        win.document.write(html);
        win.document.close();
        win.focus();
        win.print();
      }catch(_){ alert('Unable to open print window. Please enable pop-ups for this site.'); }
    }
  };

  return (
    <Box sx={{p:2}}>
      <Box sx={{mb:2, position:'sticky', top:0, backgroundColor:'background.paper', zIndex:9, py:1}}>
        {/* Row 1: title + action buttons */}
        <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mb:1}}>
          <Box sx={{display:'flex',flexDirection:'column'}}>
            <Typography variant="h5">Daily Checklist &gt; Weekly Monitoring</Typography>
            <Typography variant="caption" sx={{color:'text.secondary'}}>Week: {data?.week_start || weekStart}</Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title={isFullscreen? 'Exit fullscreen' : 'Enter fullscreen'}>
              <IconButton size="small" onClick={async ()=>{
                try{
                  const el = containerRef.current || document.documentElement
                  if (!isFullscreen){
                    if (el.requestFullscreen) await el.requestFullscreen()
                    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
                    setIsFullscreen(true)
                  }else{
                    if (document.exitFullscreen) await document.exitFullscreen()
                    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
                    setIsFullscreen(false)
                  }
                }catch(e){ console.error('fullscreen', e) }
              }}>
                {isFullscreen? <FullscreenExitIcon/> : <FullscreenIcon/>}
              </IconButton>
            </Tooltip>
            <Tooltip title={usePagedView ? (autoPage ? 'Pause auto-advance' : 'Start auto-advance') : 'Enable paged view to use auto-advance'}>
              <span>
                <IconButton size="small" onClick={()=>{ setAutoPage(v=>!v) }}>
                  {autoPage ? <PauseIcon/> : <PlayArrowIcon/>}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={autoRefresh ? 'Auto-refresh: ON (1m)' : 'Auto-refresh: OFF'}>
              <span>
                <IconButton size="small" onClick={()=>{ setAutoRefresh(v=>!v) }} sx={{color: autoRefresh ? 'inherit' : 'action.active'}}>
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <TextField
              size="small"
              label="Rows"
              type="number"
              value={rowsPerPage}
              onChange={e=>{
                const v = Number(e.target.value)
                const next = Number.isNaN(v) ? 1 : Math.max(1, Math.floor(v))
                setRowsPerPage(next)
                setCurrentPage(1)
              }}
              InputProps={{ inputProps: { min: 1, step: 1 } }}
              sx={{width:90}}
            />
          </Stack>
        </Box>
        {/* Row 2: filters */}
        <Box sx={{display:'flex', gap:1, alignItems:'center', flexWrap:'wrap'}}>
          <TextField select size="small" label="Site" value={siteId} onChange={e=>setSiteId(e.target.value)} sx={{minWidth:200}}>
            <MenuItem value="">All Sites</MenuItem>
            {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.id}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Jenis Alat" value={jenisAlatId} onChange={e=>setJenisAlatId(e.target.value)} sx={{minWidth:160}}>
            <MenuItem value="">Semua Jenis</MenuItem>
            {jenisAlats.map(j=> <MenuItem key={j.id} value={j.id}>{j.name || j.nama || j.id}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Alat" value={alatId} onChange={e=>setAlatId(e.target.value)} sx={{minWidth:180}}>
            <MenuItem value="">Semua Alat</MenuItem>
            {alatOptions.map(a=> <MenuItem key={a.id} value={a.id}>{a.nama || a.name || a.id}{a.kode ? ` (${a.kode})` : ''}</MenuItem>)}
          </TextField>
          <TextField size="small" label="Week Start" type="date" value={weekStart} onChange={e=>setWeekStart(e.target.value)} InputLabelProps={{shrink:true}} />
          <Button variant="contained" onClick={() => load()}>Refresh</Button>
        </Box>
      </Box>

      <Paper ref={containerRef} sx={{p:2, height: '70vh', overflow: 'auto'}}>
        {loading && <Box sx={{display:'flex',justifyContent:'center',p:4}}><CircularProgress/></Box>}
        {!loading && !data && <Typography>No data</Typography>}
        {!loading && data && (
          <Box>
            {/* Summary cards per day for the week */}
            <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:2, mb:2, flexWrap:'wrap'}}>
              <Box sx={{display:'flex', gap:1, flexWrap:'wrap'}}>
                {daySummaries.map(ds => (
                  <Paper
                    key={ds.date}
                    sx={{
                      p:1.5,
                      minWidth:110,
                      borderWidth: ds.date === today ? 2 : 1,
                      borderStyle:'solid',
                      borderColor: ds.date === today ? 'primary.main' : 'divider'
                    }}
                    elevation={ds.date === today ? 3 : 1}
                  >
                    <Typography variant="caption" sx={{color:'text.secondary', display:'block', fontWeight: ds.date === today ? 700 : 400}}>
                      {weekdayName(ds.date)} · {ds.date}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: (theme) =>
                          ds.done === ds.total && ds.total > 0
                            ? theme.palette.success.main
                            : ds.date < today
                              ? theme.palette.error.main
                              : theme.palette.text.primary
                      }}
                    >
                      {ds.done} / {ds.total}
                    </Typography>
                    {ds.doneWithNotes > 0 && (
                      <Typography variant="caption" sx={{color:'warning.main'}}>{ds.doneWithNotes} w/ catatan</Typography>
                    )}
                  </Paper>
                ))}
              </Box>
              <Box sx={{ml:2, textAlign:'right', alignSelf:'center'}}>
                <Typography variant="caption" sx={{color:(theme)=>theme.palette.text.secondary}}>Site</Typography>
                <Typography variant="subtitle1" sx={{fontWeight:600}}>{siteName}</Typography>
              </Box>
            </Box>
            {/* compute paged subset when using paged view */}
            {
              (()=>{
                if (!usePagedView) return null
                const total = filteredAlats.length
                const pages = Math.max(1, Math.ceil(total / rowsPerPage))
                return (
                  <Box sx={{display:'flex', alignItems:'center', gap:1, mb:1}}>
                    <Button size="small" onClick={()=> setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage<=1}>Prev</Button>
                    <Typography variant="body2">Page {currentPage} / {pages} • {total} items</Typography>
                    <Button size="small" onClick={()=> setCurrentPage(p => Math.min(p+1, pages))} disabled={currentPage>=pages}>Next</Button>
                    <Button size="small" onClick={()=> setCurrentPage(1)}>First</Button>
                    <Button size="small" onClick={()=> setCurrentPage(pages)}>Last</Button>
                    <Button size="small" onClick={()=> setAutoPage(v=>!v)} startIcon={autoPage? <PauseIcon/> : <PlayArrowIcon/>}>{autoPage? 'Pause' : 'Auto'}</Button>
                  </Box>
                )
              })()
            }
            <Table size="small">
              <TableHead>
                <TableRow sx={{'& th': {borderBottom: '2px solid', borderColor: (theme)=>theme.palette.divider}}}>
                  <TableCell
                    sx={{
                      position:'sticky',
                      top:0,
                      backgroundColor: (theme) => theme.palette.primary.main,
                      color: (theme) => theme.palette.primary.contrastText,
                      zIndex:3,
                      fontWeight:700,
                      fontSize:'0.95rem',
                      py:1.2,
                      boxShadow: (theme)=>`0 1px 0 ${theme.palette.divider} inset`
                    }}
                  >
                    <Box sx={{display:'flex', alignItems:'center', gap:1}}>
                      <Typography>Alat</Typography>
                      <IconButton size="small" onClick={()=>{
                        if (sortBy === 'alat') setSortDir(d=> d === 'asc' ? 'desc' : 'asc')
                        else { setSortBy('alat'); setSortDir('asc') }
                      }} sx={{color: (theme)=> theme.palette.primary.contrastText}}>
                        <SortIcon fontSize="small" sx={{ transform: sortBy === 'alat' && sortDir === 'desc' ? 'rotate(180deg)' : 'none' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                  {data.days.map(d=> (
                    <TableCell
                      key={d}
                      align="center"
                      sx={{
                        position:'sticky',
                        top:0,
                        backgroundColor: (theme) => theme.palette.primary.main,
                        color: (theme) => theme.palette.primary.contrastText,
                        zIndex:2,
                        fontWeight:700,
                        fontSize:'0.9rem',
                        py:1.2,
                        borderLeft: (theme)=>`1px solid ${theme.palette.divider}`
                      }}
                    >
                        <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:0.25}}>
                          <Box sx={{display:'flex',alignItems:'center',gap:0.5}}>
                            <Typography variant="caption" sx={{opacity:0.95,fontWeight:700}}>{weekdayName(d)}</Typography>
                              <IconButton size="small" onClick={()=>{
                              if (sortBy === `date:${d}`) setSortDir(s=> s === 'asc' ? 'desc' : 'asc')
                              else { setSortBy(`date:${d}`); setSortDir('asc') }
                            }} sx={{color: (theme)=> theme.palette.primary.contrastText}}>
                              <SortIcon fontSize="small" sx={{ transform: sortBy === `date:${d}` && sortDir === 'desc' ? 'rotate(180deg)' : 'none' }} />
                            </IconButton>
                          </Box>
                          <Typography variant="body2">{d}</Typography>
                        </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(() => {
                  const all = filteredAlats;
                  // apply sorting
                  let sorted = [...all];
                  if (sortBy === 'alat') {
                    sorted.sort((x, y) => {
                      const aName = String(x?.nama || x?.name || '').toLowerCase();
                      const bName = String(y?.nama || y?.name || '').toLowerCase();
                      if (aName < bName) return sortDir === 'asc' ? -1 : 1;
                      if (aName > bName) return sortDir === 'asc' ? 1 : -1;
                      return 0;
                    })
                  } else if (typeof sortBy === 'string' && sortBy.startsWith('date:')) {
                    const key = sortBy.slice(5)
                    sorted.sort((x, y) => {
                      const sx = x?.statuses?.[key]
                      const sy = y?.statuses?.[key]
                      const rank = (s) => {
                        if (s && s.done) return 0
                        if (key < today) return 2 // missed
                        return 1 // open/not yet done
                      }
                      const rx = rank(sx), ry = rank(sy)
                      if (rx !== ry) return sortDir === 'asc' ? (rx - ry) : (ry - rx)
                      // tie-break by alat name
                      const aName = String(x?.nama || x?.name || '').toLowerCase();
                      const bName = String(y?.nama || y?.name || '').toLowerCase();
                      if (aName < bName) return -1
                      if (aName > bName) return 1
                      return 0
                    })
                  }
                  let rowsToRender = sorted;
                  if (usePagedView) {
                    const pages = Math.max(1, Math.ceil(all.length / rowsPerPage));
                    const p = Math.min(Math.max(1, currentPage), pages);
                    const start = (p-1)*rowsPerPage;
                    rowsToRender = sorted.slice(start, start + rowsPerPage);
                  }
                  return rowsToRender.map((a, idx) => {
                    return (
                        <TableRow key={a.id} sx={{ backgroundColor: (theme) => idx % 2 ? theme.palette.action.hover : 'inherit' }}>
                          <TableCell sx={{fontWeight:600, minWidth:220}}>{a.nama} {a.kode ? `(${a.kode})` : ''}</TableCell>
                        {data.days.map(d => {
                          const s = a.statuses[d];
                          const todayStr = today; // YYYY-MM-DD
                          let statusLabel = 'OPEN';
                          let color = 'default';
                          if (s && s.done) {
                            statusLabel = 'DONE';
                            // Biru (info) jika ada catatan/notes, atau ada item yang false
                            if (s.notes || s.catatan || s.has_false) {
                              color = 'info';
                            } else {
                              color = 'success';
                            }
                          } else if (d < todayStr) {
                            statusLabel = 'MISS';
                            color = 'error';
                          } else {
                            statusLabel = 'OPEN';
                            color = 'default';
                          }

                          const tip = s && s.checklist_id ? `ID: ${s.checklist_id} • ${s.performed_at || ''}` : (statusLabel === 'MISS' ? (s?.assigned_teknisi ? `Missed (no checklist) • Assigned: ${s.assigned_teknisi}` : 'Missed (no checklist)') : (statusLabel === 'OPEN' ? (s?.assigned_teknisi ? `Assigned: ${s.assigned_teknisi}` : 'Not yet assigned') : ''));
                          const chipSx = (()=>{
                            return statusLabel === 'OPEN' ? { backgroundColor: (theme)=>theme.palette.grey[300], color: (theme)=>theme.palette.text.primary, fontWeight:600 } : {};
                          })();

                          return (
                            <TableCell key={d} align="center" sx={{py:1}}>
                              <Tooltip title={tip} arrow>
                                <span>
                                  <Chip
                                    label={statusLabel}
                                    color={color === 'default' ? undefined : (color === 'info' ? 'warning' : color)}
                                    size="medium"
                                    sx={chipSx}
                                    onClick={async () => {
                                      if (statusLabel !== 'DONE') return;
                                      try{
                                        setDetailLoading(true);
                                        setDetailOpen(true);
                                        if (s && s.checklist_id) {
                                          const id = s.checklist_id;
                                          const res = await apiClient(`/checklists/${id}`);
                                          const payload = res?.data || res;
                                          setDetailData(payload);
                                        } else {
                                          // Fallback: build minimal detailData from status `s` and alat `a` so user can view/print
                                          const fallback = {
                                            checklist: {
                                              id: null,
                                              teknisi_name: s?.teknisi_name || s?.teknisi || '-',
                                              performed_at: s?.performed_at || null,
                                              notes: s?.notes || s?.catatan || '',
                                              alat: { nama: a?.nama || a?.name || '-', kode: a?.kode }
                                            },
                                            items: s?.items || s?.answers || a?.checklist_items || []
                                          };
                                          setDetailData(fallback);
                                        }
                                      }catch(e){ console.error('load detail', e); setDetailData({ error: e?.message || String(e) }) }
                                      finally{ setDetailLoading(false); }
                                    }}
                                  />
                                </span>
                              </Tooltip>
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                })()}
              </TableBody>
            </Table>
          </Box>
        )}
        </Paper>
        <Dialog open={detailOpen} onClose={()=>{ setDetailOpen(false); setDetailData(null) }} fullWidth maxWidth="md" container={() => containerRef.current}>
          <DialogTitle sx={{ m: 0, p: 2 }}>
            Checklist Detail
            <IconButton
              aria-label="print"
              onClick={() => { printChecklist(); }}
              sx={{ position: 'absolute', right: 48, top: 8 }}
              size="small"
            >
              <PrintIcon />
            </IconButton>
            <IconButton
              aria-label="close"
              onClick={() => { setDetailOpen(false); setDetailData(null) }}
              sx={{ position: 'absolute', right: 8, top: 8 }}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            {detailLoading && <Typography>Loading...</Typography>}
            {!detailLoading && detailData && detailData.error && <Typography color="error">{detailData.error}</Typography>}
            {!detailLoading && detailData && !detailData.error && (
              <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{mb:1}}>
                <Avatar>{(detailData.checklist?.teknisi_name || '?').slice(0,1)}</Avatar>
                <Box>
                  <Typography variant="subtitle1">{detailData.checklist?.teknisi_name || '—'}</Typography>
                  <Typography variant="caption">Performed at: {formatDateTime(detailData.checklist?.performed_at)}</Typography>
                </Box>
                <Box sx={{ml:3}}>
                  <Typography variant="subtitle2">Alat: {detailData.checklist?.alat?.nama || detailData.checklist?.alat?.name || '—'}</Typography>
                  {detailData.checklist?.alat?.kode && <Typography variant="caption">Code: {detailData.checklist.alat.kode}</Typography>}
                </Box>
              </Stack>
              <Typography variant="body2" sx={{mb:1}}>{detailData.checklist?.notes}</Typography>
                <Divider sx={{mb:1}} />
                <List>
                  {detailItemsSorted.map((it, idx)=> (
                    <ListItem key={idx} sx={{flexDirection:'column', alignItems:'stretch', py:1}}>
                      <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
                        <Box sx={{flex:1}}>
                          <ListItemText
                            primary={`${idx + 1}. ${it.question?.question_text || it.question?.text || `Q${it.question?.id || ''}`}`}
                          />
                        </Box>
                        {
                          (()=>{
                          const rawVal = it.option?.option_text ?? it.option?.name ?? (it.answer_text ?? (it.answer_number !== undefined ? String(it.answer_number) : null))
                          const rawStr = rawVal == null ? null : String(rawVal).trim()
                          const raw = (rawStr === null || rawStr === '' || ['null','undefined'].includes(rawStr.toLowerCase())) ? null : rawStr
                          let node = null
                          if (raw === null) node = <Typography component="span" variant="body2" color="text.secondary">N/A</Typography>
                          else {
                            const low = raw.toLowerCase()
                            if (['true','1','yes','y'].includes(low)) node = <Typography component="span" variant="body2" sx={{color:'success.main',fontWeight:600}}>OK</Typography>
                            else if (['false','0','no','n'].includes(low)) node = <Typography component="span" variant="body2" sx={{color:'error.main',fontWeight:600}}>NOT OK</Typography>
                            else node = <Typography component="span" variant="body2" color="text.primary">{raw}</Typography>
                          }
                          return (
                            <Box sx={{minWidth:120, textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                              {node}
                              {(() => {
                                const note = it.evidence_note || it.evidence_description || it.notes || it.note || it.answer_text || null
                                const low = raw ? String(raw).toLowerCase() : null
                                if (low && ['false','0','no','n'].includes(low) && note) {
                                  return <Typography variant="caption" color="text.secondary" sx={{mt:0.5, maxWidth:160, textAlign:'center'}}>{note}</Typography>
                                }
                                return null
                              })()}
                            </Box>
                          )
                        })()
                        }
                      </Box>

                      {(it.evidence_photo_url || it.evidence_photo_path) ? (
                        <Box sx={{mt:1, display:'flex', gap:1, alignItems:'flex-start'}}>
                          {(() => {
                            const url = normalizeMediaUrl(it.evidence_photo_url || it.evidence_photo_path)
                            if (!url) {
                              return (
                                <Box sx={{width:80,height:80,display:'flex',alignItems:'center',justifyContent:'center',border:'1px dashed',borderColor:'divider',borderRadius:1}}>
                                  <Typography variant="caption" color="text.secondary">Local file (not uploaded)</Typography>
                                </Box>
                              )
                            }
                            return (
                              <a href={url} target="_blank" rel="noreferrer">
                                <Box component="img" src={url} sx={{width:80,height:80,objectFit:'cover',borderRadius:1,border:'1px solid',borderColor:'divider'}}/>
                              </a>
                            )
                          })()}

                          {(it.evidence_note || it.evidence_description) ? (
                            <Typography variant="caption" sx={{display:'block', mt:0, maxWidth:420, overflow:'hidden', textOverflow:'ellipsis', color:'text.secondary'}}>
                              {it.evidence_note || it.evidence_description}
                            </Typography>
                          ) : null}
                        </Box>
                      ) : null}
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </DialogContent>
        </Dialog>
    </Box>
  )
}

// Auto-scroll effect
function useAutoScroll(containerRef, enabled, speed){
  const tickRef = useRef(null)

  useEffect(()=>{
    if (!enabled) {
      if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null }
      return
    }
    const el = containerRef.current
    if (!el) return

    // compute pixels per second by speed (halved from previous values)
    const pps = speed === 'slow' ? 10 : speed === 'fast' ? 60 : 30
    const intervalMs = 100
    const pxPerTick = pps * (intervalMs/1000)

    tickRef.current = setInterval(()=>{
      if (!el) return
      const maxScroll = el.scrollHeight - el.clientHeight
      if (maxScroll <= 0) return

      if (el.scrollTop + pxPerTick >= maxScroll){
        // reached bottom -> instantly jump to top so autoplay continues
        el.scrollTop = 0
        return
      }

      el.scrollTo({ top: Math.min(el.scrollTop + pxPerTick, maxScroll), behavior: 'smooth' })
    }, intervalMs)

    return ()=>{ if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null } }
  }, [containerRef, enabled, speed])
}

// Hook usage inside component
/* Note: We can't call hooks conditionally inside the main component after the export
   so ensure consumers call useAutoScroll from within the component. */
