// components/GanttChart.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import apiClient from '../lib/api-client';
import { parseToUtcDate, formatUtcToZone, toInputDatetime } from '../lib/date-utils';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';

type WO = {
  id: string | number;
  doc_no?: string | null;
  asset_name?: string | null;
  work_type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  description?: string | null;
  raw?: any;
  // optional top-level status (some backends provide this)
  status?: string | null;
  // optional top-level progress (0..1 or 0..100)
  progress?: number | null;
  realisasi?: { actualStart?: string | null; actualEnd?: string | null; items?: Array<{ id: string; start?: string | null; end?: string | null }> } | null;
};

const rowHeight = 44;
const labelWidth = 300;
const gutter = 12;
const minBarWidthPx = 4;

function isoToMs(val?: string | null) {
  if (!val) return null;
  // If naive SQL datetime (YYYY-MM-DD or YYYY-MM-DD HH:mm:ss) without timezone,
  // interpret it as local wall-clock time so it lines up with local dayStartMs.
  const s = String(val).trim();
  const naiveSqlRx = /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const m = naiveSqlRx.exec(s);
  if (m && !/[Zz]|[+-]\d{2}:?\d{2}$/.test(s)) {
    try {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const d = Number(m[3]);
      const hh = Number(m[4] || '0');
      const mi = Number(m[5] || '0');
      const ss = Number(m[6] || '0');
      return new Date(y, mo, d, hh, mi, ss).getTime();
    } catch (e) {
      // fallback to parseToUtcDate
    }
  }
  const dd = parseToUtcDate(val);
  return dd ? dd.getTime() : null;
}
function niceTime(ms: number | null) {
  if (!ms) return '-';
  const d = new Date(ms);
  return d.toLocaleString();
}
// Format ms to dd/mm/yyyy HH24:mi using default site timezone (Asia/Jakarta)
function formatDdMmYyyyHHMM(ms: number | null) {
  if (!ms) return '-';
  return formatUtcToZone(ms);
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
  // mapping per request:
  // PREPARATION = abu-abu, ASSIGNED = biru muda, DEPLOYED = magenta, IN_PROGRESS = orange, COMPLETED = hijau
  'PREPARATION': '#64748b', // abu-abu
  'ASSIGNED': '#60a5fa', // biru muda
  'DEPLOYED': '#db2777', // magenta
  'IN_PROGRESS': '#f97316', // orange
  'COMPLETED': '#10b981', // green
  'NEW': '#64748b', // legacy alias
  'OPEN': '#64748b',
  'CANCELLED': '#ef4444',
  'CLOSED': '#334155',
};

// preferred legend order for statuses
const STATUS_ORDER = ['PREPARATION', 'ASSIGNED', 'DEPLOYED', 'IN_PROGRESS', 'COMPLETED'];

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
  if (statusRaw != null) {
    const norm = normalizeStatusRaw(statusRaw);
    if (norm) return getColorForStatus(norm);
  }
  const wt = (w.work_type || (w.raw && (w.raw.work_type || w.raw.type_work)) || '').toString();
  if (wt && WORK_TYPE_COLORS[wt]) return WORK_TYPE_COLORS[wt];
  if (wt && WORK_TYPE_COLORS[wt.toUpperCase() as keyof typeof WORK_TYPE_COLORS]) return WORK_TYPE_COLORS[wt.toUpperCase() as keyof typeof WORK_TYPE_COLORS];
  return WORK_TYPE_COLORS['Default'];
}

function getWorkTypeColor(wt?: string | null) {
  const val = (wt || '').toString();
  if (!val) return WORK_TYPE_COLORS['Default'];
  if (WORK_TYPE_COLORS[val]) return WORK_TYPE_COLORS[val];
  const up = val.toUpperCase();
  if (WORK_TYPE_COLORS[up as keyof typeof WORK_TYPE_COLORS]) return WORK_TYPE_COLORS[up as keyof typeof WORK_TYPE_COLORS];
  return WORK_TYPE_COLORS['Default'];
}

function normalizeStatusRaw(s?: any) {
  if (s == null) return '';
  const str = String(s).toString();
  const k = str.toUpperCase().trim().replace(/[-\s]/g, '_');
  // remap legacy/raw statuses to canonical names
  switch (k) {
    case 'NEW':
    case 'ASSIGNED':
      return 'PREPARATION';
    case 'READY_TO_DEPLOY':
    case 'READY-TO-DEPLOY':
      return 'ASSIGNED';
    default:
      return k;
  }
}

function getColorForStatus(s: string) {
  // assume `s` is already normalized by caller (i.e. `normalizeStatusRaw` was applied).
  // Do not call `normalizeStatusRaw` again to avoid double-mapping.
  const k = String(s || '').toUpperCase().replace(/[-\s]/g, '_');
  switch (k) {
    case 'PREPARATION': return STATUS_COLORS['PREPARATION'];
    case 'ASSIGNED': return STATUS_COLORS['ASSIGNED'];
    case 'DEPLOYED': return STATUS_COLORS['DEPLOYED'];
    case 'IN_PROGRESS': return STATUS_COLORS['IN_PROGRESS'];
    case 'IN-PROGRESS': return STATUS_COLORS['IN_PROGRESS'];
    case 'COMPLETED': return STATUS_COLORS['COMPLETED'];
    case 'OPEN': return STATUS_COLORS['OPEN'];
    case 'CANCELLED': return STATUS_COLORS['CANCELLED'];
    case 'CLOSED': return STATUS_COLORS['CLOSED'];
    default: return '#6b7280';
  }
}

function renderStatusBadge(s: any) {
  const n = normalizeStatusRaw(s);
  const color = getColorForStatus(n);
  return (
    <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 999, background: color, color: 'white', fontSize: 8, fontWeight: 600 }}>
      {String(n).replace(/_/g, ' ')}
    </span>
  );
}

function formatUtcDisplay(raw?: string | null) {
  if (!raw) return '-';
  return formatUtcToZone(raw);
}

function displayRealisasi(raw?: string | null, fallback = 'Belum direalisasi') {
  if (!raw) return fallback;
  return formatUtcDisplay(raw);
}

function normalizeDateLike(val: any) {
  const d = parseToUtcDate(val);
  return d ? d.toISOString() : null;
}

function extractRealisasi(wo: any) {
  // try multiple common shapes for realisasi start/end
  const candidates: Array<{ s?: any; e?: any }> = [];
  try {
    const r = wo?.realisasi;
    if (r) {
      candidates.push({ s: r.actualStart ?? r.actual_start ?? r.start ?? r.start_time, e: r.actualEnd ?? r.actual_end ?? r.end ?? r.end_time });
      if (Array.isArray(r.items) && r.items.length > 0) {
        candidates.push({ s: r.items[0].start ?? r.items[0].actualStart ?? r.items[0].actual_start, e: r.items[0].end ?? r.items[0].actualEnd ?? r.items[0].actual_end });
      }
    }
  } catch (e) {}
  try {
    const raw = wo?.raw ?? {};
    // common raw shapes
    candidates.push({ s: raw.realisasi_start ?? raw.realisasiStart ?? raw.actualStart ?? raw.actual_start ?? raw.start_realisasi, e: raw.realisasi_end ?? raw.realisasiEnd ?? raw.actualEnd ?? raw.actual_end ?? raw.end_realisasi });
    candidates.push({ s: raw.realisasi?.[0]?.start ?? raw.realisasi?.[0]?.actualStart, e: raw.realisasi?.[0]?.end ?? raw.realisasi?.[0]?.actualEnd });
    candidates.push({ s: raw.realisasi_items?.[0]?.start ?? raw.realisasi_items?.[0]?.actualStart, e: raw.realisasi_items?.[0]?.end ?? raw.realisasi_items?.[0]?.actualEnd });
    candidates.push({ s: raw.actual_start ?? raw.start_actual ?? raw.started_at ?? raw.startedAt, e: raw.actual_end ?? raw.end_actual ?? raw.ended_at ?? raw.endedAt });
  } catch (e) {}

  for (const c of candidates) {
    const s = normalizeDateLike(c.s);
    const e = normalizeDateLike(c.e);
    if (s || e) return { s, e };
  }
  return { s: null, e: null };
}


