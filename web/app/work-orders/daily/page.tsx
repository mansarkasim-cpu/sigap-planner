"use client";

import React, { useEffect, useMemo, useState, useRef } from 'react'
import apiClient from '../../../lib/api-client'
import Link from 'next/link'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import ListSubheader from '@mui/material/ListSubheader'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Pagination from '@mui/material/Pagination'
// OpenInNewIcon removed — details button not shown on Daily cards
import ListIcon from '@mui/icons-material/List'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Skeleton from '@mui/material/Skeleton'
import MenuItem from '@mui/material/MenuItem'

type WorkOrder = {
  id: string
  doc_no?: string
  asset_name?: string
  asset_id?: number
  type_work?: string
  work_type?: string
  date_doc?: string
  start_date?: string | null
  end_date?: string | null
  status?: string
}

function normalizeStatusRaw(s?: any) {
  if (s == null) return '';
  const str = String(s).toString();
  const k = str.toUpperCase().trim().replace(/[-\s]/g, '_');
  switch (k) {
    case 'NEW':
      return 'PREPARATION';
    case 'READY_TO_DEPLOY':
    case 'READY-TO-DEPLOY':
      return 'ASSIGNED';
    default:
      return k;
  }
}

function getColorForStatus(s?: string) {
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

export default function DailyWorkOrdersPage(){
  const [rows, setRows] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState(() => {
    try {
      const d = new Date();
      return d.toISOString().slice(0, 10);
    } catch (e) {
      return '';
    }
  })
  const [jenisFilter, setJenisFilter] = useState('')
  const [siteFilter, setSiteFilter] = useState('')
  const [jenisOptions, setJenisOptions] = useState<Array<{id:number,name:string,description?:string}>>([])
  const [page, setPage] = useState(1)
  const pageSize = 12
  const [total, setTotal] = useState(0)
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailWo, setDetailWo] = useState<any>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [checklistLoading, setChecklistLoading] = useState(false)
  const [checklistItems, setChecklistItems] = useState<any[]>([])
  const [checklistWo, setChecklistWo] = useState<any|null>(null)

  const [assignOpen, setAssignOpen] = useState(false)
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignUsers, setAssignUsers] = useState<any[]>([])
  const [assignQuery, setAssignQuery] = useState('')
  const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null)
  const [assignWo, setAssignWo] = useState<any | null>(null)
  const [scheduledOnly, setScheduledOnly] = useState(true)
  const [scheduledEmpty, setScheduledEmpty] = useState(false)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMsg, setSnackMsg] = useState('')
  const [snackSeverity, setSnackSeverity] = useState<'success'|'error'|'info'|'warning'>('success')
  const [assignedMap, setAssignedMap] = useState<Record<string,string[]>>({});
  const [deployingIds, setDeployingIds] = useState<Record<string,boolean>>({});
  const [deployingAll, setDeployingAll] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [editDateOpen, setEditDateOpen] = useState(false);
  const [editDateWo, setEditDateWo] = useState<any|null>(null);
  const [editDateDate, setEditDateDate] = useState<string>('');
  const [editDateTime, setEditDateTime] = useState<string>('');
  const [editDateSaving, setEditDateSaving] = useState(false);
  const [assetsOptions, setAssetsOptions] = useState<any[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<any[]>([]);
  const [techOptions, setTechOptions] = useState<any[]>([]);
  const [techsFromSchedule, setTechsFromSchedule] = useState(false);
  const customStartRef = useRef<string>('');
  const [siteOptions, setSiteOptions] = useState<any[]>([]);
  const [customSite, setCustomSite] = useState<string>('');
  const [selectedTechs, setSelectedTechs] = useState<any[]>([]);
  const [customStart, setCustomStart] = useState<string>('');
  const SLOT_DURATION_MIN = 15;
  const SLOT_GAP_MIN = 5;
  const [previewSchedule, setPreviewSchedule] = useState<Array<any>>([]);

  useEffect(()=>{ load(page) }, [])

  useEffect(()=>{ loadJenisOptions() }, [])
  useEffect(()=>{ loadSiteOptions() }, [])

  async function loadJenisOptions(){
    try{
      const res = await apiClient('/master/jenis-alat')
      const arr = res?.data ?? res ?? []
      setJenisOptions(Array.isArray(arr) ? arr.map((x:any)=>({ id: x.id, name: x.name || x.nama || x.label || String(x.id), description: x.description || x.desc || '' })) : [])
    }catch(e){ /* ignore */ }
  }

  async function loadAssetsAndTechs() {
    try{
      const aRes = await apiClient('/master/alats?page=1&pageSize=1000');
      const alatRows = Array.isArray(aRes) ? aRes : (aRes?.data ?? []);
      setAssetsOptions(Array.isArray(alatRows) ? alatRows : []);
    }catch(e){ setAssetsOptions([]); }
    try{
      const tRes = await apiClient('/users?page=1&pageSize=1000');
      const tRows = Array.isArray(tRes) ? tRes : (tRes?.data ?? []);
      const techs = Array.isArray(tRows) ? tRows.filter((u:any)=>(u.role||'').toLowerCase() === 'technician') : [];
      setTechOptions(sortUsersByName(techs));
    }catch(e){ setTechOptions([]); }
  }

  async function loadAvailableAssetsForDate(dateStr?: string) {
    try{
      const aRes = await apiClient('/master/alats?page=1&pageSize=1000');
      const alatRows = Array.isArray(aRes) ? aRes : (aRes?.data ?? []);
      const allAssets = Array.isArray(alatRows) ? alatRows : [];

      if (!dateStr || !String(dateStr).trim()) { setAssetsOptions(allAssets); return; }
      // normalize date YYYY-MM-DD
      const m = String(dateStr).match(/(\d{4}-\d{2}-\d{2})/);
      const dateParam = m ? m[1] : String(dateStr);

      const woRes = await apiClient(`/work-orders?date=${encodeURIComponent(dateParam)}&work_type=DAILY&page=1&pageSize=1000`);
      const woRows = Array.isArray(woRes) ? woRes : (woRes?.data ?? []);
      const occupied = new Set<string>();
      for (const w of (Array.isArray(woRows) ? woRows : [])) {
        const aid = w?.asset_id ?? w?.raw?.asset_id ?? (w?.asset && w.asset.id) ?? null;
        if (aid != null) occupied.add(String(aid));
      }
      const filtered = allAssets.filter(a => !occupied.has(String(a?.id)));
      setAssetsOptions(filtered);
    }catch(e){
      // fallback to unfiltered list on error
      try{ await loadAssetsAndTechs(); }catch(_){ setAssetsOptions([]); }
    }
  }

  async function loadSiteOptions(){
    try{
      const res = await apiClient('/master/sites');
      const rows = res?.data ?? res ?? [];
      setSiteOptions(Array.isArray(rows) ? rows : []);
    }catch(e){ setSiteOptions([]); }
  }

  function sortUsersByName(arr:any[]){
    if (!Array.isArray(arr)) return [];
    return arr.slice().sort((a:any,b:any)=>{
      const nameA = String(a?.name || a?.nama || a?.personil?.name || a?.email || a?.nipp || a?.id || '').toLowerCase();
      const nameB = String(b?.name || b?.nama || b?.personil?.name || b?.email || b?.nipp || b?.id || '').toLowerCase();
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });
  }

  function extractSiteValueGlobal(v:any){
    if (v == null) return '';
    if (typeof v === 'string') return v.trim();
    if (typeof v === 'number') return String(v);
    if (typeof v === 'object') {
      return String(v.name ?? v.code ?? v.id ?? v.nama ?? v.label ?? v.site ?? '')
    }
    return '';
  }

  async function loadTechsForDate(dateOrDateTime?: string|null, siteOverride?: string|null) {
    // Prefer scheduled-technicians endpoint. If date provided include time when available.
    setTechsFromSchedule(false);
    try{
      let dateParam = '';
      let timeParam = '';
      if (dateOrDateTime) {
        // attempt to extract YYYY-MM-DD and HH:MM
        const iso = new Date(dateOrDateTime);
        if (!isNaN(iso.getTime())){
          const yyyy = iso.getFullYear();
          const mm = String(iso.getMonth()+1).padStart(2,'0');
          const dd = String(iso.getDate()).padStart(2,'0');
          const hh = String(iso.getHours()).padStart(2,'0');
          const min = String(iso.getMinutes()).padStart(2,'0');
          dateParam = `${yyyy}-${mm}-${dd}`;
          timeParam = `${hh}:${min}`;
        } else {
          // fallback regex YYYY-MM-DD or dd-MM-yyyy
          const m = String(dateOrDateTime).match(/(\d{4}-\d{2}-\d{2})/);
          if (m) dateParam = m[1];
        }
      }

      // determine site parameter: prefer explicit override, then selectedAssets' site, then assetsOptions, then visible rows
      function extractSiteValue(v:any){
        if (v == null) return '';
        if (typeof v === 'string') return v.trim();
        if (typeof v === 'number') return String(v);
        if (typeof v === 'object') {
          return String(v.name ?? v.code ?? v.id ?? v.nama ?? v.label ?? v.site ?? '')
        }
        return '';
      }

      let siteParam: string | null = null;
      // explicit override may be an object or string
      if (siteOverride) siteParam = extractSiteValue(siteOverride) || null;
      if (!siteParam) {
        // look at selected assets
        if (selectedAssets && selectedAssets.length>0) {
          const s = extractSiteValue(selectedAssets[0].site ?? selectedAssets[0].vendor_cabang ?? selectedAssets[0].raw?.site ?? selectedAssets[0]);
          if (s) siteParam = s;
        }
      }
      if (!siteParam) {
        // fallback to assetsOptions first item
        if (assetsOptions && assetsOptions.length>0) {
          const s = extractSiteValue(assetsOptions[0].site ?? assetsOptions[0].vendor_cabang ?? assetsOptions[0].raw?.site ?? assetsOptions[0]);
          if (s) siteParam = s;
        }
      }
      if (!siteParam) {
        // fallback to visible work orders
        if (rows && rows.length>0) {
          const r0: any = rows[0];
          const s = extractSiteValue(r0.site ?? r0.vendor_cabang ?? r0.raw?.site ?? r0);
          if (s) siteParam = s;
        }
      }

      const q = `/scheduled-technicians?${dateParam ? `date=${encodeURIComponent(dateParam)}` : ''}${timeParam ? `&time=${encodeURIComponent(timeParam)}` : ''}` + (siteParam ? `&site=${encodeURIComponent(siteParam)}` : '');
      const res = await apiClient(q);
      const apiRows = res?.data ?? res ?? [];
      const list = Array.isArray(apiRows) ? apiRows : [];
      // if scheduled list found, use it; if empty, mark scheduledEmpty and do NOT fallback to full user list
      if (list.length > 0) {
        const sorted = sortUsersByName(list);
        setTechOptions(sorted);
        // auto-select all loaded technicians if user hasn't selected any yet
        if (!selectedTechs || selectedTechs.length === 0) setSelectedTechs(sorted);
        setTechsFromSchedule(true);
        setScheduledEmpty(false);
        return;
      } else {
        setTechOptions([]);
        setTechsFromSchedule(true);
        setScheduledEmpty(true);
        return;
      }
    }catch(e){ /* ignore and fallback */ }

    // only fallback if the scheduled-technicians fetch failed (handled in catch above)
    try{
      const r2 = await apiClient('/users?page=1&pageSize=1000');
      const rows2 = r2?.data ?? r2 ?? [];
      const techs = Array.isArray(rows2) ? rows2.filter((u:any) => (u.role || '').toLowerCase() === 'technician') : [];
      const sorted = sortUsersByName(techs);
      setTechOptions(sorted);
      if (!selectedTechs || selectedTechs.length === 0) setSelectedTechs(sorted);
      setTechsFromSchedule(false);
      setScheduledEmpty(false);
    }catch(_){ setTechOptions([]); setTechsFromSchedule(false); setScheduledEmpty(false); }
  }

  function isAssetSelected(a:any){
    return selectedAssets.some(sa => String(sa.id) === String(a.id));
  }

  function toggleAsset(a:any){
    if (isAssetSelected(a)) setSelectedAssets(selectedAssets.filter(sa => String(sa.id) !== String(a.id)));
    else setSelectedAssets([...selectedAssets, a]);
  }

  function isTechSelected(t:any){
    return selectedTechs.some(st => String(st.id) === String(t.id));
  }

  function toggleTech(t:any){
    if (isTechSelected(t)) setSelectedTechs(selectedTechs.filter(st => String(st.id) !== String(t.id)));
    else setSelectedTechs([...selectedTechs, t]);
  }

  function getAssetGroups(){
    const groups: Record<string, any[]> = {};
    const descMap: Record<string,string> = {};
    for (const a of assetsOptions) {
      const jenisId = a?.jenis_alat_id ?? a?.jenis_alat?.id ?? a?.jenis_id ?? a?.jenis ?? null;
      let jenisName = 'Unknown';
      if (jenisId != null) {
        const found = jenisOptions.find(j => String(j.id) === String(jenisId));
        if (found) {
          jenisName = found.name || String(found.id);
          descMap[jenisName] = found.description || '';
        } else {
          jenisName = String(jenisId);
          descMap[jenisName] = descMap[jenisName] || '';
        }
      } else {
        descMap[jenisName] = descMap[jenisName] || '';
      }
      if (!groups[jenisName]) groups[jenisName] = [];
      groups[jenisName].push(a);
    }
    return { groups, descMap };
  }

  function selectAllAssets(select=true){
    if (select) setSelectedAssets(Array.from(assetsOptions));
    else setSelectedAssets([]);
  }

  function isGroupSelected(groupName:string){
    const { groups } = getAssetGroups();
    const assets = groups[groupName] || [];
    if (assets.length === 0) return false;
    return assets.every((a:any) => isAssetSelected(a));
  }

  function toggleGroupAssets(groupName:string){
    const { groups } = getAssetGroups();
    const assets = groups[groupName] || [];
    const anySelected = assets.some((a:any) => isAssetSelected(a));
    if (anySelected) {
      // remove all in group
      setSelectedAssets(selectedAssets.filter(sa => !assets.some((a:any) => String(a.id) === String(sa.id))));
    } else {
      // add all in group (avoid duplicates)
      const existingIds = new Set(selectedAssets.map(sa=>String(sa.id)));
      const toAdd = assets.filter((a:any) => !existingIds.has(String(a.id)));
      setSelectedAssets([...selectedAssets, ...toAdd]);
    }
  }

  // Technicians grouping / select helpers
  function getTechGroups(){
    const groups: Record<string, any[]> = {};
    function findFirstRelevantString(obj:any, seen = new Set()){
      if (!obj || typeof obj !== 'object') return null;
      if (seen.has(obj)) return null;
      seen.add(obj);
      for (const k of Object.keys(obj)){
        try{
          const v = obj[k];
          if (typeof v === 'string'){
            const kl = String(k).toLowerCase();
            if (kl.includes('shift') || kl.includes('group') || kl.includes('role')) return v;
          }
        }catch(_){/* ignore */}
      }
      // recurse into nested objects/arrays
      for (const k of Object.keys(obj)){
        try{
          const v = obj[k];
          if (v && typeof v === 'object'){
            const nested = findFirstRelevantString(v, seen);
            if (nested) return nested;
          }
        }catch(_){/* ignore */}
      }
      return null;
    }

    function resolveGroupName(t:any){
      if (!t) return 'Unspecified Shift';
      // Prefer explicit shift_group fields
      const preferKeys = ['shift_group','shiftGroup','shift_group_name','shift_group_id','shift_group_label'];
      for (const k of preferKeys){
        const v = (t as any)[k];
        if (typeof v === 'string' && v.trim()) return v;
      }
      // Next try common direct fields
      const directCandidates = ['shift','shiftName','shift_name','group','group_name','shiftLabel','shift_label','work_shift','shiftCode','shift_code'];
      for (const k of directCandidates){
        const v = (t as any)[k];
        if (typeof v === 'string' && v.trim()) return v;
      }
      // nested: shift object with explicit group field
      if (t.shift && typeof t.shift === 'object'){
        if (typeof t.shift.group === 'string' && t.shift.group.trim()) return t.shift.group;
        if (t.shift.name) return t.shift.name;
        if (t.shift.label) return t.shift.label;
      }
      // schedule or schedules with shift_group
      if (t.schedule && typeof t.schedule === 'object'){
        if (t.schedule.shift && typeof t.schedule.shift === 'object'){
          if (typeof t.schedule.shift.group === 'string' && t.schedule.shift.group.trim()) return t.schedule.shift.group;
          if (t.schedule.shift.name) return t.schedule.shift.name;
          if (t.schedule.shift.label) return t.schedule.shift.label;
        }
        if (typeof t.schedule.shift_group === 'string' && t.schedule.shift_group.trim()) return t.schedule.shift_group;
        if (typeof t.schedule.shift_name === 'string' && t.schedule.shift_name.trim()) return t.schedule.shift_name;
      }
      if (Array.isArray(t.schedules) && t.schedules.length>0){
        const s = t.schedules[0];
        if (s) {
          if (s.shift && typeof s.shift === 'object'){
            if (typeof s.shift.group === 'string' && s.shift.group.trim()) return s.shift.group;
            if (s.shift.name) return s.shift.name;
          }
          if (typeof s.shift_group === 'string' && s.shift_group.trim()) return s.shift_group;
        }
      }
      if (Array.isArray(t.shifts) && t.shifts.length>0){
        const s = t.shifts[0];
        if (s) {
          if (typeof s.group === 'string' && s.group.trim()) return s.group;
          if (s.name) return s.name;
        }
      }
      // generic scan for any string field that looks relevant
      const found = findFirstRelevantString(t);
      if (found) return found;
      return 'Unspecified Shift';
    }

    for (const t of techOptions) {
      const groupName = resolveGroupName(t) || 'Unspecified Shift';
      if (!groups[groupName]) groups[groupName] = [];
      groups[groupName].push(t);
    }
    return groups;
  }

  function selectAllTechs(select=true){
    if (select) setSelectedTechs(Array.from(techOptions));
    else setSelectedTechs([]);
  }

  function isTechGroupSelected(groupName:string){
    const groups = getTechGroups();
    const list = groups[groupName] || [];
    if (list.length === 0) return false;
    return list.every((t:any) => isTechSelected(t));
  }

  function toggleTechGroup(groupName:string){
    const groups = getTechGroups();
    const list = groups[groupName] || [];
    const anySelected = list.some((t:any) => isTechSelected(t));
    if (anySelected) {
      setSelectedTechs(selectedTechs.filter(st => !list.some((t:any) => String(t.id) === String(st.id))));
    } else {
      const existing = new Set(selectedTechs.map(st=>String(st.id)));
      const toAdd = list.filter((t:any) => !existing.has(String(t.id)));
      setSelectedTechs([...selectedTechs, ...toAdd]);
    }
  }

  async function load(pageArg = 1){
    setLoading(true); setError(null)
    try{
      const qs = []
      if (search && search.trim()) qs.push(`q=${encodeURIComponent(search.trim())}`)
      qs.push(`page=${pageArg}`)
      qs.push(`pageSize=${pageSize}`)
      if (dateFilter && dateFilter.trim()) qs.push(`date=${encodeURIComponent(dateFilter.trim())}`)
      if (jenisFilter && jenisFilter.toString().trim()) qs.push(`jenis=${encodeURIComponent(jenisFilter.toString().trim())}`)
      if (siteFilter && siteFilter.toString().trim()) qs.push(`site=${encodeURIComponent(siteFilter.toString().trim())}`)
      // Only show DAILY work orders in this view
      qs.push(`work_type=DAILY`)
      const url = `/work-orders${qs.length ? ('?' + qs.join('&')) : ''}`
      const res = await apiClient(url)
      const rowsData: any[] = res?.data ?? res ?? []
      setRows(rowsData as WorkOrder[])
      // populate assigned technicians for relevant statuses in background
      populateAssignedUsers(rowsData as any[] ?? [])
      const tot = res?.meta?.total ?? 0
      setTotal(Number(tot) || 0)
      setPage(Number(pageArg) || 1)
    }catch(e:any){
      const msg = e?.message || String(e)
      setError(msg)
      setSnackMsg(msg)
      setSnackSeverity('error')
      setSnackOpen(true)
    }
    finally{ setLoading(false) }
  }

  async function populateAssignedUsers(rowsArr: any[]) {
    try{
      const want = new Set(['ASSIGNED','DEPLOYED','IN_PROGRESS','COMPLETED']);
      const map: Record<string,string[]> = {};
      await Promise.all(rowsArr.map(async (r:any) => {
        try{
          const rawStatus = r?.status ?? r?.raw?.status ?? '';
          const norm = normalizeStatusRaw(rawStatus);
          if (!want.has(norm)) return;
          // prefer workorder-level assigned users if backend supplied them
          const names: string[] = [];
          if (Array.isArray(r.assigned_users) && r.assigned_users.length > 0) {
            for (const u of r.assigned_users) {
              const nm = u?.name || u?.user_name || u?.name_display || String(u?.id || '');
              if (nm) names.push(nm);
            }
          } else {
            const res = await apiClient(`/work-orders/${encodeURIComponent(r.id)}/tasks`);
            const tasks = res?.data ?? res ?? [];
            if (Array.isArray(tasks)) {
              for (const t of tasks) {
                const assigns = Array.isArray(t.assignments) ? t.assignments : (Array.isArray(t.assignment) ? t.assignment : []);
                for (const a of assigns) {
                  const nm = a?.user?.name || a?.user?.personil?.name || a?.name || (a?.user_id ? String(a.user_id) : null) || (a?.id ? String(a.id) : null);
                  if (nm) names.push(nm);
                }
              }
            }
          }
          const uniq = Array.from(new Set(names));
          if (uniq.length) map[String(r.id)] = uniq;
        }catch(e){ /* ignore per-row errors */ }
      }));
      setAssignedMap(map);
    }catch(e){ /* ignore overall */ }
  }

  // auto-refresh when jenis or date filter changes (skip first mount to avoid double-load)
  const _mounted = useRef(false)
  useEffect(()=>{
    if (!_mounted.current) {
      _mounted.current = true
      return
    }
    load(1)
  }, [dateFilter, jenisFilter])

  // when the top-level date filter changes, refresh technician options for custom generator
  useEffect(()=>{
    loadTechsForDate(dateFilter, customSite);
  }, [dateFilter])

  // when the customStart in the dialog changes, repopulate technician list (debounced)
  useEffect(()=>{
    const v = customStart;
    if (!v) return;
    if (v === customStartRef.current) return;
    customStartRef.current = v;
    const id = setTimeout(()=>{
      loadTechsForDate(v, customSite);
    }, 300);
    return ()=> clearTimeout(id);
  }, [customStart]);

  // debounce search input
  useEffect(()=>{
    const id = setTimeout(()=>{ load(1) }, 500)
    return ()=> clearTimeout(id)
  }, [search])


  const pages = Math.max(1, Math.ceil((total || rows.length) / pageSize))
  const visible = rows

  // Quick-generate removed; use Custom Generate modal only.

  async function openCustomGenerate() {
    if (!siteFilter || !String(siteFilter).trim()) {
      setSnackMsg('Pilih site terlebih dahulu sebelum membuka Generate');
      setSnackSeverity('warning');
      setSnackOpen(true);
      return;
    }
    setCustomOpen(true);
    await loadSiteOptions();
    // load techs/users in background
    loadAssetsAndTechs();
    // initialize Start from top-level date filter (use 08:00 as default time)
    if (dateFilter && String(dateFilter).trim()) {
      const d = String(dateFilter).trim();
      // ensure format YYYY-MM-DD
      const m = d.match(/^(\d{4}-\d{2}-\d{2})$/);
      if (m) setCustomStart(`${m[1]}T08:00`);
      else setCustomStart('');
    } else {
      setCustomStart('');
    }
    setSelectedAssets([]);
    setSelectedTechs([]);
    setPreviewSchedule([]);
    // filter assets to only those without DAILY workorder on selected date
    try{
      await loadAvailableAssetsForDate(dateFilter || undefined);
    }catch(_){ /* ignore */ }
  }

  async function deployWorkOrderById(id: string) {
    try{
      setDeployingIds(prev => ({ ...prev, [id]: true }));
      const res = await apiClient(`/work-orders/${encodeURIComponent(id)}/deploy`, { method: 'POST' });
      // refresh list and show result
      await load(1);
      setSnackMsg('Work order deployed'); setSnackSeverity('success'); setSnackOpen(true);
      return res;
    }catch(e:any){
      setSnackMsg(e?.message || String(e)); setSnackSeverity('error'); setSnackOpen(true);
    }finally{
      setDeployingIds(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  }

  async function deployAll() {
    if (!visible || visible.length === 0) return;
    try{
      setDeployingAll(true);
      let success = 0;
      for (const w of visible) {
        try{
          // skip already deployed
          if ((w as any).status === 'DEPLOYED') continue;
          const r = await apiClient(`/work-orders/${encodeURIComponent(w.id)}/deploy`, { method: 'POST' });
          if (r) success++;
        }catch(_){ /* continue on error */ }
      }
      await load(1);
      setSnackMsg(`Deployed ${success} work orders`); setSnackSeverity('success'); setSnackOpen(true);
    }catch(e:any){ setSnackMsg(e?.message || String(e)); setSnackSeverity('error'); setSnackOpen(true); }
    finally{ setDeployingAll(false); }
  }

  function computePreview() {
    if (!selectedAssets || selectedAssets.length === 0) return setPreviewSchedule([]);
    if (!selectedTechs || selectedTechs.length === 0) return setPreviewSchedule([]);
    // slot length = duration + gap
    const slotMs = (SLOT_DURATION_MIN + SLOT_GAP_MIN) * 60 * 1000;
    const startMs = (customStart && !isNaN(new Date(customStart).getTime())) ? new Date(customStart).getTime() : Date.now();

    // Group assets by jenis_alat (equipment type) so we can assign one technician per jenis
    const groupMap: Record<string, any[]> = {};
    const jenisKeys: string[] = [];
    for (const a of selectedAssets) {
      const jenis = (a?.jenis_alat_id ?? a?.jenis_alat?.id ?? a?.jenis_id ?? a?.jenis) || 'unknown';
      const key = String(jenis);
      if (!groupMap[key]) { groupMap[key] = []; jenisKeys.push(key); }
      groupMap[key].push(a);
    }

    // Distribute assets across selected technicians so every checked tech can receive assignments when possible.
    const techCount = selectedTechs.length;
    const techNextAvailable: Record<string, number> = {};
    for (const t of selectedTechs) techNextAvailable[String(t.id)] = startMs;

    // Build ordered asset list grouped by jenis (keeps grouping for readability) but assign round-robin across techs
    const orderedAssets: Array<{ asset:any, jenisKey:string }> = [];
    for (const k of jenisKeys) {
      const assetsInGroup = groupMap[k] || [];
      for (const a of assetsInGroup) orderedAssets.push({ asset: a, jenisKey: k });
    }

    const items: any[] = [];
    for (let ai = 0; ai < orderedAssets.length; ai++) {
      const { asset, jenisKey } = orderedAssets[ai];
      const tech = selectedTechs[ai % techCount];
      const techId = String(tech.id);
      const slotStart = techNextAvailable[techId];
      const slotEnd = slotStart + SLOT_DURATION_MIN * 60 * 1000;
      items.push({
        asset_id: asset.id,
        asset_name: asset.name || asset.nama || asset.label || asset.id,
        start: new Date(slotStart).toISOString(),
        end: new Date(slotEnd).toISOString(),
        assigned_user_id: tech.id,
        assigned_user_name: tech.name || tech.nipp || tech.email,
        jenis_alat_id: jenisKey
      });
      techNextAvailable[techId] = slotStart + slotMs;
    }

    // Sort items by start time for preview clarity
    items.sort((a,b)=> new Date(a.start).getTime() - new Date(b.start).getTime());
    setPreviewSchedule(items);
  }

  async function submitCustomGenerate() {
    if (!previewSchedule || previewSchedule.length === 0) { setSnackMsg('No schedule to generate'); setSnackSeverity('warning'); setSnackOpen(true); return; }
    try{
      setGenerating(true);
      // call existing generator endpoint with custom payload; backend should handle creating WOs per item
      const payload = { items: previewSchedule };
      const res = await apiClient('/work-orders/generate-daily', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      // merge returned created items into current list so UI updates immediately
      const created = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      if (created && created.length > 0) {
        // prepend new items that are not already present
        setRows(prev => {
          const existing = new Set(prev.map(r => String(r.id)));
          const toAdd = created.filter((c:any) => c && c.id && !existing.has(String(c.id)));
          return [...toAdd, ...prev];
        });
        // update assignedMap for quick display of assigned technicians
        setAssignedMap(prev => {
          const next = { ...prev } as Record<string,string[]>;
          for (const c of created) {
            const id = String(c.id);
            if (Array.isArray(c.assigned_users) && c.assigned_users.length > 0) {
              next[id] = c.assigned_users.map((u:any) => u.name || u.user_name || String(u.id || ''));
            } else if (c?.raw?.assigned_user_name) {
              next[id] = [String(c.raw.assigned_user_name)];
            }
          }
          return next;
        });
        setTotal(t => Number(t || 0) + created.length);
      }
      // also refresh from server to ensure pagination/meta consistency
      await load(1);
      setSnackMsg('Generated custom work orders'); setSnackSeverity('success'); setSnackOpen(true);
      setCustomOpen(false);
    }catch(e:any){ setSnackMsg(e?.message || String(e)); setSnackSeverity('error'); setSnackOpen(true); }
    finally{ setGenerating(false); }
  }

  async function openDetail(id: string){
    setDetailOpen(true); setDetailLoading(true); setDetailWo(null)
    try{
      const res = await apiClient(`/work-orders/${id}`)
      setDetailWo(res?.data ?? res)
    }catch(e:any){
      const msg = e?.message || String(e)
      setDetailWo({ error: msg })
      setSnackMsg(msg)
      setSnackSeverity('error')
      setSnackOpen(true)
    }
    finally{ setDetailLoading(false) }
  }

  async function openChecklist(w: WorkOrder){
    setChecklistWo(w); setChecklistOpen(true); setChecklistItems([]); setChecklistLoading(true);
    try{
      // If the work order is completed, prefer showing the actual saved checklist (daily_checklist)
      const rawStatus = (w as any).status ?? (w as any).raw?.status ?? '';
      const norm = normalizeStatusRaw(rawStatus);
      const isCompleted = String(norm).toUpperCase().includes('COMPLETED');

      // helper to parse ISO y-m-d
      function extractDateIso(val?: string|null){
        if (!val) return '';
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0,10);
        const m = String(val).match(/(\d{4}-\d{2}-\d{2})/);
        return m ? m[1] : '';
      }

      // Try to load saved checklist when WO completed
      if (isCompleted) {
        try {
          const raw: any = (w as any).raw ?? {};
          const assetId = (w as any).asset_id ?? raw?.asset_id ?? (raw?.asset && raw.asset.id) ?? null;
          const dateVal = extractDateIso((w as any).end_date ?? (w as any).start_date ?? (w as any).date_doc ?? null);
          if (assetId && dateVal) {
            const listRes = await apiClient(`/mobile/checklists?date=${encodeURIComponent(dateVal)}&page=1&pageSize=20`);
            const candidates = Array.isArray(listRes?.data ?? listRes) ? (listRes?.data ?? listRes) : [];
            // filter by asset id
            const matched = (candidates || []).filter((c:any) => {
              try {
                const aid = c?.alat_id ?? c?.alat?.id ?? c?.raw?.alat_id ?? c?.raw?.asset_id ?? null;
                return aid != null && String(aid) === String(assetId);
              } catch(_) { return false; }
            });
            if (matched.length > 0) {
              // pick the latest performed_at
              matched.sort((a:any,b:any) => { try { return new Date(b.performed_at).getTime() - new Date(a.performed_at).getTime(); } catch(_) { return 0; } });
              const chosen = matched[0];
              const cid = chosen?.id ?? chosen?.daily_checklist_id ?? null;
              if (cid) {
                // admin/mobile detail endpoint exists; prefer admin `/checklists/:id`
                try {
                  const detail = await apiClient(`/checklists/${encodeURIComponent(String(cid))}`);
                  const checklist = detail?.checklist ?? detail?.data ?? detail ?? null;
                  const items = detail?.items ?? detail?.data?.items ?? detail?.items ?? [];
                  setChecklistItems(Array.isArray(items) ? items : []);
                  return;
                } catch (_){
                  // fallback to mobile detail endpoint
                  try {
                    const detail2 = await apiClient(`/mobile/checklists/${encodeURIComponent(String(cid))}`);
                    const checklist = detail2?.checklist ?? detail2?.data ?? detail2 ?? null;
                    const items = detail2?.items ?? detail2?.data?.items ?? detail2?.items ?? [];
                    setChecklistItems(Array.isArray(items) ? items : []);
                    return;
                  } catch (_) {}
                }
              }
            }
          }
        } catch (e) {
          // ignore and fallback to master questions
          console.debug('fetch saved checklist failed', e);
        }
      }

      // Fallback: Always load checklist from master_checklist_question via master/questions
      // Determine jenis_alat id from workorder raw data or from the asset lookup
      let jenisId: number | null = null;
      // try raw payload first
      const raw: any = (w as any).raw ?? {};
      jenisId = raw?.jenis_alat_id ?? raw?.jenis_alat?.id ?? null;

      // if not present, try to fetch asset to derive jenis_alat
      if (!jenisId && w.asset_id) {
        try{
          const aRes = await apiClient(`/master/alats/${w.asset_id}`);
          const alat = aRes?.data ?? aRes;
          jenisId = alat?.jenis_alat?.id ?? alat?.jenis_alat_id ?? null;
        }catch(_){ jenisId = null; }
      }

      if (jenisId) {
        try{
          const qRes = await apiClient(`/master/questions?jenis_alat_id=${encodeURIComponent(String(jenisId))}`);
          const questions = qRes?.data ?? qRes ?? [];
          setChecklistItems(Array.isArray(questions) ? questions : []);
        }catch(_){ setChecklistItems([]); }
      } else {
        // no jenis id found — show empty list
        setChecklistItems([]);
      }
    }catch(e){
      setChecklistItems([]);
    }finally{
      setChecklistLoading(false);
    }
  }

  function closeChecklist(){ setChecklistOpen(false); setChecklistWo(null); setChecklistItems([]); setChecklistLoading(false); }

  async function openAssignModal(w: WorkOrder){
    setAssignWo(w); setAssignOpen(true); setSelectedAssignee(null); setAssignUsers([]); setAssignQuery('');
    setScheduledOnly(true); setScheduledEmpty(false);
    // load scheduled technicians for this work order's shift/time
    loadScheduledTechniciansForWorkOrder(w);
  }

  async function searchUsers(q: string){
    setAssignQuery(q);
    try{
      // If we're showing scheduled-only list and have users loaded, filter locally
      if (scheduledOnly && assignUsers && assignUsers.length > 0) {
        if (!q || q.length < 1) return;
        const qq = q.toLowerCase();
        const filtered = assignUsers.filter((u:any) => (((u.name||'') + ' ' + (u.nipp||'') + ' ' + (u.email||'')).toLowerCase().includes(qq)));
        setAssignUsers(filtered);
        return;
      }
      // otherwise query server for users
      const res = await apiClient(`/users?q=${encodeURIComponent(String(q))}&page=1&pageSize=10`);
      const rows = res?.data ?? res ?? [];
      setAssignUsers(Array.isArray(rows) ? rows : []);
    }catch(e){ setAssignUsers([]); }
  }

  async function loadAllTechnicians(){
    try{
      const res = await apiClient(`/users?page=1&pageSize=1000`);
      const rows = res?.data ?? res ?? [];
      const techs = Array.isArray(rows) ? rows.filter((u:any) => (u.role || '').toLowerCase() === 'technician') : [];
      setAssignUsers(techs);
      setScheduledOnly(false);
      setScheduledEmpty(false);
    }catch(e){ /* ignore */ }
  }

  // helper: parse typical backend date strings to YYYY-MM-DD and HH:MM
  function extractDateTimeParts(val?: string|null){
    if (!val) return { date: '', time: '' };
    // try ISO parse
    const d = new Date(val);
    if (!isNaN(d.getTime())){
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      const hh = String(d.getHours()).padStart(2,'0');
      const min = String(d.getMinutes()).padStart(2,'0');
      return { date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` };
    }
    // try dd-MM-yyyy HH:mm or dd-MM-yyyy
    const m = String(val).trim().match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})(?:[ T](\d{1,2}):(\d{2}))?/);
    if (m){
      const day = m[1].padStart(2,'0');
      const mon = m[2].padStart(2,'0');
      const year = m[3];
      const hh = (m[4] || '00').padStart(2,'0');
      const min = (m[5] || '00');
      return { date: `${year}-${mon}-${day}`, time: `${hh}:${min}` };
    }
    return { date: '', time: '' };
  }

  async function loadScheduledTechniciansForWorkOrder(w: WorkOrder){
    try{
      const parts = extractDateTimeParts((w as any).start_date || (w as any).date_doc || null);
      if (!parts.date) return; // nothing to query
      // call scheduled-technicians; backend will infer shift from time
      const siteParamRaw = (w as any).site || (w as any).raw?.site || null;
      const siteParam = extractSiteValueGlobal(siteParamRaw) || null;
      const q = `/scheduled-technicians?date=${encodeURIComponent(parts.date)}${parts.time ? `&time=${encodeURIComponent(parts.time)}` : ''}` + (siteParam ? `&site=${encodeURIComponent(siteParam)}` : '');
      const res = await apiClient(q);
      const rows = res?.data ?? res ?? [];
      const list = Array.isArray(rows) ? rows : [];
      setAssignUsers(list);
      setScheduledEmpty(list.length === 0);
    }catch(e){
      // ignore; keep assignUsers empty so fallback searchUsers works
    }
  }

  async function confirmAssign(){
    if (!assignWo) return;
    if (!selectedAssignee) { setSnackMsg('Pilih teknisi terlebih dahulu'); setSnackSeverity('warning'); setSnackOpen(true); return; }
    try{
      setAssignLoading(true);
      // create a workorder-level assignment for this WO and assignee
      // only include ISO8601 scheduled_start when available (backend validates ISO8601)
      let payload: any = { wo_id: assignWo.id, assigned_to: String(selectedAssignee.id) };
      try {
        if (assignWo && assignWo.start_date) {
          const parsed = new Date(assignWo.start_date);
          if (!isNaN(parsed.getTime())) payload.scheduled_start = parsed.toISOString();
        }
      } catch (_){ /* ignore */ }
      await apiClient('/assignment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });

      // fetch existing assignments and mark other active assignments as CANCELLED
      try{
        const allAssignRes = await apiClient('/assignments');
        const allAssign = Array.isArray(allAssignRes) ? allAssignRes : (allAssignRes?.data ?? allAssignRes ?? []);
        const toCancel = (allAssign || []).filter((a:any) => a && a.wo && String(a.wo.id) === String(assignWo.id) && String(a.assigneeId || a.assignee_id) !== String(selectedAssignee.id) && ['ASSIGNED','DEPLOYED','IN_PROGRESS'].includes((a.status||'').toString()));
        for (const a of toCancel) {
          try{
            await apiClient(`/assignments/${encodeURIComponent(a.id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'CANCELLED' }) });
          }catch(_){ /* ignore per-assignment errors */ }
        }
      }catch(_){ /* ignore fetch errors */ }

      setSnackMsg('Assigned successfully'); setSnackSeverity('success'); setSnackOpen(true);
      setAssignOpen(false);
      // refresh list so UI shows updated assignments
      await load(page);
    }catch(e:any){
      const msg = e?.message || String(e);
      setSnackMsg(msg); setSnackSeverity('error'); setSnackOpen(true);
    }finally{ setAssignLoading(false); }
  }

  async function deleteWorkOrder(id: string){
    if (!confirm('Delete this Work Order? This action cannot be undone.')) return
    try{
      setLoading(true)
      const res = await apiClient(`/work-orders/${id}`, { method: 'DELETE' })
      setSnackMsg('Work order deleted')
      setSnackSeverity('success')
      setSnackOpen(true)
      // reload current page
      await load(page)
    }catch(e:any){
      const msg = e?.message || String(e)
      setSnackMsg(msg)
      setSnackSeverity('error')
      setSnackOpen(true)
    }finally{ setLoading(false) }
  }

  function openEditDate(w: WorkOrder){
    setEditDateWo(w);
    const parts = extractDateTimeParts((w as any).start_date || (w as any).date_doc || null);
    setEditDateDate(parts.date || dateFilter || '');
    setEditDateTime(parts.time || '08:00');
    setEditDateOpen(true);
  }

  async function saveEditDate(){
    if (!editDateWo) return;
    if (!editDateDate || !editDateTime) { setSnackMsg('Tanggal dan jam harus diisi'); setSnackSeverity('warning'); setSnackOpen(true); return; }
    try{
      setEditDateSaving(true);
      const newStartIso = new Date(`${editDateDate}T${editDateTime}:00`).toISOString();
      // compute duration from existing WO if available
      let durationMs = SLOT_DURATION_MIN * 60 * 1000;
      try{
        const s = new Date((editDateWo as any).start_date);
        const e = new Date((editDateWo as any).end_date);
        if (!isNaN(s.getTime()) && !isNaN(e.getTime()) && e.getTime() > s.getTime()) durationMs = e.getTime() - s.getTime();
      }catch(_){ /* ignore */ }
      const newEnd = new Date(new Date(newStartIso).getTime() + durationMs).toISOString();
      await apiClient(`/work-orders/${encodeURIComponent(String(editDateWo.id))}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ start_date: newStartIso, end_date: newEnd }) });
      setSnackMsg('Tanggal diperbarui'); setSnackSeverity('success'); setSnackOpen(true);
      setEditDateOpen(false);
      setEditDateWo(null);
      // refresh list
      await load(page);
    }catch(e:any){ setSnackMsg(e?.message || String(e)); setSnackSeverity('error'); setSnackOpen(true); }
    finally{ setEditDateSaving(false); }
  }

  return (
    <Box sx={{p:3}}>
      <Box sx={{display:'flex', justifyContent:'space-between', alignItems:'center', mb:2}}>
        <Box>
          <Typography variant="h5">Daily Checklist Work Orders</Typography>
          <Typography variant="body2" color="text.secondary">Automatically generated per asset — templates included.</Typography>
        </Box>
        <Box sx={{display:'flex', gap:1, alignItems:'center'}}>
          <TextField
            size="small"
            label="Date"
            type="date"
            value={dateFilter}
            onChange={e=>setDateFilter(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 160 }}
          />
          <TextField
            size="small"
            select
            label="Jenis Alat"
            value={jenisFilter}
            onChange={e=>setJenisFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Types</MenuItem>
            {jenisOptions.map(j => (
              <MenuItem key={j.id} value={String(j.id)}>
                <Box sx={{display:'flex',flexDirection:'column'}}>
                  <Typography variant="body2">{j.name}</Typography>
                  {j.description ? <Typography variant="caption" color="text.secondary">{j.description}</Typography> : null}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Site"
            value={siteFilter}
            onChange={e=>setSiteFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Sites</MenuItem>
            {siteOptions.map((s:any, idx:number) => (
              <MenuItem key={idx} value={String(s.name ?? s.code ?? s.id ?? s.nama ?? s.label ?? s)}>
                <Box sx={{display:'flex',flexDirection:'column'}}>
                  <Typography variant="body2">{s.name || s.nama || s.code || s.label || String(s)}</Typography>
                  {s.description ? <Typography variant="caption" color="text.secondary">{s.description}</Typography> : null}
                </Box>
              </MenuItem>
            ))}
          </TextField>
          {/* <Button variant="contained" onClick={generateToday} disabled={generating}>{generating? 'Generating…':'Generate Work Order'}</Button> */}
          <Button variant="contained" onClick={openCustomGenerate} disabled={generating} sx={{ ml: 1 }}>Custom Generate</Button>
          <Button variant="outlined" onClick={deployAll} disabled={deployingAll || loading || visible.length===0} sx={{ ml: 1 }}>
            {deployingAll ? <><CircularProgress size={14} sx={{mr:1}}/> Deploying...</> : 'Deploy All'}
          </Button>
          {/* <Button variant="outlined" onClick={() => load(page)} disabled={loading}>{loading? <CircularProgress size={18}/> : 'Refresh'}</Button> */}
        </Box>
      </Box>

      {/* errors are shown via Snackbar */}

      <Grid container spacing={2}>
        {loading && (
          <Grid item xs={12}><Box sx={{display:'flex',justifyContent:'center',p:4}}><CircularProgress/></Box></Grid>
        )}

        {!loading && visible.length === 0 && (
          <Grid item xs={12}><Paper sx={{p:3,textAlign:'center'}}>No daily work orders found.</Paper></Grid>
        )}

        {visible.map(w => {
          const rawStatus = (w as any).status ?? (w as any).raw?.status ?? 'NEW';
          const normStatus = normalizeStatusRaw(rawStatus);
          const isCompleted = String(normStatus).toUpperCase().includes('COMPLETED');
          return (
            <Grid item key={w.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <Box>
                      <Typography variant="subtitle1" sx={{fontWeight:700}}>{w.asset_name || `#${w.asset_id}`}</Typography>
                      <Typography variant="caption" color="text.secondary">{w.doc_no}</Typography>
                    </Box>
                    {(() => {
                      const color = getColorForStatus(normStatus);
                      return <Chip label={String(normStatus).replace(/_/g, ' ')} sx={{ background: color, color: 'white', fontWeight: 700, fontSize: 8 }} />;
                    })()}
                  </Box>

                  <Box sx={{mt:1}}>
                    <Typography variant="body2">Start: {w.start_date || '-'}</Typography>
                    <Typography variant="body2">End: {w.end_date || '-'}</Typography>
                    {(() => {
                      const fromMap = assignedMap[w.id];
                      let assignedNames: string[] | undefined = undefined;
                      if (Array.isArray(fromMap) && fromMap.length > 0) assignedNames = fromMap;
                      else if (Array.isArray((w as any).assigned_users) && (w as any).assigned_users.length > 0) assignedNames = (w as any).assigned_users.map((u:any) => u?.name || u?.user_name || String(u?.id || ''));
                      else if ((w as any).raw?.assigned_user_name) assignedNames = [String((w as any).raw.assigned_user_name)];
                      if (assignedNames && assignedNames.length > 0) {
                        return <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>Assigned: {assignedNames.slice(0,3).join(', ')}{assignedNames.length > 3 ? ` (+${assignedNames.length - 3})` : ''}</Typography>
                      }
                      return null;
                    })()}
                  </Box>
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={()=> openChecklist(w)} title="Open Checklist">
                    <ListIcon />
                  </IconButton>
                  {!isCompleted && (
                    <>
                      <IconButton size="small" onClick={()=> openAssignModal(w)} title="Assign Technician">
                        <AssignmentIndIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => openEditDate(w)} title="Edit Time">
                        <EditIcon />
                      </IconButton>
                      {((w as any).status !== 'DEPLOYED') && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => deployWorkOrderById(w.id)}
                          disabled={Boolean(deployingIds[w.id])}
                          startIcon={!deployingIds[w.id] ? <CloudUploadIcon /> : undefined}
                          sx={{ ml: 1 }}
                        >
                          {deployingIds[w.id] ? (
                            <>
                              <CircularProgress size={14} sx={{ mr: 1, color: 'white' }} />
                              DEPLOYING...
                            </>
                          ) : 'DEPLOY'}
                        </Button>
                      )}
                    </>
                  )}
                  <Box sx={{flex:1}} />
                  {!isCompleted && (
                    <IconButton size="small" color="error" onClick={()=> deleteWorkOrder(w.id)} title="Delete">
                      <DeleteIcon />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      <Box sx={{display:'flex',justifyContent:'center',mt:3}}>
        <Pagination count={pages} page={page} onChange={(_,v)=>load(v)} color="primary" />
      </Box>

      <Dialog open={detailOpen} onClose={()=>setDetailOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Work Order Detail</DialogTitle>
        <DialogContent>
          {detailLoading && <Box sx={{p:2}}><CircularProgress/></Box>}
          {!detailLoading && detailWo && (
            <Box sx={{p:1}}>
              {detailWo.error && <Typography color="error">{detailWo.error}</Typography>}
              {!detailWo.error && (
                <Box>
                  <Typography variant="h6">{detailWo.doc_no}</Typography>
                  <Typography variant="subtitle2">{detailWo.asset_name}</Typography>
                  <Typography variant="body2">Start: {detailWo.start_date || '-'}</Typography>
                  <Typography variant="body2">End: {detailWo.end_date || '-'}</Typography>
                  <pre style={{whiteSpace:'pre-wrap',marginTop:12,background:'#f6f8fa',padding:12,borderRadius:6}}>{JSON.stringify(detailWo.raw || detailWo, null, 2)}</pre>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editDateOpen} onClose={()=>{ setEditDateOpen(false); setEditDateWo(null); }} fullWidth maxWidth="xs">
        <DialogTitle>Edit Start Date</DialogTitle>
        <DialogContent>
          <Box sx={{display:'flex',gap:2,mt:1}}>
            <TextField label="Date" type="date" size="small" value={editDateDate} InputLabelProps={{ shrink: true }} sx={{ minWidth: 160 }} disabled />
            <TextField label="Time" type="time" size="small" value={editDateTime} onChange={e=>setEditDateTime(e.target.value)} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <Box sx={{p:1, display:'flex', justifyContent:'flex-end', gap:1}}>
          <Button onClick={()=>{ setEditDateOpen(false); setEditDateWo(null); }}>Cancel</Button>
          <Button variant="contained" onClick={saveEditDate} disabled={editDateSaving}>{editDateSaving ? <CircularProgress size={14}/> : 'Save'}</Button>
        </Box>
      </Dialog>

      <Dialog open={checklistOpen} onClose={closeChecklist} fullWidth maxWidth="sm">
        <DialogTitle>Checklist: {checklistWo ? (checklistWo.asset_name || checklistWo.doc_no) : ''}</DialogTitle>
        <DialogContent>
          {checklistLoading && <Box sx={{p:2, textAlign:'center'}}><CircularProgress/></Box>}
          {!checklistLoading && checklistItems.length === 0 && (
            <Typography color="text.secondary" sx={{p:2}}>No checklist items found for this asset.</Typography>
          )}
          {!checklistLoading && checklistItems.length > 0 && (
            <List>
              {checklistItems.map((q:any, i:number) => (
                <ListItem key={q.id || i} alignItems="flex-start">
                  <ListItemText primary={`${i+1}. ${q.question_text || q.question || q.id}`} secondary={Array.isArray(q.options) && q.options.length>0 ? q.options.map((o:any)=> o.option_text || o.option_value).join(', ') : null} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <Box sx={{p:1, display:'flex', justifyContent:'flex-end'}}>
          <Button onClick={closeChecklist}>Close</Button>
        </Box>
      </Dialog>

      <Dialog open={customOpen} onClose={()=>setCustomOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Custom Generate Work Orders</DialogTitle>
        <DialogContent>
          <Box sx={{display:'flex',gap:2,flexDirection:'column',mt:1}}>
            <Box sx={{display:'flex',gap:2,flexDirection:{xs:'column',md:'row'}}}>
              <Box sx={{flex:1, maxHeight: 320, overflow: 'auto', border: '1px solid rgba(0,0,0,0.08)', borderRadius:1, p:1}}>
                <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
                  <Typography variant="subtitle2">Select assets to generate</Typography>
                  <Box>
                    <Button size="small" onClick={()=> selectAllAssets(true)}>Select all</Button>
                    <Button size="small" onClick={()=> selectAllAssets(false)}>Clear</Button>
                  </Box>
                </Box>
                <List dense subheader={<ListSubheader disableSticky>Assets grouped by type</ListSubheader>}>
                  {(() => {
                    const { groups, descMap } = getAssetGroups();
                    return Object.keys(groups).map(g => (
                      <Box key={g} sx={{mb:1}}>
                        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pl:1,pb:0.5}}>
                          <Box>
                            <Typography variant="body2" sx={{fontWeight:700}}>{g}</Typography>
                            {descMap[g] ? <Typography variant="caption" color="text.secondary" sx={{display:'block'}}>{descMap[g]}</Typography> : null}
                          </Box>
                          <Checkbox size="small" checked={isGroupSelected(g)} onChange={()=>toggleGroupAssets(g)} />
                        </Box>
                        {groups[g].map((a:any)=> (
                          <ListItem key={a.id} secondaryAction={<Checkbox edge="end" checked={isAssetSelected(a)} onChange={()=>toggleAsset(a)} />}>
                            <ListItemText primary={a.name || a.nama || a.label || String(a.id)} secondary={a.kode || a.serial || ''} />
                          </ListItem>
                        ))}
                      </Box>
                    ))
                  })()}
                </List>
              </Box>

              <Box sx={{width:320, maxHeight:320, overflow:'auto', border: '1px solid rgba(0,0,0,0.08)', borderRadius:1, p:1}}>
                {!customStart ? (
                  <Box sx={{p:2}}>
                    <Typography variant="body2" color="text.secondary">Pilih tanggal dan jam pada field "Start (local)" terlebih dahulu untuk memuat teknisi terjadwal.</Typography>
                  </Box>
                ) : (
                  <>
                    <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
                      <Typography variant="subtitle2">Select technicians (rotation pool)</Typography>
                      <Box sx={{display:'flex',alignItems:'center',gap:1}}>
                        {techsFromSchedule ? (
                          scheduledEmpty ? <Chip label="scheduled (no assignments)" size="small" color="warning" sx={{fontSize:11}} /> : <Chip label="scheduled" size="small" color="primary" sx={{fontSize:11}} />
                        ) : (
                          <Chip label="fallback" size="small" variant="outlined" sx={{fontSize:11}} />
                        )}
                        {!scheduledEmpty && (
                          <>
                            <Button size="small" onClick={()=> selectAllTechs(true)}>Select all</Button>
                            <Button size="small" onClick={()=> selectAllTechs(false)}>Clear</Button>
                          </>
                        )}
                      </Box>
                    </Box>
                    {scheduledEmpty ? (
                      <Box sx={{p:2}}>
                        <Typography variant="body2" color="text.secondary">Shift belum diatur untuk site/tanggal/waktu terpilih. Silakan atur shift terlebih dahulu.</Typography>
                      </Box>
                    ) : (
                      <List dense>
                        {(() => {
                          const groups = getTechGroups();
                          return Object.keys(groups).map(g => (
                            <Box key={g} sx={{mb:1}}>
                              <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',pl:1,pb:0.5}}>
                                <Typography variant="body2" sx={{fontWeight:700}}>{g}</Typography>
                                <Checkbox size="small" checked={isTechGroupSelected(g)} onChange={()=>toggleTechGroup(g)} />
                              </Box>
                              {groups[g].map((t:any)=> (
                                <ListItem key={t.id} secondaryAction={<Checkbox edge="end" checked={isTechSelected(t)} onChange={()=>toggleTech(t)} />}>
                                  <ListItemText primary={t.name || t.nipp || t.email || String(t.id)} secondary={t.nipp ? `NIPP: ${t.nipp}` : null} />
                                </ListItem>
                              ))}
                            </Box>
                          ))
                        })()}
                      </List>
                    )}
                  </>
                )}
              </Box>
            </Box>

            <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
              <TextField
                label="Date"
                type="date"
                size="small"
                value={(customStart && !isNaN(new Date(customStart).getTime())) ? new Date(customStart).toISOString().slice(0,10) : (dateFilter || '')}
                InputLabelProps={{ shrink: true }}
                disabled
                sx={{ minWidth: 160 }}
              />
              <TextField
                label="Time"
                type="time"
                size="small"
                value={(() => {
                  try {
                    if (customStart && String(customStart).includes('T') && !isNaN(new Date(customStart).getTime())) {
                      const d = new Date(customStart);
                      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
                    }
                    // fallback: if dateFilter is today use current time, else 08:00
                    return '08:00';
                  } catch (e) { return '08:00'; }
                })()}
                onChange={e=>{
                  const time = String(e.target.value || '').slice(0,5);
                  const datePart = (dateFilter && String(dateFilter).trim()) ? String(dateFilter).trim() : ((customStart && String(customStart).includes('T')) ? String(customStart).split('T')[0] : '');
                  if (datePart) setCustomStart(`${datePart}T${time}`);
                }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            <Box sx={{display:'flex',gap:2,alignItems:'center'}}>
              <Button variant="outlined" onClick={computePreview} disabled={!customStart}>Preview Schedule</Button>
              <Box sx={{ml:2,color:'text.secondary'}}>Each job: {SLOT_DURATION_MIN} min, gap: {SLOT_GAP_MIN} min. Prefer one technician per equipment type; scheduled per-technician to avoid collisions.</Box>
            </Box>

            {previewSchedule.length>0 && (
              <Box>
                <Typography variant="subtitle2" sx={{mt:1}}>Preview ({previewSchedule.length} items)</Typography>
                <List>
                  {previewSchedule.map((it, idx)=> (
                    <ListItem key={idx} sx={{py:0.5}}>
                      <ListItemText primary={`${it.asset_name}`} secondary={`Start: ${new Date(it.start).toLocaleString()} — End: ${new Date(it.end).toLocaleString()} • ${it.assigned_user_name || ''}`} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <Box sx={{p:1,display:'flex',justifyContent:'flex-end'}}>
          <Button onClick={()=>setCustomOpen(false)} disabled={generating}>Cancel</Button>
          <Button variant="contained" onClick={submitCustomGenerate} disabled={generating || previewSchedule.length===0} sx={{ml:1}}>{generating? 'Generating…':'Generate'}</Button>
        </Box>
      </Dialog>

      <Dialog open={assignOpen} onClose={()=>setAssignOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Assign Technician</DialogTitle>
        <DialogContent>
          <Box sx={{mt:1}}>
            <Autocomplete
              options={assignUsers}
              openOnFocus
              getOptionLabel={(opt:any) => opt ? (opt.name || opt.nipp || opt.email || opt.id) : ''}
              value={selectedAssignee}
              onChange={(_, v) => setSelectedAssignee(v)}
              onInputChange={(_, v) => { if (v && v.length >= 2) searchUsers(v); }}
              noOptionsText="No technicians found"
              renderInput={(params) => <TextField {...params} label="Search technician (name/NIPP)" variant="outlined" fullWidth />}
            />
            {scheduledEmpty && (
              <Box sx={{mt:1,display:'flex',gap:1,alignItems:'center'}}>
                <Typography variant="body2" color="text.secondary">No technicians scheduled for this WO's shift/date.</Typography>
                <Button size="small" onClick={async ()=>{ await loadAllTechnicians(); }}>Show all technicians</Button>
              </Box>
            )}
            <Box sx={{mt:2}}>
              <Typography variant="caption" color="text.secondary">Tip: ketik 2+ karakter untuk mencari teknisi.</Typography>
            </Box>
          </Box>
        </DialogContent>
        <Box sx={{p:1, display:'flex', justifyContent:'flex-end'}}>
          <Button onClick={()=>setAssignOpen(false)} disabled={assignLoading}>Cancel</Button>
          <Button variant="contained" onClick={confirmAssign} disabled={assignLoading} sx={{ml:1}}>{assignLoading? 'Assigning…':'Assign'}</Button>
        </Box>
      </Dialog>
      <Snackbar open={snackOpen} autoHideDuration={4000} onClose={()=>setSnackOpen(false)} anchorOrigin={{vertical:'bottom', horizontal:'center'}}>
        <Alert onClose={()=>setSnackOpen(false)} severity={snackSeverity} sx={{ width: '100%' }}>{snackMsg}</Alert>
      </Snackbar>
    </Box>
  )
}
