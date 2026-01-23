'use client';
import { useEffect, useState } from 'react';
import apiClient from '../lib/api-client';
import { parseToUtcDate, formatUtcToZone, toInputDatetime } from '../lib/date-utils';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export type Activity = {
  id?: string;
  task_name?: string;
  task_number?: number;
  task_duration?: number;
  [key: string]: any;
};

export type WorkOrder = {
  id: string;
  doc_no?: string;
  sigap_id?: number;
  vendor_cabang?: string; // location field from external API
  work_type?: string;
  type_work?: string;
  date_doc?: string;
  asset_name?: string;
  description?: string;
  start_date?: string | null;
  end_date?: string | null;
  raw?: {
    activities?: Activity[];
    [key: string]: any;
  };
  tasks?: any[];
  created_at?: string;
  progress?: number;
};

type Props = {
  onRefreshRequested?: (fn: () => Promise<void>) => void;
  excludeWorkType?: string;
};

export default function WorkOrderList({ onRefreshRequested, excludeWorkType }: Props) {
  // format stored dates (possibly SQL 'YYYY-MM-DD HH:mm:ss' without timezone)
  function formatUtcDisplay(raw?: string | null) {
    if (!raw) return '-';
    return formatUtcToZone(raw);
  }

  function resolveStartDate(w: WorkOrder) {
    return (w.start_date as any) ?? (w as any).date_start ?? w.raw?.date_start ?? w.raw?.start_date ?? null;
  }

  function resolveEndDate(w: WorkOrder) {
    return (w.end_date as any) ?? (w as any).date_end ?? w.raw?.date_end ?? w.raw?.end_date ?? null;
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
  const [list, setList] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [locations, setLocations] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [editing, setEditing] = useState<WorkOrder | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editNote, setEditNote] = useState<string>('');
  const [dateHistory, setDateHistory] = useState<any[]>([]);

  const [taskModal, setTaskModal] = useState<{ open: boolean; wo: WorkOrder | null }>({ open: false, wo: null });
  const [technicians, setTechnicians] = useState<Array<any>>([]);
  const [techQuery, setTechQuery] = useState<string>('');
  const [selectedAssignees, setSelectedAssignees] = useState<Record<string, string[]>>({});
  const [currentUser, setCurrentUser] = useState<any | null>(undefined);
  const [editStartInput, setEditStartInput] = useState<string>('');
  const [editEndInput, setEditEndInput] = useState<string>('');

  // Snackbar / Toast state
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState('');
  const [snackSeverity, setSnackSeverity] = useState<'success'|'info'|'warning'|'error'>('info');
  function showToast(message: string, severity: 'success'|'info'|'warning'|'error' = 'info') {
    setSnackMsg(String(message || ''));
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  async function load(p = page, query = q, location = locationFilter, date = dateFilter) {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      params.set('page', String(p));
      params.set('pageSize', String(pageSize));
      if (location) params.set('site', location);
      if (date) params.set('date', date);
      console.debug('[WorkOrderList] loading', { url: `/work-orders?${params.toString()}`, p, query, location, date });
      // support excluding work_type when requested by parent
      if (excludeWorkType) params.set('exclude_work_type', excludeWorkType);
      const res = await apiClient(`/work-orders?${params.toString()}`);
      console.debug('[WorkOrderList] api response', res);
      const data = Array.isArray(res) ? res : (res?.data ?? []);
      const meta = (res && typeof res === 'object' && !Array.isArray(res)) ? (res.meta ?? { page: p, pageSize, total: 0 }) : { page: p, pageSize, total: 0 };
      const listData = Array.isArray(data) ? data : [];
      // derive available locations from returned (unfiltered) data
      const allListData = listData;
      const locs = Array.from(new Set(allListData.map((w: WorkOrder) => (w.vendor_cabang ?? w.raw?.vendor_cabang ?? '').toString().trim()).filter(Boolean)));
      const sts = Array.from(new Set(allListData.map((w: WorkOrder) => normalizeStatusRaw((w as any).status ?? w.raw?.status ?? 'PREPARATION').toString().trim()).filter(Boolean)));
      setStatuses(sts);
      setLocations(locs);
      // apply client-side filtering by location (case-insensitive) so filter works
      let displayed = allListData;
      console.debug('test ', allListData);
      if (location) {
        const low = location.toString().toLowerCase().trim();
        displayed = allListData.filter((w: WorkOrder) => {
          const v = (w.vendor_cabang ?? w.raw?.vendor_cabang ?? '').toString().toLowerCase().trim();
          return v === low;
        });
      }
      // apply client-side filtering by selected statuses (if any)
      if (selectedStatuses && selectedStatuses.length > 0) {
        const normSet = new Set(selectedStatuses.map(s => s.toString().toUpperCase().replace(/[-\s]/g, '_')));
        displayed = displayed.filter((w: WorkOrder) => {
          const sRaw = normalizeStatusRaw((w as any).status ?? w.raw?.status ?? 'PREPARATION').toString();
          const sNorm = sRaw.toString().toUpperCase().replace(/[-\s]/g, '_');
          return normSet.has(sNorm);
        });
      }

      // Default behavior: when no status selected, hide COMPLETED items
      if (!selectedStatuses || selectedStatuses.length === 0) {
        displayed = displayed.filter((w: WorkOrder) => {
          const sRaw = normalizeStatusRaw((w as any).status ?? w.raw?.status ?? 'PREPARATION').toString();
          const sNorm = sRaw.toString().toUpperCase().replace(/[-\s]/g, '_');
          return sNorm !== 'COMPLETED';
        });
      }
      setList(displayed);
      setTotal(typeof meta.total === 'number' ? meta.total : 0);
    } catch (err: any) {
      console.error('load work orders', err);
      setError(err?.body?.message || err?.message || 'Gagal memuat');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1, q, locationFilter, dateFilter); setPage(1); }, [q, locationFilter, selectedStatuses, dateFilter]);

  // expose the refresh function to parent via callback (so WorkOrderForm can trigger it)
  useEffect(() => {
    if (typeof onRefreshRequested === 'function') {
      onRefreshRequested(async () => {
        await load(1, q, locationFilter, dateFilter);
        setPage(1);
      });
    }
    // we intentionally omit onRefreshRequested from deps to only register once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Responsive: show stacked card view on small screens
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  useEffect(() => {
    function check() { setIsSmallScreen(typeof window !== 'undefined' ? window.innerWidth < 800 : false); }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // per-row expand/collapse state (used to show/hide long descriptions)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  function toggleRow(id: string) {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function blurActive() {
    try {
      const el = (typeof document !== 'undefined') ? (document.activeElement as HTMLElement | null) : null;
      if (el && typeof el.blur === 'function') el.blur();
    } catch (e) {
      // ignore
    }
  }

  // modal for showing full details when Expand is clicked in table view
  const [modalRow, setModalRow] = useState<WorkOrder | null>(null);
  function openRowModal(w: WorkOrder) { blurActive(); setModalRow(w); }
  function closeRowModal() { setModalRow(null); }


  function onPrev() { if (page > 1) { setPage(p => { const np = p - 1; load(np); return np; }); } }
  function onNext() { const maxPage = Math.ceil(total / pageSize); if (page < maxPage) { setPage(p => { const np = p + 1; load(np); return np; }); } }

  function openEdit(w: WorkOrder) {
    blurActive();
    setEditing(w);
    setEditNote('');
    setEditStartInput(toInputDatetime(w.start_date));
    setEditEndInput(toInputDatetime(w.end_date));
    // load date history for this workorder (if authenticated)
    (async () => {
      try {
        const h = await apiClient(`/work-orders/${encodeURIComponent(w.id)}/date-history`);
        const rows = h?.data ?? h;
        if (Array.isArray(rows)) setDateHistory(rows);
        else setDateHistory([]);
      } catch (e) {
        setDateHistory([]);
      }
    })();
  }

  function openTaskModal(w: WorkOrder) {
    console.debug('[openTaskModal]');
    console.debug('workorder:', w);
    // Require start_date on work order. If missing, prompt user to fill dates first.
    if (!w.start_date) {
      showToast('Work Order belum memiliki Start Date. Isi Start Date dan End Date terlebih dahulu.', 'warning');
      setEditing(w);
      return;
    }

    // reset technician search and selections when opening modal
    setTechQuery('');
    setTechnicians([]);
    setSelectedAssignees({});
    blurActive();
    setTaskModal({ open: true, wo: w });
    // load technicians (users with role=technician) and workorder detail (assignments)
    (async () => {
      let filteredTechs: any[] = [];
      try {
        // determine workorder site/location (use vendor_cabang or raw.site)
        const woSiteRaw = (w.vendor_cabang ?? w.raw?.vendor_cabang ?? w.raw?.site ?? '');
        const woSite = (() => {
          const v = woSiteRaw;
          if (v == null) return '';
          if (typeof v === 'object') return String(v.name ?? v.code ?? v.id ?? v.site ?? '');
          return String(v);
        })().toLowerCase().trim();
        // determine assignment date/time from workorder start_date (must exist)
        // parse stored start_date robustly and interpret SQL datetimes without timezone as UTC
        const pad = (n: number) => String(n).padStart(2, '0');

        const sdUtc = parseToUtcDate(String(w.start_date));
        if (!sdUtc) {
          showToast('Start Date tidak valid. Isi Start Date yang benar terlebih dahulu.', 'error');
          setEditing(w);
          return;
        }
        const assignDate = `${sdUtc.getUTCFullYear()}-${pad(sdUtc.getUTCMonth() + 1)}-${pad(sdUtc.getUTCDate())}`;
        const assignTime = `${pad(sdUtc.getUTCHours())}:${pad(sdUtc.getUTCMinutes())}`;
        console.debug('[openTaskModal] assignDate/time (local)', { assignDate, assignTime, raw: w.start_date });
        const schedUrl = `/scheduled-technicians?date=${encodeURIComponent(assignDate)}&time=${encodeURIComponent(assignTime)}&timeIsLocal=1` + (woSite ? `&site=${encodeURIComponent(woSite)}` : '');
        console.debug(schedUrl);

        try {
          console.debug('[openTaskModal] fetching scheduled technicians', { schedUrl });
          const sched = await apiClient(schedUrl);
          console.debug(sched);

          const schedRows = Array.isArray(sched) ? sched : (sched?.data ?? []);
          console.debug('[openTaskModal] scheduled-technicians response', { count: Array.isArray(schedRows) ? schedRows.length : 0 });
          if (schedRows && schedRows.length > 0) {
            filteredTechs = schedRows;
            console.debug('[openTaskModal] using scheduled-technicians sample', (schedRows as any[]).slice(0, 5));
          } else {
            // fallback: load site-filtered technicians
            // console.log('[openTaskModal] scheduled-technicians empty — falling back to /users?role=technician');
            // const techs = await apiClient('/users?role=technician');
            // const list = Array.isArray(techs) ? techs : (techs?.data ?? []);
            // console.log('[openTaskModal] /users?role=technician response', { count: Array.isArray(list) ? list.length : 0 });
            // if (woSite) {
            //   filteredTechs = list.filter((t: any) => {
            //     const tSite = String(t.site ?? t.vendor_cabang ?? t.location ?? '').toLowerCase().trim();
            //     return tSite === woSite;
            //   });
            //   console.log('[openTaskModal] after site-filtering technicians', { count: filteredTechs.length });
            // } else {
            //   filteredTechs = list;
            // }
            filteredTechs = schedRows;
          }
        } catch (e) {
          console.warn('scheduled-technicians fetch failed, falling back', e);
          const techs = await apiClient('/users?role=technician');
          const list = Array.isArray(techs) ? techs : (techs?.data ?? []);
          console.debug('[openTaskModal] fallback /users?role=technician response', { count: Array.isArray(list) ? list.length : 0 });
          filteredTechs = list;
        }

        console.debug('[openTaskModal] final filteredTechs', { count: filteredTechs.length, sample: filteredTechs.slice(0, 5) });
        const sorted = Array.isArray(filteredTechs) ? filteredTechs.slice().sort((a:any,b:any)=>{
          const na = String(a?.name || a?.nama || a?.nipp || a?.email || a?.id || '').toLowerCase();
          const nb = String(b?.name || b?.nama || b?.nipp || b?.email || b?.id || '').toLowerCase();
          if (na < nb) return -1; if (na > nb) return 1; return 0;
        }) : [];
        setTechnicians(sorted);
      } catch (e) {
        console.warn('Failed to load technicians from shift assignments', e);
        setTechnicians([]);
        filteredTechs = [];
      }

      // load full workorder detail to get existing assignments and tasks
      try {
        const res = await apiClient(`/work-orders/${encodeURIComponent(w.id)}`);
        const woDetail = res?.data ?? res;
        // load tasks for this work order (fallback to raw.activities if no tasks)
        try {
          console.debug('[openTaskModal] fetching tasks for workorder', { workOrderId: w.id });
          const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(w.id)}/tasks`);
          const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
          console.debug('[openTaskModal] tasks fetch result', { count: Array.isArray(tasks) ? tasks.length : 0, sample: (tasks as any[]).slice(0, 5) });
          // attach tasks to woDetail for modal rendering
          woDetail.tasks = tasks;
        } catch (e) {
          console.debug('[openTaskModal] /tasks fetch failed, falling back to raw.activities', e);
          // fallback: map raw.activities -> tasks for display
          const acts = Array.isArray(woDetail.raw?.activities) ? woDetail.raw.activities : [];
          woDetail.tasks = acts.map((act: any, idx: number) => ({ id: `raw-${idx}`, name: act.task_name || act.name || `Task ${idx + 1}`, duration_min: act.task_duration }));
        }
        // update modal workorder with full details (assignments)
        setTaskModal({ open: true, wo: woDetail });

        // build selectedAssignees from task.assignments for each task (tasks came from /work-orders/:id/tasks)
        const nextSelected: Record<string, string[]> = {};
        const taskRows = Array.isArray(woDetail.tasks) ? woDetail.tasks : [];
        // only pre-check assignments whose assignee is present in the filtered technician list
        const techIds = new Set((Array.isArray(filteredTechs) ? filteredTechs : []).map(t => String(t.id)));
        console.debug('[openTaskModal] building selectedAssignees from task.assignments', { taskCount: taskRows.length, techIdsCount: techIds.size });
        for (const t of taskRows) {
          const key = String(t.id ?? t.task_id ?? t.external_id ?? '');
          if (!key) continue;
          const assigns = Array.isArray(t.assignments) ? t.assignments : [];
          const keeps: string[] = [];
          for (const a of assigns) {
            const assId = String(a?.user?.id ?? a.user_id ?? a.userId ?? '');
            if (!assId) continue;
            if (!techIds.has(assId)) {
              console.debug('[openTaskModal] skipping assignment because assignee not in filtered technicians', { assId, key });
              continue;
            }
            if (!keeps.includes(assId)) keeps.push(assId);
          }
          if (keeps.length > 0) nextSelected[key] = keeps;
        }
        console.debug('[openTaskModal] selectedAssignees prepared', nextSelected);
        setSelectedAssignees(nextSelected);
      } catch (err) {
        console.warn('Failed to load workorder detail', err);
      }

      // load current user info (auth status)
      try {
        const me = await apiClient('/auth/me');
        setCurrentUser(me?.data ?? me);
      } catch (err) {
        // if unauthorized or error, mark as not authenticated
        setCurrentUser(null);
      }
    })();
  }

  function closeTaskModal() {
    setTaskModal({ open: false, wo: null });
    // reset tech query so checklist isn't filtered on next open
    setTechQuery('');
    // refresh work order list so changes made in the modal are reflected
    try {
      load(page, q);
    } catch (e) {
      console.warn('Failed to refresh work order list after closing modal', e);
    }
  }

  async function saveEdit(id: string, start_date?: string | null, end_date?: string | null) {
    setEditLoading(true);
    try {
      const body: any = {};
      // accept ISO strings (from datetime-local) or null
      if (start_date !== undefined) body.start_date = start_date || null;
      if (end_date !== undefined) body.end_date = end_date || null;
        if (editNote && editNote.trim().length) body.note = editNote.trim();
      await apiClient(`/work-orders/${encodeURIComponent(id)}`, { method: 'PATCH', body });
      load(page, q);
      setEditing(null);
    } catch (err: any) {
      console.error('save edit', err);
      showToast('Gagal menyimpan: ' + (err?.body?.message || err?.message), 'error');
    } finally {
      setEditLoading(false);
    }
  }

  // use shared `toInputDatetime` from web/lib/date-utils

  function parseDdMMyyyyToIso(input?: string | null) {
    if (!input) return null;
    const s = input.toString().trim();
    // expect 'dd/mm/yyyy HH:MM' or 'dd/mm/yyyy'
    const rx = /^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2}))?$/;
    const m = rx.exec(s);
    if (!m) return null;
    const dd = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const yyyy = parseInt(m[3], 10);
    const hh = m[4] ? parseInt(m[4], 10) : 0;
    const mi = m[5] ? parseInt(m[5], 10) : 0;
    const dt = new Date(Date.UTC(yyyy, mm - 1, dd, hh, mi, 0));
    if (isNaN(dt.getTime())) return null;
    return dt.toISOString();
  }

  function getColorForStatus(s: string) {
    // assume caller passes normalized status string; avoid calling normalizeStatusRaw again
    const k = String(s || '').toUpperCase().replace(/[-\s]/g, '_');
    switch (k) {
      case 'PREPARATION': return '#64748b';
      case 'ASSIGNED': return '#60a5fa';
      case 'DEPLOYED': return '#db2777';
      case 'IN_PROGRESS': return '#f97316';
      case 'IN-PROGRESS': return '#f97316';
      case 'COMPLETED': return '#10b981';
      case 'OPEN': return '#64748b';
      case 'CANCELLED': return '#ef4444';
      case 'CLOSED': return '#334155';
      default: return '#6b7280';
    }
  }

  const STATUS_OPTIONS = [
    'PREPARATION',
    'ASSIGNED',
    'DEPLOYED',
    'IN PROGRESS',
    'COMPLETED'
  ];

  function shouldShowAssignColumn(wo: WorkOrder | null) {
    const s = ((wo as any)?.status ?? wo?.raw?.status ?? '').toString().toUpperCase().replace(/[-\s]/g, '_');
    return !(s === 'IN_PROGRESS' || s === 'COMPLETED');
  }

  function renderStatusBadge(s: string) {
    const n = normalizeStatusRaw(s);
    const color = getColorForStatus(n);
    return (
      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 999, background: color, color: 'white', fontSize: 8, fontWeight: 600 }}>
        {String(n).replace(/_/g, ' ')}
      </span>
    );
  }

  async function handleDeploy(woId: string) {
    try {
      await apiClient(`/work-orders/${encodeURIComponent(woId)}/deploy`, { method: 'POST' });
      // refresh modal and list
      const woRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}`);
      const woDetail = woRes?.data ?? woRes;
      const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}/tasks`);
      const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
      setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), ...woDetail, tasks } } as any));
      load(page, q);
    } catch (e) {
      console.error('deploy failed', e);
      showToast('Deploy gagal: ' + (e?.message || e), 'error');
    }
  }

  async function handleUndeploy(woId: string) {
    try {
      await apiClient(`/work-orders/${encodeURIComponent(woId)}/undeploy`, { method: 'POST' });
      const woRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}`);
      const woDetail = woRes?.data ?? woRes;
      const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(woId)}/tasks`);
      const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
      setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), ...woDetail, tasks } } as any));
      load(page, q);
    } catch (e) {
      console.error('undeploy failed', e);
      showToast('Undeploy gagal: ' + (e?.message || e), 'error');
    }
  }

  async function handleDeleteWorkOrder(woId: string) {
    if (!confirm('Hapus Work Order ini? Data terkait (tasks, assignments) mungkin juga terhapus. Lanjutkan?')) return;
    try {
      await apiClient(`/work-orders/${encodeURIComponent(woId)}`, { method: 'DELETE' });
      // close modal if open and matches
      if (modalRow && modalRow.id === woId) setModalRow(null);
      // refresh list
      await load(page, q);
      showToast('Work Order dihapus', 'success');
    } catch (err: any) {
      console.error('delete workorder failed', err);
      showToast('Hapus Work Order gagal: ' + (err?.body?.message || err?.message || err), 'error');
    }
  }

  async function handleDeleteTask(taskId: string) {
    if (!taskId) { showToast('Task id tidak tersedia', 'error'); return; }
    if (String(taskId).startsWith('raw-')) { showToast('Task mentah (raw) tidak dapat dihapus melalui UI', 'warning'); return; }
    if (!confirm('Hapus Task ini? Aksi tidak dapat dibatalkan. Lanjutkan?')) return;
    try {
      await apiClient(`/tasks/${encodeURIComponent(taskId)}`, { method: 'DELETE' });
      // refresh tasks for current workorder modal
      try {
        const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}/tasks`);
        const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
        setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), tasks } } as any));
      } catch (e) {
        console.warn('refresh tasks after delete failed', e);
      }
      // also refresh list
      await load(page, q);
      showToast('Task dihapus', 'success');
    } catch (err: any) {
      console.error('delete task failed', err);
      showToast('Hapus Task gagal: ' + (err?.body?.message || err?.message || err), 'error');
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Select
              value={locationFilter}
              onChange={e => setLocationFilter(String(e.target.value))}
              displayEmpty
              size="small"
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="">Semua Lokasi</MenuItem>
              {locations.map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>

            <Select
              multiple
              displayEmpty
              size="small"
              value={selectedStatuses}
              onChange={e => setSelectedStatuses(typeof e.target.value === 'string' ? e.target.value.split(',') : (e.target.value as string[]))}
              renderValue={(selected) => (
                selected && (selected as string[]).length > 0 ? (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(selected as string[]).map((val) => (
                      <Chip key={val} label={val} size="small" />
                    ))}
                  </Box>
                ) : 'Semua Status'
              )}
              sx={{ minWidth: 220 }}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt} value={opt}>
                  <Checkbox checked={selectedStatuses.indexOf(opt) > -1} />
                  {opt}
                </MenuItem>
              ))}
            </Select>

            <TextField
              placeholder="Search doc_no / asset / desc"
              value={q}
              onChange={e => setQ(e.target.value)}
              size="small"
              sx={{ flex: 1, minWidth: 240 }}
            />
            <TextField
              size="small"
              type="date"
              label="Date"
              value={dateFilter}
              onChange={e => {
                const v = String(e.target.value || '').trim();
                setDateFilter(v);
                try {
                  console.debug('[WorkOrderList] date changed, reloading', v);
                  load(1, q, locationFilter, v);
                  setPage(1);
                } catch (err) {
                  console.warn('failed reloading on date change', err);
                }
              }}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />

            <Button variant="contained" color="primary" size="small" onClick={() => load(1, q, locationFilter, dateFilter)} disabled={loading}>Search</Button>
            <Button variant="outlined" size="small" onClick={() => load(1, q, locationFilter, dateFilter)} disabled={loading}>Refresh</Button>

            <Box sx={{ alignSelf: 'center', ml: 'auto', color: 'text.secondary' }}>{total} item</Box>
          </Box>

          {loading ? <Typography variant="body2">Loading...</Typography> : null}
          {error ? <Typography variant="body2" color="error">{error}</Typography> : null}
        </div>

      <div>
        {isSmallScreen ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {list.map(w => {
              const activities = (w.raw?.activities ?? []) as Activity[];
              const statusRaw = normalizeStatusRaw((w as any).status ?? w.raw?.status ?? 'PREPARATION').toString();
              const statusNorm = statusRaw.toUpperCase().replace(/[-\s]/g, '_');
              return (
                <Paper key={w.id} sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Box sx={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{w.doc_no ?? w.id} — {w.asset_name ?? '-'}</div>
                      <div style={{ color: '#666', marginTop: 6 }}>{w.description ?? '-'}</div>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        <div style={{ fontSize: 12, color: '#666' }}>Start: {formatUtcDisplay(resolveStartDate(w))}</div>
                        <div style={{ fontSize: 12, color: '#666' }}>End: {formatUtcDisplay(resolveEndDate(w))}</div>
                        <div>{renderStatusBadge((w as any).status ?? w.raw?.status ?? 'PREPARATION')}</div>
                      </Box>
                      <div style={{ marginTop: 8 }}>
                        <div style={expandedRows[w.id] ? {} : { maxHeight: '3em', overflow: 'hidden' }}>{w.description ?? '-'}</div>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-start', mt: 1 }}>
                          <Button size="small" onClick={() => toggleRow(w.id)}>{expandedRows[w.id] ? 'Collapse' : 'Expand'}</Button>
                        </Box>
                      </div>
                      {statusNorm === 'IN_PROGRESS' && typeof (w as any).progress === 'number' && (
                        <Box sx={{ mt: 1 }}>
                          {(() => {
                            const prog = Math.max(0, Math.min(1, (w as any).progress || 0));
                            const statusColor = getColorForStatus(statusRaw);
                            return (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700 }}>{Math.round(prog * 100)}%</Typography>
                                <LinearProgress variant="determinate" value={Math.round(prog * 100)} sx={{ height: 8, borderRadius: 2, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: statusColor } }} />
                              </Box>
                            );
                          })()}
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'flex-end' }}>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Button size="small" onClick={() => toggleRow(w.id)}>{expandedRows[w.id] ? 'Collapse' : 'Expand'}</Button>
                        {Array.isArray(activities) && activities.length > 0 && (
                          <Tooltip title={`Lihat Task (${activities.length})`}>
                            <IconButton size="small" onClick={() => openTaskModal(w)} aria-label={`Lihat Task ${activities.length}`}>
                              <ListAltOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {!(statusNorm === 'IN_PROGRESS' || statusNorm === 'COMPLETED' || statusNorm === 'DEPLOYED') && (
                          <Tooltip title="Edit Tanggal">
                            <IconButton size="small" color="secondary" onClick={() => openEdit(w)} aria-label="Edit Dates">
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Hapus Work Order">
                          <IconButton size="small" color="error" onClick={() => handleDeleteWorkOrder(w.id)} aria-label="Hapus">
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <div style={{ color: '#666', fontSize: 12 }}>{w.vendor_cabang ?? w.raw?.vendor_cabang ?? '-'}</div>
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>
        ) : (
          <div style={{ overflowX: 'hidden' }}>
            <TableContainer component={Paper} sx={{ mb: 2 }}>
              <Table size="small" sx={{ tableLayout: 'fixed', width: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '12%' }}>Doc No</TableCell>
                    <TableCell sx={{ width: '12%' }}>Jenis Work Order</TableCell>
                    <TableCell sx={{ width: '9%' }}>Start</TableCell>
                    <TableCell sx={{ width: '9%' }}>End</TableCell>
                    <TableCell sx={{ width: '10%' }}>Equipment</TableCell>
                    <TableCell sx={{ width: '8%' }}>Status</TableCell>
                    <TableCell sx={{ width: '10%' }}>Location</TableCell>
                    <TableCell sx={{ width: '24%', whiteSpace: 'normal' }}>Description</TableCell>
                    <TableCell sx={{ width: '8%' }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.map(w => {
                    const activities = (w.raw?.activities ?? []) as Activity[];
                    const statusRaw = normalizeStatusRaw((w as any).status ?? w.raw?.status ?? 'PREPARATION').toString();
                    const statusNorm = statusRaw.toUpperCase().replace(/[-\s]/g, '_');
                    return (
                      <TableRow key={w.id} hover>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{w.doc_no ?? w.id}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{w.work_type ?? w.type_work ?? w.raw?.work_type ?? w.raw?.type_work ?? '-'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{formatUtcDisplay(resolveStartDate(w))}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{formatUtcDisplay(resolveEndDate(w))}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{w.asset_name ?? '-'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{renderStatusBadge((w as any).status ?? w.raw?.status ?? 'PREPARATION')}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{w.vendor_cabang ?? w.raw?.vendor_cabang ?? '-'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{w.description ?? '-'}</TableCell>
                        <TableCell sx={{ whiteSpace: 'normal' }}>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                              <Tooltip title="Details">
                                <IconButton size="small" onClick={() => openRowModal(w)} aria-label="Details">
                                  <InfoOutlinedIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              {Array.isArray(activities) && activities.length > 0 && (
                                <Tooltip title={`Lihat Task (${activities.length})`}>
                                  <IconButton size="small" onClick={() => openTaskModal(w)} aria-label="Lihat Task">
                                    <ListAltOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              {!(statusNorm === 'IN_PROGRESS' || statusNorm === 'COMPLETED' || statusNorm === 'DEPLOYED') && (
                                <Tooltip title="Edit Tanggal">
                                  <IconButton size="small" color="secondary" onClick={() => openEdit(w)} aria-label="Edit Dates">
                                    <EditOutlinedIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Hapus Work Order">
                                <IconButton size="small" color="error" onClick={() => handleDeleteWorkOrder(w.id)} aria-label="Hapus">
                                  <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button onClick={onPrev} disabled={page <= 1} size="small">Prev</Button>
          <Typography variant="body2">Page {page} / {Math.max(1, Math.ceil(total / pageSize))}</Typography>
          <Button onClick={onNext} disabled={page >= Math.max(1, Math.ceil(total / pageSize))} size="small">Next</Button>
        </Box>
      </div>

      {/* Task Modal */}
      {taskModal.open && taskModal.wo && (
        <div style={{
          position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: 16
        }}>
          <div style={{ background: 'white', padding: 16, width: '95%', maxWidth: 900, borderRadius: 8, maxHeight: '86vh', overflow: 'auto', boxShadow: '0 6px 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <h2 style={{ marginTop: 0, marginBottom: 6, fontSize: 20 }}>Task - {taskModal.wo.doc_no ?? taskModal.wo.id}</h2>
                <div style={{ color: '#666', fontSize: 13 }}>{taskModal.wo.description}</div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 180 }}>
                <div style={{ fontSize: 13, marginBottom: 8 }}>
                  {currentUser === undefined ? (
                    <span style={{ color: '#666' }}>Checking auth...</span>
                  ) : currentUser === null ? (
                    <span style={{ color: '#c00' }}>Not authenticated</span>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 700 }}>{currentUser.name || currentUser.username || currentUser.email}</div>
                      <div style={{ color: '#666', fontSize: 12 }}>{currentUser.email} — {currentUser.role ?? currentUser.type}</div>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  {normalizeStatusRaw((taskModal.wo as any)?.status ?? taskModal.wo?.raw?.status ?? '').toString() === 'ASSIGNED' && (
                    <button onClick={() => { if (confirm('Deploy Work Order ini? Lanjutkan deploy?')) handleDeploy(taskModal.wo!.id); }} style={{ padding: '6px 10px', background: '#7c3aed', color: 'white', borderRadius: 6 }}>Deploy</button>
                  )}
                  {normalizeStatusRaw((taskModal.wo as any)?.status ?? taskModal.wo?.raw?.status ?? '').toString() === 'DEPLOYED' && (
                    <button onClick={() => handleUndeploy(taskModal.wo!.id)} style={{ padding: '6px 10px', background: '#ef4444', color: 'white', borderRadius: 6 }}>Undeploy</button>
                  )}
                  <button onClick={closeTaskModal} style={{ padding: '6px 10px' }}>Close</button>
                </div>
              </div>
            </div>

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
                    {shouldShowAssignColumn(taskModal.wo as any) && (
                      <th style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #ddd' }}>Assign technicians</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(taskModal.wo.tasks) && taskModal.wo.tasks.map((act: any, idx: number) => {
                    const taskKey = (act.id ?? act.task_id ?? String(idx));
                    const selected = selectedAssignees[taskKey] || [];
                    // robust detection for whether task has realisasi
                    function taskHasRealisasi(t: any) {
                      try {
                        // 1) task-local explicit lists (common patterns)
                        const lists = ['realisasi','realisasis','realisasi_list','realisasi_entries','realisasiItems','realisasi_items','realisasiEntries'];
                        for (const k of lists) {
                          const v = t[k];
                          if (Array.isArray(v) && v.length > 0) return true;
                        }

                        // 2) assignment records that are attached directly to the task (if present)
                        if (Array.isArray(t.assignments)) {
                          for (const a of t.assignments) {
                            if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                            if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                            const s = (a.status || a.state || '').toString().toUpperCase();
                            if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                          }
                        }

                        // 3) workorder-level assignments: some data models store realisasi on a separate `assignment` table
                        const woAssigns = Array.isArray((taskModal.wo as any)?.assignments) ? (taskModal.wo as any).assignments : [];
                        if (woAssigns.length > 0) {
                          for (const a of woAssigns) {
                            // match by explicit task_id first, then by name fallback
                            const aTaskId = (a.task_id ?? a.taskId ?? a.task?.id) ? String(a.task_id ?? a.taskId ?? a.task?.id) : null;
                            const tId = (t.id ?? t.task_id ?? t.external_id) ? String(t.id ?? t.task_id ?? t.external_id) : null;
                            if (aTaskId && tId && aTaskId === tId) {
                              if (Array.isArray(a.realisasi) && a.realisasi.length > 0) return true;
                              if ((a.realisasi_count || a.realisasiCount || a.realisasiTotal) > 0) return true;
                              const s = (a.status || a.state || '').toString().toUpperCase();
                              if (s.includes('COMP') || s.includes('VERIF') || s.includes('DONE') || s.includes('APPROV')) return true;
                            }
                            // name-based fallback (older rows)
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

                        // 4) task-level flags and timestamps
                        if (t.completed === true || t.is_completed === true || String(t.status || '').toUpperCase().includes('COMP')) return true;
                        if (t.completed_at || t.realisasi_at || t.approved_at) return true;
                      } catch (e) {
                        // ignore
                      }
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
                                // explicit 'Belum Realisasi' state when neither realisasi nor pending exist
                                return <span style={{ background: '#64748b', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 12, fontWeight: 600 }}>Belum Realisasi</span>;
                              })()
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>ID: {act.id ?? '-'}</div>
                          {/* show already-assigned technicians */}
                          {Array.isArray(act.assignments) && act.assignments.length > 0 && (
                              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                {act.assignments.map((asgn: any) => (
                                  <div
                                    key={asgn.id}
                                    style={{ background: '#eef2ff', padding: '4px 8px', borderRadius: 6, display: 'flex', gap: 8, alignItems: 'center' }}
                                  >
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{asgn.user?.name ?? asgn.user?.nipp ?? asgn.user?.email ?? asgn.assigned_to ?? 'Unknown'}</span>
                                    {currentUser && !['DEPLOYED', 'IN_PROGRESS'].includes(((taskModal.wo as any)?.status ?? '').toString()) && (
                                      <button onClick={async () => {
                                        try {
                                          await apiClient(`/tasks/${encodeURIComponent(act.id)}/assign/${encodeURIComponent(asgn.id)}`, { method: 'DELETE' });
                                        } catch (err) {
                                          try {
                                            await apiClient(`/tasks/${encodeURIComponent(act.id)}/assign/${encodeURIComponent(asgn.id)}`, { method: 'DELETE' });
                                          } catch (e) { console.error('unassign failed', e); showToast('Unassign failed', 'error'); return; }
                                        }
                                        try {
                                          const woRes = await apiClient(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}`);
                                          const woDetail = woRes?.data ?? woRes;
                                          const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}/tasks`);
                                          const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
                                          setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), ...woDetail, tasks } } as any));
                                        } catch (e) { console.warn('refresh workorder after unassign failed', e); }
                                      }} style={{ background: 'transparent', border: 'none', color: '#c00', cursor: 'pointer' }}>Unassign</button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                              <div style={{ marginTop: 8 }}>
                                {currentUser ? (
                                  <button onClick={async () => {
                                    const tid = act.id ?? act.task_id ?? String(idx);
                                    if (!tid) { showToast('Task id tidak tersedia', 'error'); return; }
                                    if (hasRealisasi) {
                                      if (!confirm('Task ini memiliki realisasi. Menghapus task akan menghapus data realisasi terkait. Lanjutkan?')) return;
                                    } else {
                                      if (!confirm('Hapus Task ini? Aksi tidak dapat dibatalkan. Lanjutkan?')) return;
                                    }
                                    await handleDeleteTask(tid);
                                  }} style={{ background: 'transparent', border: 'none', color: '#c00', cursor: 'pointer' }}>Hapus Task</button>
                                ) : null}
                              </div>
                        </td>
                        <td style={{ padding: 12, verticalAlign: 'top', textAlign: 'right' }}>{(act.duration_min ?? act.task_duration) ?? '-'}</td>
                        {shouldShowAssignColumn(taskModal.wo as any) ? (
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
                                ) : !['DEPLOYED', 'IN_PROGRESS'].includes(((taskModal.wo as any)?.status ?? '').toString()) ? (
                                  <>
                                    <Button size="small" variant="contained" onClick={async () => {
                                      const ass = selectedAssignees[taskKey] || [];
                                      if (!ass || ass.length === 0) { showToast('Pilih minimal 1 teknisi', 'warning'); return; }
                                      try {
                                        const unique = Array.from(new Set(ass));
                                        for (const uid of unique) {
                                          await apiClient(`/tasks/${encodeURIComponent(act.id ?? act.task_id ?? String(idx))}/assign`, { method: 'POST', body: { userId: uid, assignedBy: currentUser?.id } } as any);
                                        }
                                        showToast('Assignment created', 'success');
                                        try {
                                          const woRes = await apiClient(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}`);
                                          const woDetail = woRes?.data ?? woRes;
                                          const tasksRes = await apiClient(`/work-orders/${encodeURIComponent(taskModal.wo?.id)}/tasks`);
                                          const tasks = Array.isArray(tasksRes) ? tasksRes : (tasksRes?.data ?? []);
                                          setTaskModal(prev => ({ ...(prev || {}), wo: { ...(prev?.wo || {}), ...woDetail, tasks } } as any));
                                        } catch (e) { console.warn('refresh tasks after assign failed', e); }
                                        load(page, q);
                                      } catch (err) {
                                        console.error('assign error', err);
                                        showToast(err?.body?.message || err?.message || 'Assignment failed', 'error');
                                      }
                                    }}>Assign</Button>
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
          </div>
        </div>
      )}

      {/* Row Details Dialog for table view */}
      <Dialog open={Boolean(modalRow)} onClose={closeRowModal} fullWidth maxWidth="sm">
        <DialogTitle>Details — {modalRow?.doc_no ?? modalRow?.id}</DialogTitle>
        <DialogContent dividers>
          {modalRow ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <div style={{ fontWeight: 700 }}>{modalRow.asset_name ?? '-'}</div>
              <div style={{ color: '#666' }}>{modalRow.description ?? '-'}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Location: {modalRow.vendor_cabang ?? modalRow.raw?.vendor_cabang ?? '-'}</div>
              <div style={{ color: '#666', fontSize: 13 }}>Start: {formatUtcDisplay(modalRow ? resolveStartDate(modalRow) : undefined)}</div>
              <div style={{ color: '#666', fontSize: 13 }}>End: {formatUtcDisplay(modalRow ? resolveEndDate(modalRow) : undefined)}</div>
              <div style={{ marginTop: 8 }}>{renderStatusBadge((modalRow as any).status ?? modalRow?.raw?.status ?? 'PREPARATION')}</div>
              {typeof (modalRow as any).progress === 'number' && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{Math.round(Math.max(0, Math.min(1, (modalRow as any).progress || 0)) * 100)}%</Typography>
                  <LinearProgress variant="determinate" value={Math.round(Math.max(0, Math.min(1, (modalRow as any).progress || 0)) * 100)} sx={{ height: 8, borderRadius: 2, backgroundColor: '#f1f5f9', '& .MuiLinearProgress-bar': { background: getColorForStatus((modalRow as any).status ?? modalRow?.raw?.status ?? 'PREPARATION') } }} />
                </Box>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRowModal}>Close</Button>
          <Tooltip title="Edit Tanggal">
            <IconButton onClick={() => { if (!modalRow) return; openEdit(modalRow); closeRowModal(); }} aria-label="Edit Dates">
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
          {modalRow && Array.isArray(modalRow.raw?.activities) && modalRow.raw.activities.length > 0 && (
            <Tooltip title={`Lihat Task (${(modalRow.raw?.activities || []).length})`}>
              <IconButton onClick={() => { if (modalRow) { openTaskModal(modalRow); closeRowModal(); } }} aria-label="Lihat Task">
                <ListAltOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
        </DialogActions>
      </Dialog>

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
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <div style={{ fontSize: 12, color: '#666' }}>Current: {formatUtcDisplay(editing ? resolveStartDate(editing) : undefined)}</div>

            <TextField
              label="End Date & Time"
              type="datetime-local"
              size="small"
              value={editEndInput}
              onChange={e => setEditEndInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <div style={{ fontSize: 12, color: '#666' }}>Current: {formatUtcDisplay(editing ? resolveEndDate(editing) : undefined)}</div>

            <TextField
              label="Keterangan (opsional)"
              placeholder="Alasan atau catatan perubahan tanggal"
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
            // Convert datetime-local (YYYY-MM-DDTHH:MM) to SQL datetime string 'YYYY-MM-DD HH:MM:00'
            function datetimeLocalToSql(local?: string | null) {
              if (!local) return null;
              const rx = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
              const m = rx.exec(local);
              if (!m) return null;
              const [, yy, mm, dd, hh, mi] = m as any;
              return `${yy}-${mm}-${dd} ${hh}:${mi}:00`;
            }

            // basic validation: ensure input matches expected pattern
            if (editStartInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editStartInput)) { showToast('Start date tidak valid', 'warning'); return; }
            if (editEndInput && !/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/.test(editEndInput)) { showToast('End date tidak valid', 'warning'); return; }

            const sSql = datetimeLocalToSql(editStartInput || null);
            const eSql = datetimeLocalToSql(editEndInput || null);
            await saveEdit(editing!.id, sSql, eSql);
          }} disabled={editLoading}>{editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
