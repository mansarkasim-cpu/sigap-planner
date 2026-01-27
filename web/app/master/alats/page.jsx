'use client';
import { useEffect, useState } from 'react';
import apiClient from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function AlatsPage(){
  const [rows,setRows] = useState([]);
  const [jenis,setJenis] = useState([]);
  const [sites,setSites] = useState([]);
  const [loading,setLoading] = useState(false);
  const [modalOpen,setModalOpen] = useState(false);
  const [editing,setEditing] = useState(null);
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(20);
  const [total,setTotal] = useState(0);
  const [q,setQ] = useState('');
  const [filterJenis,setFilterJenis] = useState(null);
  const [filterSite,setFilterSite] = useState(null);
  const [showFilters,setShowFilters] = useState(false);

  async function load(p = page, ps = pageSize, search = q){
    setLoading(true);
    try{
      const params = new URLSearchParams();
      if (p) params.set('page', String(p));
      if (ps) params.set('pageSize', String(ps));
      if (filterJenis) params.set('jenis_alat_id', String(filterJenis));
      if (filterSite) params.set('site_id', String(filterSite));
      const data = await apiClient('/master/alats?' + params.toString());
      if (Array.isArray(data)) { setRows(data); setTotal(0); }
      else { setRows(data.data || []); setTotal(data.meta?.total || 0); setPage(data.meta?.page || p); setPageSize(data.meta?.pageSize || ps); }
    }catch(err){ console.error(err); alert(err?.body?.message||err?.message||'Load failed'); }
    finally{ setLoading(false); }
  }

  async function loadRefs(){ try{ const j = await apiClient('/master/jenis-alat'); setJenis(Array.isArray(j)?j:[]); const s = await apiClient('/master/sites'); setSites(Array.isArray(s)?s:[]); }catch(e){console.error(e);} }

  useEffect(()=>{ load(); loadRefs(); },[]);

  // auto-refresh when jenis or site filter changes
  useEffect(()=>{
    setPage(1);
    load(1, pageSize, q);
  }, [filterJenis, filterSite]);

  function openCreate(){ setEditing({ nama:'', kode:'', serial_no:'', jenis_alat_id: null, site_id: null, notes:'' }); setModalOpen(true); }
  function openEdit(r){ setEditing({...r, jenis_alat_id: r.jenis_alat? r.jenis_alat.id : null, site_id: r.site? r.site.id: null}); setModalOpen(true); }

  async function save(){ if(!editing || !editing.nama) return alert('Nama required'); if(!editing.jenis_alat_id) return alert('jenis_alat_id required'); try{ if(editing.id) await apiClient(`/master/alats/${editing.id}`, { method:'PATCH', body: editing }); else await apiClient('/master/alats', { method:'POST', body: editing }); setModalOpen(false); setEditing(null); await load(); }catch(err){ alert(err?.body?.message||err?.message||'Save failed'); } }
  async function remove(id){ if(!confirm('Hapus alat?')) return; try{ await apiClient(`/master/alats/${id}`, { method:'DELETE' }); await load(); }catch(err){ alert(err?.body?.message||err?.message||'Delete failed'); } }

  return (
    <Box sx={{ p:2 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Box>
          <Box component="h2" sx={{ m:0 }}>Alat</Box>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Manage equipment instances</Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <TextField
            size="small"
            placeholder="Search nama alat"
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>{ if(e.key === 'Enter'){ setPage(1); load(1, pageSize, e.target.value); } }}
            sx={{ minWidth:220 }}
          />
          <Select size="small" value={filterJenis ?? ''} onChange={e=>{ setFilterJenis(e.target.value || null); }} displayEmpty sx={{ minWidth:200 }}>
            <MenuItem value=""><em>All jenis</em></MenuItem>
            {jenis.map(j=> <MenuItem key={j.id} value={j.id}>{j.nama}</MenuItem>)}
          </Select>
          <Button variant="outlined" onClick={()=>{ setPage(1); load(1, pageSize, q); }} startIcon={loading? <CircularProgress size={18}/> : null}>Search</Button>
          <Button variant="outlined" onClick={()=>{ setQ(''); setFilterJenis(null); setPage(1); load(1, pageSize, ''); }}>Clear</Button>
          <Button variant="outlined" onClick={()=>load(page,pageSize,q)} startIcon={loading? <CircularProgress size={18}/> : null}>Refresh</Button>
          <Button variant="contained" sx={{ ml:1 }} startIcon={<AddIcon/>} onClick={openCreate}>Create Alat</Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Serial/Kode</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r=> (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.nama}</TableCell>
                  <TableCell>
                    {r.jenis_alat ? (
                      <Box>
                        <Box sx={{ fontWeight:700 }}>{r.jenis_alat.nama}</Box>
                        {r.jenis_alat.description && <Box sx={{ fontSize:12, color:'text.secondary' }}>{r.jenis_alat.description}</Box>}
                      </Box>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    {r.status ? (
                      <Chip
                        label={r.status}
                        size="small"
                        color={r.status === 'ACTIVE' ? 'success' : 'default'}
                        variant={r.status === 'ACTIVE' ? 'filled' : 'outlined'}
                      />
                    ) : (
                      <Chip label="ACTIVE" size="small" color="success" />
                    )}
                  </TableCell>
                  <TableCell>{r.site? r.site.name : '-'}</TableCell>
                  <TableCell>{r.kode || r.serial_no || '-'}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit"><IconButton size="small" onClick={()=>openEdit(r)}><EditIcon fontSize="small"/></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={()=>remove(r.id)}><DeleteIcon fontSize="small"/></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mt:1 }}>
        <Box>
          <Button size="small" disabled={page<=1} onClick={()=>{ const np = Math.max(1,page-1); setPage(np); load(np,pageSize,q); }}>Prev</Button>
          <Button size="small" sx={{ ml:1 }} disabled={pageSize<=0 || (total>0 && page*pageSize>=total)} onClick={()=>{ const np = page+1; setPage(np); load(np,pageSize,q); }}>Next</Button>
          <Box component="span" sx={{ ml:2, color:'text.secondary' }}>Page {page} {total? `of ${Math.ceil(total/pageSize)}` : ''}</Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Per page</Box>
          <Select size="small" value={pageSize} onChange={e=>{ const ps = Number(e.target.value); setPageSize(ps); setPage(1); load(1,ps,q); }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>

      <Dialog open={modalOpen} onClose={()=>{ setModalOpen(false); setEditing(null); }} fullWidth>
        <DialogTitle>{editing?.id? 'Edit Alat' : 'Create Alat'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display:'grid', gap:2, mt:1 }}>
            <TextField label="Nama" size="small" value={editing?.nama||''} onChange={e=>setEditing({...editing, nama: e.target.value})} />
            <TextField label="Kode" size="small" value={editing?.kode||''} onChange={e=>setEditing({...editing, kode: e.target.value})} />
            <TextField label="Serial No" size="small" value={editing?.serial_no||''} onChange={e=>setEditing({...editing, serial_no: e.target.value})} />
            <Select size="small" value={editing?.jenis_alat_id ?? ''} onChange={e=>setEditing({...editing, jenis_alat_id: e.target.value || null})}>
              <MenuItem value=""><em>Select jenis</em></MenuItem>
              {jenis.map(j=> (
                <MenuItem key={j.id} value={j.id} sx={{ display:'flex', flexDirection:'column', alignItems:'flex-start' }}>
                  <Box sx={{ fontWeight:700 }}>{j.nama}</Box>
                  {j.description && <Box sx={{ fontSize:12, color:'text.secondary' }}>{j.description}</Box>}
                </MenuItem>
              ))}
            </Select>
            <Select size="small" value={editing?.status ?? 'ACTIVE'} onChange={e=>setEditing({...editing, status: e.target.value})} sx={{ mt:1 }}>
              <MenuItem value="ACTIVE">ACTIVE</MenuItem>
              <MenuItem value="INACTIVE">INACTIVE</MenuItem>
            </Select>
            <Select size="small" value={editing?.site_id ?? ''} onChange={e=>setEditing({...editing, site_id: e.target.value || null})}>
              <MenuItem value=""><em>None</em></MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
            </Select>
            <TextField label="Notes" size="small" multiline minRows={2} value={editing?.notes||''} onChange={e=>setEditing({...editing, notes: e.target.value})} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ setModalOpen(false); setEditing(null); }}>Cancel</Button>
          <Button variant="contained" onClick={save}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
