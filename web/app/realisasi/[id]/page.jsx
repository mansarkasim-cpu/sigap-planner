'use client'
import { useEffect, useState } from 'react'
import apiClient from '../../../../lib/api-client'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'

export default function Page({ params }) {
  const id = params?.id
  const [loading, setLoading] = useState(false)
  const [wo, setWo] = useState(null)
  const [tasks, setTasks] = useState([])
  const [realisasiByTask, setRealisasiByTask] = useState({})

  useEffect(() => { if (id) load(id); }, [id])

  function resolveMediaUrl(u) {
    if (!u) return u
    if (u.startsWith('http://') || u.startsWith('https://')) return u
    const envBase = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) ? process.env.NEXT_PUBLIC_API_URL : ''
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : ''
      let base = envBase || origin || ''
    if (!base) return u
    if (base.endsWith('/api')) base = base.slice(0, -4)
      // development convenience: if front-end origin is localhost:3000 and no API URL provided,
      // assume backend runs on the same host with port 4000 and use that for uploads.
      if (!envBase && origin && origin.includes('localhost:3000')) {
        base = origin.replace('localhost:3000', 'localhost:4000')
      }
    if (!u.startsWith('/')) u = '/' + u
    return base + u
  }

  async function load(woId) {
    setLoading(true)
    try {
      const [woRes, tasksRes, relRes] = await Promise.all([
        apiClient(`/work-orders/${encodeURIComponent(woId)}`),
        apiClient(`/work-orders/${encodeURIComponent(woId)}/tasks`),
        apiClient(`/work-orders/${encodeURIComponent(woId)}/realisasi/full`),
      ])

      const workorder = woRes?.data ?? woRes
      const taskList = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? tasksRes?.items ?? [])
      const relItems = Array.isArray(relRes) ? relRes : (relRes?.items ?? relRes?.data ?? [])

      const byTask = {}
      for (const it of (relItems || [])) {
        const tid = it.taskId || it.task_id || (it.assignmentId ? String(it.assignmentId) : 'unknown')
        byTask[tid] = byTask[tid] || []
        byTask[tid].push(it)
      }

      setWo(workorder)
      setTasks(taskList)
      setRealisasiByTask(byTask)
    } catch (e) {
      console.error('load view realisasi', e)
      setWo(null)
      setTasks([])
      setRealisasiByTask({})
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ padding: 24 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <div>
          <Typography variant="h5">View Realisasi</Typography>
          <Typography variant="subtitle2" color="textSecondary">Work Order: {wo?.doc_no || wo?.id || id}</Typography>
        </div>
        <div>
          <Button href="/realisasi" variant="outlined">Back to list</Button>
        </div>
      </Stack>

      {loading ? <div>Loading...</div> : null}

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2 }}>
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Work Order Details</Typography>
            <div style={{ marginTop: 8 }}>
              <div><strong>Start:</strong> {wo ? (wo.start_date || wo.raw?.start_date ? (function(s){ const m=String(s).match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/); if(m) return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`; try{ const d=new Date(s); const pad=(n)=>n<10?('0'+n):n; return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}` }catch(e){return String(s)} })(wo.start_date || wo.raw?.start_date) : '-') : '-'}</div>
              <div><strong>End:</strong> {wo ? (wo.end_date || wo.raw?.end_date ? (function(s){ const m=String(s).match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/); if(m) return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`; try{ const d=new Date(s); const pad=(n)=>n<10?('0'+n):n; return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}` }catch(e){return String(s)} })(wo.end_date || wo.raw?.end_date) : '-') : '-'}</div>
              <div><strong>Status:</strong> {wo?.status || wo?.raw?.status || '-'}</div>
            </div>
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1">Tasks & Realisasi</Typography>
            <Divider sx={{ my: 1 }} />
            {tasks && tasks.length > 0 ? (
              tasks.map((t) => (
                <Box key={t.id || t.external_id} sx={{ mb: 2 }}>
                  <Typography variant="subtitle2">{t.name || t.task_name || 'Task'}</Typography>
                  <div style={{ fontSize: 13, color: '#666' }}>Task ID: {t.id || t.external_id || ''}</div>

                  <Box sx={{ mt: 1 }}>
                    {(realisasiByTask && realisasiByTask[t.id] && realisasiByTask[t.id].length > 0) ? (
                      realisasiByTask[t.id].map((r) => (
                        <Card key={r.id} variant="outlined" sx={{ my: 1 }}>
                          <CardContent>
                            <div><strong>Start:</strong> {(function(s){ const m=String(s||'').match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/); if(m) return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`; try{ const d=new Date(s); const pad=(n)=>n<10?('0'+n):n; return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}` }catch(e){return s||'-'} })(r.start)} &nbsp; <strong>End:</strong> {(function(s){ const m=String(s||'').match(/(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/); if(m) return `${m[3]}/${m[2]}/${m[1]} ${m[4]}:${m[5]}`; try{ const d=new Date(s); const pad=(n)=>n<10?('0'+n):n; return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}` }catch(e){return s||'-'} })(r.end)}</div>
                            <div><strong>Teknisi:</strong> {r.user ? ((r.user.nipp ? r.user.nipp + ' • ' : '') + (r.user.name || r.user.email || r.user.id)) : '-'}</div>
                            {r.notes ? <div><strong>Keterangan:</strong> {r.notes}</div> : null}
                            {r.photoUrl ? (
                              <div style={{ marginTop: 6 }}>
                                <a href={resolveMediaUrl(r.photoUrl)} target="_blank" rel="noreferrer">
                                  <img src={resolveMediaUrl(r.photoUrl)} alt="photo" style={{ width: 160, height: 'auto', borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" />
                                </a>
                              </div>
                            ) : null}
                            {r.signatureUrl ? <div style={{ marginTop: 6 }}><a href={r.signatureUrl} target="_blank" rel="noreferrer">Download Signature</a></div> : null}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div style={{ color: '#666' }}>No realisasi entries for this task.</div>
                    )}
                  </Box>
                </Box>
              ))
            ) : (
              <div style={{ color: '#666' }}>No tasks found for this work order.</div>
            )}
          </CardContent>
        </Card>
      </Box>
    </main>
  )
}
