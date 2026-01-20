"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

type Props = { id: string };

function fmtDate(s?: string | null) {
  if (!s) return '-';
  const d = new Date(s);
  if (isNaN(d.getTime())) return String(s);
  return d.toLocaleString();
}

function resolveMediaUrl(u?: string) {
  if (!u) return undefined;
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  try {
    const envBase = (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_URL) ? process.env.NEXT_PUBLIC_API_URL : '';
    const origin = (typeof window !== 'undefined' && window.location && window.location.origin) ? window.location.origin : '';
    let base = envBase || origin || '';
    if (base.endsWith('/api')) base = base.slice(0, -4);
    if (!envBase && origin && origin.includes('localhost:3000')) base = origin.replace('localhost:3000', 'localhost:4000');
    if (!u.startsWith('/')) u = '/' + u;
    return base + u;
  } catch (e) { return u; }
}

export default function WorkOrderDetailClient({ id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wo, setWo] = useState<any | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [dateHistory, setDateHistory] = useState<any[]>([]);
  const [realisasi, setRealisasi] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    async function loadAll() {
      setLoading(true);
      setError(null);
      try {
        const pDetail = apiClient(`/work-orders/${encodeURIComponent(String(id))}`);
        const pTasks = apiClient(`/work-orders/${encodeURIComponent(String(id))}/tasks`);
        const pDateHist = apiClient(`/work-orders/${encodeURIComponent(String(id))}/date-history`);
        const pRealisasi = apiClient(`/work-orders/${encodeURIComponent(String(id))}/realisasi/full`).catch(() => apiClient(`/work-orders/${encodeURIComponent(String(id))}/realisasi`).catch(() => []));

        const [dRes, tRes, hRes, rRes] = await Promise.allSettled([pDetail, pTasks, pDateHist, pRealisasi]);

        // detail
        if (dRes.status === 'fulfilled') {
          const detail = (dRes.value && (dRes.value.data ?? dRes.value)) || dRes.value;
          if (mounted) setWo(detail);
        } else {
          throw dRes.reason || new Error('Gagal memuat work order');
        }

        // tasks
        if (tRes.status === 'fulfilled') {
          const trows = Array.isArray(tRes.value) ? tRes.value : (tRes.value?.data ?? tRes.value ?? []);
          if (mounted) setTasks(trows);
        } else {
          // fallback to raw.activities once we have detail
          const det = (dRes as any).status === 'fulfilled' ? ((dRes as any).value?.data ?? (dRes as any).value) : null;
          const acts = Array.isArray(det?.raw?.activities) ? det.raw.activities : [];
          const mapped = acts.map((a: any, i: number) => ({ id: `raw-${i}`, name: a.task_name || a.name || `Task ${i + 1}`, duration_min: a.task_duration, assignments: a.assignments }));
          if (mounted) setTasks(mapped);
        }

        // date history
        if (hRes.status === 'fulfilled') {
          const rows = Array.isArray(hRes.value) ? hRes.value : (hRes.value?.data ?? hRes.value ?? []);
          if (mounted) setDateHistory(rows);
        }

        // realisasi
        if (rRes.status === 'fulfilled') {
          const rows = Array.isArray(rRes.value) ? rRes.value : (rRes.value?.items ?? rRes.value?.data ?? rRes.value ?? []);
          if (mounted) setRealisasi(rows);
        }
      } catch (err: any) {
        console.error('load workorder detail', err);
        if (mounted) setError(err?.body?.message || err?.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadAll();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <Box sx={{ p: 3 }}>Memuat...</Box>;
  if (error) return (
    <Box sx={{ p: 3 }}>
      <Typography color="error">Gagal memuat: {String(error)}</Typography>
      <Button sx={{ mt: 1 }} onClick={() => router.push('/work-orders')}>Kembali ke daftar</Button>
    </Box>
  );

  if (!wo) return (
    <Box sx={{ p: 3 }}>
      <Typography>Work order tidak ditemukan.</Typography>
      <Button sx={{ mt: 1 }} onClick={() => router.push('/work-orders')}>Kembali</Button>
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
        <Box>
          <Typography variant="h5">{wo.doc_no || wo.id}</Typography>
          <Typography variant="subtitle2" color="text.secondary">{wo.description || wo.raw?.description || ''}</Typography>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Chip label={String(wo.status || wo.raw?.status || 'N/A')} color="primary" />
          <Box sx={{ mt: 1 }}>
            <Button size="small" onClick={() => router.back()} sx={{ mr: 1 }}>Kembali</Button>
            <Button size="small" onClick={() => router.push('/work-orders')}>Daftar</Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Ringkasan</Typography>
            <Divider sx={{ my: 1 }} />
            <List dense>
              <ListItem><ListItemText primary="ID" secondary={wo.id} /></ListItem>
              <ListItem><ListItemText primary="Doc No" secondary={wo.doc_no || '-'} /></ListItem>
              <ListItem><ListItemText primary="Site / Lokasi" secondary={wo.vendor_cabang || wo.raw?.vendor_cabang || '-'} /></ListItem>
              <ListItem><ListItemText primary="Asset" secondary={wo.asset_name || '-'} /></ListItem>
              <ListItem><ListItemText primary="Tipe Pekerjaan" secondary={wo.work_type || wo.type_work || '-'} /></ListItem>
              <ListItem><ListItemText primary="Start" secondary={fmtDate(wo.start_date || wo.raw?.start_date)} /></ListItem>
              <ListItem><ListItemText primary="End" secondary={fmtDate(wo.end_date || wo.raw?.end_date)} /></ListItem>
              <ListItem><ListItemText primary="Progress" secondary={typeof wo.progress === 'number' ? `${wo.progress}%` : (wo.progress ?? '-')} /></ListItem>
            </List>
          </Paper>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1">Tanggal / Riwayat</Typography>
            <Divider sx={{ my: 1 }} />
            {dateHistory.length === 0 ? (
              <Typography color="text.secondary">Tidak ada riwayat tanggal.</Typography>
            ) : (
              dateHistory.map((r: any, i: number) => (
                <Box key={i} sx={{ mb: 1 }}>
                  <Typography variant="body2">{r.field || r.key || r.type || 'Tanggal'}</Typography>
                  <Typography variant="caption" color="text.secondary">{fmtDate(r.old_value)} → {fmtDate(r.new_value)} ({r.author || r.user || ''})</Typography>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Tasks</Typography>
            <Divider sx={{ my: 1 }} />
            {tasks.length === 0 ? <Typography color="text.secondary">Tidak ada task.</Typography> : (
              tasks.map((t: any) => (
                <Card key={t.id || t.external_id} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1">{t.name || t.task_name || t.external_name || 'Task'}</Typography>
                        <Typography variant="caption" color="text.secondary">Task ID: {t.id || t.external_id || ''} • Durasi: {t.duration_min ?? t.task_duration ?? '-'} menit</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption">Assigned: {Array.isArray(t.assignments) ? t.assignments.map((a:any)=> (a.user?.name ?? a.user?.id ?? a.user_id)).join(', ') : '-'}</Typography>
                      </Box>
                    </Box>

                    {Array.isArray(t.assignments) && t.assignments.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2">Assignments</Typography>
                        {t.assignments.map((a:any) => (
                          <Box key={a.id || (a.user && a.user.id) || JSON.stringify(a)} sx={{ borderTop: '1px dashed #eee', pt: 1, mt: 1 }}>
                            <Typography variant="body2">{a.user ? (a.user.name || a.user.email || a.user.id) : (a.user_id || a.assignee_id || '-')}</Typography>
                            <Typography variant="caption" color="text.secondary">Status: {a.status || a.assignment_status || '-' } • Start: {fmtDate(a.started_at || a.start_date)} • End: {fmtDate(a.ended_at || a.end_date)}</Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>

          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">Realisasi / Evidence</Typography>
            <Divider sx={{ my: 1 }} />
            {realisasi.length === 0 ? (
              <Typography color="text.secondary">Belum ada realisasi.</Typography>
            ) : (
              realisasi.map((r: any) => (
                <Card key={r.id || JSON.stringify(r)} variant="outlined" sx={{ mb: 1 }}>
                  <CardContent>
                    <Typography variant="subtitle2">{r.taskName || r.task_name || r.assignmentId || r.assignment_id || r.id}</Typography>
                    <Typography variant="caption" color="text.secondary">{r.user ? (r.user.name || r.user.email) : (r.user_id || '')} • {fmtDate(r.start)} → {fmtDate(r.end)}</Typography>
                    {r.notes && <Typography sx={{ mt: 1 }}>{r.notes}</Typography>}
                    {r.photoUrl && (
                      <Box sx={{ mt: 1 }}>
                        <a href={resolveMediaUrl(r.photoUrl)} target="_blank" rel="noreferrer">
                          <img src={resolveMediaUrl(r.photoUrl)} alt="evidence" style={{ width: 160, borderRadius: 6, border: '1px solid #ddd' }} loading="lazy" />
                        </a>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Raw Data</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography component="pre" sx={{ whiteSpace: 'pre-wrap', maxHeight: 360, overflow: 'auto', fontSize: 12 }}>
              {JSON.stringify(wo, null, 2)}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
