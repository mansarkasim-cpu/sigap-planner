'use client'
import React, { useEffect, useState } from 'react'
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
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Divider from '@mui/material/Divider'
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

function computeRangeFromItems(items) {
  if (!items || !Array.isArray(items) || items.length === 0) return { minStart: null, maxEnd: null }
  let min = null
  let max = null
  for (const r of items) {
    try {
      const s = r.start ?? r.start_time ?? r.startTime ?? null
      const e = r.end ?? r.end_time ?? r.endTime ?? null
      if (s) {
        const ss = String(s).trim()
        const naiveSqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/
        const m = naiveSqlRx.exec(ss)
        let ds
        if (m && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(ss)) {
          const y = Number(m[1]); const mo = Number(m[2]) - 1; const d0 = Number(m[3]);
          const hh = Number(m[4] || '0'); const mi = Number(m[5] || '0'); const ssn = Number(m[6] || '0');
          ds = new Date(y, mo, d0, hh, mi, ssn)
        } else {
          ds = new Date(s)
        }
        if (!isNaN(ds.getTime())) {
          if (min === null || ds.getTime() < min.getTime()) min = ds
        }
      }
      if (e) {
        const es = String(e).trim()
        const naiveSqlRx2 = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/
        const m2 = naiveSqlRx2.exec(es)
        let de
        if (m2 && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(es)) {
          const y = Number(m2[1]); const mo = Number(m2[2]) - 1; const d0 = Number(m2[3]);
          const hh = Number(m2[4] || '0'); const mi = Number(m2[5] || '0'); const ssn = Number(m2[6] || '0');
          de = new Date(y, mo, d0, hh, mi, ssn)
        } else {
          de = new Date(e)
        }
        if (!isNaN(de.getTime())) {
          if (max === null || de.getTime() > max.getTime()) max = de
        }
      }
    } catch (_) {}
  }
  return { minStart: min, maxEnd: max }
}

