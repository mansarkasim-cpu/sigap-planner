"use client";
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

function startOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth(), 1);
  x.setHours(0,0,0,0);
  return x;
}

function endOfMonth(d) {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  x.setHours(23,59,59,999);
  return x;
}

function getMonthMatrix(year, month) {
  // returns array of weeks, each week is 7 Date objects (may include prev/next month)
  const first = new Date(year, month, 1);
  const start = new Date(first);
  start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Monday start
  const weeks = [];
  let cur = new Date(start);
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }
  return weeks;
}

function toYMD(dt, tzOffsetHours = 0) {
  if (!dt) return null;
  const d = new Date(dt);
  if (isNaN(d.getTime())) return null;
  // Compute the date in target timezone reliably by shifting milliseconds
  // and then reading the UTC date parts of the shifted time. This avoids
  // relying on the client's local getTimezoneOffset and handles input
  // timestamps that already include time zone offsets.
  const tzMs = d.getTime() + (tzOffsetHours * 3600000);
  const td = new Date(tzMs);
  const yyyy = td.getUTCFullYear();
  const mm = String(td.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(td.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export default function PMCalendarPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(() => startOfMonth(new Date()));
  const [dayModalOpen, setDayModalOpen] = useState(false);
  const [dayModalItems, setDayModalItems] = useState([]);
  const [historyRows, setHistoryRows] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignWoValue, setAssignWoValue] = useState('');
  const [assignWorkOrderId, setAssignWorkOrderId] = useState(null);
  const [workOrderOptions, setWorkOrderOptions] = useState([]);
  const [isFull, setIsFull] = useState(false);
  const [sites, setSites] = useState([]);
  const [siteId, setSiteId] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      const json = await apiFetch('/pm/calendar?limit=1000');
      setRows(json.data || []);
    } catch (e) {
      console.error('load pm calendar', e);
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(start, end) {
    try {
      const params = `?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&limit=1000${siteId ? `&site_id=${encodeURIComponent(siteId)}` : ''}`;
      const j = await apiFetch('/pm/history' + params);
      setHistoryRows(j.data || []);
    } catch (e) {
      console.error('loadHistory', e);
      setHistoryRows([]);
    }
  }

  useEffect(() => {
    async function fetchSites() {
      try {
        const j = await apiFetch('/master/sites?limit=1000');
        // response may be { data: [...] } or array
        setSites(j.data || j || []);
      } catch (err) {
        console.error('fetch sites', err);
      }
    }
    fetchSites();
  }, []);

  useEffect(() => {
    const handler = () => setIsFull(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  async function toggleFullScreen() {
    const el = document.getElementById('pm-calendar-root') || document.documentElement;
    try {
      if (!document.fullscreenElement) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
      } else {
        if (document.exitFullscreen) await document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }
    } catch (e) {
      console.error('toggleFullScreen', e);
    }
  }

  async function runNow() {
    setRunning(true);
    setError('');
    try {
      await apiFetch('/pm/run', { method: 'POST' });
      await load();
    } catch (e) {
      console.error('run pm', e);
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Auto-refresh calendar and visible history every 5 minutes
  useEffect(() => {
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    const id = setInterval(() => {
      try {
        load();
        const sd = toYMD(startOfMonth(viewDate), 8) + 'T00:00:00Z';
        const ed = toYMD(endOfMonth(viewDate), 8) + 'T23:59:59Z';
        loadHistory(sd, ed);
      } catch (e) {
        console.error('auto-refresh pm calendar error', e);
      }
    }, intervalMs);
    return () => clearInterval(id);
  }, [viewDate, siteId]);

  // load history for visible month whenever viewDate or site filter changes
  useEffect(() => {
    const sd = toYMD(startOfMonth(viewDate), 8) + 'T00:00:00Z';
    const ed = toYMD(endOfMonth(viewDate), 8) + 'T23:59:59Z';
    loadHistory(sd, ed);
  }, [viewDate, siteId]);

  const matrix = getMonthMatrix(viewDate.getFullYear(), viewDate.getMonth());

  // apply site filter, then group rows by date (YYYY-MM-DD) using next_pm_due_at if present
  const filteredRows = siteId ? rows.filter(r => String(r.site_id) === String(siteId)) : rows;
  const eventsByDate = {};
  const noDate = [];
  for (const r of filteredRows) {
    const ymd = toYMD(r.next_pm_due_at, 8);
    if (ymd) {
      // If this scheduled row is already satisfied by engine hours but has no PM history,
      // don't show it in the calendar as a 'done' event to avoid confusing users.
      const lastEngine = r.last_engine_hour != null ? Number(r.last_engine_hour) : null;
      const nextEngine = r.next_pm_engine_hour != null ? Number(r.next_pm_engine_hour) : null;
      const isInferredDone = (lastEngine != null && nextEngine != null && lastEngine >= nextEngine);
      if (isInferredDone && !r.__history) {
        // skip showing inferred-done scheduled rows; they will still be visible in reports/history
        continue;
      }
      eventsByDate[ymd] = eventsByDate[ymd] || [];
      eventsByDate[ymd].push(r);
    } else {
      noDate.push(r);
    }
  }

  // include PM history (actual done PMs) and mark as done
  for (const h of historyRows || []) {
    // apply site filter if present
    if (siteId && String(h.site_id) !== String(siteId)) continue;
    const ymd = toYMD(h.performed_at, 8);
    if (!ymd) continue;
    const item = {
      ...h,
      __history: true,
      pm_label: h.kode_rule || h.pm_rule_label || (h.next_due_engine_hour ? `PM${h.next_due_engine_hour}` : null),
      performed_at: h.performed_at,
      engine_hour: h.engine_hour,
    };
    eventsByDate[ymd] = eventsByDate[ymd] || [];
    eventsByDate[ymd].push(item);
  }

  // Compute client-side forecast events for unscheduled rows (non-persistent visual only)
  try {
    for (const r of noDate) {
      const lastEngine = r.last_engine_hour != null ? Number(r.last_engine_hour) : null;
      const nextEngine = r.next_pm_engine_hour != null ? Number(r.next_pm_engine_hour) : null;
      const lastRecorded = r.last_recorded_at ? new Date(r.last_recorded_at) : null;
      // prefer per-jenis avg_hours_per_day, then any top-level avg_hours_per_day, fallback to 24
      const perJenisAvg = r.jenis_alat && (r.jenis_alat.avg_hours_per_day || r.jenis_alat.avg_hours_per_day === 0) ? Number(r.jenis_alat.avg_hours_per_day) : null;
      const avg = perJenisAvg != null ? perJenisAvg : (r.avg_hours_per_day != null ? Number(r.avg_hours_per_day) : 24);
      if (lastEngine != null && nextEngine != null && lastRecorded && avg > 0) {
        const hoursLeft = nextEngine - lastEngine;
        if (hoursLeft >= 0) {
          const days = Math.ceil(hoursLeft / Number(avg));
          const d = new Date(lastRecorded);
          d.setHours(0,0,0,0);
          d.setDate(d.getDate() + days);
          const fy = toYMD(d, 8);
          const fr = { ...r, __forecast: true, __forecast_days: days, __forecast_date: d.toISOString() };
          eventsByDate[fy] = eventsByDate[fy] || [];
          eventsByDate[fy].push(fr);
        }
      }
    }
  } catch (err) {
    // noop
  }

  function itemStatus(it) {
    if (it && it.__history) return 'done';
    const now = new Date();
    const lastEngine = it.last_engine_hour != null ? Number(it.last_engine_hour) : null;
    const nextEngine = it.next_pm_engine_hour != null ? Number(it.next_pm_engine_hour) : null;
    const dueAt = it.next_pm_due_at ? new Date(it.next_pm_due_at) : null;
    // compute avg hours per day for this item (prefer jenis setting)
    const perJenisAvg = it.jenis_alat && (it.jenis_alat.avg_hours_per_day || it.jenis_alat.avg_hours_per_day === 0) ? Number(it.jenis_alat.avg_hours_per_day) : null;
    const avgForItem = perJenisAvg != null ? perJenisAvg : (it.avg_hours_per_day != null ? Number(it.avg_hours_per_day) : 24);
    const TOLERANCE_HOURS = 50; // tolerance before marking overdue
    // If there's an associated workorder, prefer that to decide status
    if (it.workorder_status) {
      const st = String(it.workorder_status || '').toUpperCase().trim();
      // If WO is completed but we don't have a PM history record for this item, mark it as awaiting PM input
      if ((st === 'COMPLETED' || st === 'DONE' || st === 'CLOSED') && !it.__history) return 'awaiting_pm';
      if (st === 'COMPLETED' || st === 'DONE' || st === 'CLOSED') return 'done';
      return 'in_progress';
    }
    // Completed if last engine hour already reached or exceeded nextEngine
    if (nextEngine != null && lastEngine != null && lastEngine >= nextEngine) return 'done';
    // Overdue if due date passed and passed beyond tolerance (convert tolerance hours to days using avg)
    if (dueAt) {
      try {
        const toleranceDays = (avgForItem > 0) ? (TOLERANCE_HOURS / avgForItem) : 0;
        const thresholdMs = dueAt.getTime() + Math.ceil(toleranceDays * 24) * 3600000; // add tolerance (in hours)
        if (now.getTime() > thresholdMs) return 'overdue';
      } catch (e) {
        if (dueAt.getTime() < now.getTime()) return 'overdue';
      }
    }
    return 'scheduled';
  }

  const STATUS_COLORS = { done: '#28a745', overdue: '#dc3545', scheduled: '#6f42c1', in_progress: '#f0ad4e', awaiting_pm: '#17a2b8' };
  const FORECAST_COLOR = '#6f42c1';

  function statusLabel(code) {
    if (!code) return '';
    switch (code) {
      case 'done': return 'Done';
      case 'overdue': return 'Overdue';
      case 'scheduled': return 'Scheduled';
      case 'in_progress': return 'In Progress';
      case 'awaiting_pm': return 'Awaiting PM';
      default: return String(code);
    }
  }

  function prevMonth() { setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()-1, 1)); }
  function nextMonth() { setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth()+1, 1)); }
  function gotoToday() { setViewDate(startOfMonth(new Date())); }

  function openDayModal(items) {
    setDayModalItems(items);
    setDayModalOpen(true);
  }

  function openDetail(it) {
    setDetailItem(it);
    setDetailOpen(true);
  }

  function openAssignModal(it) {
    setDetailItem(it);
    setAssignWoValue(it.workorder_doc_no || it.workorder_no || '');
    setAssignWorkOrderId(it.work_order_id || null);
    // fetch available PM workorders for this alat
    (async () => {
      try {
        const alatId = it.alat_id || it.id;
        const j = await apiFetch(`/pm/equipment-status/${encodeURIComponent(alatId)}/workorders`);
        const opts = j.data || [];
        setWorkOrderOptions(opts);
        // if there's a matching doc_no, select its id
        const matched = opts.find(o => o.doc_no === (it.workorder_doc_no || it.workorder_no));
        if (matched) setAssignWorkOrderId(matched.id);
      } catch (e) {
        console.error('load workorders for alat', e);
        setWorkOrderOptions([]);
      }
    })();
    setAssignModalOpen(true);
  }

  async function submitAssign() {
    if (!detailItem) return;
    try {
      const alatId = detailItem.alat_id || detailItem.id;
      await apiFetch(`/pm/equipment-status/${encodeURIComponent(alatId)}/assign-workorder`, { method: 'POST', body: { workorder_doc_no: assignWoValue, work_order_id: assignWorkOrderId } });
      setAssignModalOpen(false);
      setDetailOpen(false);
      await load();
    } catch (e) {
      console.error('assign wo', e);
      alert('Assign failed');
    }
  }

  async function submitUnassign() {
    if (!detailItem) return;
    if (!confirm('Unassign workorder from this PM?')) return;
    try {
      const alatId = detailItem.alat_id || detailItem.id;
      await apiFetch(`/pm/equipment-status/${encodeURIComponent(alatId)}/unassign-workorder`, { method: 'POST' });
      setDetailOpen(false);
      await load();
    } catch (e) {
      console.error('unassign wo', e);
      alert('Unassign failed');
    }
  }

  return (
    <div id="pm-calendar-root" style={{ padding: 16, backgroundColor: isFull ? '#fff' : undefined, color: isFull ? '#000' : undefined, minHeight: isFull ? '100vh' : undefined }}>
      <Box style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
        <h2 style={{ margin:0, color: isFull ? '#000' : undefined }}>PM Calendar</h2>
        <div style={{ marginLeft: 12 }}>
          {isFull && siteId && (
            <Typography variant="h6" component="div" style={{ marginLeft: 8, color: '#000' }}>{(sites.find(s => String(s.id) === String(siteId)) || sites.find(s => String(s.site_id) === String(siteId)) || {}).nama_site || (sites.find(s => String(s.id) === String(siteId)) || {}).name || ''}</Typography>
          )}
        </div>
        <div style={{ marginLeft: 'auto', display:'flex', gap:8, alignItems:'center' }}>
          <FormControl size="small" variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel id="site-filter-label">Site</InputLabel>
            <Select
              labelId="site-filter-label"
              value={siteId}
              label="Site"
              onChange={(e) => setSiteId(e.target.value)}
            >
              <MenuItem value="">All Sites</MenuItem>
              {sites.map(s => (
                <MenuItem key={s.id || s.site_id} value={s.id || s.site_id}>{s.nama_site || s.name || s.label || s.nama}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* Avg hours per day is taken from master_jenis_alat.avg_hours_per_day per item */}
          <IconButton size="small" onClick={toggleFullScreen} aria-label="fullscreen">
            {isFull ? <FullscreenExitIcon fontSize="small" /> : <FullscreenIcon fontSize="small" />}
          </IconButton>
          <Button variant="outlined" onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Refresh'}</Button>
          <Button variant="contained" onClick={runNow} disabled={running}>{running ? 'Running...' : 'Run PM Now'}</Button>
        </div>
      </Box>

      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

      {noDate.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Unscheduled</div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6 }}>
            {noDate.map((r) => (
              <Chip key={r.alat_id || r.id} onClick={() => openDetail(r)} label={`${r.nama_alat || `Alat ${r.alat_id}`}${r.kode_alat ? ` · ${r.kode_alat}` : ''} → ${r.next_pm_engine_hour ?? '-'}h`} clickable color="default" />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: 12, display:'flex', gap:12, alignItems:'center' }}>
        <div style={{ fontWeight:600 }}>{viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
        <div style={{ display:'flex', gap:8 }}>
          <Button size="small" onClick={prevMonth}>&lt;</Button>
          <Button size="small" onClick={gotoToday}>Today</Button>
          <Button size="small" onClick={nextMonth}>&gt;</Button>
        </div>
        <div style={{ marginLeft: 'auto', display:'flex', gap:8 }}>
          <Chip label="Scheduled" size="small" style={{ background: STATUS_COLORS.scheduled, color:'#fff' }} />
          <Chip label="Overdue" size="small" style={{ background: STATUS_COLORS.overdue, color:'#fff' }} />
          <Chip label="In Progress" size="small" style={{ background: STATUS_COLORS.in_progress, color:'#fff' }} />
          <Chip label="Awaiting PM" size="small" style={{ background: STATUS_COLORS.awaiting_pm, color:'#fff' }} />
          <Chip label="Done" size="small" style={{ background: STATUS_COLORS.done, color:'#fff' }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap:16 }}>
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 140px)', gap: 6, width: 980, margin: '0 auto' }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(h => (
              <div key={h} style={{ padding: 8, background: '#fafafa', border: '1px solid #eee', textAlign: 'center', fontWeight: '600' }}>{h}</div>
            ))}
            {matrix.map((week, wi) => (
              week.map((day, di) => {
                const ymd = toYMD(day, 8);
                const isCurrentMonth = day.getMonth() === viewDate.getMonth();
                const isToday = toYMD(day, 8) === toYMD(new Date(), 8);
                const items = eventsByDate[ymd] || [];
                const todayBoxStyle = isToday ? { border: '2px solid #1976d2', background: isCurrentMonth ? '#e8f0ff' : '#e6eefc', boxShadow: '0 2px 6px rgba(25,118,210,0.12)' } : {};
                return (
                  <div key={`${wi}-${di}`} style={{ minHeight: 120, border: '1px solid #eee', background: isCurrentMonth ? '#fff' : '#f7f7f7', padding: 8, borderRadius:6, ...todayBoxStyle }} aria-current={isToday ? 'date' : undefined}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: isToday ? '700' : '500' }}>{day.getDate()}</div>
                      {items.length > 0 && <div style={{ fontSize: 12, color: '#0070f3' }}>{items.length} PM</div>}
                    </div>
                    <div style={{ fontSize: 13 }}>
                      {items.slice(0,4).map((it, idx) => {
                        const isForecast = !!it.__forecast;
                        const st = itemStatus(it);
                        const color = isForecast ? FORECAST_COLOR : (STATUS_COLORS[st] || '#888');
                        return (
                          <div key={idx} onClick={() => openDetail(it)} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6, padding: '6px 8px', background: isForecast ? '#f7f0ff' : '#fff', borderRadius: 6, cursor: 'pointer', boxShadow: '0 1px 0 rgba(0,0,0,0.02)', border: isForecast ? '1px dashed rgba(111,66,193,0.4)' : undefined }} title={`${it.nama_alat} — ${it.pm_label || it.next_pm_engine_hour}`}>
                            <div style={{ width: 10, height: 10, borderRadius: 10, background: color, marginTop: 6 }} />
                            <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                              <div style={{ fontWeight: 'normal', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.nama_alat || `Alat ${it.alat_id}`}{it.kode_alat ? ` · ${it.kode_alat}` : ''}</div>
                            </div>
                            {isForecast ? null : null}
                          </div>
                        );
                      })}
                      {items.length > 4 && <div style={{ fontSize: 12, color: '#666', cursor: 'pointer' }} onClick={() => openDayModal(items)}>+{items.length-4} more</div>}
                    </div>
                  </div>
                );
              })
            ))}
          </div>
        </div>
      </div>

      <Dialog open={dayModalOpen} onClose={() => setDayModalOpen(false)} fullWidth maxWidth="sm" container={() => document.getElementById('pm-calendar-root')}>
        <DialogTitle>Events</DialogTitle>
        <DialogContent>
          {dayModalItems.map((it, idx) => (
            <div key={idx} style={{ padding: 8, borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => { setDayModalOpen(false); openDetail(it); }}>
              <div style={{ fontWeight: 600 }}>{it.nama_alat}</div>
              <div style={{ fontSize: 13, color: '#444' }}>Next: {it.pm_label || it.next_pm_engine_hour} — Last: {it.last_engine_hour ?? '-'}</div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDayModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} fullWidth maxWidth="sm" container={() => document.getElementById('pm-calendar-root')}>
        <DialogTitle>
          {detailItem ? (detailItem.nama_alat || `Alat ${detailItem.alat_id}`) : 'Detail'}
          <IconButton onClick={() => setDetailOpen(false)} style={{ position:'absolute', right:8, top:8 }}><CloseIcon/></IconButton>
        </DialogTitle>
        <DialogContent>
          {detailItem && (
            <div>
              <p><strong>Kode:</strong> {detailItem.kode_alat ?? '-'}</p>
              <p><strong>PM Rule:</strong> {detailItem.chosen_kode_rule || detailItem.kode_rule || detailItem.pm_rule_label || (detailItem.next_pm_engine_hour ? `PM${detailItem.next_pm_engine_hour}` : '-')}</p>
              {detailItem.__history ? (
                <>
                  <p><strong>Performed At:</strong> {detailItem.performed_at ?? '-'}</p>
                  <p><strong>Engine Hour (performed):</strong> {detailItem.engine_hour ?? '-'}</p>
                  <p><strong>Workorder:</strong> {detailItem.workorder_no ?? detailItem.workorder_doc_no ?? '-'}</p>
                  <p><strong>Notes:</strong> {detailItem.notes ?? '-'}</p>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}><strong>Status:</strong> {(() => {
                    const st = itemStatus(detailItem);
                    const color = STATUS_COLORS[st] || '#6f42c1';
                    return <Chip label={statusLabel(st)} size="small" style={{ background: color, color: '#fff' }} />;
                  })()}</p>
                </>
              ) : (
                <>
                  <p><strong>Next PM Engine Hour:</strong> {detailItem.next_pm_engine_hour ?? '-'}</p>
                  <p><strong>Last Engine Hour:</strong> {detailItem.last_engine_hour ?? '-'} {detailItem.last_recorded_at ? <span style={{ color: '#666', marginLeft: 8 }}>(recorded: {toYMD(detailItem.last_recorded_at, 8)})</span> : null}</p>
                  <p><strong>Workorder:</strong> {detailItem.workorder_doc_no ?? detailItem.workorder_no ?? '-'}</p>
                  <p><strong>Workorder Status:</strong> {detailItem.workorder_status ?? '-'}</p>
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    {(!(detailItem.workorder_doc_no || detailItem.workorder_no || detailItem.work_order_id)) && (
                      <Button variant="outlined" size="small" onClick={() => openAssignModal(detailItem)}>Assign WO</Button>
                    )}
                    <Button variant="outlined" size="small" color="error" onClick={() => submitUnassign(detailItem)}>Unassign WO</Button>
                  </div>
                  <p style={{ display: 'flex', alignItems: 'center', gap: 8 }}><strong>Status:</strong> {(() => {
                    const st = itemStatus(detailItem);
                    const color = STATUS_COLORS[st] || '#6f42c1';
                    return <Chip label={statusLabel(st)} size="small" style={{ background: color, color: '#fff' }} />;
                  })()}</p>
                </>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={assignModalOpen} onClose={() => setAssignModalOpen(false)} fullWidth maxWidth="sm" container={() => document.getElementById('pm-calendar-root')}>
        <DialogTitle>Assign Workorder</DialogTitle>
        <DialogContent>
          <Box sx={{ display:'grid', gap:2, mt:1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="assign-wo-select-label">Select Workorder</InputLabel>
              <Select
                labelId="assign-wo-select-label"
                value={assignWorkOrderId || ''}
                label="Select Workorder"
                onChange={(e) => {
                  const val = e.target.value;
                  setAssignWorkOrderId(val);
                  const sel = workOrderOptions.find(o => String(o.id) === String(val));
                  setAssignWoValue(sel ? (sel.doc_no || '') : '');
                }}
              >
                <MenuItem value="">-- Select existing PM Workorder --</MenuItem>
                {workOrderOptions.map(o => (
                  <MenuItem key={o.id} value={o.id}>{`${o.doc_no || '(no doc)'} — ${o.status || ''}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Or enter Workorder No (manual)" size="small" value={assignWoValue} onChange={e => { setAssignWoValue(e.target.value); setAssignWorkOrderId(null); }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAssign}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
