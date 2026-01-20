"use client";
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
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function QuestionsPage(){
  const [rows,setRows] = useState([]);
  const [jenis,setJenis] = useState([]);
  const [loading,setLoading] = useState(false);
  const [modalOpen,setModalOpen] = useState(false);
  const [editing,setEditing] = useState(null);
  const [q,setQ] = useState('');
  const [filterJenis,setFilterJenis] = useState(null);
  const [page,setPage] = useState(1);
  const [pageSize,setPageSize] = useState(20);
  const [total,setTotal] = useState(0);

  async function load(p = page, ps = pageSize, presetQ){
    setLoading(true);
    try{
      const params = new URLSearchParams();
      const search = presetQ || q;
      if (search) params.set('q', search);
      if (filterJenis) params.set('jenis_alat_id', String(filterJenis));
      if (p) params.set('page', String(p));
      if (ps) params.set('pageSize', String(ps));
      const data = await apiClient('/master/questions?' + params.toString());
      if (Array.isArray(data)) { setRows(data); setTotal(0); }
      else { setRows(data.data || []); setTotal(data.meta?.total || 0); setPage(data.meta?.page || p); setPageSize(data.meta?.pageSize || ps); }
    }catch(err){ console.error(err); alert(err?.body?.message||err?.message||'Load failed'); }
    finally{ setLoading(false); }
  }

  async function loadRefs(){ try{ const j = await apiClient('/master/jenis-alat'); setJenis(Array.isArray(j)?j:[]); }catch(e){console.error(e);} }

  useEffect(()=>{ load(); loadRefs(); },[]);

  // auto-refresh when filterJenis changes (immediate)
  useEffect(() => {
    setPage(1);
    load(1, pageSize);
  }, [filterJenis]);

  // debounced search when q changes
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      load(1, pageSize);
    }, 400);
    return () => clearTimeout(t);
  }, [q]);

  function openCreate(){ setEditing({ question_text:'', jenis_alat_id: null, input_type: 'boolean', required: true, order: 0, options: [] }); setModalOpen(true); }
  async function openEdit(row){
    setLoading(true);
    try{
      // fetch detailed question (API returns list with options when calling /master/questions/:id currently returns many with options)
      const data = await apiClient(`/master/questions/${row.id}`);
      // data may be array or object; try to find the question
      let qrow = null;
      if (Array.isArray(data)) qrow = data.find(d=>d.id===row.id) || row;
      else if (data && data.id) qrow = data;
      else qrow = row;
      // ensure options array
      qrow.options = qrow.options || [];
      setEditing({...qrow});
      setModalOpen(true);
    }catch(err){ console.error(err); alert('Failed to load question details'); }
    finally{ setLoading(false); }
  }

  function addOption(){
    const opts = Array.isArray(editing.options) ? [...editing.options] : [];
    opts.push({ option_text: '', option_value: '', order: opts.length, _isNew: true });
    setEditing({...editing, options: opts});
  }

  function removeOption(idx){
    const opts = [...(editing.options||[])];
    const [rem] = opts.splice(idx,1);
    // track deleted option ids to remove on save
    const del = editing._deletedOptionIds ? [...editing._deletedOptionIds] : [];
    if (rem && rem.id) del.push(rem.id);
    setEditing({...editing, options: opts, _deletedOptionIds: del});
  }

  async function save(){
    if(!editing || !editing.question_text) return alert('question_text required');
    try{
      if (editing.id){
        const payload = { ...editing };
        delete payload.options; delete payload._deletedOptionIds;
        await apiClient(`/master/questions/${editing.id}`, { method: 'PATCH', body: payload });
        // handle options
        if (Array.isArray(editing.options)){
          for (const opt of editing.options){
            if (opt.id){ await apiClient(`/master/options/${opt.id}`, { method: 'PATCH', body: { option_text: opt.option_text, option_value: opt.option_value, order: opt.order } }); }
            else { await apiClient('/master/options', { method: 'POST', body: { question_id: editing.id, option_text: opt.option_text, option_value: opt.option_value, order: opt.order } }); }
          }
        }
        if (Array.isArray(editing._deletedOptionIds)){
          for (const oid of editing._deletedOptionIds){ await apiClient(`/master/options/${oid}`, { method: 'DELETE' }); }
        }
      } else {
        // create with options inline
        const payload = { ...editing };
        await apiClient('/master/questions', { method: 'POST', body: payload });
      }
      setModalOpen(false); setEditing(null); await load();
    }catch(err){ console.error(err); alert(err?.body?.message||err?.message||'Save failed'); }
  }

  async function remove(id){ if(!confirm('Hapus question?')) return; try{ await apiClient(`/master/questions/${id}`, { method: 'DELETE' }); await load(); }catch(err){ alert(err?.body?.message||err?.message||'Delete failed'); } }

  return (
    <Box sx={{ p:2 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Box>
          <Box component="h2" sx={{ m:0 }}>Checklist Questions</Box>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Manage checklist questions and options</Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <Select size="small" value={filterJenis ?? ''} onChange={e=>{ const v = e.target.value || null; setFilterJenis(v); }} displayEmpty sx={{ minWidth:200 }}>
            <MenuItem value=""><em>All Jenis</em></MenuItem>
            {jenis.map(j=> (
              <MenuItem key={j.id} value={j.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Box component="span" sx={{ fontWeight: 600 }}>{j.nama}</Box>
                {j.deskripsi || j.description ? <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>{j.deskripsi || j.description}</Box> : null}
              </MenuItem>
            ))}
          </Select>
          <TextField size="small" placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
          <Button variant="contained" sx={{ ml:1 }} startIcon={<AddIcon/>} onClick={openCreate}>Create Question</Button>
        </Box>
      </Box>

      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow><TableCell>ID</TableCell><TableCell>Jenis</TableCell><TableCell>Kelompok</TableCell><TableCell>Question</TableCell><TableCell>Input</TableCell><TableCell>Required</TableCell><TableCell align="right">Action</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {rows.map(r=> (
                <TableRow key={r.id} hover>
                  <TableCell>{r.id}</TableCell>
                  <TableCell>{r.jenis_alat? r.jenis_alat.nama : '-'}</TableCell>
                  <TableCell>{r.kelompok || r.group || r.group_name || '-'}</TableCell>
                  <TableCell>{r.question_text}</TableCell>
                  <TableCell>{r.input_type}</TableCell>
                  <TableCell>{r.required? 'Yes' : 'No'}</TableCell>
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
          <Button size="small" disabled={page<=1} onClick={()=>{ const np = Math.max(1,page-1); setPage(np); load(np,pageSize); }}>Prev</Button>
          <Button size="small" sx={{ ml:1 }} disabled={pageSize<=0 || (total>0 && page*pageSize>=total)} onClick={()=>{ const np = page+1; setPage(np); load(np,pageSize); }}>Next</Button>
          <Box component="span" sx={{ ml:2, color:'text.secondary' }}>Page {page} {total? `of ${Math.ceil(total/pageSize)}` : ''}</Box>
        </Box>
        <Box sx={{ display:'flex', alignItems:'center', gap:1 }}>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Per page</Box>
          <Select size="small" value={pageSize} onChange={e=>{ const ps = Number(e.target.value); setPageSize(ps); setPage(1); load(1,ps); }}>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </Box>
      </Box>

      <Dialog open={modalOpen} onClose={()=>{ setModalOpen(false); setEditing(null); }} fullWidth maxWidth="md">
        <DialogTitle>{editing?.id? 'Edit Question' : 'Create Question'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display:'grid', gap:2, mt:1 }}>
            <Select size="small" value={editing?.jenis_alat_id ?? ''} onChange={e=>setEditing({...editing, jenis_alat_id: e.target.value || null})}>
              <MenuItem value=""><em>Select jenis</em></MenuItem>
              {jenis.map(j=> (
                <MenuItem key={j.id} value={j.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box component="span" sx={{ fontWeight: 600 }}>{j.nama}</Box>
                  {j.deskripsi || j.description ? <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>{j.deskripsi || j.description}</Box> : null}
                </MenuItem>
              ))}
            </Select>
            <TextField label="Question Text" size="small" value={editing?.question_text||''} onChange={e=>setEditing({...editing, question_text: e.target.value})} />
            <TextField label="Kelompok Pertanyaan" size="small" value={editing?.kelompok || editing?.group || ''} onChange={e=>setEditing({...editing, kelompok: e.target.value})} />
            <Select size="small" value={editing?.input_type || 'boolean'} onChange={e=>setEditing({...editing, input_type: e.target.value})}>
              <MenuItem value="boolean">Boolean</MenuItem>
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="number">Number</MenuItem>
              <MenuItem value="select">Select</MenuItem>
            </Select>
            <FormControlLabel control={<Checkbox checked={!!editing?.required} onChange={e=>setEditing({...editing, required: e.target.checked})} />} label="Required" />
            <TextField label="Order" size="small" type="number" value={editing?.order ?? 0} onChange={e=>setEditing({...editing, order: Number(e.target.value)})} />

            <Box>
              <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <Box component="strong">Options</Box>
                <Button size="small" onClick={addOption} startIcon={<AddIcon/>}>Add Option</Button>
              </Box>
              <Box sx={{ mt:1 }}>
                {(editing?.options||[]).map((opt, idx)=> (
                  <Box key={idx} sx={{ display:'flex', gap:1, alignItems:'center', mb:1 }}>
                    <TextField size="small" placeholder="Text" value={opt.option_text||''} onChange={e=>{ const o = [...editing.options]; o[idx] = {...o[idx], option_text: e.target.value}; setEditing({...editing, options: o}); }} />
                    <TextField size="small" placeholder="Value" value={opt.option_value||''} onChange={e=>{ const o = [...editing.options]; o[idx] = {...o[idx], option_value: e.target.value}; setEditing({...editing, options: o}); }} />
                    <TextField size="small" placeholder="Order" type="number" value={opt.order||0} onChange={e=>{ const o = [...editing.options]; o[idx] = {...o[idx], order: Number(e.target.value)}; setEditing({...editing, options: o}); }} sx={{ width:88 }} />
                    <IconButton size="small" color="error" onClick={()=>removeOption(idx)}><DeleteIcon fontSize="small"/></IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
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
