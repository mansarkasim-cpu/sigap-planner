"use client";
import React, { useEffect, useState, useMemo } from 'react';
import apiClient from '../lib/api-client';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  IconButton,
  Stack,
  Pagination,
  Checkbox,
  ListItemText,
  Chip,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export default function MonthlyChecklistScheduler(){
  const [site, setSite] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  });
  const [alats, setAlats] = useState([]);
  const [sites, setSites] = useState([]);
  const [assignmentsByDate, setAssignmentsByDate] = useState({});
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [previewItems, setPreviewItems] = useState([]); // now per-technician
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [shiftGroups, setShiftGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);
  const [existingSchedule, setExistingSchedule] = useState(null); // data dari DB jika sudah ada

  async function loadAlats(){
    try{
      const qs = site ? `?site_id=${encodeURIComponent(site)}&page=1&pageSize=1000` : '?page=1&pageSize=1000';
      const res = await apiClient(`/master/alats${qs}`);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setAlats(list || []);
    }catch(e){ setAlats([]); }
  }

  async function loadShiftAssignments(){
    try{
      // shift-assignments expects site name/code, try resolve from selected site id
      let siteName = '';
      try{ const s = sites.find(ss => String(ss.id) === String(site)); if (s) siteName = s.name || s.nama || s.code || String(s.id); }catch(e){}
      const siteQuery = siteName ? `&site=${encodeURIComponent(siteName)}` : (site ? `&site=${encodeURIComponent(site)}` : '');
      const res = await apiClient(`/shift-assignments?date=${encodeURIComponent(selectedDate)}${siteQuery}`);
      const rows = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      const map = {};
      for (const r of rows || []){
        map[r.date] = map[r.date] || [];
        map[r.date].push(r);
      }
      setAssignmentsByDate(map);
      setAssignmentsLoaded(true);
    }catch(e){ setAssignmentsByDate({}); }
  }

  function buildPreview(){
    // Build preview grouped by technician for the selected day
    if (!users || users.length === 0) return setPreviewItems([]);
    const days = [selectedDate];

    // build scheduled map per day: set of member ids scheduled that day
    const scheduledMap = {};
    for (const d of days) {
      const assignRows = assignmentsByDate[d] || [];
      const memberIds = [];
      for (const row of assignRows) {
        const members = row.members || row.groupMembers || row.group_members || [];
        if (Array.isArray(members) && members.length>0) {
          for (const m of members) {
            const mid = (m && (m.id || m.user_id || m.member_id)) ? (m.id || m.user_id || m.member_id) : (typeof m === 'string' || typeof m === 'number' ? m : null);
            if (mid != null) memberIds.push(String(mid));
          }
        } else if (row.user_id || row.user || row.tech_id) {
          const mid = row.user_id || (row.user && row.user.id) || row.tech_id;
          if (mid != null) memberIds.push(String(mid));
        }
      }
      scheduledMap[d] = new Set(memberIds.map(String));
    }

    const items = users.map(u => ({
      techId: u.id,
      techName: u.name || u.nama || u.label || String(u.id),
      // assignedAssetIdsByDay: object keyed by date -> array of asset ids
      assignedAssetIdsByDay: days.reduce((acc, dd) => { acc[dd] = []; return acc; }, {}),
      // scheduledByDay: whether this tech is scheduled on given date
      // If assignments not yet loaded → default true (optimistic). If loaded but no data for date → false (no shift = no access)
      scheduledByDay: days.reduce((acc, dd) => {
        if (!assignmentsLoaded) { acc[dd] = true; return acc; }
        acc[dd] = Boolean(scheduledMap[dd] && scheduledMap[dd].has(String(u.id)));
        return acc;
      }, {}),
      startTime: '08:00:00Z',
      endTime: '08:15:00Z',
    }));

    // Pre-assign assets: skipped — use Auto Assign button to distribute assets

    // Sort items by group name so same-group technicians appear together
    if (shiftGroups && shiftGroups.length > 0) {
      const groupOrderMap = {};
      for (let gi = 0; gi < shiftGroups.length; gi++) {
        for (const m of (Array.isArray(shiftGroups[gi].members) ? shiftGroups[gi].members : [])) {
          groupOrderMap[String(m)] = gi;
        }
      }
      items.sort((a, b) => {
        const ga = groupOrderMap[String(a.techId)] ?? 9999;
        const gb = groupOrderMap[String(b.techId)] ?? 9999;
        if (ga !== gb) return ga - gb;
        return (a.techName || '').localeCompare(b.techName || '');
      });
    }

    setPreviewItems(items);

    // Jika sudah ada data tersimpan, overlay assignment dari DB
    if (existingSchedule && Array.isArray(existingSchedule.assignments) && existingSchedule.assignments.length > 0) {
      const d = selectedDate;
      const saved = existingSchedule.assignments;
      items.forEach(it => { it.assignedAssetIdsByDay[d] = []; });
      for (const a of saved) {
        const assetId = a.asset?.id ?? a.asset_id;
        const userId  = a.user?.id  ?? a.user_id;
        if (assetId == null || userId == null) continue;
        const idx = items.findIndex(it => String(it.techId) === String(userId));
        if (idx >= 0) items[idx].assignedAssetIdsByDay[d].push(Number(assetId));
      }
      setPreviewItems([...items]);
    }

    setPage(1);
  }

  async function loadUsers(){
    try{
      // prefer loading users filtered by selected site (use site.name if available)
      let siteName = '';
      try{ const s = sites.find(ss => String(ss.id) === String(site)); if (s) siteName = s.name || s.nama || s.code || String(s.id); }catch(e){}
      const url = siteName ? `/users?site=${encodeURIComponent(siteName)}&page=1&pageSize=1000` : '/users?page=1&pageSize=1000';
      const res = await apiClient(url);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      const techs = (list || []).filter(u => {
        if (!u) return false;
        const role = u.role || '';
        if (typeof role === 'string') return role.toLowerCase().includes('technician');
        if (Array.isArray(role)) return role.map(String).some(r => r.toLowerCase().includes('technician'));
        return false;
      });
      setUsers(techs || []);
    }catch(e){ setUsers([]); }
  }

  async function loadGroups(){
    try{
      let siteName = '';
      try{ const s = sites.find(ss => String(ss.id) === String(site)); if (s) siteName = s.name || s.nama || s.code || String(s.id); }catch(e){}
      const url = siteName ? `/shift-groups?site=${encodeURIComponent(siteName)}` : '/shift-groups';
      const res = await apiClient(url);
      const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      setShiftGroups(list || []);
    }catch(e){ setShiftGroups([]); }
  }

  async function loadExistingSchedule(){
    try{
      const siteObj = sites.find(ss => String(ss.id) === String(site));
      const siteIdParam = siteObj ? `&site_id=${encodeURIComponent(siteObj.id)}` : '';
      const res = await apiClient(`/daily-checklist-schedules?date=${encodeURIComponent(selectedDate)}${siteIdParam}`);
      const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
      setExistingSchedule(list && list.length > 0 ? list[0] : null);
    }catch(e){ setExistingSchedule(null); }
  }

  async function handleLoad(){
    if (!site) return alert('Pilih site terlebih dahulu');
    setLoading(true);
    setAssignmentsLoaded(false);
    await Promise.all([loadAlats(), loadShiftAssignments(), loadUsers(), loadGroups(), loadExistingSchedule()]);
    setLoading(false);
  }

  function handleAutoAssign(){
    // Round-robin distribute assets among scheduled technicians for selectedDate
    const assets = (alats || []).map(a => a.id);
    if (assets.length === 0) return;
    const scheduled = previewItems
      .map((it, idx) => ({ idx, it }))
      .filter(({ it }) => assignmentsLoaded ? Boolean(it.scheduledByDay?.[selectedDate]) : true);
    if (scheduled.length === 0) return;
    setPreviewItems(prev => {
      const copy = prev.map(it => ({
        ...it,
        assignedAssetIdsByDay: { ...(it.assignedAssetIdsByDay || {}), [selectedDate]: [] },
      }));
      for (let i = 0; i < assets.length; i++) {
        const target = scheduled[i % scheduled.length].idx;
        copy[target].assignedAssetIdsByDay[selectedDate].push(assets[i]);
      }
      return copy;
    });
  }

  // load master sites and try to set user's default site
  useEffect(() => {
    let mounted = true;
    async function loadSites(){
      try{
        let userSiteName = null;
        try{
          const me = await apiClient('/auth/me').catch(()=>null);
          const us = me?.site ?? (me?.data && me.data.site) ?? null;
          if (us) userSiteName = (us.name || us.code || (us.id ? String(us.id) : null) || String(us)).toString();
        }catch(e){}

        const r = await apiClient('/master/sites?limit=1000');
        const rows = r?.data ?? r ?? [];
        const list = Array.isArray(rows) ? rows.map(rr => ({ id: rr.id ?? rr.site_id ?? rr.code ?? rr.name, name: rr.name || rr.nama || rr.code || String(rr.id) })) : [];
        if (!mounted) return;
        setSites(list);
        if (userSiteName) {
          const found = list.find(x => String(x.name).toLowerCase() === String(userSiteName).toLowerCase() || String(x.id) === String(userSiteName));
            if (found) {
              setSite(found.id || found.name);
            } else {
              // fallback: set raw userSiteName if no exact match
              setSite(userSiteName);
            }
        }
      }catch(e){ setSites([]); }
    }
    loadSites();
    return () => { mounted = false; };
  }, []);

  useEffect(()=>{ buildPreview(); }, [alats, assignmentsByDate, selectedDate, users, shiftGroups, existingSchedule]);

  // Re-fetch shift assignments & existing schedule whenever date changes (only after initial load)
  useEffect(()=>{
    if (!assignmentsLoaded) return; // belum pernah load, skip
    setAssignmentsLoaded(false);
    Promise.all([loadShiftAssignments(), loadExistingSchedule()]);
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(){
    if (!confirm('Simpan jadwal daily checklist ini ke server?')) return;
    // Flatten: collect all (asset_id, user_id) pairs that have assignments
    const assignments = [];
    for (const it of previewItems) {
      const assetIds = (it.assignedAssetIdsByDay && it.assignedAssetIdsByDay[selectedDate]) || [];
      for (const aid of assetIds) {
        assignments.push({ asset_id: aid, user_id: it.techId });
      }
    }
    if (assignments.length === 0) return alert('Belum ada asset yang di-assign.');
    const siteObj = sites.find(s => String(s.id) === String(site));
    try{
      const res = await apiClient('/daily-checklist-schedules', {
        method: 'POST',
        body: { date: selectedDate, site_id: siteObj ? siteObj.id : undefined, assignments },
      });
      alert('Jadwal tersimpan: ' + (res?.message || 'OK'));
    }catch(e){ alert('Gagal menyimpan jadwal'); }
  }

  function setAssigneeForItem(idx, userId, userName){
    setPreviewItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], techId: userId, techName: userName };
      return copy;
    });
  }

  function setAssetsForTech(idx, assetIds){
    setPreviewItems(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], assignedAssetIds: Array.isArray(assetIds) ? assetIds : [] };
      return copy;
    });
  }

  function assignAllToTech(idx){
    const allIds = (alats || []).map(a => a.id);
    setAssetsForTech(idx, allIds);
  }

  function clearAssetsForTech(idx){
    setAssetsForTech(idx, []);
  }

  const totalPages = useMemo(()=> Math.max(1, Math.ceil(previewItems.length / pageSize)), [previewItems.length, pageSize]);
  const pageItems = useMemo(()=> previewItems.slice((page-1)*pageSize, page*pageSize), [previewItems, page, pageSize]);
  const totalAssigned = useMemo(() => previewItems.reduce((s, p) => s + ((p.assignedAssetIdsByDay?.[selectedDate] || []).length), 0), [previewItems, selectedDate]);

  // Map assetId -> techId that currently holds it for selectedDate (across ALL previewItems, not just pageItems)
  const assetOwnerMap = useMemo(() => {
    const map = {};
    for (const it of previewItems) {
      for (const aid of (it.assignedAssetIdsByDay?.[selectedDate] || [])) {
        map[String(aid)] = String(it.techId);
      }
    }
    return map;
  }, [previewItems, selectedDate]);

  // Map userId -> groupName from loaded shift groups
  const userGroupMap = useMemo(() => {
    const map = {};
    for (const g of (shiftGroups || [])) {
      const gname = g.name || g.groupName || String(g.id);
      for (const m of (Array.isArray(g.members) ? g.members : [])) {
        map[String(m)] = gname;
      }
    }
    return map;
  }, [shiftGroups]);

  // Build grouped rows for the table: insert header rows when group changes
  const groupedRows = useMemo(() => {
    if (!shiftGroups || shiftGroups.length === 0) {
      return pageItems.map((it, i) => ({ type: 'row', item: it, globalIdx: (page-1)*pageSize + i }));
    }
    const rows = [];
    let lastGroup = undefined;
    pageItems.forEach((it, i) => {
      const globalIdx = (page-1)*pageSize + i;
      const group = userGroupMap[String(it.techId)] || '(Tanpa Grup)';
      if (group !== lastGroup) {
        rows.push({ type: 'header', groupName: group });
        lastGroup = group;
      }
      rows.push({ type: 'row', item: it, globalIdx });
    });
    return rows;
  }, [pageItems, userGroupMap, shiftGroups, page, pageSize]);

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField select label="Site" size="small" value={site} onChange={e=>{ setSite(e.target.value); }} sx={{width:180, '& .MuiInputBase-input': { fontSize: '0.85rem' }}}>
          <MenuItem value="">-- Select site --</MenuItem>
          {sites.map(s => (<MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.id}</MenuItem>))}
        </TextField>
        <TextField type="date" label="Tanggal" size="small" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} sx={{width:150, '& .MuiInputBase-input': { fontSize: '0.85rem' }}} InputLabelProps={{shrink:true}} />
        <Button variant="contained" onClick={handleLoad} disabled={loading}>{loading? 'Loading...':'Load Preview'}</Button>
        <Button variant="outlined" onClick={buildPreview}>Rebuild Preview</Button>
        <Button variant="outlined" color="secondary" onClick={handleAutoAssign} disabled={previewItems.length === 0 || alats.length === 0}>Auto Assign</Button>
        <Box sx={{ flex: 1 }} />
        <TextField select size="small" label="Page size" value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }} sx={{width:120, '& .MuiInputBase-input': { fontSize: '0.78rem' }}}>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </TextField>
        <Button color="success" variant="contained" onClick={handleSubmit}>
          {existingSchedule ? 'Update Jadwal' : 'Simpan Jadwal'}
        </Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">Technicians: <strong>{previewItems.length}</strong> — Assigned assets ({selectedDate}): <strong>{totalAssigned}</strong> / <strong>{alats.length}</strong></Typography>
          {existingSchedule && (
            <Chip size="small" color="success" label="Jadwal tersimpan" />
          )}
        </Stack>
        <Pagination count={totalPages} page={page} onChange={(e,v)=>setPage(v)} color="primary" />
      </Stack>

      <Paper variant="outlined">
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{width:180}}>Technician</TableCell>
                <TableCell sx={{minWidth:260}}>Assets — {selectedDate}</TableCell>
                <TableCell sx={{width:160}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupedRows.map((entry, rowIdx) => {
                if (entry.type === 'header') {
                  return (
                    <TableRow key={`group_${rowIdx}_${entry.groupName}`}>
                      <TableCell colSpan={3} sx={{ bgcolor: 'action.selected', fontWeight: 700, fontSize: '0.8rem', py: 0.5, pl: 2 }}>
                        {entry.groupName}
                      </TableCell>
                    </TableRow>
                  );
                }
                const { item: it, globalIdx } = entry;
                const currentAssets = (it.assignedAssetIdsByDay && it.assignedAssetIdsByDay[selectedDate]) || [];
                const isScheduled = assignmentsLoaded ? Boolean(it.scheduledByDay && it.scheduledByDay[selectedDate]) : true;
                const techIdStr = String(it.techId);
                return (
                  <TableRow key={`${it.techId}_${globalIdx}`} hover>
                    <TableCell sx={{ opacity: isScheduled ? 1 : 0.4 }}>{it.techName}</TableCell>
                    <TableCell>
                      <Select
                        fullWidth
                        multiple
                        size="small"
                        value={currentAssets}
                        disabled={!isScheduled}
                        onChange={e => {
                          const vals = e.target.value || [];
                          setPreviewItems(prev => {
                            const copy = [...prev];
                            copy[globalIdx] = { ...copy[globalIdx] };
                            copy[globalIdx].assignedAssetIdsByDay = { ...(copy[globalIdx].assignedAssetIdsByDay || {}) };
                            copy[globalIdx].assignedAssetIdsByDay[selectedDate] = Array.isArray(vals) ? vals : [];
                            return copy;
                          });
                        }}
                        sx={{ minWidth: 200, '& .MuiSelect-select': { fontSize: '0.78rem' } }}
                        renderValue={(selected) => {
                          if (!selected || selected.length === 0) return '-- none --';
                          return selected.map(sid => (alats.find(a=>String(a.id)===String(sid))?.nama || alats.find(a=>String(a.id)===String(sid))?.name || String(sid))).join(', ');
                        }}
                      >
                        {alats.map(a => {
                            const aidStr = String(a.id);
                            const owner = assetOwnerMap[aidStr];
                            const takenByOther = owner !== undefined && owner !== techIdStr;
                            return (
                              <MenuItem key={a.id} value={a.id} sx={{ fontSize: '0.78rem' }} disabled={takenByOther}>
                                <Checkbox checked={currentAssets.indexOf(a.id) > -1} />
                                <ListItemText primary={a.nama || a.name || a.label || a.id} primaryTypographyProps={{ fontSize: '0.78rem', color: takenByOther ? 'text.disabled' : 'inherit' }} />
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" onClick={()=>{
                          setPreviewItems(prev => {
                            const copy = [...prev];
                            copy[globalIdx] = { ...copy[globalIdx] };
                            copy[globalIdx].assignedAssetIdsByDay = { ...(copy[globalIdx].assignedAssetIdsByDay || {}) };
                            copy[globalIdx].assignedAssetIdsByDay[selectedDate] = [];
                            return copy;
                          });
                        }} title="Clear">
                          <ClearIcon fontSize="small" />
                        </IconButton>

                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
