"use client";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import apiClient from '../../../lib/api-client';

// ─── helpers ─────────────────────────────────────────────────────────────────

function toYMD(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

function formatDate(s) {
  if (!s) return '-';
  const dt = new Date(s);
  if (isNaN(dt.getTime())) return String(s);
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
}

function formatTime(s) {
  if (!s) return '-';
  const dt = new Date(s);
  if (isNaN(dt.getTime())) return '-';
  return `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function formatDateTime(s) {
  if (!s) return '-';
  const dt = new Date(s);
  if (isNaN(dt.getTime())) return String(s);
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function answerLabel(item) {
  if (item.answer_text !== null && item.answer_text !== undefined) {
    const t = String(item.answer_text).toLowerCase();
    if (t === 'true' || t === '1' || t === 'ya' || t === 'yes') return { label: 'OK', color: 'success' };
    if (t === 'false' || t === '0' || t === 'tidak' || t === 'no') return { label: 'NOK', color: 'error' };
    return { label: item.answer_text, color: 'default' };
  }
  if (item.answer_number !== null && item.answer_number !== undefined) {
    return { label: String(item.answer_number), color: 'info' };
  }
  if (item.option?.label) return { label: item.option.label, color: 'default' };
  return { label: '-', color: 'default' };
}

function normalizeMediaUrl(p) {
  if (!p) return '';
  try {
    const s = String(p).trim();
    if (!s) return '';
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    if (/^[a-zA-Z]:[\\/]/.test(s) || /^file:\/\//i.test(s)) return '';
    const base = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_API_URL || '')) || (typeof window !== 'undefined' ? window.location.origin : '');
    if (!base) return s.startsWith('/') ? s : `/${s}`;
    return String(base).replace(/\/$/, '') + (s.startsWith('/') ? s : `/${s}`);
  } catch (e) { return String(p); }
}

// ─── main component ───────────────────────────────────────────────────────────

export default function DailyChecklistReport() {
  const today = toYMD(new Date());

  const [date, setDate] = useState(today);
  const [siteId, setSiteId] = useState('');
  const [alatId, setAlatId] = useState('');
  const [search, setSearch] = useState('');

  const [sites, setSites] = useState([]);
  const [alats, setAlats] = useState([]);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // pagination (client-side on fetched data)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // ── load reference data ───────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
      // resolve user's site from /auth/me; if present restrict dropdown to that site only
      try {
        const me = await apiClient('/auth/me').catch(() => null);
        const userSite = me?.site || me?.data?.site || null;
        if (userSite && (userSite.id || userSite.name)) {
          const siteObj = {
            id: userSite.id ?? userSite.site_id ?? userSite.code ?? userSite.name,
            name: userSite.name || userSite.nama || userSite.label || userSite.code || String(userSite.id),
          };
          setSites([siteObj]);
          setSiteId(String(siteObj.id));
        } else {
          // admin / no-site-restriction: show all sites
          const res = await apiClient('/master/sites').catch(() => []);
          setSites(Array.isArray(res) ? res : (res?.data || []));
        }
      } catch {
        const res = await apiClient('/master/sites').catch(() => []);
        setSites(Array.isArray(res) ? res : (res?.data || []));
      }

      // load all alats (filtered client-side by selected site)
      apiClient('/master/alats')
        .then(d => setAlats(Array.isArray(d) ? d : (d?.data || [])))
        .catch(() => {});
    }
    init();
  }, []);

  const filteredAlats = useMemo(() => {
    if (!siteId) return alats;
    return alats.filter(a => String(a.site?.id ?? a.site_id ?? '') === String(siteId));
  }, [alats, siteId]);

  // ── fetch checklist data ──────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setPage(0);
    try {
      const params = new URLSearchParams();
      if (date) { params.set('date_from', date); params.set('date_to', date); }
      if (siteId) params.set('site_id', siteId);
      if (alatId) params.set('alat_id', alatId);
      if (search.trim()) params.set('q', search.trim());

      const res = await apiClient(`/checklists?${params.toString()}`);
      const data = Array.isArray(res) ? res : (res?.data || []);
      const tot = res?.meta?.total ?? data.length;
      setRows(data);
      setTotal(tot);
    } catch (err) {
      setError(err?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [date, siteId, alatId, search]);

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // re-fetch once siteId is auto-populated from /auth/me
  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (siteId && !didAutoFetch.current) {
      didAutoFetch.current = true;
      fetchData();
    }
  }, [siteId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── paginated slice (client side) ─────────────────────────────────────────
  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  // ── detail dialog ─────────────────────────────────────────────────────────
  const openDetail = async (id) => {
    setDetailOpen(true);
    setDetailLoading(true);
    setDetailData(null);
    try {
      const res = await apiClient(`/checklists/${id}`);
      setDetailData(res);
    } catch (e) {
      setDetailData({ error: e?.message || 'Gagal memuat detail' });
    } finally {
      setDetailLoading(false);
    }
  };

  // ── print detail checklist (iframe-based, same as weekly monitoring) ──────
  const printChecklist = () => {
    if (!detailData || !detailData.checklist) return;
    const checklist = detailData.checklist;
    const items = detailData.items || [];

    // sort items by question index
    const sortedItems = [...items].sort((a, b) => {
      const getIdx = x => {
        const q = x?.question || {};
        for (const v of [q.index, q.index_number, q.order, q.position, x.index, x.id, q.id]) {
          if (v !== undefined && v !== null && !isNaN(Number(v))) return Number(v);
        }
        return 9999;
      };
      return getIdx(a) - getIdx(b);
    });

    const htmlItems = sortedItems.map((it, idx) => {
      const rawVal = it?.option?.option_text ?? it?.option?.name ?? it?.answer_text ?? (it?.answer_number !== undefined ? String(it.answer_number) : '');
      const qtext = it?.question?.question_text || it?.question?.text || it?.question?.pertanyaan || '';
      const low = rawVal == null ? null : String(rawVal).toLowerCase();
      let ans = '-';
      let noteHtml = '';
      if (low === null) ans = 'N/A';
      else if (['true', '1', 'yes', 'y', 'ya'].includes(low)) ans = '<strong style="color:#2e7d32">OK</strong>';
      else if (['false', '0', 'no', 'n', 'tidak'].includes(low)) {
        ans = '<strong style="color:#d32f2f">NOT OK</strong>';
        const note = it.evidence_note || it.evidence_description || it.notes || '';
        if (note) noteHtml = `<div style="margin-top:6px;font-size:12px;color:#444">Catatan: ${String(note).replace(/\n/g, '<br/>')}</div>`;
      } else {
        ans = String(rawVal);
      }

      let imgHtml = '';
      try {
        const ev = it.evidence_photo_url || it.evidence_photo_path || null;
        const url = ev ? normalizeMediaUrl(ev) : null;
        if (url) imgHtml = `<div style="margin-top:8px"><img src="${url}" style="max-width:200px;max-height:150px;border:1px solid #ddd;padding:2px;border-radius:4px"/></div>`;
      } catch (e) { imgHtml = ''; }

      return `<tr>
        <td style="vertical-align:top;padding:6px;border:1px solid #ddd;width:36px;text-align:center">${idx + 1}</td>
        <td style="padding:6px;border:1px solid #ddd">${qtext}${noteHtml}${imgHtml}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:center">${ans}</td>
      </tr>`;
    }).join('');

    const alatName = checklist.alat?.nama || checklist.alat?.name || '-';
    const jenisAlatName = checklist.alat?.jenis_alat?.nama || checklist.alat?.jenis_alat?.name || '-';
    const siteName = checklist.site?.name || checklist.site?.nama || checklist.alat?.site?.name || checklist.alat?.site?.nama || '-';

    const html = `
      <html><head><title>Checklist - ${alatName} - ${formatDateTime(checklist.performed_at)}</title>
      <meta charset="utf-8" />
      <style>
        body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #222; font-size: 13px; }
        h1 { font-size: 17px; margin: 0 0 4px 0; }
        h2 { font-size: 14px; margin: 0 0 12px 0; color: #555; font-weight: normal; }
        .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 4px 24px; margin-bottom: 14px; padding: 10px 12px; background: #f8f8f8; border: 1px solid #e0e0e0; border-radius: 4px; }
        .meta div { font-size: 12px; }
        .meta strong { color: #333; }
        table { border-collapse: collapse; width: 100%; margin-top: 4px; }
        th { background: #1976d2; color: #fff; padding: 8px; text-align: left; font-size: 12px; }
        td { border: 1px solid #ddd; padding: 7px 8px; font-size: 12px; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
        .header-line { border-bottom: 2px solid #1976d2; padding-bottom: 6px; margin-bottom: 12px; }
        .footer { margin-top: 16px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 6px; }
        @media print { @page { margin: 12mm; size: A4 portrait; } body { padding: 0; } }
      </style>
      </head><body>
        <div class="header-line">
          <h1>LAPORAN DAILY CHECKLIST</h1>
          <h2>${alatName} &mdash; ${jenisAlatName} &mdash; ${siteName}</h2>
        </div>
        <div class="meta">
          <div><strong>Alat:</strong> ${alatName}</div>
          <div><strong>Jenis Alat:</strong> ${jenisAlatName}</div>
          <div><strong>Teknisi:</strong> ${checklist.teknisi_name || checklist.teknisi_id || '-'}</div>
          <div><strong>Site:</strong> ${siteName}</div>
          <div><strong>Tanggal &amp; Waktu:</strong> ${formatDateTime(checklist.performed_at)}</div>
          <div><strong>Catatan:</strong> ${checklist.notes ? String(checklist.notes).replace(/\n/g, '<br/>') : '-'}</div>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width:36px;text-align:center">#</th>
              <th>Pertanyaan</th>
              <th style="width:90px;text-align:center">Jawaban</th>
            </tr>
          </thead>
          <tbody>${htmlItems}</tbody>
        </table>
        <div class="footer">Dicetak: ${formatDateTime(new Date().toISOString())} &nbsp;|&nbsp; Total: ${sortedItems.length} item</div>
      </body></html>
    `;

    try {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;overflow:hidden';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open(); doc.write(html); doc.close();
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        } catch (e) {
          const win = window.open('', '_blank', 'noopener,noreferrer');
          if (!win) { alert('Pop-up diblokir. Izinkan pop-up untuk situs ini.'); return; }
          win.document.write(html); win.document.close(); win.focus(); win.print();
        } finally {
          setTimeout(() => { try { document.body.removeChild(iframe); } catch (_) {} }, 800);
        }
      }, 300);
    } catch (e) {
      try {
        const win = window.open('', '_blank', 'noopener,noreferrer');
        if (!win) { alert('Pop-up diblokir. Izinkan pop-up untuk situs ini.'); return; }
        win.document.write(html); win.document.close(); win.focus(); win.print();
      } catch (_) { alert('Tidak dapat membuka jendela cetak.'); }
    }
  };

  // ── export Excel ──────────────────────────────────────────────────────────
  const exportExcel = () => {
    try {
      const XLSX = require('xlsx');
      const siteName = siteId ? (sites.find(s => String(s.id) === String(siteId))?.name || siteId) : 'Semua Site';

      // Summary sheet
      const summaryData = [
        ['LAPORAN DAILY CHECKLIST'],
        [`Tanggal: ${formatDate(date + 'T00:00:00')}`],
        [`Site: ${siteName}`],
        [`Dicetak: ${formatDateTime(new Date().toISOString())}`],
        [`Total Data: ${rows.length}`],
        [],
      ];

      // Data header + rows
      const header = ['No', 'Tanggal', 'Waktu', 'Alat', 'Jenis Alat', 'Teknisi', 'Site', 'Catatan'];
      const dataRows = rows.map((r, i) => [
        i + 1,
        formatDate(r.performed_at),
        formatTime(r.performed_at),
        r.alat?.nama || r.alat?.name || '-',
        r.alat?.jenis_alat?.nama || r.alat?.jenis_alat?.name || '-',
        r.teknisi_name || (r.teknisi_id ? String(r.teknisi_id) : '-'),
        r.site?.name || r.site?.nama || r.alat?.site?.name || r.alat?.site?.nama || '-',
        r.notes || '-',
      ]);

      const wsData = [...summaryData, header, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [
        { wch: 5 }, { wch: 12 }, { wch: 8 }, { wch: 22 }, { wch: 22 },
        { wch: 28 }, { wch: 20 }, { wch: 35 },
      ];

      // Bold & center title rows
      const titleRows = [0, 1, 2, 3, 4];
      for (const r of titleRows) {
        const cellAddr = XLSX.utils.encode_cell({ r, c: 0 });
        if (ws[cellAddr]) {
          ws[cellAddr].s = { font: { bold: true }, alignment: { horizontal: 'left' } };
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Daily Checklist');
      const filename = `laporan-daily-checklist-${date || 'all'}.xlsx`;
      XLSX.writeFile(wb, filename);
    } catch (e) {
      alert('Gagal export Excel: ' + (e?.message || String(e)));
    }
  };

  // ── computed display info ─────────────────────────────────────────────────
  const siteName = useMemo(() => {
    if (!siteId) return 'Semua Site';
    const s = sites.find(x => String(x.id) === String(siteId));
    return s ? (s.name || s.nama || siteId) : siteId;
  }, [siteId, sites]);

  const printTitle = `LAPORAN DAILY CHECKLIST — ${siteName} — Tanggal ${formatDate(date + 'T00:00:00')}`;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* print-specific CSS */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-show { display: block !important; }
          .print-table-wrapper { overflow: visible !important; }
          body { font-size: 10px; }
          @page { margin: 12mm; size: A4 landscape; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
        }
        .print-show { display: none; }
      `}</style>

      <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
        {/* ── Page title ── */}
        <Typography variant="h5" fontWeight="bold" gutterBottom className="no-print">
          Laporan Daily Checklist
        </Typography>

        {/* ── Print header (visible only when printing) ── */}
        <Box className="print-show" sx={{ mb: 1.5, borderBottom: '2px solid #333', pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">{printTitle}</Typography>
          <Typography variant="caption">
            Dicetak: {formatDateTime(new Date().toISOString())} &nbsp;|&nbsp; Total: {rows.length} data
          </Typography>
        </Box>

        {/* ── Filter bar ── */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }} className="no-print">
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="flex-end">
            <TextField
              label="Tanggal"
              type="date"
              size="small"
              value={date}
              onChange={e => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              select
              label="Site"
              size="small"
              value={siteId}
              onChange={e => { setSiteId(e.target.value); setAlatId(''); }}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">Semua Site</MenuItem>
              {sites.map(s => (
                <MenuItem key={s.id} value={String(s.id)}>{s.name || s.nama}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Alat"
              size="small"
              value={alatId}
              onChange={e => setAlatId(e.target.value)}
              sx={{ minWidth: 170 }}
            >
              <MenuItem value="">Semua Alat</MenuItem>
              {filteredAlats.map(a => (
                <MenuItem key={a.id} value={String(a.id)}>{a.nama || a.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Cari"
              size="small"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchData()}
              placeholder="Teknisi, alat, catatan…"
              sx={{ minWidth: 190 }}
            />
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              onClick={fetchData}
              disabled={loading}
            >
              Cari
            </Button>
            <Tooltip title="Refresh data">
              <span>
                <IconButton onClick={fetchData} disabled={loading}><RefreshIcon /></IconButton>
              </span>
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportExcel}
              disabled={rows.length === 0 || loading}
            >
              Export Excel
            </Button>
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={() => window.print()}
              disabled={rows.length === 0 || loading}
            >
              Print / PDF
            </Button>
          </Stack>
        </Paper>

        {/* ── Summary info ── */}
        {!loading && !error && (
          <Box sx={{ mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              Total <strong>{total}</strong> data
              {rows.length !== total && ` (menampilkan ${rows.length})`}
              {date && ` | Tanggal: ${formatDate(date + 'T00:00:00')}`}
              {siteName !== 'Semua Site' && ` | Site: ${siteName}`}
            </Typography>
          </Box>
        )}

        {/* ── Error ── */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        )}

        {/* ── Loading ── */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* ── Table ── */}
        {!loading && (
          <Paper elevation={1} className="print-table-wrapper" sx={{ overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff', whiteSpace: 'nowrap' }}>No</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff', whiteSpace: 'nowrap' }}>Tanggal</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff', whiteSpace: 'nowrap' }}>Waktu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>Alat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>Jenis Alat</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>Teknisi</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>Site</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }}>Catatan</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: '#1976d2', color: '#fff' }} className="no-print">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 5, color: 'text.secondary' }}>
                      Tidak ada data — gunakan filter di atas lalu klik <strong>Cari</strong>
                    </TableCell>
                  </TableRow>
                ) : pagedRows.map((r, i) => (
                  <TableRow key={r.id} hover sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDate(r.performed_at)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatTime(r.performed_at)}</TableCell>
                    <TableCell>{r.alat?.nama || r.alat?.name || '-'}</TableCell>
                    <TableCell>{r.alat?.jenis_alat?.nama || r.alat?.jenis_alat?.name || '-'}</TableCell>
                    <TableCell>{r.teknisi_name || (r.teknisi_id ? String(r.teknisi_id) : '-')}</TableCell>
                    <TableCell>{r.site?.name || r.site?.nama || r.alat?.site?.name || r.alat?.site?.nama || '-'}</TableCell>
                    <TableCell sx={{ maxWidth: 220 }}>
                      <Typography variant="caption" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {r.notes || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell className="no-print">
                      <Tooltip title="Lihat detail checklist">
                        <IconButton size="small" onClick={() => openDetail(r.id)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* pagination — hidden when printing */}
            {rows.length > 0 && (
              <TablePagination
                className="no-print"
                component="div"
                count={rows.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={(_, np) => setPage(np)}
                rowsPerPageOptions={[10, 25, 50, 100]}
                onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                labelRowsPerPage="Baris per halaman:"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
              />
            )}
          </Paper>
        )}
      </Box>

      {/* ── Detail Dialog ── */}
      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth scroll="paper">
        <DialogTitle sx={{ pr: 12 }}>
          Detail Checklist
          <Tooltip title="Print / Cetak PDF">
            <span>
              <IconButton
                size="small"
                sx={{ position: 'absolute', right: 44, top: 8 }}
                onClick={printChecklist}
                disabled={detailLoading || !detailData || !!detailData.error}
              >
                <PrintIcon />
              </IconButton>
            </span>
          </Tooltip>
          <IconButton
            size="small"
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setDetailOpen(false)}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {detailLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          {detailData?.error && <Alert severity="error">{detailData.error}</Alert>}
          {detailData && !detailData.error && !detailLoading && (
            <Box>
              {/* Header info */}
              {(() => {
                const cl = detailData.checklist;
                const jenisAlat = cl?.alat?.jenis_alat?.nama || cl?.alat?.jenis_alat?.name || '-';
                const site = cl?.site?.name || cl?.site?.nama || cl?.alat?.site?.name || cl?.alat?.site?.nama || '-';
                return (
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 2 }}>
                    <Typography variant="body2"><strong>Alat:</strong> {cl?.alat?.nama || cl?.alat?.name || '-'}</Typography>
                    <Typography variant="body2"><strong>Jenis Alat:</strong> {jenisAlat}</Typography>
                    <Typography variant="body2"><strong>Teknisi:</strong> {cl?.teknisi_name || cl?.teknisi_id || '-'}</Typography>
                    <Typography variant="body2"><strong>Site:</strong> {site}</Typography>
                    <Typography variant="body2"><strong>Tanggal &amp; Waktu:</strong> {formatDateTime(cl?.performed_at)}</Typography>
                    <Typography variant="body2"><strong>Catatan:</strong> {cl?.notes || '-'}</Typography>
                  </Box>
                );
              })()}

              <Divider sx={{ mb: 2 }} />

              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Item Checklist ({detailData.items?.length || 0} pertanyaan)
              </Typography>

              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', width: 40 }}>No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Pertanyaan</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5', width: 100 }}>Jawaban</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: '#f5f5f5' }}>Keterangan / Catatan</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(detailData.items || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                        Tidak ada item checklist
                      </TableCell>
                    </TableRow>
                  ) : (detailData.items || []).map((item, i) => {
                    const ans = answerLabel(item);
                    return (
                      <TableRow key={item.id} sx={{ '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          {item.question?.question_text || item.question?.text || item.question?.pertanyaan || '-'}
                        </TableCell>
                        <TableCell>
                          <Chip label={ans.label} size="small" color={ans.color} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">{item.evidence_note || '-'}</Typography>
                          {(item.evidence_photo_url || item.evidence_photo_path) && (
                            <Box>
                              <Typography
                                component="a"
                                href={item.evidence_photo_url || item.evidence_photo_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="caption"
                                color="primary"
                                sx={{ display: 'block' }}
                              >
                                Lihat foto bukti
                              </Typography>
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
