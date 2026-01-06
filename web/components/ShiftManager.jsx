"use client";
import React, { useEffect, useMemo, useState } from 'react';
import apiClient from '../lib/api-client';
import { Button, TextField, MenuItem, Paper, IconButton, Chip, Box, Typography, Checkbox } from '@mui/material';
const SHIFT_DEFS = [
  { id: 1, label: 'Shift 1', time: '07:00 - 15:00' },
  { id: 2, label: 'Shift 2', time: '15:00 - 23:00' },
  { id: 3, label: 'Shift 3', time: '23:00 - 07:00' },
];

function Badge({ children, color = '#2563eb' }) {
  return <Chip label={children} sx={{ backgroundColor: color, color: '#fff', fontWeight: 700 }} size="small" />;
}

export default function ShiftManager() {
  const [sites, setSites] = useState([]);
  const [site, setSite] = useState('');
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [techQuery, setTechQuery] = useState('');
  const [groupLeader, setGroupLeader] = useState('');

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0,10));
  const [selectedGroupToAssign, setSelectedGroupToAssign] = useState('');
  const [selectedShift, setSelectedShift] = useState(1);

  // load sites (deriving from users' vendor_cabang) and users for selected site
  useEffect(() => { loadSites(); }, []);

  // reload groups whenever selected site changes
  useEffect(() => {
    loadGroups();
  }, [site]);

  async function loadSites() {
    try {
      const res = await apiClient('/users?page=1&pageSize=1000');
      const rows = (res?.data ?? res) || [];
      // users may store site in different fields depending on source: prefer `site`, fall back to `vendor_cabang`
      const uniqueSites = Array.from(new Set(rows.map(r => r.site || r.vendor_cabang || ''))).filter(Boolean);
      setSites(uniqueSites);
      if (!site && uniqueSites[0]) setSite(uniqueSites[0]);
    } catch (err) {
      console.error('load sites', err);
    }
  }

  useEffect(() => { if (site) loadUsers(site); }, [site]);

  async function loadUsers(siteFilter) {
    try {
      const res = await apiClient(`/users?page=1&pageSize=1000&site=${encodeURIComponent(siteFilter)}`);
      const rows = (res?.data ?? res) || [];
      // only technicians are selectable
      setUsers(rows.filter(u => (u.role || '').toLowerCase() === 'technician'));
    } catch (err) { console.error('load users', err); }
  }

  async function loadGroups() {
    try {
      const url = site ? `/shift-groups?site=${encodeURIComponent(site)}` : '/shift-groups';
      const res = await apiClient(url);
      const rows = (res?.data ?? res) || [];
      setGroups(rows);
    } catch (err) { console.error('load groups', err); }
  }

  async function loadAssignments() {
    try {
      let url;
      // For calendar view, fetch all assignments (optionally filtered by site) so we can show shifts for every day
      if (viewMode === 'calendar') {
        url = site ? `/shift-assignments?site=${encodeURIComponent(site)}` : '/shift-assignments';
      } else {
        url = `/shift-assignments?date=${selectedDate}` + (site ? `&site=${encodeURIComponent(site)}` : '');
      }
      const res = await apiClient(url);
      const rows = (res?.data ?? res) || [];
      setAssignments(rows);
    } catch (err) { console.error('load assignments', err); setAssignments([]); }
  }

  useEffect(() => { loadAssignments(); }, [selectedDate, site]);

  function toggleUserSelection(id) {
    const s = new Set(selectedUsers);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelectedUsers(s);
  }

  async function createGroup() {
    if (!groupName || selectedUsers.size === 0) return alert('Please enter a group name and choose at least one technician');
    if (groupLeader && !selectedUsers.has(groupLeader)) return alert('Leader must be one of the selected members');
    const payload = { name: groupName, members: Array.from(selectedUsers), site, leader: groupLeader || null };
    try {
      await apiClient('/shift-groups', { method: 'POST', body: payload });
      setGroupName('');
      setGroupLeader('');
      setSelectedUsers(new Set());
      await loadGroups();
      alert('Group created');
    } catch (err) { console.error('create group', err); alert('Failed to create group'); }
  }

  async function assignGroup() {
    if (!selectedGroupToAssign) return alert('Select a group to assign');
    const payload = { date: selectedDate, shift: selectedShift, groupId: selectedGroupToAssign, site };
    try {
      await apiClient('/shift-assignments', { method: 'POST', body: payload });
      await loadAssignments();
      alert('Assigned');
    } catch (err) { console.error('assign', err); alert('Failed to assign'); }
  }

  // Edit group UI state
  const [editGroupId, setEditGroupId] = useState('');
  const [editGroupName, setEditGroupName] = useState('');
  const [editGroupSelectedUsers, setEditGroupSelectedUsers] = useState(new Set());
  const [editGroupLeader, setEditGroupLeader] = useState('');

  function startEditGroup(g) {
    setEditGroupId(g.id);
    setEditGroupName(g.name || '');
    setEditGroupSelectedUsers(new Set(g.members || []));
    setEditGroupLeader(g.leader || '');
  }

  function toggleEditUserSelection(id) {
    const s = new Set(editGroupSelectedUsers);
    if (s.has(id)) s.delete(id); else s.add(id);
    setEditGroupSelectedUsers(s);
  }

  function cancelEditGroup() {
    setEditGroupId('');
    setEditGroupName('');
    setEditGroupSelectedUsers(new Set());
    setEditGroupLeader('');
  }

  async function saveEditGroup() {
    if (!editGroupId) return;
    try {
      if (editGroupLeader && !editGroupSelectedUsers.has(editGroupLeader)) return alert('Leader must be one of the selected members');
      const payload = { name: editGroupName, members: Array.from(editGroupSelectedUsers), site, leader: editGroupLeader || null };
      await apiClient(`/shift-groups/${editGroupId}`, { method: 'PUT', body: payload });
      await loadGroups();
      await loadAssignments();
      cancelEditGroup();
      alert('Group updated');
    } catch (err) { console.error('save edit group', err); alert('Failed to update group'); }
  }

  const groupsById = useMemo(() => {
    const m = {};
    groups.forEach(g => m[g.id] = g);
    return m;
  }, [groups]);

  const usersById = useMemo(() => {
    const m = {};
    users.forEach(u => { m[u.id] = u; });
    return m;
  }, [users]);

  const assignmentMap = useMemo(() => {
    const m = {};
    assignments.forEach(a => {
      const key = a.shift;
      if (!m[key]) m[key] = [];
      m[key].push(a);
    });
    return m;
  }, [assignments]);

  // assignments grouped by date for calendar view
  const assignmentsByDate = useMemo(() => {
    const m = {};
    assignments.forEach(a => {
      if (!a || !a.date) return;
      if (!m[a.date]) m[a.date] = [];
      m[a.date].push(a);
    });
    return m;
  }, [assignments]);

  // view mode: 'schedule' (list per shift) or 'calendar' (month view)
  const [viewMode, setViewMode] = useState('schedule');

  // calendar month state (based on selectedDate)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date(selectedDate);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  useEffect(() => {
    const d = new Date(selectedDate);
    setCalendarMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  }, [selectedDate]);

  function prevMonth() {
    setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  }

  function nextMonth() {
    setCalendarMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));
  }

  function buildMonthDays(monthStart) {
    const startDay = new Date(monthStart);
    const firstDow = startDay.getDay(); // 0=Sun..6=Sat
    // normalize to Monday-first if desired; keep Sunday-first here
    const days = [];
    // Backfill previous month days
    for (let i = 0; i < firstDow; i++) {
      const dt = new Date(startDay.getFullYear(), startDay.getMonth(), i - firstDow + 1);
      days.push({ date: dt, inMonth: false });
    }
    // current month
    const month = startDay.getMonth();
    for (let d = 1; d <= 31; d++) {
      const dt = new Date(startDay.getFullYear(), month, d);
      if (dt.getMonth() !== month) break;
      days.push({ date: dt, inMonth: true });
    }
    // fill to complete weeks (multiple of 7)
    while (days.length % 7 !== 0) {
      const last = days[days.length - 1].date;
      const dt = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
      days.push({ date: dt, inMonth: false });
    }
    return days;
  }

  const monthDays = useMemo(() => buildMonthDays(calendarMonth), [calendarMonth]);

  // When calendar view or calendarMonth changes, reload assignments for the month view
  useEffect(() => {
    if (viewMode === 'calendar') {
      loadAssignments();
    }
    // also reload when site changes
  }, [viewMode, calendarMonth, site]);

  // When user returns to Schedule view, ensure assignments are loaded only for the selected date
  useEffect(() => {
    if (viewMode === 'schedule') {
      loadAssignments();
    }
  }, [viewMode]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', gap: 3, p: 1 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, width: 440, zIndex: 20 }}>
        
      </Box>
      <Box sx={{ width: 420 }}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Site</Typography>
          {sites.length === 0 ? (
            <Paper sx={{ p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 1, color: 'text.secondary' }}>Tidak ada site terdaftar. Pastikan pengguna memiliki field `site` pada profil mereka.</Paper>
          ) : (
            <TextField select value={site} onChange={e => setSite(e.target.value)} fullWidth size="small">
              <MenuItem value="">-- pilih site --</MenuItem>
              {sites.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </TextField>
          )}
        </Box>

        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Create Group</Typography>
          <TextField placeholder="Group name" value={groupName} onChange={e => setGroupName(e.target.value)} fullWidth size="small" sx={{ mb: 1 }} />

          <Box sx={{ maxHeight: 260, overflow: 'auto', border: 1, borderColor: 'divider', p: 1, borderRadius: 1 }}>
            {users.length === 0 && <Typography color="text.secondary">No technicians for this site</Typography>}
            <TextField placeholder="Cari teknisi (nama atau NIPP)" value={techQuery} onChange={e => setTechQuery(e.target.value)} fullWidth size="small" sx={{ mb: 1 }} />
            {users.filter(u => {
              if (!techQuery) return true;
              const q = techQuery.toLowerCase();
              return (u.name || '').toLowerCase().includes(q) || String(u.nipp || '').includes(q);
            }).map(u => (
              <Box key={u.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', p: '6px 4px' }}>
                <Checkbox size="small" checked={selectedUsers.has(u.id)} onChange={() => toggleUserSelection(u.id)} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{u.name || u.nipp || u.email}</Typography>
                  <Typography variant="caption" color="text.secondary">{u.nipp} • {u.role}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Leader (optional)</Typography>
            <TextField select value={groupLeader} onChange={e => setGroupLeader(e.target.value)} fullWidth size="small" disabled={selectedUsers.size === 0} sx={{ mb: 1 }}>
              <MenuItem value="">-- pilih leader (opsional) --</MenuItem>
              {Array.from(selectedUsers).map(id => {
                const u = usersById[id];
                return <MenuItem key={id} value={id}>{u ? (u.name || u.nipp || id) : id}</MenuItem>;
              })}
            </TextField>
            <Box sx={{ textAlign: 'right' }}>
              <Button variant="contained" size="small" onClick={createGroup}>Create</Button>
            </Box>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }}>
          <Typography variant="h6">Existing Groups</Typography>
          {groups.length === 0 ? (
            <Typography color="text.secondary">No groups created yet.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 1 }}>
              {groups.map(g => (
                <Paper key={g.id} sx={{ p: 1, borderRadius: 1 }}>
                  {editGroupId === g.id ? (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <TextField value={editGroupName} onChange={e => setEditGroupName(e.target.value)} sx={{ flex: 1, mr: 1 }} size="small" />
                        <Typography color="text.secondary" variant="caption">{g.site || ''} • {g.members?.length || 0} members</Typography>
                      </Box>
                      <Box sx={{ mt: 1, maxHeight: 180, overflow: 'auto', border: 1, borderColor: 'divider', p: 1, borderRadius: 1 }}>
                        {users.filter(u => (u.role || '').toLowerCase() === 'technician').map(u => (
                          <Box key={u.id} sx={{ display: 'flex', gap: 1, alignItems: 'center', py: 0.5 }}>
                            <Checkbox size="small" checked={editGroupSelectedUsers.has(u.id)} onChange={() => toggleEditUserSelection(u.id)} />
                            <Box>
                              <Typography sx={{ fontWeight: 700 }}>{u.name || u.nipp || u.email}</Typography>
                              <Typography variant="caption" color="text.secondary">{u.nipp}</Typography>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Leader (optional)</Typography>
                        <TextField select value={editGroupLeader} onChange={e => setEditGroupLeader(e.target.value)} fullWidth size="small" disabled={editGroupSelectedUsers.size === 0} sx={{ mb: 1 }}>
                          <MenuItem value="">-- pilih leader (opsional) --</MenuItem>
                          {Array.from(editGroupSelectedUsers).map(id => {
                            const u = usersById[id];
                            return <MenuItem key={id} value={id}>{u ? (u.name || u.nipp || id) : id}</MenuItem>;
                          })}
                        </TextField>
                        <Box sx={{ textAlign: 'right' }}>
                          <Button variant="contained" size="small" onClick={saveEditGroup} sx={{ mr: 1 }}>Save</Button>
                          <Button variant="outlined" size="small" onClick={cancelEditGroup}>Cancel</Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 700 }}>{g.name}</Typography>
                        <Typography color="text.secondary" variant="caption">{g.site || ''} • {g.members?.length || 0} members</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        {(g.members || []).map(id => (
                          <Typography key={id} sx={{ fontSize: 13 }}>{usersById[id]?.name || usersById[id]?.nipp || id}</Typography>
                        ))}
                        {g.leader ? (
                          <Typography sx={{ mt: 0.5 }}><strong>Leader:</strong> {usersById[g.leader]?.name || usersById[g.leader]?.nipp || g.leader}</Typography>
                        ) : null}
                      </Box>
                      <Box sx={{ mt: 1, textAlign: 'right' }}>
                        <Button variant="outlined" size="small" onClick={() => startEditGroup(g)} sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="contained" size="small" color="error" onClick={async () => {
                          if (!confirm(`Hapus grup "${g.name}"? Ini juga akan menghapus penugasan shift yang terkait.`)) return;
                          try {
                            await apiClient(`/shift-groups/${g.id}`, { method: 'DELETE' });
                            await loadGroups();
                            await loadAssignments();
                            alert('Group deleted');
                          } catch (err) {
                            console.error('delete group', err); alert('Failed to delete group');
                          }
                        }}>Delete</Button>
                      </Box>
                    </Box>
                  )}
                </Paper>
              ))}
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, borderRadius: 2, background: 'background.paper' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Assign Group to Shift</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} size="small" />
            <TextField select value={selectedShift} onChange={e => setSelectedShift(Number(e.target.value))} size="small">
              {SHIFT_DEFS.map(s => <MenuItem key={s.id} value={s.id}>{s.label} — {s.time}</MenuItem>)}
            </TextField>
          </Box>

          <TextField select value={selectedGroupToAssign} onChange={e => setSelectedGroupToAssign(e.target.value)} fullWidth size="small" sx={{ mb: 1 }}>
            <MenuItem value="">-- pilih grup --</MenuItem>
            {groups.map(g => <MenuItem key={g.id} value={g.id}>{g.name} ({g.members?.length || 0})</MenuItem>)}
          </TextField>
          <Box sx={{ textAlign: 'right' }}>
            <Button variant="contained" size="small" onClick={assignGroup}>Assign</Button>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box sx={{ mb: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <Typography variant="h6" sx={{ m: 0 }}>{viewMode === 'calendar' ? 'Calendar' : `Schedule — ${selectedDate}`}</Typography>
          <Box sx={{ ml: 1.5, display: 'flex', gap: 1 }}>
            <Button variant={viewMode === 'schedule' ? 'contained' : 'outlined'} size="small" onClick={() => setViewMode('schedule')}>Schedule</Button>
            <Button variant={viewMode === 'calendar' ? 'contained' : 'outlined'} size="small" onClick={() => setViewMode('calendar')}>Calendar</Button>
          </Box>
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            {viewMode === 'calendar' ? (
              <>
                <IconButton size="small" onClick={prevMonth}>◀</IconButton>
                <Typography sx={{ minWidth: 200, textAlign: 'center', fontWeight: 700 }}>{calendarMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</Typography>
                <IconButton size="small" onClick={nextMonth}>▶</IconButton>
              </>
            ) : (
              <TextField type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} size="small" />
            )}
          </Box>
        </Box>
        {viewMode === 'calendar' ? (
          <Box sx={{ display: 'grid', gap: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 0.5, textAlign: 'center', color: 'text.secondary' }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <Box key={d} sx={{ fontWeight: 700 }}>{d}</Box>)}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
              {monthDays.map(({ date, inMonth }) => {
                const pad = (n) => String(n).padStart(2, '0');
                const dStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
                const dayAssigns = assignmentsByDate[dStr] || [];
                return (
                  <Paper key={dStr} onClick={() => { setSelectedDate(dStr); setViewMode('schedule'); }} sx={{ minHeight: 120, p: 1, borderRadius: 1, backgroundColor: inMonth ? 'background.paper' : 'background.default', cursor: 'pointer' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ fontWeight: 700 }}>{date.getDate()}</Typography>
                      <Typography variant="caption" color="text.secondary">{dStr === (new Date().toISOString().slice(0,10)) ? 'Today' : ''}</Typography>
                    </Box>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {SHIFT_DEFS.map(s => {
                        const sAssigns = dayAssigns.filter(a => Number(a.shift) === s.id);
                        return sAssigns.length === 0 ? null : (
                          <Box key={s.id}>
                            <Typography sx={{ fontSize: 12, color: 'text.primary', fontWeight: 600 }}>{s.label}</Typography>
                            {sAssigns.map(sa => {
                              const group = groupsById[sa.groupId];
                              return (<Box key={sa.id} sx={{ mt: 0.5 }}><Badge color="#2563eb">{group ? group.name : `Group ${sa.groupId}`}</Badge></Box>);
                            })}
                          </Box>
                        );
                      })}
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gap: 1 }}>
          {SHIFT_DEFS.map(s => {
            const assigns = assignmentMap[s.id] || [];
            return (
              <Paper key={s.id} sx={{ p: 1, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{s.label} <Box component="span" sx={{ fontWeight: 400, color: 'text.secondary', ml: 1 }}>{s.time}</Box></Typography>
                  {assigns.length > 0 ? (
                    <Box sx={{ mt: 1 }}>
                      {assigns.map(ass => {
                        const group = groupsById[ass.groupId];
                        return (
                          <Box key={ass.id} sx={{ mt: 1 }}>
                            <Badge color="#2563eb">{group ? group.name : `Group ${ass.groupId}`}</Badge>
                            <Box sx={{ mt: 0.5, color: 'text.primary' }}>
                              {(group?.members || []).slice(0,5).map(id => {
                                const u = usersById[id] || { name: id };
                                return <Typography key={id} sx={{ fontSize: 13 }}>{u.name || u.nipp || id}</Typography>;
                              })}
                              {group?.members && group.members.length > 5 && <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>+{group.members.length - 5} more</Typography>}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Typography sx={{ mt: 1, color: 'text.secondary' }}>Not assigned</Typography>
                  )}
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  {assigns.map(ass => (
                    <Box key={ass.id} sx={{ mb: 1 }}>
                      <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{`assigned by ${ass.created_by || '—'}`}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Button variant="outlined" size="small" color="error" onClick={async () => {
                          if (!confirm('Remove assignment?')) return;
                          try {
                            await apiClient(`/shift-assignments/${ass.id}`, { method: 'DELETE' });
                            await loadAssignments();
                            alert('Removed');
                          } catch (err) { console.error(err); alert('Failed'); }
                        }}>Remove</Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            );
          })}
        </Box>
        )}

      </Box>
    </Box>
  );
}
