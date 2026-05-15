'use client';
import { useEffect, useState } from 'react';
import apiClient from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function PMRuleSequencePage(){
  const [jenis,setJenis] = useState([]);
  const [sites,setSites] = useState([]);
  const [alats,setAlats] = useState([]);
  const [pmRules,setPmRules] = useState([]);
  const [selectedSite,setSelectedSite] = useState('');
  const [selectedJenis,setSelectedJenis] = useState('');
  const [selectedAlat,setSelectedAlat] = useState('');
  const [sequence,setSequence] = useState([]); // [{seq_no, pm_rule_id}]
  const positions = Array.from({length:24},(_,i)=>i+1);

  useEffect(()=>{ loadMeta(); },[]);

  async function loadMeta(){
    try{
      const [j, s, r] = await Promise.all([
        apiClient('/master/jenis-alat?limit=1000'),
        apiClient('/master/sites'),
        apiClient('/pm/rules?limit=1000'),
      ]);
      setJenis(Array.isArray(j)?j:j.data||[]);
      setSites(Array.isArray(s)?s:s.data||[]);
      setPmRules(Array.isArray(r)?r:r.data||[]);
    }catch(e){ console.error('loadMeta',e); }
  }

  async function handleSiteChange(siteId){
    setSelectedSite(siteId);
    setSelectedAlat('');
    setSelectedJenis('');
    setSequence([]);
    setAlats([]);
    if(!siteId) return;
    try{
      const a = await apiClient(`/master/alats?site_id=${encodeURIComponent(siteId)}&limit=1000`);
      setAlats(Array.isArray(a)?a:a.data||[]);
    }catch(e){ console.error('loadAlats',e); }
  }

  async function loadSequenceForJenis(jenisId){
    setSequence([]);
    if(!jenisId) return;
    try{
      const res = await apiClient(`/master/pm-sequence/jenis/${encodeURIComponent(jenisId)}`);
      const rows = res.data || [];
      // map into positions
      const map = new Map(rows.map(r=>[Number(r.seq_no), r.pm_rule_id]));
      const seq = positions.map(pos=> ({ seq_no: pos, pm_rule_id: map.get(pos) || null }));
      setSequence(seq);
    }catch(e){ console.error('loadSequenceForJenis', e); }
  }

  async function loadSequenceForAlat(alatId){
    setSequence([]);
    if(!alatId) return;
    try{
      const res = await apiClient(`/master/pm-sequence/alat/${encodeURIComponent(alatId)}`);
      const rows = res.data || [];
      const map = new Map(rows.map(r=>[Number(r.seq_no), r.pm_rule_id]));
      const seq = positions.map(pos=> ({ seq_no: pos, pm_rule_id: map.get(pos) || null }));
      setSequence(seq);
    }catch(e){ console.error('loadSequenceForAlat', e); }
  }

  function changePmRuleAt(pos, pmRuleId){
    setSequence(s => s.map(it => it.seq_no===pos ? {...it, pm_rule_id: pmRuleId} : it));
  }

  function availableRules() {
    // If an alat is selected (override), prefer rules for that alat or its jenis; otherwise when jenis selected, prefer rules for that jenis.
    const alatId = selectedAlat ? Number(selectedAlat) : null;
    const jenisId = selectedJenis ? Number(selectedJenis) : null;
    return pmRules.filter(r => {
      const rJenis = r.jenis_alat_id != null ? Number(r.jenis_alat_id) : null;
      const rAlat = r.alat_id != null ? Number(r.alat_id) : null;
      // If alat selected: include rules scoped to that alat, or rules for its jenis, or global rules (no scope)
      if (alatId) return (rAlat === alatId) || (rJenis === jenisId) || (rAlat == null && rJenis == null);
      // If only jenis selected: include rules for that jenis, or global rules
      if (jenisId) return (rJenis === jenisId) || (rAlat == null && rJenis == null);
      // No selection: include only global rules
      return (rAlat == null && rJenis == null);
    });
  }

  async function saveJenis(){
    if(!selectedJenis) return alert('Select jenis alat first');
    const items = sequence.map(it=> ({ seq_no: it.seq_no, pm_rule_id: it.pm_rule_id }));
    try{
      await apiClient(`/master/pm-sequence/jenis/${encodeURIComponent(selectedJenis)}`, { method:'POST', body: { items } });
      alert('Saved');
    }catch(e){ console.error(e); alert('Save failed'); }
  }

  async function saveAlat(){
    if(!selectedAlat) return alert('Select alat first');
    const items = sequence.map(it=> ({ seq_no: it.seq_no, pm_rule_id: it.pm_rule_id }));
    try{
      await apiClient(`/master/pm-sequence/alat/${encodeURIComponent(selectedAlat)}`, { method:'POST', body: { items } });
      alert('Saved');
    }catch(e){ console.error(e); alert('Save failed'); }
  }

  return (
    <Box sx={{ p:2 }}>
      {/* Step 1: Site */}
      <Box sx={{ display:'flex', gap:2, mb:2, alignItems:'center' }}>
        <Select size="small" value={selectedSite} onChange={e=> handleSiteChange(e.target.value)} sx={{ minWidth:220 }}>
          <MenuItem value="">-- Pilih Site --</MenuItem>
          {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.nama || s.name || s.kode || s.id}</MenuItem>)}
        </Select>
      </Box>

      {/* Step 2: Jenis Alat */}
      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <Select size="small" value={selectedJenis} onChange={e=>{ setSelectedJenis(e.target.value); setSelectedAlat(''); loadSequenceForJenis(e.target.value); }} sx={{ minWidth:240 }} disabled={!selectedSite}>
          <MenuItem value="">-- Select Jenis Alat --</MenuItem>
          {jenis.map(j=> <MenuItem key={j.id} value={j.id}>{j.nama}</MenuItem>)}
        </Select>
        <Button variant="contained" onClick={saveJenis} disabled={!selectedJenis}>Save Jenis Sequence</Button>
      </Box>

      {/* Step 3: Alat (override, filtered by site) */}
      <Box sx={{ mb:4 }}>
        <Select size="small" value={selectedAlat} onChange={e=>{ setSelectedAlat(e.target.value); setSelectedJenis(''); loadSequenceForAlat(e.target.value); }} sx={{ minWidth:320 }} disabled={!selectedSite}>
          <MenuItem value="">-- Select Alat (override) --</MenuItem>
          {alats.map(a=> <MenuItem key={a.id} value={a.id}>{a.nama || a.kode || a.id}</MenuItem>)}
        </Select>
        <Button variant="contained" onClick={saveAlat} disabled={!selectedAlat} sx={{ ml:2 }}>Save Alat Sequence</Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>Pos</TableCell><TableCell>PM Rule</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {sequence.map(it=> (
                <TableRow key={it.seq_no}>
                  <TableCell>{it.seq_no}</TableCell>
                  <TableCell>
                    <Select size="small" value={it.pm_rule_id || ''} onChange={e=>changePmRuleAt(it.seq_no, e.target.value || null)} sx={{ minWidth:220 }}>
                      <MenuItem value="">-- None --</MenuItem>
                      {availableRules().map(r=> <MenuItem key={r.id} value={r.id}>{(r.kode_rule || r.kode || r.description || r.id)}</MenuItem>)}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
