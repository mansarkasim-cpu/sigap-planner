// components/GanttChart.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../lib/api-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';

type WO = {
  id: string | number;
  doc_no?: string | null;
  asset_name?: string | null;
  work_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  raw?: any;
  realisasi?: { actualStart?: string | null; actualEnd?: string | null; items?: Array<{ id: string; start?: string | null; end?: string | null }> } | null;
};

const rowHeight = 44;
const labelWidth = 300;
const gutter = 12;
const minBarWidthPx = 4;

function isoToMs(val?: string | null) {
  if (!val) return null;
  // If string is date-only (YYYY-MM-DD), parse as local midnight to avoid UTC offset issues
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const d = new Date(`${val}T00:00:00`);
    const n = d.getTime();
    return isNaN(n) ? null : n;
  }
  // If string is datetime without timezone (e.g. "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DD HH:mm:ss"),
  // parse components and treat them as backend-local time. Many backends send naive datetimes
  // (no TZ) — assume backend uses UTC+8 and subtract that offset to get UTC ms.
  if (/^\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(val) && !/[Z+-]\d{2}:?\d{2}$/.test(val) && !/Z$/.test(val)) {
    // normalize separator to T
    const norm = val.replace(' ', 'T');
    const m = norm.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?$/);
    if (m) {
      const year = parseInt(m[1], 10);
      const month = parseInt(m[2], 10) - 1;
      const day = parseInt(m[3], 10);
      const hour = parseInt(m[4], 10);
      const minute = parseInt(m[5], 10);
      const second = m[6] ? parseInt(m[6], 10) : 0;
      const ms = m[7] ? Math.round(Number('0.' + m[7]) * 1000) : 0;
      // Adjust this offset if your backend uses a different timezone
      const BACKEND_TZ_OFFSET_HOURS = 8;
      const nUtc = Date.UTC(year, month, day, hour, minute, second, ms) - (BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000);
      return isNaN(nUtc) ? null : nUtc;
    }
  }
  const n = Date.parse(val);
  return isNaN(n) ? null : n;
}
function niceTime(ms: number | null) {
  if (!ms) return '-';
  const d = new Date(ms);
  return d.toLocaleString();
}
// Format ms to dd/mm/yyyy HH24:mi using UTC getters to avoid local TZ differences
function formatDdMmYyyyHHMM(ms: number | null) {
  if (!ms) return '-';
  // display with +8h offset (backend local timezone) on the frontend
  const BACKEND_TZ_OFFSET_HOURS = 8;
  const d = new Date(ms + BACKEND_TZ_OFFSET_HOURS * 60 * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, '0');
  const dd = pad(d.getUTCDate());
  const mm = pad(d.getUTCMonth() + 1);
  const yyyy = d.getUTCFullYear();
  const hh = pad(d.getUTCHours());
  const mi = pad(d.getUTCMinutes());
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}
function dateInputToDayStart(dateStr: string) {
  return new Date(`${dateStr}T00:00:00`);
}

const WORK_TYPE_COLORS: Record<string, string> = {
  'Preventive Maintenance': '#16a34a',
  'Corrective Maintenance': '#fb923c',
  'Breakdown': '#ef4444',
  'PM': '#16a34a',
  'CM': '#fb923c',
  'Default': '#3b82f6',
};
const STATUS_COLORS: Record<string, string> = {
  'ASSIGNED': '#0ea5e9', // blue
  'DEPLOYED': '#06b6d4', // teal
  'READY_TO_DEPLOY': '#7c3aed', // purple
  'IN_PROGRESS': '#f97316', // orange
  'COMPLETED': '#10b981', // green
  'NEW': '#64748b', // gray
  'OPEN': '#64748b',
  'CANCELLED': '#ef4444', // red
  'CLOSED': '#334155',
};

// preferred legend order for statuses
const STATUS_ORDER = ['NEW', 'ASSIGNED', 'READY_TO_DEPLOY', 'DEPLOYED', 'IN_PROGRESS', 'COMPLETED'];

