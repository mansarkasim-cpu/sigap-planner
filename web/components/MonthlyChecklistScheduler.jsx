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
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function MonthlyChecklistScheduler(){
  const [site, setSite] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    // default to start of current week (Monday)
    const day = d.getDay();
    const diffToMon = (day === 0 ? -6 : 1) - day; // if Sunday(0) go back 6 days
    const mon = new Date(d);
    mon.setDate(d.getDate() + diffToMon);
    return `${mon.getFullYear()}-${String(mon.getMonth()+1).padStart(2,'0')}-${String(mon.getDate()).padStart(2,'0')}`;
  });
  const [weekDates, setWeekDates] = useState([]);
  const [alats, setAlats] = useState([]);
  const [sites, setSites] = useState([]);
  const [assignmentsByDate, setAssignmentsByDate] = useState({});
  const [assignmentsLoaded, setAssignmentsLoaded] = useState(false);
  const [previewItems, setPreviewItems] = useState([]); // now per-technician
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(200);

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
    // Build preview grouped by technician for the selected week (7 days)
    if (!users || users.length === 0) return setPreviewItems([]);
    // compute weekDates from selectedDate (assumed monday)
    const mon = new Date(selectedDate);
    const days = [];
    for (let i=0;i<7;i++){ const d = new Date(mon); d.setDate(mon.getDate()+i); days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`); }
    setWeekDates(days);

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
      // scheduledByDay: whether this tech is scheduled on given date (default true while assignments not loaded)
      scheduledByDay: days.reduce((acc, dd) => { acc[dd] = (!assignmentsLoaded) ? true : Boolean(scheduledMap[dd] && scheduledMap[dd].has(String(u.id))); return acc; }, {}),
      startTime: '08:00:00Z',
      endTime: '08:15:00Z',
    }));

    // Pre-assign assets based on shift-assignments per day (round-robin distribution)
    try {
      const assets = Array.isArray(alats) ? alats.map(a => a.id) : [];
      for (const d of days) {
        // use scheduledMap to get memberIds in insertion order from assign rows
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
        const previewIdxs = memberIds.map(mid => items.findIndex(it => String(it.techId) === String(mid))).filter(idx => idx >= 0);
        if (previewIdxs.length === 0) continue;

        for (let i = 0; i < assets.length; i++) {
          const target = previewIdxs[i % previewIdxs.length];
          items[target].assignedAssetIdsByDay[d].push(assets[i]);
        }
      }
    } catch (e) {
      // if pre-assign fails for any reason, ignore and leave empty assignments
      console.debug('pre-assign failed', e);
    }

    setPreviewItems(items);
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

  async function handleLoad(){
    if (!site) return alert('Pilih site terlebih dahulu');
    setLoading(true);
    setAssignmentsLoaded(false);
    await Promise.all([loadAlats(), loadShiftAssignments(), loadUsers()]);
    setLoading(false);
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

  useEffect(()=>{ buildPreview(); }, [alats, assignmentsByDate, selectedDate, users]);

  async function handleSubmit(){
    if (!confirm('Kirim jadwal preview ini ke server untuk dibuatkan Work Orders daily?')) return;
    const payload = [];
    for (const it of previewItems) {
      const techId = it.techId;
      const techName = it.techName;
      for (const aid of (it.assignedAssetIds || [])) {
        payload.push({
          asset_id: aid,
          asset_name: (alats.find(a=>String(a.id)===String(aid))?.nama || alats.find(a=>String(a.id)===String(aid))?.name || String(aid)),
          start: it.start,
          end: it.end,
          assigned_user_id: techId,
          assigned_user_name: techName,
          jenis_alat_id: null,
        });
      }
    }
    try{
      const res = await apiClient('/work-orders/generate-daily', { method: 'POST', body: { items: payload } });
      alert('Server response: ' + (res?.message || 'OK'));
    }catch(e){ alert('Gagal mengirim jadwal'); }
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
  const totalAssigned = useMemo(() => previewItems.reduce((s, p) => s + ((p.assignedAssetIds || []).length), 0), [previewItems]);

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField select label="Site" size="small" value={site} onChange={e=>{ setSite(e.target.value); }} sx={{width:180, '& .MuiInputBase-input': { fontSize: '0.85rem' }}}>
          <MenuItem value="">-- Select site --</MenuItem>
          {sites.map(s => (<MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.id}</MenuItem>))}
        </TextField>
        <TextField type="date" label="Week Start (Mon)" size="small" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)} sx={{width:150, '& .MuiInputBase-input': { fontSize: '0.85rem' }}} InputLabelProps={{shrink:true}} />
        <Button variant="contained" onClick={handleLoad} disabled={loading}>{loading? 'Loading...':'Load Preview'}</Button>
        <Button variant="outlined" onClick={buildPreview}>Rebuild Preview</Button>
        <Box sx={{ flex: 1 }} />
        <TextField select size="small" label="Page size" value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }} sx={{width:120, '& .MuiInputBase-input': { fontSize: '0.78rem' }}}>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
          <MenuItem value={200}>200</MenuItem>
          <MenuItem value={500}>500</MenuItem>
        </TextField>
        <Button color="success" variant="contained" onClick={handleSubmit}>Submit All</Button>
      </Stack>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2">Technicians: <strong>{previewItems.length}</strong> — Assigned assets this week: <strong>{totalAssigned}</strong></Typography>
        <Pagination count={totalPages} page={page} onChange={(e,v)=>setPage(v)} color="primary" />
      </Stack>

      <Paper variant="outlined">
        <TableContainer sx={{ maxHeight: '60vh' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{width:120}}>Technician</TableCell>
                {weekDates.map(d => (<TableCell key={d} sx={{minWidth:220}}>{d}</TableCell>))}
                <TableCell sx={{width:160}}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pageItems.map((it, i) => {
                const globalIdx = (page-1)*pageSize + i;
                return (
                  <TableRow key={`${it.techId}_${globalIdx}`} hover>
                    <TableCell>{it.techName}</TableCell>
                    {weekDates.map(d => (
                      <TableCell key={d}>
                        <Select
                          fullWidth
                          multiple
                          size="small"
                          value={it.assignedAssetIdsByDay ? (it.assignedAssetIdsByDay[d] || []) : []}
                          disabled={assignmentsLoaded ? !(it.scheduledByDay && it.scheduledByDay[d]) : false}
                          onChange={e => {
                            const vals = e.target.value || [];
                            setPreviewItems(prev => {
                              const copy = [...prev];
                              copy[globalIdx] = copy[globalIdx] || {};
                              copy[globalIdx].assignedAssetIdsByDay = { ...(copy[globalIdx].assignedAssetIdsByDay || {}) };
                              copy[globalIdx].assignedAssetIdsByDay[d] = Array.isArray(vals) ? vals : [];
                              return copy;
                            });
                          }}
                          sx={{ minWidth: 160, '& .MuiSelect-select': { fontSize: '0.78rem' } }}
                          renderValue={(selected) => {
                            if (!selected || selected.length === 0) return '-- none --';
                            return (selected || []).map(sid => (alats.find(a=>String(a.id)===String(sid))?.nama || alats.find(a=>String(a.id)===String(sid))?.name || String(sid))).join(', ');
                          }}
                        >
                          {alats.map(a => (
                            <MenuItem key={a.id} value={a.id} sx={{ fontSize: '0.78rem' }}>
                              <Checkbox checked={((it.assignedAssetIdsByDay && it.assignedAssetIdsByDay[d])||[]).indexOf(a.id) > -1} />
                              <ListItemText primary={a.nama || a.name || a.label || a.id} primaryTypographyProps={{ fontSize: '0.78rem' }} />
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    ))}
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton size="small" onClick={()=>{
                          // clear all days for this tech
                          setPreviewItems(prev => {
                            const copy = [...prev];
                            copy[globalIdx] = { ...copy[globalIdx] };
                            copy[globalIdx].assignedAssetIdsByDay = (copy[globalIdx].assignedAssetIdsByDay || {});
                            for (const d of weekDates) copy[globalIdx].assignedAssetIdsByDay[d] = [];
                            return copy;
                          });
                        }} title="Clear">
                          <ClearIcon fontSize="small" />
                        </IconButton>
                        <Button startIcon={<PersonAddIcon />} size="small" onClick={()=>{
                          // assign all assets for all days to this tech
                          setPreviewItems(prev => {
                            const copy = [...prev];
                            copy[globalIdx] = { ...copy[globalIdx] };
                            copy[globalIdx].assignedAssetIdsByDay = (copy[globalIdx].assignedAssetIdsByDay || {});
                            const allIds = (alats||[]).map(a=>a.id);
                            for (const d of weekDates) copy[globalIdx].assignedAssetIdsByDay[d] = allIds.slice();
                            return copy;
                          });
                        }}>Assign All (week)</Button>
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
