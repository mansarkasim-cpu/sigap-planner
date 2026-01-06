'use client';
import { useEffect, useState } from 'react';
import apiClient from '../../../lib/api-client';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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

export default function JenisAlatPage(){
  const [rows,setRows] = useState([]);
  const [loading,setLoading] = useState(false);
  const [modalOpen,setModalOpen] = useState(false);
  const [editing,setEditing] = useState(null);
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(20);
  const [total,setTotal] = useState(0);
  const [q,setQ] = useState('');

  async function load(p = page, ps = pageSize, search = q){
    setLoading(true);
    try{
      const params = new URLSearchParams();
      if (search) params.set('q', search);
      if (p) params.set('page', String(p));
      if (ps) params.set('pageSize', String(ps));
      const data = await apiClient('/master/jenis-alat?' + params.toString());
      if (Array.isArray(data)) { setRows(data); setTotal(0); }
      else { setRows(data.data || []); setTotal(data.meta?.total || 0); setPage(data.meta?.page || p); setPageSize(data.meta?.pageSize || ps); }
    }catch(err){ console.error(err); alert(err?.body?.message||err?.message||'Load failed'); }
    finally{ setLoading(false); }
  }
  useEffect(()=>{ load(); },[]);
  function openCreate(){ setEditing({ nama:'', description:'' }); setModalOpen(true); }
  function openEdit(r){ setEditing({...r}); setModalOpen(true); }
  async function save(){ if(!editing || !editing.nama) return alert('Nama required'); try{ if(editing.id) await apiClient(`/master/jenis-alat/${editing.id}`, { method:'PATCH', body: editing }); else await apiClient('/master/jenis-alat', { method:'POST', body: editing }); setModalOpen(false); setEditing(null); await load(); }catch(err){ alert(err?.body?.message||err?.message||'Save failed'); } }
  async function remove(id){ if(!confirm('Hapus jenis alat?')) return; try{ await apiClient(`/master/jenis-alat/${id}`, { method:'DELETE' }); await load(); }catch(err){ alert(err?.body?.message||err?.message||'Delete failed'); } }

  return (
    <Box sx={{ p:2 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Box>
          <Box component="h2" sx={{ m:0 }}>Jenis Alat</Box>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Manage equipment types</Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <TextField size="small" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ setPage(1); load(1,pageSize,e.target.value); } }} />
          <Button variant="outlined" onClick={()=>{ setPage(1); load(1,pageSize,q); }} startIcon={loading? <CircularProgress size={18}/> : null}>Search</Button>
          <Button variant="outlined" onClick={()=>{ setQ(''); setPage(1); load(1,pageSize,''); }} sx={{ ml:1 }}>Clear</Button>
          <Button variant="outlined" onClick={()=>load(page,pageSize,q)} startIcon={loading? <CircularProgress size={18}/> : null}>Refresh</Button>
          <Button variant="contained" sx={{ ml:1 }} startIcon={<AddIcon/>} onClick={openCreate}>Create</Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>ID</TableCell><TableCell>Nama</TableCell><TableCell>Description</TableCell><TableCell align="right">Action</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r=> (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.nama}</TableCell>
                  <TableCell sx={{ maxWidth:300, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.description}</TableCell>
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
        <DialogTitle>{editing?.id? 'Edit' : 'Create'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display:'grid', gap:2, mt:1 }}>
            <TextField label="Nama" size="small" value={editing?.nama||''} onChange={e=>setEditing({...editing, nama: e.target.value})} />
            <TextField label="Description" size="small" multiline minRows={3} value={editing?.description||''} onChange={e=>setEditing({...editing, description: e.target.value})} />
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