export default function Page() {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState([])
  const [ranges, setRanges] = useState({})
  const [modalOpen, setModalOpen] = useState(false)
  const [modalLoading, setModalLoading] = useState(false)
  const [modalData, setModalData] = useState(null)
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
      // preload realisasi ranges (min start / max end) for visible work orders
      setRanges({})
      const fetches = completed.map(async (wo) => {
        try {
          const woId = wo.id
          if (!woId) return null
          const relRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}/realisasi/full`)
          const items = relRes?.items ?? relRes?.data ?? relRes ?? []
          const range = computeRangeFromItems(Array.isArray(items) ? items : [])
          return { id: woId, range }
        } catch (e) {
          return null
        }
      })
      const settled = await Promise.allSettled(fetches)
      const newRanges = {}
      for (const s of settled) {
        if (s.status === 'fulfilled' && s.value && s.value.id) {
          newRanges[s.value.id] = s.value.range
        }
      }
      setRanges(prev => ({ ...prev, ...newRanges }))
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
      return { tasks, relByTask: byTask }
    } catch (e) {
      console.error('load details', e)
      setExpanded(prev => ({ ...prev, [woId]: { tasks: [], relByTask: {} } }))
      return { tasks: [], relByTask: {} }
    } finally {
      setLoadingDetails(prev => ({ ...prev, [woId]: false }))
    }
  }

  function extractAssignedFromTask(t) {
    if (!t) return []
    // possible fields: assignments (array of objects), assignment (single), assignees, users
    const arr = []
    if (Array.isArray(t.assignments) && t.assignments.length) {
      for (const a of t.assignments) {
        if (a.user) arr.push(a.user)
        else if (a.teknisi) arr.push(a.teknisi)
        else arr.push(a)
      }
    } else if (t.assignment) {
      const a = t.assignment
      if (a.user) arr.push(a.user)
      else if (a.teknisi) arr.push(a.teknisi)
      else arr.push(a)
    } else if (Array.isArray(t.assignees) && t.assignees.length) {
      arr.push(...t.assignees)
    } else if (Array.isArray(t.users) && t.users.length) {
      arr.push(...t.users)
    }
    return arr
  }

  function getSubmitterName(r) {
    if (!r) return '-'
    const u = r.user || r.submitter || r.submitted_by || r.created_by
    if (!u) return '-'
    return (u.nipp ? (u.nipp + ' • ') : '') + (u.name || u.fullname || u.email || u.id || '-')
  }

  function pickSingleRealisasi(items) {
    if (!items || !Array.isArray(items) || items.length === 0) return null
    // prefer latest by start, fallback to latest by end, otherwise first
    let best = null
    let bestTime = -Infinity
    for (const r of items) {
      const s = r.start ?? r.start_time ?? r.startTime ?? null
      const e = r.end ?? r.end_time ?? r.endTime ?? null
      let t = null
      try {
        if (s) t = new Date(s).getTime()
        else if (e) t = new Date(e).getTime()
      } catch (_) { t = null }
      const tv = (t && !isNaN(t)) ? t : -Infinity
      if (tv > bestTime) { bestTime = tv; best = r }
    }
    return best || items[0]
  }

  async function openModal(wo) {
    setModalOpen(true)
    setModalLoading(true)
    try {
      const res = await loadDetails(wo.id)
      setModalData({ wo, tasks: res.tasks || [], relByTask: res.relByTask || {} })
    } catch (e) {
      console.error('openModal error', e)
      setModalData({ wo, tasks: [], relByTask: {} })
    } finally {
      setModalLoading(false)
    }
  }

  function closeModal() {
    setModalOpen(false)
    setModalData(null)
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

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>WO</strong></TableCell>
              <TableCell><strong>Asset</strong></TableCell>
              <TableCell><strong>Start</strong></TableCell>
              <TableCell><strong>End</strong></TableCell>
              <TableCell><strong>Tasks</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((wo) => (
              <TableRow hover key={wo.id || wo.doc_no || wo._id}>
                <TableCell>{wo.doc_no || wo.id}</TableCell>
                <TableCell>{wo.asset_name || wo.raw?.asset_name || wo.raw?.alat?.nama || wo.raw?.alat?.name || '—'}</TableCell>
                <TableCell>{(() => {
                  const tz = getSiteTimezone(wo)
                  const range = (ranges && ranges[wo.id]) ? ranges[wo.id] : (expanded[wo.id] ? getRealisasiRange(expanded, wo.id) : { minStart: null, maxEnd: null })
                  const hdrStart = range.minStart ? formatDateDisplay(range.minStart.toISOString(), tz) : formatDateDisplay(wo.start_date || wo.raw?.start_date, tz)
                  return hdrStart
                })()}</TableCell>
                <TableCell>{(() => {
                  const tz = getSiteTimezone(wo)
                  const range = (ranges && ranges[wo.id]) ? ranges[wo.id] : (expanded[wo.id] ? getRealisasiRange(expanded, wo.id) : { minStart: null, maxEnd: null })
                  const hdrEnd = range.maxEnd ? formatDateDisplay(range.maxEnd.toISOString(), tz) : formatDateDisplay(wo.end_date || wo.raw?.end_date, tz)
                  return hdrEnd
                })()}</TableCell>
                <TableCell>{expanded[wo.id] ? (expanded[wo.id].tasks?.length ?? (wo.tasks_count ?? wo.task_count ?? '-')) : (wo.tasks_count ?? wo.task_count ?? '-')}</TableCell>
                <TableCell>
                  <Button size="small" variant="contained" startIcon={<VisibilityIcon />} onClick={() => openModal(wo)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {list.length === 0 && !loading ? <div>No completed work orders found.</div> : null}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Stack spacing={2} alignItems="center">
          <Pagination page={page} count={totalPages} onChange={(_, value) => { setPage(value); }} color="primary" />
          <div style={{ color: '#666' }}>Page {page} of {totalPages}</div>
        </Stack>
      </Box>

      <Dialog fullWidth maxWidth="md" open={modalOpen} onClose={closeModal}>
        <DialogTitle>Realisasi Details</DialogTitle>
        <DialogContent dividers>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>
          ) : modalData ? (
            <div>
              <Typography variant="h6">{modalData.wo?.asset_name || modalData.wo?.doc_no}</Typography>
              <Typography variant="subtitle2" color="textSecondary">WO: {modalData.wo?.doc_no || modalData.wo?.id}</Typography>
              <Divider sx={{ my: 1 }} />
              {modalData.tasks && modalData.tasks.length > 0 ? (
                modalData.tasks.map((t) => (
                  <Paper key={t.id || t.external_id} variant="outlined" sx={{ p: 1, mt: 1 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs={12} sm={8}>
                        <Typography variant="subtitle1">{t.name || t.task_name || 'Task'}</Typography>
                        <div style={{ fontSize: 13, color: '#666' }}>Task ID: {t.id || t.external_id || ''}</div>
                        <div style={{ marginTop: 6 }}>
                          <strong>Assigned:</strong>{' '}
                          {(() => {
                            const assigned = extractAssignedFromTask(t)
                            if (!assigned || assigned.length === 0) return <span style={{ color: '#666' }}>No assigned technicians</span>
                            return assigned.map((u, idx) => (
                              <Chip key={idx} size="small" sx={{ mr: 0.5 }} label={(u.nipp ? (u.nipp + ' • ') : '') + (u.name || u.fullname || u.email || u.id)} avatar={u.name ? <Avatar>{(u.name || u.email || '').charAt(0)}</Avatar> : undefined} />
                            ))
                          })()}
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip label={`${(modalData.relByTask && modalData.relByTask[t.id] ? modalData.relByTask[t.id].length : 0)} entries`} size="small" />
                      </Grid>
                    </Grid>

                    <Box mt={1}>
                      {(modalData.relByTask && modalData.relByTask[t.id]) ? (
                        (() => {
                          const chosen = pickSingleRealisasi(modalData.relByTask[t.id])
                          if (!chosen) return <div style={{ color: '#666' }}>No realisasi entries for this task.</div>
                          const rawPhotos = []
                          if (Array.isArray(chosen.photos) && chosen.photos.length) rawPhotos.push(...chosen.photos)
                          if (Array.isArray(chosen.photoUrls) && chosen.photoUrls.length) rawPhotos.push(...chosen.photoUrls)
                          if (Array.isArray(chosen.photo_urls) && chosen.photo_urls.length) rawPhotos.push(...chosen.photo_urls)
                          if (chosen.photoUrl && typeof chosen.photoUrl === 'string') rawPhotos.push(chosen.photoUrl)
                          if (chosen.photo && typeof chosen.photo === 'string') rawPhotos.push(chosen.photo)
                          const photos = rawPhotos.map(p => p && resolveMediaUrl(p)).filter(Boolean)
                          return (
                            <Paper key={chosen.id || 'r'} variant="outlined" sx={{ mb: 1, p: 1, display: 'grid', gridTemplateColumns: '120px 1fr', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: 1 }}>
                                {photos && photos.length > 0 ? (
                                  photos.length === 1 ? (
                                    <a href={photos[0]} target="_blank" rel="noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}><img src={photos[0]} alt="photo" style={{ width: '100%', height: '100%', maxHeight: 120, objectFit: 'cover', display: 'block', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" /></a>
                                  ) : (
                                    <Box sx={{ display: 'flex', gap: 0.5, width: '100%', height: '100%' }}>{photos.map((p, idx) => (<a key={idx} href={p} target="_blank" rel="noreferrer" style={{ width: `${100 / photos.length}%`, display: 'block', height: '100%' }}><img src={p} alt={`photo-${idx}`} style={{ width: '100%', height: '100%', maxHeight: 120, objectFit: 'cover', display: 'block', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" /></a>))}</Box>
                                  )
                                ) : null}
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Stack direction="row" spacing={1} alignItems="center">
                                    <Chip label={`Start: ${formatDateDisplay(chosen.start, getSiteTimezone(modalData.wo))}`} size="small" />
                                    <Chip label={`End: ${formatDateDisplay(chosen.end, getSiteTimezone(modalData.wo))}`} size="small" />
                                  </Stack>
                                  <Chip label={getSubmitterName(chosen)} size="small" avatar={chosen.user ? <Avatar alt={chosen.user.name || chosen.user.id}>{(chosen.user.name || chosen.user.email || '').charAt(0)}</Avatar> : undefined} />
                                </Box>
                                {chosen.notes ? <Typography sx={{ mt: 1 }}>{chosen.notes}</Typography> : null}
                              </Box>
                            </Paper>
                          )
                        })()
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
          ) : (
            <div>No data</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Close</Button>
        </DialogActions>
      </Dialog>
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
