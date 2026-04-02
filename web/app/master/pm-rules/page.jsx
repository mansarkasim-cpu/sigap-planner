"use client";
import React, { useEffect, useState } from 'react';
import apiClient from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function PMRulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filterJenisId, setFilterJenisId] = useState('');
  const [jenisOptions, setJenisOptions] = useState([]);
  const [alatOptions, setAlatOptions] = useState([]);
  const [form, setForm] = useState({ kode_rule:'', description:'', jenis_alat_id:'', alat_id:'', interval_hours:250, multiplier:1, start_engine_hour:0, active:true });
  const [editingId, setEditingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [allAlatsMap, setAllAlatsMap] = useState({});
  const [snack, setSnack] = useState({ open:false, msg:'', severity:'success' });

  async function loadRules(jenisId) {
    setLoading(true);
    try {
      const params = jenisId ? `?jenis_alat_id=${encodeURIComponent(jenisId)}` : '';
      const json = await apiClient('/pm/rules' + params);
      setRules(json.data || []);
    } catch (e) {
      console.error('loadRules', e);
      alert(e?.message || 'Failed to load rules');
    } finally { setLoading(false); }
  }

  async function loadJenis() {
    try {
      const data = await apiClient('/master/jenis-alat');
      // api may return array or object
      const rows = Array.isArray(data) ? data : (data.data || data);
      setJenisOptions(rows || []);
    } catch (e) { console.error('loadJenis', e); }
  }

  async function loadAlats(jenisId) {
    try {
      const params = jenisId ? `?jenis_alat_id=${jenisId}` : '';
      const data = await apiClient('/master/alats' + params);
      const rows = Array.isArray(data) ? data : (data.data || data);
      setAlatOptions(rows || []);
    } catch (e) { console.error('loadAlats', e); }
  }

  async function loadAllAlats() {
    try {
      const data = await apiClient('/master/alats');
      const rows = Array.isArray(data) ? data : (data.data || data);
      const map = {};
      (rows || []).forEach(a => { map[a.id] = a; });
      setAllAlatsMap(map);
    } catch (e) { console.error('loadAllAlats', e); }
  }

  useEffect(()=>{ loadRules(); loadJenis(); loadAllAlats(); }, []);

  // reload rules when jenis filter changes
  useEffect(()=>{ loadRules(filterJenisId); }, [filterJenisId]);

  useEffect(()=>{ if (form.jenis_alat_id) loadAlats(form.jenis_alat_id); else setAlatOptions([]); }, [form.jenis_alat_id]);

  function getJenisLabel(jenisId) {
    if (!jenisId) return '-';
    const j = jenisOptions.find(x => String(x.id) === String(jenisId));
    if (!j) return jenisId;
    return j.nama || j.name || j.description || jenisId;
  }

  function onChange(k, v) { setForm(prev => ({ ...prev, [k]: v })); }

  function startEdit(r) { setEditingId(r.id); setForm({ kode_rule:r.kode_rule||'', description:r.description||'', jenis_alat_id:r.jenis_alat_id||'', alat_id:r.alat_id||'', interval_hours:r.interval_hours||250, multiplier:r.multiplier||1, start_engine_hour:r.start_engine_hour||0, active: r.active === true }); setModalOpen(true); }

  function resetForm() { setEditingId(null); setForm({ kode_rule:'', description:'', jenis_alat_id:'', alat_id:'', interval_hours:250, multiplier:1, start_engine_hour:0, active:true }); setModalOpen(false); }

  async function save() {
    if (!form.kode_rule || String(form.kode_rule).trim() === '') return alert('Kode rule is required');
    if (!form.interval_hours || Number(form.interval_hours) <= 0) return alert('interval_hours must be > 0');
    setSaving(true);
    try {
      if (editingId) {
        await apiClient(`/pm/rules/${editingId}`, { method: 'PATCH', body: form });
      } else {
        await apiClient('/pm/rules', { method: 'POST', body: form });
      }
      await loadRules();
      resetForm();
      setSnack({ open:true, msg: editingId ? 'Rule updated' : 'Rule created', severity:'success' });
    } catch (e) {
      console.error('save', e);
      setSnack({ open:true, msg: e?.message || 'Save failed', severity:'error' });
    } finally { setSaving(false); }
  }

  async function remove(id) {
    if (!confirm('Hapus rule ini?')) return;
    try {
      await apiClient(`/pm/rules/${id}`, { method: 'DELETE' });
      await loadRules();
      setSnack({ open:true, msg: 'Rule deleted', severity:'success' });
    } catch (e) { console.error('remove', e); alert('Delete failed'); }
  }

  return (
    <Box sx={{ p:2 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Box>
          <Box component="h2" sx={{ m:0 }}>PM Rules (Master)</Box>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Define PM interval rules per equipment type or specific equipment</Box>
        </Box>
        <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
          <Select size="small" value={filterJenisId} onChange={e=>setFilterJenisId(e.target.value)} displayEmpty sx={{ minWidth:220, mr:1 }}>
            <MenuItem value="">-- All Jenis Alat --</MenuItem>
            {jenisOptions.map(j => (<MenuItem key={j.id} value={j.id}>{j.nama}</MenuItem>))}
          </Select>
          <Button variant="outlined" onClick={()=>{ loadRules(filterJenisId); loadJenis(); }}>Refresh</Button>
          <Button variant="contained" onClick={()=>{ resetForm(); setModalOpen(true); }} startIcon={<EditIcon/>} sx={{ ml:1 }}>Create Rule</Button>
        </Box>
      </Box>

      <Box sx={{ display:'flex', gap:3 }}>
    <Paper sx={{ flex:1, p:1 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kode</TableCell>
                  <TableCell>Desc</TableCell>
                  <TableCell>Jenis</TableCell>
                  <TableCell>Alat</TableCell>
                  <TableCell>Interval</TableCell>
                  <TableCell>Mult</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map(r => (
                  <TableRow key={r.id} hover>
                    <TableCell>{r.id}</TableCell>
                    <TableCell>{r.kode_rule || (r.interval_hours ? `PM${r.interval_hours}` : '')}</TableCell>
                    <TableCell sx={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.description}</TableCell>
                      <TableCell>{getJenisLabel(r.jenis_alat_id)}</TableCell>
                      <TableCell>{(allAlatsMap[r.alat_id]?.nama) || r.alat_id || '-'}</TableCell>
                    <TableCell>{r.interval_hours}</TableCell>
                    <TableCell>{r.multiplier}</TableCell>
                    <TableCell>{r.active ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={()=>startEdit(r)}><EditIcon fontSize="small"/></IconButton>
                      <IconButton size="small" color="error" onClick={()=>remove(r.id)}><DeleteIcon fontSize="small"/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      <Dialog open={modalOpen} onClose={()=>setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? 'Edit PM Rule' : 'Create PM Rule'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display:'grid', gap:1, mt:1 }}>
            <TextField label="Kode Rule" value={form.kode_rule} onChange={e=>onChange('kode_rule', e.target.value)} size="small" fullWidth />
            <TextField label="Description" value={form.description} onChange={e=>onChange('description', e.target.value)} size="small" fullWidth />
            <Select size="small" value={form.jenis_alat_id || ''} onChange={e=>onChange('jenis_alat_id', e.target.value)} displayEmpty fullWidth>
              <MenuItem value="">-- Select Jenis Alat (optional) --</MenuItem>
              {jenisOptions.map(j => (<MenuItem key={j.id} value={j.id}>{j.nama} {j.kode? `(${j.kode})` : ''}</MenuItem>))}
            </Select>
            <Select size="small" value={form.alat_id || ''} onChange={e=>onChange('alat_id', e.target.value)} displayEmpty fullWidth>
              <MenuItem value="">-- Select Alat (optional) --</MenuItem>
              {alatOptions.map(a => (<MenuItem key={a.id} value={a.id}>{a.kode? `${a.kode} · `: ''}{a.nama}</MenuItem>))}
            </Select>
            <TextField type="number" label="Interval (hours)" value={form.interval_hours} onChange={e=>onChange('interval_hours', Number(e.target.value))} size="small" fullWidth />
            <TextField type="number" label="Multiplier" value={form.multiplier} onChange={e=>onChange('multiplier', Number(e.target.value))} size="small" fullWidth />
            <TextField type="number" label="Start Engine Hour" value={form.start_engine_hour} onChange={e=>onChange('start_engine_hour', Number(e.target.value))} size="small" fullWidth />
            <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
              <label><input type="checkbox" checked={form.active} onChange={e=>onChange('active', e.target.checked)} /> Active</label>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ setModalOpen(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={async()=>{ await save(); setModalOpen(false); }}> {saving ? <CircularProgress size={18}/> : editingId ? 'Update' : 'Create'} </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={()=>setSnack(prev=>({ ...prev, open:false }))}>
        <Alert onClose={()=>setSnack(prev=>({ ...prev, open:false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