// simple hex -> rgb helper and luminance check for label text color
function hexToRgbStatic(hex: string | undefined | null) {
  if (!hex) return null;
  const h = hex.replace('#','').trim();
  if (h.length === 3) {
    const r = parseInt(h[0]+h[0],16);
    const g = parseInt(h[1]+h[1],16);
    const b = parseInt(h[2]+h[2],16);
    return { r, g, b };
  }
  if (h.length === 6) {
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return { r, g, b };
  }
  return null;
}
function isDarkColor(hex: string) {
  const rgb = hexToRgbStatic(hex) || { r: 0, g: 0, b: 0 };
  const lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
  return lum < 140;
}

function pickColorForWork(w: WO) {
  // prefer top-level status if present (set by backend), fallback to raw payload fields
  const statusRaw = (w as any).status || (w.raw && (w.raw.doc_status || w.raw.status || w.raw.state)) || null;
  if (statusRaw && typeof statusRaw === 'string') {
    const k = statusRaw.toString().toUpperCase().replace(/[-\s]/g, '_');
    if (STATUS_COLORS[k]) return STATUS_COLORS[k];
  }
  const wt = (w.work_type || (w.raw && (w.raw.work_type || w.raw.type_work)) || '').toString();
  if (wt && WORK_TYPE_COLORS[wt]) return WORK_TYPE_COLORS[wt];
  if (wt && WORK_TYPE_COLORS[wt.toUpperCase() as keyof typeof WORK_TYPE_COLORS]) return WORK_TYPE_COLORS[wt.toUpperCase() as keyof typeof WORK_TYPE_COLORS];
  return WORK_TYPE_COLORS['Default'];
}


