'use client'
import { useEffect, useState } from 'react'
import apiClient from '../../lib/api-client'
import { formatUtcToZone } from '../../lib/date-utils'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'

function getSiteTimezone(wo) {
  if (!wo) return undefined
  return wo.site?.timezone || wo.siteTimezone || wo.raw?.site?.timezone || undefined
}

function formatDateDisplay(s, tz) {
  if (!s) return '-'
  try {
    return formatUtcToZone(s, tz)
  } catch (e) {
    return String(s)
  }
}

function resolveMediaUrl(u) {
  if (!u) return u
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const envBase = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) ? process.env.NEXT_PUBLIC_API_URL : ''
  const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : ''
  let base = envBase || origin || ''
  if (!base) return u
  // strip trailing /api if present
  if (base.endsWith('/api')) base = base.slice(0, -4)
  // development convenience: if front-end origin is localhost:3000 and no API URL provided,
  // assume backend runs on the same host with port 4000 and use that for uploads.
  if (!envBase && origin && origin.includes('localhost:3000')) {
    base = origin.replace('localhost:3000', 'localhost:4000')
  }
  if (!u.startsWith('/')) u = '/' + u
  return base + u
}

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expanded, setExpanded] = useState({})
  const [loadingDetails, setLoadingDetails] = useState({})

  useEffect(() => { load(); }, [page, pageSize])

  async function load() {
    setLoading(true)
    try {
      const qs = []
      qs.push(`page=${encodeURIComponent(page)}`)
      qs.push(`pageSize=${encodeURIComponent(pageSize)}`)
      if (search && search.trim()) qs.push(`q=${encodeURIComponent(search.trim())}`)
      if (startDate) qs.push(`start=${encodeURIComponent(startDate)}`)
      if (endDate) qs.push(`end=${encodeURIComponent(endDate)}`)
      const url = `/work-orders?${qs.join('&')}`
      const res = await apiClient(url)

      // Normalize responses: support array or { items, total, page, pageSize }
      let rows = []
      let total = 0
      if (Array.isArray(res)) {
        rows = res
        total = res.length
      } else if (res && Array.isArray(res.items)) {
        rows = res.items
        total = Number(res.total || rows.length)
      } else if (res && Array.isArray(res.data)) {
        rows = res.data
        total = Number(res.total || rows.length)
      } else if (res && Array.isArray(res)) {
        rows = res
        total = res.length
      }

      const completed = (rows || []).filter(r => ((r.status || r.raw?.status || 'PREPARATION').toString().toUpperCase()) === 'COMPLETED')
      setList(completed)
      const computedTotalPages = Math.max(1, Math.ceil((total || completed.length) / pageSize))
      setTotalPages(computedTotalPages)
    } catch (e) {
      console.error('load realisasi list', e)
      setList([])
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }

  async function loadDetails(woId) {
    setLoadingDetails(prev => ({ ...prev, [woId]: true }))
    try {
      const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}/tasks`)
      const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? [])
      const relRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}/realisasi/full`)
      const items = relRes?.items ?? relRes?.data ?? relRes ?? []
      // group items by taskId
      const byTask = {}
      for (const it of items) {
        const tid = it.taskId || it.task_id || (it.assignmentId ? String(it.assignmentId) : 'unknown')
        byTask[tid] = byTask[tid] || []
        byTask[tid].push(it)
      }
      setExpanded(prev => ({ ...prev, [woId]: { tasks, relByTask: byTask } }))
    } catch (e) {
      console.error('load details', e)
      setExpanded(prev => ({ ...prev, [woId]: { tasks: [], relByTask: {} } }))
    } finally {
      setLoadingDetails(prev => ({ ...prev, [woId]: false }))
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Realisasi — Completed Work Orders</h1>
      {loading ? <div>Loading...</div> : null}

      <Box sx={{ mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
          <TextField size="small" label="Search (doc no / id)" value={search} onChange={(e) => setSearch(e.target.value)} />
          <TextField size="small" label="Start date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <TextField size="small" label="End date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <Button variant="outlined" onClick={() => { setPage(1); load(); }}>Apply</Button>
          <Button variant="text" onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); setPage(1); load(); }}>Clear</Button>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="ps-label">Page Size</InputLabel>
            <Select labelId="ps-label" value={pageSize} label="Page Size" onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {list.map((wo) => (
          <Card key={wo.id} variant="outlined">
            <CardContent>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{wo.asset_name || wo.raw?.asset_name || wo.raw?.alat?.nama || wo.raw?.alat?.name || '—'}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">WO: {wo.doc_no || wo.id}</Typography>
                  {
                    (() => {
                      const tz = getSiteTimezone(wo)
                      const range = expanded[wo.id] ? getRealisasiRange(expanded, wo.id) : { minStart: null, maxEnd: null }
                      const hdrStart = range.minStart ? formatDateDisplay(range.minStart.toISOString(), tz) : formatDateDisplay(wo.start_date || wo.raw?.start_date, tz)
                      const hdrEnd = range.maxEnd ? formatDateDisplay(range.maxEnd.toISOString(), tz) : formatDateDisplay(wo.end_date || wo.raw?.end_date, tz)
                      return (
                        <>
                          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>⏱️ Start: {hdrStart}</Typography>
                          <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700 }}>🏁 End: {hdrEnd}</Typography>
                        </>
                      )
                    })()
                  }
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Chip label={`Tasks: ${expanded[wo.id] ? (expanded[wo.id].tasks?.length ?? 0) : (wo.tasks_count ?? wo.task_count ?? '-')}`} size="small" />
                    <Button variant={expanded[wo.id] ? 'outlined' : 'contained'} color="primary" size="small" startIcon={!expanded[wo.id] ? <VisibilityIcon /> : null} onClick={async () => {
                      if (!expanded[wo.id]) {
                        await loadDetails(wo.id)
                      } else {
                        setExpanded(prev => ({ ...prev, [wo.id]: null }))
                      }
                    }}>
                      {loadingDetails[wo.id] ? <CircularProgress size={18} /> : (expanded[wo.id] ? 'Hide Details' : 'View Realisasi')}
                    </Button>
                  </div>
                </div>
              </div>

              {expanded[wo.id] && (
                <div style={{ marginTop: 12 }}>
                  <Typography variant="subtitle1">Tasks & Realisasi</Typography>
                  {expanded[wo.id].tasks && expanded[wo.id].tasks.length > 0 ? (
                    expanded[wo.id].tasks.map((t) => (
                      <Paper key={t.id || t.external_id} variant="outlined" sx={{ p: 1, mt: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={12} sm={8}>
                            <Typography variant="subtitle2">{t.name || t.task_name || 'Task'}</Typography>
                            <div style={{ fontSize: 13, color: '#666' }}>Task ID: {t.id || t.external_id || ''}</div>
                          </Grid>
                          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Chip label={`${(expanded[wo.id].relByTask && expanded[wo.id].relByTask[t.id] ? expanded[wo.id].relByTask[t.id].length : 0)} entries`} size="small" />
                          </Grid>
                        </Grid>
                        <Box mt={1}>
                          {(expanded[wo.id].relByTask && expanded[wo.id].relByTask[t.id]) ? (
                            expanded[wo.id].relByTask[t.id].map((r) => (
                              <Paper key={r.id} variant="outlined" sx={{ mb: 1, p: 1, display: 'flex', gap: 2 }}>
                                <Box sx={{ width: 120, height: 120 }}>
                                  {r.photoUrl ? (
                                    <a href={resolveMediaUrl(r.photoUrl)} target="_blank" rel="noreferrer">
                                      <img src={resolveMediaUrl(r.photoUrl)} alt="photo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" />
                                    </a>
                                  ) : (
                                    <Box sx={{ width: '100%', height: '100%', bgcolor: '#f5f5f5', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No photo</Box>
                                  )}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={`Start: ${formatDateDisplay(r.start, getSiteTimezone(wo))}`} size="small" />
                                    <Chip label={`End: ${formatDateDisplay(r.end, getSiteTimezone(wo))}`} size="small" />
                                    <Chip label={r.user ? ((r.user.nipp ? r.user.nipp + ' • ' : '') + (r.user.name || r.user.email || r.user.id)) : '-'} size="small" avatar={r.user ? <Avatar alt={r.user.name || r.user.id}>{(r.user.name || r.user.email || '').charAt(0)}</Avatar> : undefined} />
                                  </Stack>
                                  {r.notes ? <Typography sx={{ mt: 1 }}>{r.notes}</Typography> : null}
                                  {r.photoUrl ? (
                                    <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                      <img src={resolveMediaUrl(r.photoUrl)} alt="thumb" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" />
                                    </Box>
                                  ) : null}
                                </Box>
                              </Paper>
                            ))
                          ) : (
                            <div style={{ color: '#666' }}>No realisasi entries for this task.</div>
                          )}
                        </Box>
                      </Paper>
                    ))
                  ) : (
                    <div style={{ color: '#666' }}>No tasks found for this work order.</div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {list.length === 0 && !loading ? <div>No completed work orders found.</div> : null}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Pagination page={page} count={totalPages} onChange={(_, value) => { setPage(value); }} color="primary" />
          <div style={{ color: '#666' }}>Page {page} of {totalPages}</div>
        </Stack>
      </Box>
    </main>
  )
}

  function getRealisasiRange(expandedState, woId) {
    const entry = expandedState[woId]
    if (!entry || !entry.relByTask) return { minStart: null, maxEnd: null }
    const rows = Object.values(entry.relByTask).flat()
    let min = null
    let max = null
    for (const r of rows) {
        const s = r.start ?? r.start_time ?? r.startTime ?? null
        const e = r.end ?? r.end_time ?? r.endTime ?? null
      try {
          if (s) {
            // if naive SQL datetime (YYYY-MM-DD[ HH:MM:SS]) without timezone,
            // interpret as local wall-clock to match displayed values
            const ss = String(s).trim();
            const naiveSqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
            const m = naiveSqlRx.exec(ss);
            let ds;
            if (m && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(ss)) {
              const y = Number(m[1]); const mo = Number(m[2]) - 1; const d0 = Number(m[3]);
              const hh = Number(m[4] || '0'); const mi = Number(m[5] || '0'); const ssn = Number(m[6] || '0');
              ds = new Date(y, mo, d0, hh, mi, ssn);
            } else {
              ds = new Date(s);
            }
            if (!isNaN(ds.getTime())) {
              if (min === null || ds.getTime() < min.getTime()) min = ds
            }
          }
      } catch (_) {}
      try {
          if (e) {
            const es = String(e).trim();
            const naiveSqlRx2 = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
            const m2 = naiveSqlRx2.exec(es);
            let de;
            if (m2 && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(es)) {
              const y = Number(m2[1]); const mo = Number(m2[2]) - 1; const d0 = Number(m2[3]);
              const hh = Number(m2[4] || '0'); const mi = Number(m2[5] || '0'); const ssn = Number(m2[6] || '0');
              de = new Date(y, mo, d0, hh, mi, ssn);
            } else {
              de = new Date(e);
            }
            if (!isNaN(de.getTime())) {
              if (max === null || de.getTime() > max.getTime()) max = de
            }
          }
      } catch (_) {}
    }
    return { minStart: min, maxEnd: max }
  }
