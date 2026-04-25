'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Button, CircularProgress, IconButton, MenuItem, OutlinedInput, Paper,
  Select, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Typography, Tooltip, Chip,
} from '@mui/material';
import apiClient from '../lib/api-client';

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const DAY_NAMES_SHORT = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

const GROUP_COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#d97706',
  '#7c3aed', '#0891b2', '#db2777', '#059669', '#ea580c',
];

function getGroupColor(groupId, groups) {
  const idx = groups.findIndex(g => g.id === groupId);
  return GROUP_COLORS[idx >= 0 ? idx % GROUP_COLORS.length : 0];
}

function toYearMonth(year, month) {
  return `${year}-${String(month).padStart(2, '0')}`;
}

export default function MonthlyShiftPlanner({ site, groups, shiftDefs }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-12

  // grid[day][shiftId] = string[] (array of groupIds)
  const [grid, setGrid] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const yearMonth = useMemo(() => toYearMonth(year, month), [year, month]);
  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const loadMonth = useCallback(async () => {
    if (!site) return;
    setLoading(true);
    setDirty(false);
    try {
      const url = `/shift-assignments?site=${encodeURIComponent(site)}&yearMonth=${yearMonth}`;
      const res = await apiClient(url);
      const rows = Array.isArray(res) ? res : (res?.data ?? []);
      const newGrid = {};
      rows.forEach(r => {
        if (!r.date || !r.groupId) return;
        const day = parseInt(r.date.split('-')[2], 10);
        const shiftKey = Number(r.shift);
        if (!newGrid[day]) newGrid[day] = {};
        if (!newGrid[day][shiftKey]) newGrid[day][shiftKey] = [];
        if (!newGrid[day][shiftKey].includes(r.groupId)) {
          newGrid[day][shiftKey].push(r.groupId);
        }
      });
      setGrid(newGrid);
    } catch (err) {
      console.error('loadMonth', err);
    } finally {
      setLoading(false);
    }
  }, [site, yearMonth]);

  useEffect(() => { loadMonth(); }, [loadMonth]);

  // Toggle a group in a shift cell (add if absent, remove if present)
  function toggleCellGroup(day, shiftId, groupId) {
    setGrid(prev => {
      const current = (prev[day]?.[shiftId] || []);
      const next = current.includes(groupId)
        ? current.filter(id => id !== groupId)
        : [...current, groupId];
      return {
        ...prev,
        [day]: { ...(prev[day] || {}), [shiftId]: next },
      };
    });
    setDirty(true);
  }

  async function saveMonth() {
    setSaving(true);
    try {
      const entries = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
        for (const s of shiftDefs) {
          const groupIds = grid[day]?.[s.id] || [];
          for (const groupId of groupIds) {
            if (groupId) entries.push({ date: dayStr, shift: s.id, groupId });
          }
        }
      }
      await apiClient('/shift-assignments/bulk', {
        method: 'POST',
        body: { site, yearMonth, entries },
      });
      setDirty(false);
      alert('Jadwal shift berhasil disimpan!');
    } catch (err) {
      console.error('saveMonth', err);
      alert('Gagal menyimpan jadwal shift');
    } finally {
      setSaving(false);
    }
  }

  function prevMonth() {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else setMonth(m => m + 1);
  }

  function getDayOfWeek(day) {
    return new Date(year, month - 1, day).getDay();
  }

  function isWeekend(day) {
    const dow = getDayOfWeek(day);
    return dow === 0 || dow === 6;
  }

  // --- bulk fill helpers ---
  // Toggle a group across the entire column (all days for a shift)
  // If ANY day already has this group, remove it from all; otherwise add to all.
  function fillColumn(shiftId, groupId) {
    setGrid(prev => {
      const anyHas = Array.from({ length: daysInMonth }, (_, i) => i + 1)
        .some(d => (prev[d]?.[shiftId] || []).includes(groupId));
      const next = { ...prev };
      for (let d = 1; d <= daysInMonth; d++) {
        const current = next[d]?.[shiftId] || [];
        const updated = anyHas
          ? current.filter(id => id !== groupId)
          : current.includes(groupId) ? current : [...current, groupId];
        next[d] = { ...(next[d] || {}), [shiftId]: updated };
      }
      return next;
    });
    setDirty(true);
  }

  function clearAll() {
    setGrid({});
    setDirty(true);
  }

  function printSchedule() {
    const groupById = {};
    groups.forEach(g => { groupById[g.id] = g; });

    const rows = Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
      const dow = new Date(year, month - 1, day).getDay();
      const dayNames = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const isWknd = dow === 0 || dow === 6;
      const cells = shiftDefs.map(s => {
        const ids = grid[day]?.[s.id] || [];
        const names = ids.map(id => groupById[id]?.name || id).join(', ');
        return `<td style="border:1px solid #ccc;padding:5px 8px;font-size:12px;${isWknd ? 'background:#fff5f5' : ''}">${names || '<span style="color:#bbb">&mdash;</span>'}</td>`;
      }).join('');
      return `<tr>
        <td style="border:1px solid #ccc;padding:5px 8px;font-size:12px;font-weight:700;white-space:nowrap;${isWknd ? 'background:#fff5f5;color:#dc2626' : ''}">
          ${String(day).padStart(2,'0')} ${dayNames[dow]}
        </td>
        ${cells}
      </tr>`;
    }).join('');

    const shiftHeaders = shiftDefs.map(s =>
      `<th style="border:1px solid #ccc;padding:6px 10px;background:#f1f5f9;text-align:left;">
        ${s.label}<br><span style="font-weight:400;font-size:11px;color:#666">${s.time}</span>
      </th>`
    ).join('');

    const legendItems = groups.map((g, idx) =>
      `<span style="display:inline-block;margin:2px 6px 2px 0;padding:2px 8px;border-radius:12px;font-size:11px;background:${GROUP_COLORS[idx % GROUP_COLORS.length]}25;border:1px solid ${GROUP_COLORS[idx % GROUP_COLORS.length]};color:#333">${g.name}</span>`
    ).join('');

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Jadwal Shift — ${MONTH_NAMES[month - 1]} ${year} — ${site}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #222; }
    h2 { margin: 0 0 4px; font-size: 18px; }
    p { margin: 0 0 10px; font-size: 13px; color: #555; }
    table { border-collapse: collapse; width: 100%; }
    @media print {
      button { display: none; }
      body { margin: 10px; }
    }
  </style>
</head>
<body>
  <h2>Jadwal Shift — ${MONTH_NAMES[month - 1]} ${year}</h2>
  <p>Site: <strong>${site}</strong></p>
  <div style="margin-bottom:10px">${legendItems}</div>
  <table>
    <thead>
      <tr>
        <th style="border:1px solid #ccc;padding:6px 10px;background:#f1f5f9;text-align:left;">Hari</th>
        ${shiftHeaders}
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); }
  }

  if (!site) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography color="text.secondary">Pilih site terlebih dahulu.</Typography>
      </Paper>
    );
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <Box>
      {/* Header: month nav + actions */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        <IconButton size="small" onClick={prevMonth} title="Bulan sebelumnya">◀</IconButton>
        <Typography sx={{ fontWeight: 700, minWidth: 190, textAlign: 'center', fontSize: 16 }}>
          {MONTH_NAMES[month - 1]} {year}
        </Typography>
        <IconButton size="small" onClick={nextMonth} title="Bulan berikutnya">▶</IconButton>

        <Box sx={{ flex: 1 }} />

        <Button size="small" variant="outlined" color="inherit" onClick={clearAll} disabled={saving}>
          Kosongkan Semua
        </Button>
        <Button size="small" variant="outlined" onClick={printSchedule} disabled={loading}>
          🖨 Print
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={saveMonth}
          disabled={saving || !dirty}
          sx={{ minWidth: 130 }}
        >
          {saving ? <CircularProgress size={14} sx={{ mr: 1 }} color="inherit" /> : null}
          {dirty ? 'Simpan Jadwal *' : 'Simpan Jadwal'}
        </Button>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>Grup:</Typography>
        {groups.map((g, idx) => (
          <Chip
            key={g.id}
            label={g.name}
            size="small"
            sx={{ backgroundColor: GROUP_COLORS[idx % GROUP_COLORS.length] + '25', borderColor: GROUP_COLORS[idx % GROUP_COLORS.length], border: '1px solid', fontSize: 11 }}
          />
        ))}
        {groups.length === 0 && <Typography variant="caption" color="text.secondary">Belum ada grup — buat grup terlebih dahulu.</Typography>}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, maxHeight: '68vh', overflow: 'auto', border: '1px solid', borderColor: 'divider' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                {/* Day column header */}
                <TableCell
                  sx={{
                    fontWeight: 700, minWidth: 72, width: 72,
                    position: 'sticky', left: 0, zIndex: 4,
                    background: '#fff', borderRight: '2px solid #e0e0e0',
                  }}
                >
                  Hari
                </TableCell>

                {shiftDefs.map(s => (
                  <TableCell key={s.id} sx={{ fontWeight: 700, minWidth: 170, zIndex: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      <span>{s.label}</span>
                      <Typography variant="caption" color="text.secondary">{s.time}</Typography>
                    </Box>

                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {days.map(day => {
                const dow = getDayOfWeek(day);
                const weekend = isWeekend(day);
                const dayStr = `${yearMonth}-${String(day).padStart(2, '0')}`;
                const isToday = dayStr === todayStr;
                const rowBg = isToday ? '#eff6ff' : weekend ? '#fafafa' : 'transparent';

                return (
                  <TableRow key={day} sx={{ background: rowBg, '&:hover': { background: isToday ? '#dbeafe' : '#f5f5f5' } }}>
                    {/* Day cell */}
                    <TableCell
                      sx={{
                        position: 'sticky', left: 0, zIndex: 1,
                        background: isToday ? '#eff6ff' : weekend ? '#f5f5f5' : '#fff',
                        borderRight: '2px solid #e0e0e0',
                        p: '6px 10px',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <Typography sx={{ fontWeight: isToday ? 900 : 700, fontSize: 14, lineHeight: 1.2, color: isToday ? 'primary.main' : 'inherit' }}>
                          {String(day).padStart(2, '0')}
                        </Typography>
                        <Typography variant="caption" sx={{ color: weekend ? '#ef4444' : 'text.secondary', fontWeight: 600 }}>
                          {DAY_NAMES_SHORT[dow]}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Shift cells */}
                    {shiftDefs.map(s => {
                      const selectedIds = grid[day]?.[s.id] || [];
                      return (
                        <TableCell key={s.id} sx={{ p: '4px 6px', verticalAlign: 'middle' }}>
                          <Select
                            multiple
                            displayEmpty
                            value={selectedIds}
                            onChange={e => {
                              const val = typeof e.target.value === 'string'
                                ? e.target.value.split(',')
                                : e.target.value;
                              setGrid(prev => ({
                                ...prev,
                                [day]: { ...(prev[day] || {}), [s.id]: val },
                              }));
                              setDirty(true);
                            }}
                            input={<OutlinedInput size="small" />}
                            renderValue={selected =>
                              selected.length === 0 ? (
                                <Typography variant="caption" color="text.disabled">— pilih grup —</Typography>
                              ) : (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                                  {selected.map(id => {
                                    const g = groups.find(x => x.id === id);
                                    const color = getGroupColor(id, groups);
                                    return (
                                      <Chip
                                        key={id}
                                        label={g ? g.name : id}
                                        size="small"
                                        sx={{ fontSize: 10, background: color, color: '#fff', height: 18 }}
                                      />
                                    );
                                  })}
                                </Box>
                              )
                            }
                            fullWidth
                            size="small"
                            sx={{ fontSize: 12, minWidth: 140 }}
                          >
                            {groups.map((g, idx) => {
                              const color = GROUP_COLORS[idx % GROUP_COLORS.length];
                              const active = selectedIds.includes(g.id);
                              return (
                                <MenuItem key={g.id} value={g.id} sx={{ gap: 1 }}>
                                  <Box sx={{
                                    width: 10, height: 10, borderRadius: '50%',
                                    background: color, flexShrink: 0,
                                    border: active ? `2px solid ${color}` : 'none',
                                  }} />
                                  <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 400 }}>
                                    {g.name}
                                  </Typography>
                                  {g.members?.length ? (
                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                                      {g.members.length} org
                                    </Typography>
                                  ) : null}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
