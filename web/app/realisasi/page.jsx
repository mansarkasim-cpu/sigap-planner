'use client'
import { useEffect, useState } from 'react'
import apiClient from '../../lib/api-client'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Stack from '@mui/material/Stack'
import Pagination from '@mui/material/Pagination'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

function formatDateDisplay(s) {
  if (!s) return '-'
  const m = String(s).match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/)
  if (m) return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`
  try {
    const d = new Date(s)
    const pad = (n) => (n < 10 ? '0' + n : n)
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
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

      const completed = (rows || []).filter(r => ((r.status || r.raw?.status || 'NEW').toString().toUpperCase()) === 'COMPLETED')
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
                  <Typography variant="h6">{wo.doc_no || wo.id}</Typography>
                  <Typography variant="body2" color="textSecondary">Start: {formatDateDisplay(wo.start_date || wo.raw?.start_date)}</Typography>
                  <Typography variant="body2" color="textSecondary">End: {formatDateDisplay(wo.end_date || wo.raw?.end_date)}</Typography>
                </div>
                <div>
                  <Button size="small" onClick={async () => {
                    if (!expanded[wo.id]) {
                      await loadDetails(wo.id)
                    } else {
                      setExpanded(prev => ({ ...prev, [wo.id]: null }))
                    }
                  }}>
                    {expanded[wo.id] ? 'Hide' : 'View Realisasi'}
                  </Button>
                </div>
              </div>

              {expanded[wo.id] && (
                <div style={{ marginTop: 12 }}>
                  <Typography variant="subtitle1">Tasks & Realisasi</Typography>
                  {expanded[wo.id].tasks && expanded[wo.id].tasks.length > 0 ? (
                    expanded[wo.id].tasks.map((t) => (
                      <Box key={t.id || t.external_id} sx={{ borderTop: '1px solid #eee', pt: 1, mt: 1 }}>
                        <Typography variant="subtitle2">{t.name || t.task_name || 'Task'}</Typography>
                        <div style={{ fontSize: 13, color: '#666' }}>Task ID: {t.id || t.external_id || ''}</div>
                        <div style={{ marginTop: 8 }}>
                          {(expanded[wo.id].relByTask && expanded[wo.id].relByTask[t.id]) ? (
                            expanded[wo.id].relByTask[t.id].map((r) => (
                              <Box key={r.id} sx={{ mb: 1, p: 1, border: '1px dashed #ddd', borderRadius: 1 }}>
                                <div><strong>Start:</strong> {formatDateDisplay(r.start)} &nbsp; <strong>End:</strong> {formatDateDisplay(r.end)}</div>
                                <div><strong>Teknisi:</strong> {r.user ? ((r.user.nipp ? r.user.nipp + ' • ' : '') + (r.user.name || r.user.email || r.user.id)) : '-'}</div>
                                {r.notes ? <div><strong>Keterangan:</strong> {r.notes}</div> : null}
                                {r.photoUrl ? (
                                  <div style={{ marginTop: 6 }}>
                                    <a href={resolveMediaUrl(r.photoUrl)} target="_blank" rel="noreferrer">
                                      <img src={resolveMediaUrl(r.photoUrl)} alt="photo" style={{ width: 120, height: 'auto', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" />
                                    </a>
                                  </div>
                                ) : null}
                              </Box>
                            ))
                          ) : (
                            <div style={{ color: '#666' }}>No realisasi entries for this task.</div>
                          )}
                        </div>
                      </Box>
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
