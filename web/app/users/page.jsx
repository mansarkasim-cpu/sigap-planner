'use client';
import { useEffect, useState } from 'react';
import apiClient from '../../lib/api-client';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
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
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [roles, setRoles] = useState([]);
  const [sites, setSites] = useState([]);
  // fixed role options
  const ROLE_OPTIONS = ['admin', 'planner', 'lead_shift', 'technician'];
  const combinedRoles = Array.from(new Set([...(ROLE_OPTIONS || []), ...(roles || [])]));
  const [roleFilter, setRoleFilter] = useState('');
  const [siteFilter, setSiteFilter] = useState('');
  const [nameQ, setNameQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(null);

  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  async function load() {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams();
      if (nameQ) params.set('q', nameQ);
      if (roleFilter) params.set('role', roleFilter);
      if (siteFilter) params.set('site', siteFilter);
      params.set('page', String(page));
      params.set('pageSize', String(pageSize));
      const url = '/users' + (params.toString() ? `?${params.toString()}` : '');
      const data = await apiClient(url);
      if (Array.isArray(data)) {
        setUsers(data);
        setTotal(null);
      } else if (data?.data) {
        setUsers(data.data || []);
        setTotal((data.meta && Number(data.meta.total)) || 0);
        if (data.meta?.page) setPage(Number(data.meta.page));
        if (data.meta?.pageSize) setPageSize(Number(data.meta.pageSize));
      } else {
        const rows = data ?? [];
        setUsers(Array.isArray(rows) ? rows : []);
        setTotal(null);
      }

      // derive role and site lists from fetched users
      const rset = Array.from(new Set((data?.data || data || []).map(r => r.role).filter(Boolean)));
      const sset = Array.from(new Set((data?.data || data || []).map(r => r.site).filter(Boolean)));
      setRoles(rset);
      setSites(sset);
    } catch (err) {
      console.error('load users', err);
      setError(err?.message || 'Failed to load users');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [roleFilter, siteFilter, nameQ, page, pageSize]);

  function openCreate() { setEditing({ name:'', email:'', role:'technician', site:'', nipp:'', password: '' }); setModalOpen(true); }
  function openEdit(u) { setEditing(u); setModalOpen(true); }

  async function save() {
    if (!editing) return;
    try {
      if (!editing.name || !editing.nipp) return alert('Name and NIPP are required');
      if (!editing.id && !editing.password) return alert('Password is required for new users');
      if (editing.id) {
        await apiClient(`/users/${encodeURIComponent(editing.id)}`, { method: 'PATCH', body: editing });
      } else {
        await apiClient('/users', { method: 'POST', body: editing });
      }
      setModalOpen(false);
      setEditing(null);
      setPage(1);
      await load();
    } catch (err) {
      alert(err?.body?.message || err?.message || 'Save failed');
    }
  }

  async function remove(id) {
    if (!confirm('Hapus user ini?')) return;
    try {
      await apiClient(`/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await load();
    } catch (err) {
      alert(err?.body?.message || err?.message || 'Delete failed');
    }
  }

  return (
    <Box sx={{ p:2 }}>
      <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2 }}>
        <Box>
          <Box component="h2" sx={{ m:0 }}>Users</Box>
          <Box sx={{ color:'text.secondary', fontSize:13 }}>Manage application users</Box>
        </Box>

        <Box sx={{ display:'flex', gap:1 }}>
          <Button variant="outlined" color="inherit" onClick={load} startIcon={loading ? <CircularProgress size={18} /> : null}>Refresh</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>Create User</Button>
        </Box>
      </Box>

      <Paper sx={{ p:2, mb:2 }} elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField fullWidth placeholder="Search name or email" value={nameQ} onChange={e=>setNameQ(e.target.value)} size="small" />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select label="Role" value={roleFilter} onChange={e=>setRoleFilter(e.target.value)}>
                <MenuItem value=""><em>All roles</em></MenuItem>
                {combinedRoles.map(r=> <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Site</InputLabel>
              <Select label="Site" value={siteFilter} onChange={e=>setSiteFilter(e.target.value)}>
                <MenuItem value=""><em>All sites</em></MenuItem>
                {sites.map(s=> <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="contained" onClick={load}>Apply</Button>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={1}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>NIPP</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Site</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(u => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.nipp ?? '-'}</TableCell>
                  <TableCell sx={{ maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</TableCell>
                  <TableCell>
                    <Chip label={u.role || '-'} size="small" color={u.role === 'admin' ? 'primary' : 'default'} />
                  </TableCell>
                  <TableCell>{u.site ?? '-'}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={()=>openEdit(u)}>
                          <EditIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={()=>remove(u.id)}>
                          <DeleteIcon fontSize="small"/>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {loading && <Box sx={{ p:2, display:'flex', justifyContent:'center' }}><CircularProgress /></Box>}
        {error && <Box sx={{ p:2, color:'error.main' }}>{String(error)}</Box>}
      </Paper>

      <Box sx={{ mt:2, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <Box>
          {total !== null && (
            <Box sx={{ color:'text.secondary' }}>Showing {(Math.min((page - 1) * pageSize + 1, total) || 0)} - {Math.min(page * pageSize, total)} of {total}</Box>
          )}
        </Box>
        <Box sx={{ display:'flex', gap:1, alignItems:'center' }}>
          <Button size="small" variant="outlined" onClick={()=>{ if (page>1) setPage(p=>p-1); }} disabled={page<=1}>Prev</Button>
          <Box>Page {page}</Box>
          <Button size="small" variant="outlined" onClick={()=>{ if (total === null) { setPage(p=>p+1); } else if (page * pageSize < total) { setPage(p=>p+1); } }} disabled={total !== null && page * pageSize >= total}>Next</Button>
          <FormControl size="small" sx={{ minWidth:100 }}>
            <Select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1); }}>
              {[10,25,50,100].map(n => (<MenuItem key={n} value={n}>{n} / page</MenuItem>))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Dialog open={modalOpen} onClose={()=>{ setModalOpen(false); setEditing(null); }} fullWidth maxWidth="sm">
        <DialogTitle>{editing?.id ? 'Edit User' : 'Create User'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt:0 }}>
            <Grid item xs={12}>
              <TextField label="Name" fullWidth size="small" value={editing?.name||''} onChange={e=>setEditing({...editing, name: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="NIPP" fullWidth size="small" value={editing?.nipp||''} onChange={e=>setEditing({...editing, nipp: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" fullWidth size="small" value={editing?.email||''} onChange={e=>setEditing({...editing, email: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Password" type="password" fullWidth size="small" value={editing?.password||''} onChange={e=>setEditing({...editing, password: e.target.value})} />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Role</InputLabel>
                <Select label="Role" value={editing?.role||''} onChange={e=>setEditing({...editing, role: e.target.value})}>
                  {combinedRoles.map(r => (<MenuItem key={r} value={r}>{r}</MenuItem>))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Site" fullWidth size="small" value={editing?.site||''} onChange={e=>setEditing({...editing, site: e.target.value})} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{ setModalOpen(false); setEditing(null); }}>Cancel</Button>
          <Button variant="contained" onClick={save}>{editing?.id ? 'Save' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