export default function GanttChart({ pageSize = 2000 }: { pageSize?: number }) {
  const [items, setItems] = useState<WO[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [site, setSite] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayIsoDate = new Date().toISOString().slice(0,10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIsoDate);
  const [scale, setScale] = useState<number>(1);
  const [selected, setSelected] = useState<WO | null>(null);
  // displayMode: 'both' | 'planned' | 'actual'
  const [displayMode, setDisplayMode] = useState<string>('both');

  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(900);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const el = svgWrapperRef.current ?? containerRef.current;
    if (!el) return;
    setContainerWidth(el.clientWidth || 900);
    const ro = new ResizeObserver(() => setContainerWidth(el.clientWidth || 900));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => { load(); }, []);

  useEffect(() => { loadSites(); }, []);

  useEffect(() => { load(); }, [site]);

  // Auto-refresh: call `load()` every 60 seconds without recreating the interval.
  const loadRef = useRef<any>(null);
  useEffect(() => { loadRef.current = load; }, [load]);
  useEffect(() => {
    const AUTO_REFRESH_MS = 60 * 1000; // 1 minute
    const id = setInterval(() => {
      try {
        if (loadRef.current) loadRef.current();
      } catch (e) {
        console.warn('Gantt auto-refresh failed', e);
      }
    }, AUTO_REFRESH_MS);
    return () => clearInterval(id);
  }, [site, selectedDate, pageSize]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const url = `/work-orders?q=&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
      const res = await apiClient(url);
      const rows = res?.data ?? res;
      const mapped: WO[] = (rows || []).map((r: any) => ({
        ...r,
        start_date: r.start_date ?? null,
        end_date: r.end_date ?? null,
        description: r.description ?? r.raw?.description ?? null,
      }));
        // fetch realisasi summary for each workorder in parallel (small batches)
        try {
          await Promise.all(mapped.map(async (m) => {
            try {
              const rr = await apiClient(`/work-orders/${encodeURIComponent(String(m.id))}/realisasi`);
              m.realisasi = rr?.data ?? rr;
            } catch (e) {
              m.realisasi = null;
            }
          }));
        } catch (e) {
          // ignore per-item failures
        }
      setItems(mapped);
      // debug: log loaded items for troubleshooting
      if (typeof window !== 'undefined' && (window as any).console && (window as any).console.debug) {
        console.debug('[Gantt] loaded items:', mapped.length, mapped.map((r: any) => r.id ?? r.doc_no));
      }
      // detailed debug: show start/end values and parsed timestamps
      if (typeof window !== 'undefined' && (window as any).console && (window as any).console.debug) {
        try {
          console.debug('[Gantt] items details:', mapped.map((r: any) => ({ id: r.id ?? r.doc_no, start_date: r.start_date, end_date: r.end_date, sMs: isoToMs(r.start_date), eMs: isoToMs(r.end_date) })));
        } catch (e) {}
      }
    } catch (err: any) {
      console.error('load gantt', err);
      setError(err?.body?.message || err?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }

  async function loadSites() {
    try {
      const res = await apiClient('/users?page=1&pageSize=1000');
      const rows: any[] = (res?.data ?? res) || [];
      const uniqueSites: string[] = Array.from(new Set(rows.map((r: any) => (r.site || r.vendor_cabang || '').toString()))).filter(Boolean);
      setSites(uniqueSites);
    } catch (err) {
      console.error('load sites for gantt', err);
    }
  }

  const { dayStartMs, dayEndMs } = useMemo(() => {
    const ds = dateInputToDayStart(selectedDate);
    const de = new Date(ds.getTime() + 24*60*60*1000);
    return { dayStartMs: ds.getTime(), dayEndMs: de.getTime() };
  }, [selectedDate]);

  const totalMs = 24 * 60 * 60 * 1000;
  const available = Math.max(300, containerWidth - labelWidth - gutter - 20);
  const timelineWidth = available;
  const svgWidth = gutter + timelineWidth + 8;
  const pxPerMs = (timelineWidth / totalMs) * scale;
  function msToX(ms: number) { return gutter + Math.round((ms - dayStartMs) * pxPerMs); }
  function clampBarWidth(x1: number, x2: number) { return Math.max(minBarWidthPx, x2 - x1); }

  const tickStepMs = 30 * 60 * 1000;
  const ticks = useMemo(() => {
    const out: number[] = [];
    const startTick = Math.floor(dayStartMs / tickStepMs) * tickStepMs;
    for (let t = startTick; t <= dayEndMs; t += tickStepMs) out.push(t);
    return out;
  }, [dayStartMs, dayEndMs]);


  const validItems = useMemo(() => {
    const debugReasons: any[] = [];
    const filtered = items.filter(it => {
      const s = isoToMs(it.start_date);
      const e = isoToMs(it.end_date);
      const rec: any = { id: it.id ?? it.doc_no, rawStart: it.start_date, rawEnd: it.end_date, s, e };
      if (s == null && e == null) {
        rec.passes = false;
        rec.reason = 'no start and end';
        debugReasons.push(rec);
        return false;
      }
      const start = s ?? e ?? null;
      const end = e ?? s ?? null;
      rec.start = start; rec.end = end;
      if (start == null || end == null) {
        rec.passes = false;
        rec.reason = 'start or end null after fallback';
        debugReasons.push(rec);
        return false;
      }
      if (end <= dayStartMs) {
        rec.passes = false;
        rec.reason = `ends before or at dayStart (${end} <= ${dayStartMs})`;
        debugReasons.push(rec);
        return false;
      }
      if (start >= dayEndMs) {
        rec.passes = false;
        rec.reason = `starts at/after dayEnd (${start} >= ${dayEndMs})`;
        debugReasons.push(rec);
        return false;
      }
      rec.passes = true;
      rec.reason = 'in range';
      debugReasons.push(rec);
      return true;
    });
    // sort by start time
    const sorted = filtered.sort((a,b) => {
      const sa = isoToMs(a.start_date) ?? 0;
      const sb = isoToMs(b.start_date) ?? 0;
      return sa - sb;
    });
    if (typeof window !== 'undefined' && (window as any).console && (window as any).console.debug) {
      try { console.debug('[Gantt] filter reasons:', debugReasons); } catch (e) {}
    }
    return sorted;
  }, [items, dayStartMs, dayEndMs]);

  // debug: log validItems when they change so we can inspect filtering
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      console.debug('[Gantt] validItems:', validItems.length, validItems.map(i => i.id ?? i.doc_no));
    } catch (e) {}
  }, [validItems]);

  // rows are simply the valid items (no shift grouping)
  const rows = validItems;

  const nowMs = Date.now();
  const showNow = nowMs >= dayStartMs && nowMs <= dayEndMs;
  const nowX = showNow ? msToX(nowMs) : null;

  // Compute svg height; when fullscreen make it fill viewport height
  const svgHeight = (typeof window !== 'undefined' && isFullscreen)
    ? Math.max(140, window.innerHeight - 160)
    : Math.max(140, validItems.length * rowHeight + 80);

  // Fullscreen handling
  useEffect(() => {
    function onFsChange() {
      const doc = document as any;
      const fsElem = doc.fullscreenElement ?? doc.webkitFullscreenElement ?? doc.mozFullScreenElement ?? doc.msFullscreenElement;
      setIsFullscreen(Boolean(fsElem));
    }
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('mozfullscreenchange', onFsChange);
      document.removeEventListener('MSFullscreenChange', onFsChange);
    };
  }, []);

  async function toggleFullscreen() {
    const el = svgWrapperRef.current ?? containerRef.current;
    if (!el) return;
    const doc: any = document;
    const isFs = doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement;
    try {
      if (!isFs) {
        if (el.requestFullscreen) await el.requestFullscreen();
        else if ((el as any).webkitRequestFullscreen) await (el as any).webkitRequestFullscreen();
        else (el as any).classList.add('gantt-fs-fallback');
      } else {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        else (el as any).classList.remove('gantt-fs-fallback');
      }
    } catch (e) {
      // fallback toggle class
      (el as any).classList.toggle('gantt-fs-fallback');
      setIsFullscreen((f) => !f);
    }
  }

  return (
    <div style={{ padding: 18, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 30 }}>
        <Paper elevation={1} style={{ background: '#f7fafc', padding: 12, borderBottom: '1px solid #eee' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
            <Box sx={{ minWidth: 0, pr: 2 }}>
              <Typography variant="h6" component="h2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Gantt Chart — Work Orders (per-hari)</Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: '#ffffff', padding: '6px', borderRadius: 1, boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)' }}>
                <TextField
                  label="Tanggal"
                  type="date"
                  size="small"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 160 }}
                />

                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel id="gantt-site-label">Site</InputLabel>
                  <Select
                    labelId="gantt-site-label"
                    label="Site"
                    value={site}
                    onChange={e => setSite(e.target.value as string)}
                    renderValue={(v) => v || '-- All sites --'}
                    sx={{ minWidth: 140 }}
                  >
                    <MenuItem value="">-- All sites --</MenuItem>
                    {sites.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel id="gantt-show-label">Show</InputLabel>
                  <Select
                    labelId="gantt-show-label"
                    label="Show"
                    value={displayMode}
                    onChange={e => setDisplayMode(String(e.target.value))}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="both">Planned + Actual</MenuItem>
                    <MenuItem value="planned">Planned only</MenuItem>
                    <MenuItem value="actual">Actual only</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Tooltip title="Zoom out">
                  <IconButton size="small" onClick={() => setScale(s => Math.max(0.5, s * 0.9))}><ZoomOutIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Zoom in">
                  <IconButton size="small" onClick={() => setScale(s => Math.min(4, s * 1.1))}><ZoomInIcon /></IconButton>
                </Tooltip>
                <Tooltip title="Refresh">
                  <IconButton size="small" onClick={load}><RefreshIcon /></IconButton>
                </Tooltip>
                <Tooltip title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                  <IconButton size="small" onClick={toggleFullscreen}>
                    {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </Paper>
      </header>

      {/* (work-type legend removed) — keep status indicator only */}
      {/* <div style={{ display:'flex', gap:12, alignItems:'center', marginBottom:12 }}>
        <LegendItem color={STATUS_COLORS['IN_PROGRESS']} label="Status — In Progress" showBox={false} />
      </div> */}

      {/* status legend (color mapping for bars) */}
      <Box display="flex" gap={1} alignItems="center" flexWrap="wrap" sx={{ mt: 1, mb: 2 }}>
        <Typography sx={{ fontWeight: 700, mr: 1 }}>Status colors:</Typography>
        {STATUS_ORDER.map((status) => {
          const color = STATUS_COLORS[status] || '#999';
          const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
          return (
            <Chip
              key={status}
              label={status.replace(/_/g, ' ')}
              size="small"
              sx={{ backgroundColor: color, color: textColor, fontWeight: 700 }}
            />
          );
        })}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
          <Box sx={{ width: 14, height: 14, backgroundColor: '#0f172a', borderRadius: 0.5, opacity: 0.12 }} />
          <Typography sx={{ fontSize: 13, color: '#333' }}>Realisasi (actual)</Typography>
        </Box>
      </Box>

      {/* svg wrapper: used for fullscreen request */}
      <div
        ref={svgWrapperRef}
        className="gantt-svg-wrapper"
        style={{
          border: '1px solid #eee',
          overflow: 'auto',
          background: isFullscreen ? '#fff' : undefined,
          height: isFullscreen ? '100vh' : undefined,
          padding: isFullscreen ? 18 : undefined,
          // when fullscreen, make wrapper fixed to fully cover viewport (fallback and ensure no black bars)
          position: isFullscreen ? 'fixed' : undefined,
          left: isFullscreen ? 0 : undefined,
          top: isFullscreen ? 0 : undefined,
          right: isFullscreen ? 0 : undefined,
          bottom: isFullscreen ? 0 : undefined,
          width: isFullscreen ? '100vw' : undefined,
          zIndex: isFullscreen ? 99999 : undefined,
          borderRadius: isFullscreen ? 0 : 8,
          boxSizing: 'border-box'
        }}
      >
        <div ref={containerRef} style={{ overflowX: 'auto', height: isFullscreen ? '100%' : undefined }}>
          <div style={{ display:'flex', minWidth: Math.max(900, svgWidth) }}>
            {/* labels */}
            <div style={{ width: labelWidth, borderRight: '1px solid #f0f0f0', background: '#fafafa' }}>
              <div style={{ padding: '10px 12px', fontWeight:700 }}>Work Order</div>
              <div style={{ height:8 }} />
              {validItems.map((w, idx) => (
                <div key={w.id} style={{
                  height: rowHeight,
                  display:'flex',
                  flexDirection:'column',
                  justifyContent:'center',
                  padding: '6px 12px',
                  borderBottom: '1px solid #f1f1f1',
                  whiteSpace: 'nowrap',
                  overflow:'hidden',
                  textOverflow:'ellipsis'
                }}>
                  <div style={{ fontSize:13, fontWeight:700 }}>{w.doc_no ?? w.id}</div>
                  <div style={{ marginTop:4, color:'#666', fontSize:12 }}>{w.asset_name ?? ''} {w.work_type ? ` • ${w.work_type}` : ''}</div>
                </div>
              ))}
            </div>

            {/* timeline */}
            <div style={{ flex:'1 0 auto', minWidth: 600, position:'relative', background:'#fff', height: isFullscreen ? '100%' : svgHeight }}>
              <svg width={svgWidth} height={svgHeight} style={{ width: isFullscreen ? '100%' : undefined, height: isFullscreen ? '100%' : undefined }}>
                {/* background rows */}
                {validItems.map((r, idx) => (
                  <rect key={'bg'+idx}
                    x={0}
                    y={idx * rowHeight + 40}
                    width={svgWidth}
                    height={rowHeight}
                    fill={idx % 2 === 0 ? '#ffffff' : '#fbfbfb'}
                  />
                ))}

                {/* ticks (30 min) */}
                {ticks.map((t, i) => {
                  const x = msToX(t);
                  // show major label every 2 hours; minor ticks remain every 30 minutes
                  const showLabel = (t - dayStartMs) % (2 * 60 * 60 * 1000) === 0;
                  return (
                    <g key={'tick'+i}>
                      <line x1={x} y1={30} x2={x} y2={30 + Math.max(20, svgHeight - 40)} stroke="#e7e7e7" />
                      {showLabel && <text x={x + 4} y={20} fontSize={11} fill="#333">{new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}</text>}
                    </g>
                  );
                })}

                {/* now line */}
                {showNow && nowX !== null && (
                  <g>
                    <line x1={nowX} y1={30} x2={nowX} y2={30 + Math.max(20, svgHeight - 40)} stroke="#8b5cf6" strokeWidth={2} strokeDasharray="6,4" />
                  </g>
                )}

                {/* bars */}
                {validItems.map((w, idx) => {
                  const sMsRaw = isoToMs(w.start_date) as number | null;
                  const eMsRaw = isoToMs(w.end_date) as number | null;
                  const realStartMsRaw = isoToMs(w.realisasi?.actualStart) as number | null;
                  const realEndMsRaw = isoToMs(w.realisasi?.actualEnd) as number | null;
                  if (sMsRaw == null || eMsRaw == null) return null;
                  const sMs = Math.max(sMsRaw, dayStartMs);
                  const eMs = Math.min(eMsRaw, dayEndMs);
                  if (eMs <= sMs) return null;
                  const x1 = msToX(sMs);
                  const x2 = msToX(eMs);
                  const width = clampBarWidth(x1, x2);
                  const y = idx * rowHeight + 40 + 6;
                  const rx = 6;
                  // bar color reflects status or work-type (original behavior)
                  const color = pickColorForWork(w);

                  // determine status normalized
                  const statusNorm = ((w as any).status || (w.raw && (w.raw.status || w.raw.doc_status)) || '').toString().toUpperCase().replace(/[-\s]/g, '_');
                  // progress value: prefer top-level `progress` (0..1) then raw.progress; accept 0..1 or 0..100
                  let progressVal: number | null = null;
                  const pRaw = (w as any).progress ?? w.raw?.progress ?? null;
                  if (typeof pRaw === 'number') {
                    if (pRaw > 1) progressVal = Math.max(0, Math.min(1, pRaw / 100));
                    else progressVal = Math.max(0, Math.min(1, pRaw));
                  }

                  // helper: determine readable text color for a background hex color
                  function hexToRgb(hex: string) {
                    if (!hex) return null;
                    const h = hex.replace('#','').trim();
                    if (h.length === 3) {
                      const r = parseInt(h[0]+h[0],16);
                      const g = parseInt(h[1]+h[1],16);
                      const b = parseInt(h[2]+h[2],16);
                      return { r, g, b };
                    }
                    if (h.length === 6) {
                      const r = parseInt(h.substring(0,2),16);
                      const g = parseInt(h.substring(2,4),16);
                      const b = parseInt(h.substring(4,6),16);
                      return { r, g, b };
                    }
                    return null;
                  }
                  function isDark(hex: string) {
                    const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
                    // luminance approximation
                    const lum = 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                    return lum < 140;
                  }

                  // helper: darken a hex color by a fraction (0..1)
                  function darkenHex(hex: string, frac = 0.22) {
                    try {
                      const rgb = hexToRgb(hex);
                      if (!rgb) return hex;
                      const r = Math.max(0, Math.min(255, Math.round(rgb.r * (1 - frac))));
                      const g = Math.max(0, Math.min(255, Math.round(rgb.g * (1 - frac))));
                      const b = Math.max(0, Math.min(255, Math.round(rgb.b * (1 - frac))));
                      const toHex = (n: number) => n.toString(16).padStart(2, '0');
                      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                    } catch (e) {
                      return hex;
                    }
                  }

                  // use a darker variant of the bar color for the progress overlay
                  const progressColor = darkenHex(color, 0.22);
                  const progressTextColorInside = isDark(progressColor) ? '#ffffff' : '#000000';

                  return (
                    <g key={'bar'+w.id} style={{ cursor:'pointer' }} onClick={() => setSelected(w)}>
                      {/* work-type badge moved to Y-axis labels */}
                      {displayMode !== 'actual' && (
                        <rect x={x1} y={y} rx={rx} ry={rx} width={width} height={rowHeight - 12} fill={color} opacity={0.98} />
                      )}

                      {/* realized interval (if available) — draw a thinner, semi-transparent overlay */}
                      {realStartMsRaw != null && realEndMsRaw != null && displayMode !== 'planned' && (() => {
                        const rs = Math.max(realStartMsRaw, dayStartMs);
                        const re = Math.min(realEndMsRaw, dayEndMs);
                        if (re <= rs) return null;
                        const rx1 = msToX(rs);
                        const rx2 = msToX(re);
                        const rwidth = clampBarWidth(rx1, rx2);
                        const ry = y + 6; // inset slightly
                        const rheight = Math.max(6, rowHeight - 24);
                        return (
                          <>
                            <rect x={rx1} y={ry} rx={3} ry={3} width={rwidth} height={rheight} fill="#0f172a" opacity={0.12} />
                            <rect x={rx1} y={ry} rx={3} ry={3} width={rwidth} height={rheight} fill="none" stroke="#0f172a" strokeWidth={1} opacity={0.22} />
                          </>
                        );
                      })()}

                      {/* show realisasi/progress overlay when item is IN_PROGRESS and progress available */}
                      {statusNorm === 'IN_PROGRESS' && progressVal !== null && (
                        <>
                          <rect x={x1} y={y} rx={rx} ry={rx} width={Math.max(minBarWidthPx, width * progressVal)} height={rowHeight - 12} fill={progressColor} opacity={0.72} />
                          {/* percentage label: inside if space, otherwise outside to the right */}
                          {(() => {
                            const progWidth = Math.max(minBarWidthPx, width * progressVal);
                            const pctText = Math.round(progressVal * 100) + '%';
                            if (progWidth > 28) {
                              return <text x={x1 + 6} y={y + (rowHeight - 12) / 2 + 4} fontSize={12} fill={progressTextColorInside} fontWeight={700}>{pctText}</text>;
                            }
                            // outside label
                            return <text x={x2 + 6} y={y + (rowHeight - 12) / 2 + 4} fontSize={12} fill={color} fontWeight={700}>{pctText}</text>;
                          })()}
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      {selected && (
        <div style={{
          position:'fixed', left:0, right:0, top:0, bottom:0, background:'rgba(0,0,0,0.36)',
          display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999
        }}>
          <div style={{ background:'#fff', width:720, maxHeight:'80%', overflowY:'auto', borderRadius:8, padding:16 }}>
            <h3 style={{ marginTop:0 }}>{selected.doc_no}</h3>
            <div><strong>Asset:</strong> {selected.asset_name}</div>
            <div><strong>Type:</strong> {selected.work_type}</div>
            <div><strong>Start:</strong> {formatDdMmYyyyHHMM(isoToMs(selected.start_date))}</div>
            <div><strong>End:</strong> {formatDdMmYyyyHHMM(isoToMs(selected.end_date))}</div>
            <div><strong>Actual Start:</strong> {formatDdMmYyyyHHMM(isoToMs(selected.realisasi?.actualStart))}</div>
            <div><strong>Actual End:</strong> {formatDdMmYyyyHHMM(isoToMs(selected.realisasi?.actualEnd))}</div>
            <div style={{ marginTop:12 }}>
              <pre style={{ whiteSpace:'pre-wrap', background:'#f7f7f7', padding:8, borderRadius:6 }}>{selected.description ?? JSON.stringify(selected.raw ?? selected, null, 2)}</pre>
            </div>
            <div style={{ textAlign:'right', marginTop:8 }}>
              <Button variant="contained" size="small" startIcon={<CloseIcon />} onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* small styles for fallback fullscreen */}
      <style jsx>{`
        .gantt-svg-wrapper.gantt-fs-fallback {
          position: fixed !important;
          left: 0; top: 0; right: 0; bottom: 0;
          width: 100vw !important; height: 100vh !important;
          z-index: 99999;
          background: #fff;
          padding: 18px;
        }
      `}</style>
    </div>
  );
}

function LegendItem({ color, label, showBox = true }: { color: string; label: string; showBox?: boolean }) {
  const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
  return (
    <Box display="flex" alignItems="center" gap={1} sx={{ background: '#fff', padding: '6px 8px', borderRadius: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}>
      {showBox && <Box sx={{ width: 14, height: 14, backgroundColor: color, borderRadius: 0.5 }} />}
      <Typography sx={{ fontSize: 13, color: '#333' }}>{label}</Typography>
    </Box>
  );
}