export default function GanttChart({ pageSize = 2000 }: { pageSize?: number }) {
  const [items, setItems] = useState<WO[]>([]);
  const [sites, setSites] = useState<string[]>([]);
  const [site, setSite] = useState<string>('');
  const [workType, setWorkType] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayIsoDate = new Date().toISOString().slice(0,10);
  const [selectedDate, setSelectedDate] = useState<string>(todayIsoDate);
  const [scale, setScale] = useState<number>(1);
  const [selected, setSelected] = useState<WO | null>(null);
  const [editing, setEditing] = useState<WO | null>(null);
  const [editStartInput, setEditStartInput] = useState<string>('');
  const [editEndInput, setEditEndInput] = useState<string>('');
  const [editLoading, setEditLoading] = useState(false);
  const [editNote, setEditNote] = useState<string>('');
  const [dateHistory, setDateHistory] = useState<any[]>([]);
  const [deployLoading, setDeployLoading] = useState<boolean>(false);
  const [undeployLoading, setUndeployLoading] = useState<boolean>(false);
  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMsg, setSnackMsg] = useState<string>('');
  const [snackSeverity, setSnackSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('success');
  const [taskModal, setTaskModal] = useState<{ open: boolean; wo: WO | null }>({ open: false, wo: null });
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [techQuery, setTechQuery] = useState<string>('');
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string[]>>({});
  const [currentUser, setCurrentUser] = useState<any | null | undefined>(undefined);
  const [techLoading, setTechLoading] = useState<boolean>(false);
  const [taskLoading, setTaskLoading] = useState<boolean>(false);
  const [assignLoading, setAssignLoading] = useState<Record<string, boolean>>({});
  // displayMode: 'both' | 'planned' | 'actual'
  const [displayMode, setDisplayMode] = useState<string>('both');

  // drag / resize state for interactive Gantt
  const [dragState, setDragState] = useState<null | {
    id: string | number;
    type: 'move' | 'resize-left' | 'resize-right';
    startX: number; // clientX at start
    origStartMs: number;
    origEndMs: number;
  }>(null);
  const [dragPreview, setDragPreview] = useState<null | { id: string | number; startMs: number; endMs: number }>(null);
  const [savingDrag, setSavingDrag] = useState<boolean>(false);
  const suppressClickRef = useRef<boolean>(false);

  // handle global pointer movements while dragging/resizing
  useEffect(() => {
    function onMove(ev: MouseEvent) {
      if (!dragState) return;
      try {
        const clientX = ev.clientX;
        const deltaPx = clientX - dragState.startX;
        if (Math.abs(deltaPx) > 4) suppressClickRef.current = true;
        const deltaMs = deltaPx / pxPerMs;
        let newStart = dragState.origStartMs;
        let newEnd = dragState.origEndMs;
        const minDurationMs = 5 * 60 * 1000; // 5 minutes min
        if (dragState.type === 'move') {
          newStart = Math.round(dragState.origStartMs + deltaMs);
          newEnd = Math.round(dragState.origEndMs + deltaMs);
        } else if (dragState.type === 'resize-left') {
          newStart = Math.round(dragState.origStartMs + deltaMs);
          if (newEnd - newStart < minDurationMs) newStart = newEnd - minDurationMs;
        } else if (dragState.type === 'resize-right') {
          newEnd = Math.round(dragState.origEndMs + deltaMs);
          if (newEnd - newStart < minDurationMs) newEnd = newStart + minDurationMs;
        }
        // clamp to current day window
        newStart = Math.max(dayStartMs, Math.min(newStart, dayEndMs - 60000));
        newEnd = Math.max(dayStartMs + 60000, Math.min(newEnd, dayEndMs));
        setDragPreview({ id: dragState.id, startMs: newStart, endMs: newEnd });
      } catch (e) { console.error('drag move', e); }
    }
    async function onUp(ev: MouseEvent) {
      if (!dragState) return;
      try {
        const preview = dragPreview;
        const id = dragState.id;
        // compute movement to distinguish click vs drag
        const deltaPx = ev.clientX - dragState.startX;
        setDragState(null);
        setDragPreview(null);
        if (Math.abs(deltaPx) < 4) {
          // treat as click: open details modal for this work order
          try {
            let wo: WO | undefined = items.find(it => String(it.id) === String(id));
            if (!wo) {
              try {
                const res = await apiClient(`/work-orders/${encodeURIComponent(String(id))}`);
                wo = res?.data ?? res;
                try {
                  const rr = await apiClient(`/work-orders/${encodeURIComponent(String(id))}/realisasi`);
                  (wo as any).realisasi = rr?.data ?? rr;
                } catch (e) {
                  (wo as any).realisasi = (wo as any).realisasi ?? null;
                }
              } catch (e) { wo = undefined; }
            }
            if (wo) {
              console.debug('[Gantt] open details (after drag click) payload:', wo);
              setSelected(wo as any);
            }
          } catch (e) { console.error('open details on click after drag', e); }
          // reset suppress flag
          suppressClickRef.current = false;
          return;
        }
        if (!preview) return;
        // otherwise treat as drag/resize: open Edit Dates dialog as confirmation
        if (preview.startMs !== dragState.origStartMs || preview.endMs !== dragState.origEndMs) {
          try {
            let wo: WO | undefined = items.find(it => String(it.id) === String(id));
            if (!wo) {
              try {
                const res = await apiClient(`/work-orders/${encodeURIComponent(String(id))}`);
                wo = res?.data ?? res;
              } catch (e) { wo = undefined; }
            }
            if (!wo) return;
            setEditing(wo as any);
            setEditStartInput(msToInputDatetime(preview.startMs));
            setEditEndInput(msToInputDatetime(preview.endMs));
            setEditNote('');
            setSelected(null);
            // dateHistory will be loaded by the existing effect that watches `editing`
          } catch (e) {
            console.error('open edit dialog after drag', e);
          }
        }
      } catch (e) { console.error('drag up', e); }
    }
    if (dragState) {
      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
      return () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
      };
    }
  }, [dragState, dragPreview, load, scale, selectedDate]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgWrapperRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(900);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const selectedDateLabel = useMemo(() => {
    try {
      const d = dateInputToDayStart(selectedDate);
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()}`;
    } catch (e) { return selectedDate; }
  }, [selectedDate]);

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

  useEffect(() => { load(); }, [site, selectedDate, workType, pageSize]);

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
      const baseUrl = `/work-orders?q=&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
      const res = await apiClient(baseUrl);
      const rows = res?.data ?? res;
      // Also explicitly fetch DAILY work orders and merge to ensure they appear on the Gantt
      let dailyRows: any[] = [];
      try {
        const dailyUrl = `/work-orders?work_type=DAILY&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
        const dres = await apiClient(dailyUrl);
        dailyRows = dres?.data ?? dres ?? [];
      } catch (e) {
        dailyRows = [];
      }
      // Also fetch items where type_work='DAILY_CHECKLIST' (legacy or alternative column)
      let typeWorkRows: any[] = [];
      try {
        const twUrl = `/work-orders?type_work=DAILY_CHECKLIST&page=1&pageSize=${pageSize}` + (site ? `&site=${encodeURIComponent(site)}` : '');
        const tres = await apiClient(twUrl);
        typeWorkRows = tres?.data ?? tres ?? [];
      } catch (e) {
        typeWorkRows = [];
      }
      // merge rows and dailyRows deduping by id
      const map = new Map<string|number, any>();
      (Array.isArray(rows) ? rows : []).forEach((r: any) => { if (r && r.id != null) map.set(String(r.id), r); });
      (Array.isArray(dailyRows) ? dailyRows : []).forEach((r: any) => { if (r && r.id != null) map.set(String(r.id), r); });
      (Array.isArray(typeWorkRows) ? typeWorkRows : []).forEach((r: any) => { if (r && r.id != null) map.set(String(r.id), r); });
      const merged = Array.from(map.values());
      const mapped: WO[] = (merged || []).map((r: any) => ({
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

  // use shared `toInputDatetime` from web/lib/date-utils

  async function saveEdit(id: string, start_date?: string | null, end_date?: string | null) {
    setEditLoading(true);
    try {
      const body: any = {};
      if (start_date !== undefined) body.start_date = start_date || null;
      if (end_date !== undefined) body.end_date = end_date || null;
      if (editNote && editNote.trim().length) body.note = editNote.trim();
      await apiClient(`/work-orders/${encodeURIComponent(id)}`, { method: 'PATCH', body });
      await load();
      setEditing(null);
      setSelected(null);
      setEditNote('');
      setDateHistory([]);
    } catch (err: any) {
      console.error('save edit', err);
      alert('Gagal menyimpan: ' + (err?.body?.message || err?.message));
    } finally {
      setEditLoading(false);
    }
  }

  function shouldShowAssignColumn(wo: WO | null) {
    const s = ((wo as any)?.status ?? wo?.raw?.status ?? '').toString().toUpperCase().replace(/[-\s]/g, '_');
    return !(s === 'COMPLETED');
  }

  async function openTaskModal(w: WO) {
    // mirror logic from WorkOrderList.openTaskModal
    if (!w.start_date) {
      alert('Work Order belum memiliki Start Date. Isi Start Date dan End Date terlebih dahulu.');
      return;
    }
    setTaskModal({ open: true, wo: w });
    setTechQuery('');
    setTechnicians([]);
    setSelectedAssignees({});
    (async () => {
      setTechLoading(true);
      setTaskLoading(true);
      let filteredTechs: any[] = [];
      try {
        const woSiteRaw = (w.raw && (w.raw.vendor_cabang || w.raw.site)) || (w as any).vendor_cabang || '';
        const woSite = (() => {
          const v = woSiteRaw;
          if (v == null) return '';
          if (typeof v === 'object') return String(v.name ?? v.code ?? v.id ?? v.site ?? '');
          return String(v);
        })().toLowerCase().trim();
        const pad = (n: number) => String(n).padStart(2, '0');

        const sdUtc = parseToUtcDate(String(w.start_date));
        if (!sdUtc) {
          alert('Start Date tidak valid.');
          setTaskModal({ open: false, wo: null });
          setTechLoading(false);
          setTaskLoading(false);
          return;
        }
        const assignDate = `${sdUtc.getUTCFullYear()}-${pad(sdUtc.getUTCMonth() + 1)}-${pad(sdUtc.getUTCDate())}`;
        const assignTime = `${pad(sdUtc.getUTCHours())}:${pad(sdUtc.getUTCMinutes())}`;
        const schedUrl = `/scheduled-technicians?date=${encodeURIComponent(assignDate)}&time=${encodeURIComponent(assignTime)}&timeIsLocal=1` + (woSite ? `&site=${encodeURIComponent(woSite)}` : '');
        try {
          const sched = await apiClient(schedUrl);
          const schedRows = Array.isArray(sched) ? sched : (sched?.data ?? []);
          filteredTechs = schedRows;
        } catch (e) {
          try {
            const techs = await apiClient('/users?role=technician');
            const list = Array.isArray(techs) ? techs : (techs?.data ?? []);
            filteredTechs = list;
          } catch (e2) {
            filteredTechs = [];
          }
        }
        const sortedTechs = Array.isArray(filteredTechs) ? filteredTechs.slice().sort((a:any,b:any)=>{
          const na = String(a?.name || a?.nama || a?.nipp || a?.email || a?.id || '').toLowerCase();
          const nb = String(b?.name || b?.nama || b?.nipp || b?.email || b?.id || '').toLowerCase();
          if (na < nb) return -1; if (na > nb) return 1; return 0;
        }) : [];
        setTechnicians(sortedTechs);
      } catch (e) {
        setTechnicians([]);
      }

      try {
        const res = await apiClient(`/work-orders/${encodeURIComponent(String(w.id))}`);
        const woDetail = res?.data ?? res;
        try {
          const rr = await apiClient(`/work-orders/${encodeURIComponent(String(w.id))}/realisasi`);
          (woDetail as any).realisasi = rr?.data ?? rr;
        } catch (e) {
          (woDetail as any).realisasi = (woDetail as any).realisasi ?? null;
        }
        try {
          const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(String(w.id))}/tasks`);
          const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
          (woDetail as any).tasks = tasks;
        } catch (e) {
          const acts = Array.isArray(woDetail.raw?.activities) ? woDetail.raw.activities : [];
          (woDetail as any).tasks = acts.map((act: any, idx: number) => ({ id: `raw-${idx}`, name: act.task_name || act.name || `Task ${idx + 1}`, duration_min: act.task_duration }));
        }
        setTaskModal({ open: true, wo: woDetail });

        const nextSelected: Record<string, string[]> = {};
        const taskRows = Array.isArray((woDetail as any).tasks) ? (woDetail as any).tasks : [];
        const techIds = new Set((Array.isArray(filteredTechs) ? filteredTechs : []).map(t => String(t.id)));
        for (const t of taskRows) {
          const key = String(t.id ?? t.task_id ?? t.external_id ?? '');
          if (!key) continue;
          const assigns = Array.isArray(t.assignments) ? t.assignments : [];
          const keeps: string[] = [];
          for (const a of assigns) {
            const assId = String(a?.user?.id ?? a.user_id ?? a.userId ?? '');
            if (!assId) continue;
            if (!techIds.has(assId)) continue;
            if (!keeps.includes(assId)) keeps.push(assId);
          }
          if (keeps.length > 0) nextSelected[key] = keeps;
        }
        setSelectedAssignees(nextSelected);
      } catch (err) {
        // ignore
      }

      try {
        const me = await apiClient('/auth/me');
        setCurrentUser(me?.data ?? me);
      } catch (err) {
        setCurrentUser(null);
      }
      setTechLoading(false);
      setTaskLoading(false);
    })();
  }

  function closeTaskModal() {
    setTaskModal({ open: false, wo: null });
    setTechQuery('');
    setTechnicians([]);
    setSelectedAssignees({});
    setTechLoading(false);
    setTaskLoading(false);
    setAssignLoading({});
    try { load(); } catch (e) { }
  }

  useEffect(() => {
    if (!editing) {
      setDateHistory([]);
      return;
    }
    (async () => {
      try {
        const h = await apiClient(`/work-orders/${encodeURIComponent(String(editing.id))}/date-history`);
        const rows = h?.data ?? h;
        setDateHistory(Array.isArray(rows) ? rows : []);
      } catch (e) {
        setDateHistory([]);
      }
    })();
  }, [editing]);

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

  const workTypes = useMemo(() => {
    const s = new Set<string>();
    for (const it of items) {
      const wt = it.work_type ?? (it.raw && (it.raw.work_type || it.raw.type_work)) ?? '';
      if (wt) s.add(String(wt));
    }
    return Array.from(s).sort();
  }, [items]);

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

  function msToInputDatetime(ms: number) {
    // produce datetime-local value in client timezone using shared util
    try {
      return toInputDatetime(new Date(ms));
    } catch (e) { return ''; }
  }

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
      // filter by selected work type (if any)
      const wtVal = (it.work_type ?? (it.raw && (it.raw.work_type || it.raw.type_work)) ?? '').toString();
      if (Array.isArray(workType) && workType.length > 0 && !workType.includes(wtVal)) {
        const rec: any = { id: it.id ?? it.doc_no, rawWorkType: wtVal, passes: false, reason: `filtered by workType (${wtVal})` };
        debugReasons.push(rec);
        return false;
      }
      // prefer realisasi dates for COMPLETED work orders if available
      // but fall back to common raw fields when top-level start/end are missing
      const pickRawStart = (obj: any) => obj?.start_date ?? obj?.start_date_sql ?? obj?.date_start ?? obj?.date ?? obj?.planned_start ?? null;
      const pickRawEnd = (obj: any) => obj?.end_date ?? obj?.end_date_sql ?? obj?.up_date ?? obj?.date_end ?? obj?.planned_end ?? null;
      let sIso: string | null = (it.start_date ?? pickRawStart(it.raw) ?? null) as any;
      let eIso: string | null = (it.end_date ?? pickRawEnd(it.raw) ?? null) as any;
      try {
        const statusNorm = normalizeStatusRaw((it as any).status ?? it.raw?.status ?? it.raw?.state ?? '');
        // prefer realisasi start for COMPLETED and IN_PROGRESS items when available;
        // for IN_PROGRESS, keep the original estimated end_date as the bar end
        // prefer realisasi dates only for COMPLETED work orders when available
        if (statusNorm === 'COMPLETED') {
          const r = (it as any).realisasi ?? (it.raw && (it.raw.realisasi || it.raw.realisasis || it.raw.realisasi_items)) ?? null;
          if (r) {
            // only override with realisasi when it actually contains dates; otherwise keep work-order start/end (including raw fallbacks)
            const realS = r.actualStart ?? (Array.isArray(r.items) && r.items.length > 0 ? r.items[0].start : null) ?? null;
            const realE = r.actualEnd ?? (Array.isArray(r.items) && r.items.length > 0 ? r.items[0].end : null) ?? null;
            if (realS) sIso = realS;
            if (realE) eIso = realE;
          }
        }
      } catch (e) {
        // ignore and fallback to original start/end
      }
      const s = isoToMs(sIso ?? it.start_date);
      const e = isoToMs(eIso ?? it.end_date);
      const rec: any = { id: it.id ?? it.doc_no, rawStart: sIso ?? it.start_date, rawEnd: eIso ?? it.end_date, s, e };
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
      function preferredStartMs(x: any) {
        try {
          const sNorm = normalizeStatusRaw(x.status ?? x.raw?.status ?? x.raw?.state ?? '');
          // only prefer realisasi for COMPLETED status
          if (sNorm === 'COMPLETED') {
            const r = x.realisasi ?? (x.raw && (x.raw.realisasi || x.raw.realisasis || x.raw.realisasi_items)) ?? null;
            if (r) {
              const sIso = r.actualStart ?? (Array.isArray(r.items) && r.items.length > 0 ? r.items[0].start : null) ?? null;
              const ms = isoToMs(sIso);
              if (ms != null) return ms;
            }
          }
        } catch (e) {}
        return isoToMs(x.start_date) ?? 0;
      }
      const sa = preferredStartMs(a);
      const sb = preferredStartMs(b);
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
              <Typography variant="h6" component="h2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Work Orders (per-hari)</Typography>
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

                <FormControl size="small" sx={{ minWidth: 200 }}>
                  <InputLabel id="gantt-worktype-label">Jenis WO</InputLabel>
                  <Select
                    labelId="gantt-worktype-label"
                    label="Jenis WO"
                    multiple
                    value={workType}
                    onChange={e => {
                      const val = e.target.value as string[];
                      if (Array.isArray(val) && val.includes('__clear__')) setWorkType([]);
                      else setWorkType(val);
                    }}
                    renderValue={(v) => (Array.isArray(v) && v.length ? (v as string[]).join(', ') : '-- All types --')}
                    sx={{ minWidth: 160 }}
                  >
                    <MenuItem value="__clear__"><ListItemText primary="-- All types --" /></MenuItem>
                    {workTypes.map(wt => (
                      <MenuItem key={wt} value={wt}>
                        <Checkbox checked={workType.indexOf(wt) > -1} />
                        <ListItemText primary={wt} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* show/planned toggle hidden per UX request */}
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
              sx={{ backgroundColor: color, color: textColor, fontWeight: 700, fontSize: 8, px: 0.5, height: 22 }}
            />
          );
        })}
        {/* Realisasi legend removed */}
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
        {isFullscreen && (
          <Box display="flex" gap={1} alignItems="center" sx={{ mt: 1, mb: 2, position: 'sticky', top: 0, zIndex: 40, background: '#fff', padding: '8px', borderBottom: '1px solid #eee' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 700, mr: 1 }}>Status colors:</Typography>
              {STATUS_ORDER.map((status) => {
                const color = STATUS_COLORS[status] || '#999';
                const textColor = isDarkColor(color) ? '#ffffff' : '#000000';
                return (
                  <Chip
                    key={status + '-fs'}
                    label={status.replace(/_/g, ' ')}
                    size="small"
                    sx={{ backgroundColor: color, color: textColor, fontWeight: 700, fontSize: 8, px: 0.5, height: 22 }}
                  />
                );
              })}
              {/* Realisasi legend removed in fullscreen */}
            </Box>

            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography sx={{ fontSize: 13, color: '#444', fontWeight: 700 }}>Tanggal</Typography>
              <Typography sx={{ fontSize: 13, color: '#111' }}>{selectedDateLabel}</Typography>
            </Box>
          </Box>
        )}
        <div ref={containerRef} style={{ overflowX: 'auto', height: isFullscreen ? '100%' : undefined }}>
          <div style={{ display:'flex', minWidth: Math.max(900, svgWidth) }}>
            {/* labels */}
            <div style={{ width: labelWidth, borderRight: '1px solid #f0f0f0', background: '#fafafa' }}>
              <div style={{ height: 40, padding: '10px 12px', boxSizing: 'border-box', display: 'flex', alignItems: 'center', fontWeight:700 }}>Work Order</div>
              {validItems.map((w, idx) => {
                const wt = w.work_type ?? (w.raw && (w.raw.work_type || w.raw.type_work)) ?? '';
                const badgeColor = getWorkTypeColor(wt);
                const badgeTextColor = isDarkColor(badgeColor) ? '#ffffff' : '#000000';
                return (
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
                    <div style={{ fontSize:13, fontWeight:700 }}>{w.asset_name ?? ''}</div>
                    <div style={{ marginTop:6, display:'flex', gap:8, alignItems:'center' }}>
                      <div style={{ color:'#666', fontSize:12, overflow:'hidden', textOverflow:'ellipsis' }}>{w.doc_no ?? w.id}</div>
                      {wt ? (
                        <Chip
                          label={wt}
                          size="small"
                          sx={{ backgroundColor: badgeColor, color: badgeTextColor, fontWeight:700, fontSize: 8, px: 0.5, height: 20 }}
                        />
                      ) : null}
                    </div>
                  </div>
                );
              })}
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
                  const baseStartRaw = isoToMs(w.start_date ?? w.raw?.start_date ?? w.raw?.start_date_sql ?? w.raw?.date_start ?? w.raw?.date ?? w.raw?.planned_start) as number | null;
                  const baseEndRaw = isoToMs(w.end_date ?? w.raw?.end_date ?? w.raw?.end_date_sql ?? w.raw?.up_date ?? w.raw?.date_end ?? w.raw?.planned_end) as number | null;
                  const realStartMsRaw = isoToMs(w.realisasi?.actualStart ?? w.realisasi?.items?.[0]?.start) as number | null;
                  const realEndMsRaw = isoToMs(w.realisasi?.actualEnd ?? w.realisasi?.items?.[0]?.end) as number | null;
                  // determine which start/end to use: for COMPLETED prefer realisasi start/end when available
                  // for other statuses (PREPARATION, ASSIGNED, DEPLOYED, IN_PROGRESS) use work order start_date/end_date
                  const statusNorm = normalizeStatusRaw((w as any).status || w.raw?.status || w.raw?.doc_status);
                  let chosenStartRaw: number | null = baseStartRaw;
                  let chosenEndRaw: number | null = baseEndRaw;
                  if (statusNorm === 'COMPLETED') {
                    if (realStartMsRaw != null || realEndMsRaw != null) {
                      chosenStartRaw = realStartMsRaw ?? baseStartRaw;
                      chosenEndRaw = realEndMsRaw ?? baseEndRaw;
                    }
                  }
                  // Normalize tiny anomalies where end <= start (e.g. rounding issues)
                  const MIN_BAR_DURATION_MS = 60 * 1000; // 1 minute
                  if (chosenStartRaw != null && chosenEndRaw != null && chosenEndRaw <= chosenStartRaw) {
                    chosenEndRaw = chosenStartRaw + MIN_BAR_DURATION_MS;
                  }
                  if (chosenStartRaw == null || chosenEndRaw == null) return null;
                  const sMs = Math.max(chosenStartRaw, dayStartMs);
                  const eMs = Math.min(chosenEndRaw, dayEndMs);
                  if (eMs <= sMs) return null;
                  const x1 = msToX(sMs);
                  const x2 = msToX(eMs);
                  const width = clampBarWidth(x1, x2);
                  const y = idx * rowHeight + 40 + 6;
                  const rx = 6;
                  // bar color reflects status or work-type (original behavior)
                  const color = pickColorForWork(w);

                  // statusNorm already computed above
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

                  // compute luminance for a hex color (higher = lighter)
                  function luminance(hex: string) {
                    const rgb = hexToRgb(hex) || { r: 0, g: 0, b: 0 };
                    return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
                  }

                  // helper: lighten a hex color by moving each channel toward 255 by frac (0..1)
                  function lightenHex(hex: string, frac = 0.18) {
                    try {
                      const rgb = hexToRgb(hex);
                      if (!rgb) return hex;
                      const r = Math.max(0, Math.min(255, Math.round(rgb.r + (255 - rgb.r) * frac)));
                      const g = Math.max(0, Math.min(255, Math.round(rgb.g + (255 - rgb.g) * frac)));
                      const b = Math.max(0, Math.min(255, Math.round(rgb.b + (255 - rgb.b) * frac)));
                      const toHex = (n: number) => n.toString(16).padStart(2, '0');
                      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                    } catch (e) {
                      return hex;
                    }
                  }

                  // use a darker variant of the bar color for the progress overlay
                  // For COMPLETED items we keep the progress overlay color as the base `color` (real/actual),
                  // and ensure the planned interval is not darker than that actual color.
                  const progressColor = (statusNorm === 'COMPLETED') ? color : darkenHex(color, 0.22);
                  const progressTextColorInside = isDark(progressColor) ? '#ffffff' : '#000000';

                  // determine per-status allowed interactions:
                  const canMove = (statusNorm === 'PREPARATION' || statusNorm === 'ASSIGNED');
                  const canResizeLeft = canMove;
                  const canResizeRight = canMove || statusNorm === 'DEPLOYED' || statusNorm === 'IN_PROGRESS';
                  const interactive = canMove || canResizeRight;
                  const cursorStyle = canMove ? 'grab' : (canResizeRight ? 'ew-resize' : 'pointer');

                  return (
                    <g
                      key={'bar'+w.id}
                      style={{ cursor: cursorStyle }}
                      onClick={async () => {
                        if (suppressClickRef.current) { suppressClickRef.current = false; return; }
                        try {
                          // fetch full details to ensure start_date/end_date and realisasi are present
                          const res = await apiClient(`/work-orders/${encodeURIComponent(String(w.id))}`);
                          const woDetail = res?.data ?? res;
                          try {
                            const rr = await apiClient(`/work-orders/${encodeURIComponent(String(w.id))}/realisasi`);
                            (woDetail as any).realisasi = rr?.data ?? rr;
                          } catch (e) {
                            (woDetail as any).realisasi = (woDetail as any).realisasi ?? null;
                          }
                          console.debug('[Gantt] open details (click) payload:', woDetail || w);
                          setSelected(woDetail || w);
                        } catch (e) {
                          // fallback to list item
                          console.debug('[Gantt] open details (click) fallback payload:', w);
                          setSelected(w);
                        }
                      }}
                      onMouseDown={(ev) => {
                        try {
                          if (!interactive) return;
                          ev.stopPropagation();
                          const rect = (ev.currentTarget as SVGGElement).ownerSVGElement?.getBoundingClientRect();
                          if (!rect) return;
                          const clientX = ev.clientX;
                          const localX = clientX - rect.left;
                          const leftEdge = x1;
                          const rightEdge = x2;
                          const edgeThreshold = 10;
                          let type: 'move' | 'resize-left' | 'resize-right' | null = null;
                          if (Math.abs(localX - leftEdge) <= edgeThreshold) {
                            if (canResizeLeft) type = 'resize-left';
                            else if (canResizeRight) type = 'resize-right';
                          } else if (Math.abs(localX - rightEdge) <= edgeThreshold) {
                            if (canResizeRight) type = 'resize-right';
                          } else {
                            if (canMove) type = 'move';
                          }
                          if (!type) return; // click area not interactive for this status
                          setDragState({ id: w.id as any, type, startX: clientX, origStartMs: sMs, origEndMs: eMs });
                          // set initial preview
                          setDragPreview({ id: w.id as any, startMs: sMs, endMs: eMs });
                          // prevent text selection / page drag
                          if (typeof window !== 'undefined') window.getSelection()?.removeAllRanges();
                        } catch (e) {
                          console.error('start drag', e);
                        }
                      }}
                    >
                      {/* work-type badge moved to Y-axis labels */}
                      {/* For COMPLETED items: draw the planned interval behind the realized bar (lighter color / dashed) */}
                      {(statusNorm === 'COMPLETED' && baseStartRaw != null && baseEndRaw != null && (realStartMsRaw != null || realEndMsRaw != null)) && (() => {
                        const ps = Math.max(baseStartRaw, dayStartMs);
                        const pe = Math.min(baseEndRaw, dayEndMs);
                        if (pe > ps) {
                          const px1 = msToX(ps);
                          const px2 = msToX(pe);
                          const pwidth = clampBarWidth(px1, px2);
                          // make the planned interval slightly lighter than the actual/progress bar
                          // make planned interval noticeably lighter than the actual/progress bar
                          // make planned interval much lighter than the actual/progress bar
                          let plannedFill = lightenHex(color, 0.75);
                          const plannedStroke = darkenHex(color, 0.08);
                          // ensure plannedFill is lighter than progressColor; if not, lighten progressColor instead
                          if (luminance(plannedFill) <= luminance(progressColor)) {
                            plannedFill = lightenHex(progressColor, 0.75);
                          }
                          return (
                            <>
                              <rect x={px1} y={y} rx={rx} ry={rx} width={pwidth} height={rowHeight - 12} fill={plannedFill} />
                              <rect x={px1} y={y} rx={rx} ry={rx} width={pwidth} height={rowHeight - 12} fill="none" stroke={plannedStroke} strokeWidth={1} strokeDasharray="4,2" />
                            </>
                          );
                        }
                        return null;
                      })()}
                      {displayMode !== 'actual' && (
                        <rect x={x1} y={y} rx={rx} ry={rx} width={width} height={rowHeight - 12} fill={color} opacity={0.98} />
                      )}

                      {/* drag preview (while dragging/resizing) */}
                      {dragPreview && dragPreview.id === w.id && (() => {
                        const px1 = msToX(dragPreview.startMs);
                        const px2 = msToX(dragPreview.endMs);
                        const pwidth = clampBarWidth(px1, px2);
                        return (
                          <>
                            <rect x={px1} y={y} rx={rx} ry={rx} width={pwidth} height={rowHeight - 12} fill={color} opacity={0.6} />
                            <rect x={px1} y={y} rx={rx} ry={rx} width={pwidth} height={rowHeight - 12} fill="none" stroke="#000" strokeWidth={1} opacity={0.12} />
                          </>
                        );
                      })()}

                      {/* realized overlay removed per UX request */}

                      {/* show realisasi/progress overlay when item is IN_PROGRESS and progress available, or COMPLETED (show 100%) */}
                          {((statusNorm === 'IN_PROGRESS' && progressVal !== null) || statusNorm === 'COMPLETED') && (() => {
                            const isCompleted = statusNorm === 'COMPLETED';
                            const showVal = isCompleted ? 1 : (progressVal ?? 0);
                            const progWidth = Math.max(minBarWidthPx, width * showVal);
                            const pctText = Math.round(showVal * 100) + '%';
                            return (
                              <>
                                <rect x={x1} y={y} rx={rx} ry={rx} width={progWidth} height={rowHeight - 12} fill={progressColor} opacity={0.72} />
                                {progWidth > 28 ? (
                                  <text x={x1 + 6} y={y + (rowHeight - 12) / 2 + 4} fontSize={12} fill={progressTextColorInside} fontWeight={700}>{pctText}</text>
                                ) : (
                                  <text x={x2 + 6} y={y + (rowHeight - 12) / 2 + 4} fontSize={12} fill={color} fontWeight={700}>{pctText}</text>
                                )}
                              </>
                            );
                          })()}
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Details Dialog for selected work order (match WorkOrderList dialog) */}
      <Dialog open={Boolean(selected)} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        <DialogTitle>Details — {selected?.doc_no ?? selected?.id}</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ fontWeight: 700 }}>{selected.asset_name ?? '-'}</div>
              <div style={{ color: '#666' }}>{selected.description ?? '-'}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Location: {selected.raw?.vendor_cabang ?? selected.raw?.site ?? ''}</div>
              <div style={{ color: '#666', fontSize: 13 }}>
                Start: {formatUtcDisplay(
                  // prefer normalized top-level start_date, then try common raw fields
                  selected.start_date ?? selected.raw?.start_date ?? selected.raw?.start_date_sql ?? selected.raw?.date_start ?? null
                )}
              </div>
              <div style={{ color: '#666', fontSize: 13 }}>
                End: {formatUtcDisplay(
                  selected.end_date ?? selected.raw?.end_date ?? selected.raw?.end_date_sql ?? selected.raw?.up_date ?? null
                )}
              </div>
              {normalizeStatusRaw((selected as any).status ?? selected.raw?.status ?? '') === 'COMPLETED' && (
                <>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    Realisasi Start: {(() => {
                      const ex = extractRealisasi(selected);
                      const fallback = normalizeDateLike(selected.start_date ?? selected.raw?.start_date ?? selected.raw?.date_start ?? selected.raw?.start_downtime ?? selected.raw?.started_at ?? null);
                      const display = ex.s ?? fallback;
                      return displayRealisasi(display, '-');
                    })()}
                  </div>
                  <div style={{ color: '#666', fontSize: 13 }}>
                    Realisasi End: {(() => {
                      const ex = extractRealisasi(selected);
                      const fallback = normalizeDateLike(selected.end_date ?? selected.raw?.end_date ?? selected.raw?.date_end ?? selected.raw?.up_date ?? selected.raw?.ended_at ?? null);
                      const display = ex.e ?? fallback;
                      return displayRealisasi(display, '-');
                    })()}
                  </div>
                </>
              )}
              <div style={{ marginTop: 8 }}>{renderStatusBadge((selected as any).status ?? selected.raw?.status ?? 'PREPARATION')}</div>
              {typeof (selected as any).progress === 'number' && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{Math.round(Math.max(0, Math.min(1, (selected as any).progress || 0)) * 100)}%</Typography>
                  <LinearProgress variant="determinate" value={Math.round(Math.max(0, Math.min(1, (selected as any).progress || 0)) * 100)} sx={{ height: 8, borderRadius: 2, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: getColorForStatus((selected as any).status ?? selected.raw?.status ?? 'PREPARATION') } }} />
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
          {selected && normalizeStatusRaw((selected as any).status ?? selected.raw?.status ?? '') !== 'COMPLETED' && (
            <Tooltip title="Edit Tanggal">
              <IconButton onClick={() => {
                if (!selected) return;
                setEditing(selected);
                setEditStartInput(toInputDatetime(selected.start_date));
                setEditEndInput(toInputDatetime(selected.end_date));
                setEditNote('');
                setSelected(null);
              }}>
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={`Lihat Task`}>
            <IconButton onClick={() => { if (!selected) return; openTaskModal(selected); setSelected(null); }}>
              <ListAltOutlinedIcon />
            </IconButton>
          </Tooltip>
          {selected && normalizeStatusRaw((selected as any).status ?? selected.raw?.status ?? '') === 'ASSIGNED' && (
            <Button size="small" variant="contained" color="primary" onClick={async () => {
              if (!selected) return;
              if (!confirm('Yakin ingin deploy Work Order ini?')) return;
              setDeployLoading(true);
              try {
                // Use server-side deploy endpoint to ensure assignments and status updates
                await apiClient(`/work-orders/${encodeURIComponent(String(selected.id))}/deploy`, { method: 'POST' });
                await load();
                setSelected(null);
                setSnackMsg('Deploy berhasil');
                setSnackSeverity('success');
                setSnackOpen(true);
              } catch (err: any) {
                console.error('deploy error', err);
                const msg = err?.body?.message || err?.message || String(err);
                setSnackMsg('Gagal deploy: ' + msg);
                setSnackSeverity('error');
                setSnackOpen(true);
              } finally {
                setDeployLoading(false);
              }
            }}>{deployLoading ? 'Processing...' : 'Deploy'}</Button>
          )}
          {selected && normalizeStatusRaw((selected as any).status ?? selected.raw?.status ?? '') === 'DEPLOYED' && (
            <Button size="small" variant="outlined" color="secondary" onClick={async () => {
              if (!selected) return;
              if (!confirm('Yakin ingin undeploy Work Order ini?')) return;
              setUndeployLoading(true);
              try {
                await apiClient(`/work-orders/${encodeURIComponent(String(selected.id))}/undeploy`, { method: 'POST' });
                await load();
                setSelected(null);
                setSnackMsg('Undeploy berhasil');
                setSnackSeverity('success');
                setSnackOpen(true);
              } catch (err: any) {
                console.error('undeploy error', err);
                const msg = err?.body?.message || err?.message || String(err);
                setSnackMsg('Gagal undeploy: ' + msg);
                setSnackSeverity('error');
                setSnackOpen(true);
              } finally {
                setUndeployLoading(false);
              }
            }}>{undeployLoading ? 'Processing...' : 'Undeploy'}</Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>

      {/* Edit Dates Dialog (styled) */}
      <Dialog open={Boolean(editing)} onClose={() => setEditing(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Dates — {editing?.doc_no ?? editing?.id}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Start Date & Time"
              type="datetime-local"
              size="small"
              value={editStartInput}
              onChange={e => setEditStartInput(e.target.value)}
              disabled={['DEPLOYED', 'IN_PROGRESS'].includes(normalizeStatusRaw(editing?.status ?? editing?.raw?.status ?? ''))}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <div style={{ fontSize: 12, color: '#666' }}>Current: {formatUtcDisplay(editing?.start_date)}</div>

            <TextField
              label="End Date & Time"
              type="datetime-local"
              size="small"
              value={editEndInput}
              onChange={e => setEditEndInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <div style={{ fontSize: 12, color: '#666' }}>Current: {formatUtcDisplay(editing?.end_date)}</div>
            <TextField
              label="Keterangan (opsional)"
              placeholder="Keterangan (opsional)"
              multiline
              rows={4}
              value={editNote}
              onChange={e => setEditNote(e.target.value)}
              fullWidth
              size="small"
            />
            {Array.isArray(dateHistory) && dateHistory.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>History perubahan tanggal</div>
                <div style={{ maxHeight: 240, overflow: 'auto' }}>
                  {dateHistory.map((h, idx) => (
                    <div key={h.id || idx} style={{ padding: 12, borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 13, color: '#333', fontWeight: 700 }}>{h.changed_at ? new Date(h.changed_at).toLocaleString() : '-'}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>{h.changed_by ? `${h.changed_by.nipp ?? h.changed_by.id ?? '-'} • ${h.changed_by.name ?? h.changed_by.email ?? '-'}` : '-'}</div>
                      </div>
                      <div style={{ marginTop: 6, color: '#444' }}>
                        <div>Start: {h.old_start ? formatUtcDisplay(h.old_start) : '-'} → {h.new_start ? formatUtcDisplay(h.new_start) : '-'}</div>
                        <div>End: {h.old_end ? formatUtcDisplay(h.old_end) : '-'} → {h.new_end ? formatUtcDisplay(h.new_end) : '-'}</div>
                      </div>
                      {h.note && <div style={{ marginTop: 8, fontSize: 13, color: '#555' }}>Catatan: {h.note}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditing(null)} disabled={editLoading}>Batal</Button>
          <Button variant="contained" color="primary" onClick={async () => {
            function datetimeLocalToSql(local?: string | null) {
              if (!local) return null;
              const rx = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
              const m = rx.exec(local);
              if (!m) return null;
              const [, yy, mm, dd, hh, mi] = m as any;
              return `${yy}-${mm}-${dd} ${hh}:${mi}:00`;
            }
            if (editStartInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editStartInput)) { alert('Start date tidak valid'); return; }
            if (editEndInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editEndInput)) { alert('End date tidak valid'); return; }
            const sSql = datetimeLocalToSql(editStartInput || null);
            const eSql = datetimeLocalToSql(editEndInput || null);
            await saveEdit(String(editing!.id), sSql, eSql);
          }} disabled={editLoading}>{editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
        </DialogActions>
      </Dialog>

      {/* Task Modal (copied/adapted from WorkOrderList) */}
      {taskModal.open && taskModal.wo && (
        <Dialog open={true} onClose={closeTaskModal} fullWidth maxWidth="md" scroll="paper">
          {(techLoading || taskLoading) && <LinearProgress />}
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              Task - {taskModal.wo.doc_no ?? taskModal.wo.id}
              <div style={{ color: '#666', fontSize: 13 }}>{taskModal.wo.description}</div>
              <div style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Start: {formatUtcDisplay(taskModal.wo.start_date)} &nbsp; End: {formatUtcDisplay(taskModal.wo.end_date)}</div>
              <div style={{ color: '#666', fontSize: 13 }}>{(() => {
                const ex = extractRealisasi(taskModal.wo);
                return `Realisasi Start: ${displayRealisasi(ex.s)} • Realisasi End: ${displayRealisasi(ex.e, '-')}`;
              })()}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {currentUser === undefined ? (
                <span style={{ color: '#666' }}>Checking auth...</span>
              ) : currentUser === null ? (
                <span style={{ color: '#c00' }}>Not authenticated</span>
              ) : (
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{currentUser.name || currentUser.username || currentUser.email}</div>
                  <div style={{ color: '#666', fontSize: 12 }}>{currentUser.email} — {currentUser.role ?? currentUser.type}</div>
                </div>
              )}
              <IconButton onClick={closeTaskModal}><CloseIcon /></IconButton>
            </div>
          </DialogTitle>
          <DialogContent dividers>
            <div style={{ marginBottom: 8 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                <colgroup>
                  <col style={{ width: '50px' }} />
                  <col />
                  <col style={{ width: '110px' }} />
                  <col style={{ width: '340px' }} />
                </colgroup>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>No</th>
                    <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Task Name</th>
                    <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd', textAlignLast: 'right' }}>Duration (min)</th>
                    {shouldShowAssignColumn(taskModal.wo) && (
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Assign technicians</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray((taskModal.wo as any).tasks) && (taskModal.wo as any).tasks.map((act: any, idx: number) => {
                    const taskKey = String(act.id ?? act.task_id ?? String(idx));
                    const selected = selectedAssignees[taskKey] || [];
                    function taskHasRealisasi(t: any) {
                      try {
                        const lists = ['realisasi','realisasis','realisasi_list','realisasi_entries','realisasiItems','realisasi_items','realisasiEntries'];
                        for (const k of lists) {
                          const v = t[k];
                          if (Array.isArray(v) && v.length > 0) return true;
                        }
                        if (Array.isArray(t.assignments)) {
                          for (const a of t.assignments) {
                            if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                            if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                            const s = (a.status || a.state || '').toString().toUpperCase();
                            if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                          }
                        }
                        const woAssigns = Array.isArray((taskModal.wo as any)?.assignments) ? (taskModal.wo as any).assignments : [];
                        if (woAssigns.length > 0) {
                          for (const a of woAssigns) {
                            const aTaskId = (a.task_id ?? a.taskId ?? a.task?.id) ? String(a.task_id ?? a.taskId ?? a.task?.id) : null;
                            const tId = (t.id ?? t.task_id ?? t.external_id) ? String(t.id ?? t.task_id ?? t.external_id) : null;
                            if (aTaskId && tId && aTaskId === tId) {
                              if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                              if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                              const s = (a.status || a.state || '').toString().toUpperCase();
                              if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                            }
                            const aName = (a.task_name || a.taskName || a.task?.name || '').toString().trim().toLowerCase();
                            const tName = (t.name || t.task_name || t.taskName || '').toString().trim().toLowerCase();
                            if (aName && tName && aName === tName) {
                              if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                              if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                              const s2 = (a.status || a.state || '').toString().toUpperCase();
                              if (s2.includes('COMP') || s2.includes('VERIF') || s2.includes('DONE') || s2.includes('APPROV')) return true;
                            }
                          }
                        }
                        if (t.completed === true || t.is_completed === true || String(t.status || '').toUpperCase().includes('COMP')) return true;
                        if (t.completed_at || t.realisasi_at || t.approved_at) return true;
                      } catch (e) {}
                      return false;
                    }
                    const hasRealisasi = taskHasRealisasi(act) || Boolean(act.has_realisasi || act.realisasi_count);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid #f1f1f1' }}>
                        <td style={{ padding: 12, verticalAlign: 'top' }}>{act.task_number ?? idx + 1}</td>
                        <td style={{ padding: 12, verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <div style={{ fontWeight: 700 }}>{act.name ?? act.task_name ?? '-'}</div>
                            {hasRealisasi ? (
                              <span style={{ background: '#10b981', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Realisasi ✓</span>
                            ) : (
                              (() => {
                                const pendingCount = Number(act.pending_realisasi_count || act.pendingCount || 0);
                                const hasPending = Boolean(act.has_pending || pendingCount > 0);
                                if (hasPending) {
                                  return <span style={{ background: '#f59e0b', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Pending{pendingCount ? ` (${pendingCount})` : ''}</span>;
                                }
                                return <span style={{ background: '#64748b', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Belum Realisasi</span>;
                              })()
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>ID: {act.id ?? '-'}</div>
                          {Array.isArray(act.assignments) && act.assignments.length > 0 && (
                              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {act.assignments.map((asgn: any) => (
                                  <div
                                    key={asgn.id}
                                    style={{ background: '#eef2ff', padding: '4px 8px', borderRadius: 6, display: 'flex', gap: 8, alignItems: 'center' }}
                                  >
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{asgn.user?.name ?? asgn.user?.nipp ?? asgn.user?.email ?? asgn.assigned_to ?? 'Unknown'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </td>
                        <td style={{ padding: 12, verticalAlign: 'top', textAlign: 'right' }}>{(act.duration_min ?? act.task_duration) ?? '-'}</td>
                        {shouldShowAssignColumn(taskModal.wo) ? (
                          <td style={{ padding: 12, verticalAlign: 'top' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <Autocomplete
                                multiple
                                options={technicians || []}
                                getOptionLabel={(t: any) => (t.name || t.nipp || t.email || '').toString()}
                                filterSelectedOptions
                                value={(selectedAssignees[taskKey] || []).map((id: any) => technicians.find((t: any) => t.id === id)).filter(Boolean)}
                                onChange={(e, newVal) => setSelectedAssignees(prev => ({ ...prev, [taskKey]: newVal.map((n: any) => n.id) }))}
                                renderInput={(params) => <TextField {...params} placeholder="Cari teknisi (nama / email / id)" size="small" />}
                              />

                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                                  {(technicians || []).slice(0, 200).map((t: any) => {
                                    const isSel = (selectedAssignees[taskKey] || []).includes(t.id);
                                    return (
                                      <Chip
                                        key={t.id}
                                        label={(t.name || t.nipp || t.email || '').toString()}
                                        onClick={() => {
                                          setSelectedAssignees(prev => {
                                            const cur = new Set(prev[taskKey] || []);
                                            if (cur.has(t.id)) cur.delete(t.id); else cur.add(t.id);
                                            return { ...prev, [taskKey]: Array.from(cur) };
                                          });
                                        }}
                                        clickable
                                        color={isSel ? 'primary' : 'default'}
                                        variant={isSel ? 'filled' : 'outlined'}
                                        size="small"
                                        sx={{ marginRight: 0.5 }}
                                      />
                                    );
                                  })}
                                </div>

                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-start', marginTop: 8 }}>
                                {currentUser === undefined ? (
                                  <Button size="small" disabled>Checking...</Button>
                                ) : currentUser === null ? (
                                  <>
                                    <Button size="small" variant="contained" color="primary" onClick={() => { window.location.href = '/login'; }}>Login to assign</Button>
                                    <Button size="small" onClick={() => { setSelectedAssignees(prev => ({ ...prev, [taskKey]: [] })); }}>Clear</Button>
                                  </>
                                ) : !['DEPLOYED'].includes(((taskModal.wo as any)?.status ?? '').toString()) ? (
                                  <>
                                    <Button size="small" variant="contained" disabled={Boolean(assignLoading[taskKey])} onClick={async () => {
                                      const ass = selectedAssignees[taskKey] || [];
                                      if (!ass || ass.length === 0) { alert('Pilih minimal 1 teknisi'); return; }
                                      setAssignLoading(prev => ({ ...prev, [taskKey]: true }));
                                      try {
                                        const unique = Array.from(new Set(ass));
                                        await Promise.all(unique.map((uid) => apiClient(`/tasks/${encodeURIComponent(String(act.id ?? act.task_id ?? String(idx)))}/assign`, { method: 'POST', body: { userId: uid, assignedBy: currentUser?.id } } as any)));
                                        alert('Assignment created');
                                        try {
                                          const res = await apiClient(`/work-orders/${encodeURIComponent(String(taskModal.wo?.id))}`);
                                          const woDetail = res?.data ?? res;
                                          const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(String(taskModal.wo?.id))}/tasks`);
                                          const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
                                          setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), ...woDetail, tasks } } as any));
                                        } catch (e) { console.warn('refresh tasks after assign failed', e); }
                                        try { load(); } catch (e) {}
                                      } catch (err) {
                                        console.error('assign error', err);
                                        alert(err?.body?.message || err?.message || 'Assignment failed');
                                      } finally {
                                        setAssignLoading(prev => ({ ...prev, [taskKey]: false }));
                                      }
                                    }}>{assignLoading[taskKey] ? <CircularProgress size={16} /> : 'Assign'}</Button>
                                    <Button size="small" onClick={() => { setSelectedAssignees(prev => ({ ...prev, [taskKey]: [] })); }}>Clear</Button>
                                  </>
                                ) : (
                                  <Button size="small" disabled>Deployed</Button>
                                )}
                              </div>
                            </div>
                          </td>
                        ) : (
                          <td style={{ padding: 12, verticalAlign: 'top' }} />
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeTaskModal}>Close</Button>
          </DialogActions>
        </Dialog>
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
