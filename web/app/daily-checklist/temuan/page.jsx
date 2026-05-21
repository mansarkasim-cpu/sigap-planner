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
import ImageIcon from '@mui/icons-material/Image';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import Collapse from '@mui/material/Collapse';
import TableContainer from '@mui/material/TableContainer';
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

function formatDateTime(s) {
  if (!s) return '-';
  const dt = new Date(s);
  if (isNaN(dt.getTime())) return String(s);
  return `${String(dt.getDate()).padStart(2, '0')}/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
}

function normalizeMediaUrl(p) {
  if (!p) return '';
  try {
    const s = String(p).trim();
    if (!s) return '';
    if (/^(https?:|data:|blob:)/i.test(s)) return s;
    if (/^[a-zA-Z]:[\\/]/.test(s) || /^file:\/\//i.test(s)) return '';
    const base = (typeof window !== 'undefined' && (process.env.NEXT_PUBLIC_API_URL || '')) || '';
    if (!base) return s.startsWith('/') ? s : `/${s}`;
    return String(base).replace(/\/$/, '') + (s.startsWith('/') ? s : `/${s}`);
  } catch (e) { return String(p); }
}

// Group findings by alat name then by date
function groupFindings(rows) {
  const byAlat = {};
  for (const row of rows) {
    const alatKey = row.alat?.nama || row.alat?.id || 'Tidak Diketahui';
    if (!byAlat[alatKey]) {
      byAlat[alatKey] = { alat: row.alat, dates: {} };
    }
    const dateKey = formatDate(row.performed_at);
    if (!byAlat[alatKey].dates[dateKey]) {
      byAlat[alatKey].dates[dateKey] = { performed_at: row.performed_at, teknisi_name: row.teknisi_name, items: [] };
    }
    byAlat[alatKey].dates[dateKey].items.push(row);
  }
  return byAlat;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getMondayYMD() {
  const dt = new Date();
  const day = dt.getDay();
  const diff = (day + 6) % 7; // days since Monday
  dt.setDate(dt.getDate() - diff);
  return toYMD(dt);
}

// ─── main component ───────────────────────────────────────────────────────────

export default function TemuanChecklistPage() {
  const today = toYMD(new Date());

  const [dateFrom, setDateFrom] = useState(getMondayYMD);
  const [dateTo, setDateTo] = useState(today);
  const [siteId, setSiteId] = useState('');
  const [alatId, setAlatId] = useState('');

  const [sites, setSites] = useState([]);
  const [alats, setAlats] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const [photoUrl, setPhotoUrl] = useState('');
  const [photoOpen, setPhotoOpen] = useState(false);

  // collapsible alat rows
  const [collapsed, setCollapsed] = useState({});

  // ── load reference data ───────────────────────────────────────────────────
  useEffect(() => {
    async function init() {
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
          const res = await apiClient('/master/sites').catch(() => []);
          setSites(Array.isArray(res) ? res : (res?.data || []));
        }
      } catch {
        const res = await apiClient('/master/sites').catch(() => []);
        setSites(Array.isArray(res) ? res : (res?.data || []));
      }

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

  // ── fetch findings ────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    setPage(0);
    try {
      const params = new URLSearchParams();
      if (dateFrom) params.set('date_from', dateFrom);
      if (dateTo)   params.set('date_to', dateTo);
      if (siteId) params.set('site_id', siteId);
      if (alatId) params.set('alat_id', alatId);

      const res = await apiClient(`/checklists/findings?${params.toString()}`);
      const data = Array.isArray(res) ? res : (res?.data || []);
      setRows(data);
    } catch (err) {
      setError(err?.message || 'Gagal memuat data');
    } finally {
      setLoading(false);
    }
  }, [dateFrom, dateTo, siteId, alatId]);

  useEffect(() => { fetchData(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const didAutoFetch = useRef(false);
  useEffect(() => {
    if (siteId && !didAutoFetch.current) {
      didAutoFetch.current = true;
      fetchData();
    }
  }, [siteId]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── flat list for table view ───────────────────────────────────────────────
  const pagedRows = useMemo(() => {
    const start = page * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  // ── computed display info ─────────────────────────────────────────────────
  const siteName = useMemo(() => {
    if (!siteId) return 'Semua Site';
    const s = sites.find(x => String(x.id) === String(siteId));
    return s ? (s.name || s.nama || siteId) : siteId;
  }, [siteId, sites]);

  const dateRangeLabel = dateFrom === dateTo
    ? formatDate(dateFrom + 'T00:00:00')
    : `${formatDate(dateFrom + 'T00:00:00')} s/d ${formatDate(dateTo + 'T00:00:00')}`;

  const printTitle = `LAPORAN TEMUAN DAILY CHECKLIST — ${siteName} — ${dateRangeLabel}`;

  // ── export Excel ──────────────────────────────────────────────────────────
  const exportExcel = () => {
    try {
      const XLSX = require('xlsx');
      const header = ['No', 'Tanggal', 'Jam', 'Nama Alat', 'Jenis Alat', 'Site', 'Kelompok', 'Temuan / Pertanyaan', 'Catatan', 'Teknisi'];
      const dataRows = rows.map((r, i) => {
        const dt = r.performed_at ? new Date(r.performed_at) : null;
        return [
          i + 1,
          dt ? formatDate(r.performed_at) : '-',
          dt ? `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` : '-',
          r.alat?.nama || '-',
          r.alat?.jenis_alat || '-',
          r.alat?.site?.name || '-',
          r.kelompok || '-',
          r.question_text || '-',
          r.evidence_note || '-',
          r.teknisi_name || '-',
        ];
      });

      const summaryData = [
        ['LAPORAN TEMUAN DAILY CHECKLIST'],
        [`Periode: ${dateRangeLabel}`],
        [`Site: ${siteName}`],
        [`Dicetak: ${formatDateTime(new Date().toISOString())}`],
        [`Total Temuan: ${rows.length}`],
        [],
      ];

      const wsData = [...summaryData, header, ...dataRows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      ws['!cols'] = [
        { wch: 5 }, { wch: 12 }, { wch: 7 }, { wch: 22 }, { wch: 20 },
        { wch: 18 }, { wch: 18 }, { wch: 45 }, { wch: 40 }, { wch: 28 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Temuan Checklist');
      XLSX.writeFile(wb, `laporan-temuan-checklist-${dateFrom || 'all'}-sd-${dateTo || 'all'}.xlsx`);
    } catch (e) {
      alert('Gagal export Excel: ' + (e?.message || String(e)));
    }
  };

  // ── print ─────────────────────────────────────────────────────────────────
  const handlePrint = () => {
    const tableRows = rows.map((r, i) => {
      const dt = r.performed_at ? new Date(r.performed_at) : null;
      const time = dt ? `${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}` : '-';
      return `<tr>
        <td style="text-align:center">${i + 1}</td>
        <td>${dt ? formatDate(r.performed_at) : '-'} ${time}</td>
        <td><strong>${r.alat?.nama || '-'}</strong><br/><small>${r.alat?.jenis_alat || ''}</small></td>
        <td>${r.kelompok || '-'}</td>
        <td>${r.question_text || '-'}</td>
        <td>${r.evidence_note || '-'}</td>
        <td>${r.teknisi_name || '-'}</td>
      </tr>`;
    }).join('');

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>${printTitle}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 10px; margin: 0; }
        h2 { font-size: 13px; margin: 0 0 2px; }
        .meta { font-size: 9px; color: #555; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #aaa; padding: 3px 5px; vertical-align: top; }
        th { background: #e0e0e0; font-size: 9.5px; }
        tr:nth-child(even) { background: #f9f9f9; }
        @page { size: A4 landscape; margin: 12mm; }
      </style>
    </head><body>
      <h2>${printTitle}</h2>
      <div class="meta">Dicetak: ${formatDateTime(new Date().toISOString())} &nbsp;|&nbsp; Total temuan: ${rows.length}</div>
      <table>
        <thead><tr>
          <th style="width:30px">No</th>
          <th style="width:100px">Waktu</th>
          <th>Nama Alat</th>
          <th>Kelompok</th>
          <th>Temuan</th>
          <th>Catatan</th>
          <th>Teknisi</th>
        </tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>`;

    try {
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open(); doc.write(html); doc.close();
      setTimeout(() => {
        try { iframe.contentWindow.focus(); iframe.contentWindow.print(); }
        catch (e) {
          const win = window.open('', '_blank', 'noopener,noreferrer');
          if (!win) { alert('Pop-up diblokir.'); return; }
          win.document.write(html); win.document.close(); win.focus(); win.print();
        } finally {
          setTimeout(() => { try { document.body.removeChild(iframe); } catch (_) {} }, 800);
        }
      }, 300);
    } catch (e) {
      const win = window.open('', '_blank', 'noopener,noreferrer');
      if (win) { win.document.write(html); win.document.close(); win.focus(); win.print(); }
    }
  };

  // ─── render ───────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-show { display: block !important; }
          body { font-size: 10px; }
          @page { margin: 12mm; size: A4 landscape; }
          thead { display: table-header-group; }
          tr { page-break-inside: avoid; }
        }
        .print-show { display: none; }
      `}</style>

      <Box sx={{ p: { xs: 1.5, sm: 3 } }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom className="no-print">
          Laporan Temuan Daily Checklist
        </Typography>

        <Box className="print-show" sx={{ mb: 1.5, borderBottom: '2px solid #333', pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">{printTitle}</Typography>
          <Typography variant="caption">
            Dicetak: {formatDateTime(new Date().toISOString())} &nbsp;|&nbsp; Total temuan: {rows.length}
          </Typography>
        </Box>

        {/* ── Filter bar ── */}
        <Paper elevation={2} sx={{ p: 2, mb: 3 }} className="no-print">
          <Stack direction="row" flexWrap="wrap" gap={2} alignItems="flex-end">
            <TextField
              label="Dari Tanggal"
              type="date"
              size="small"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 160 }}
            />
            <TextField
              label="Sampai Tanggal"
              type="date"
              size="small"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
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

            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <SearchIcon />}
              onClick={fetchData}
              disabled={loading}
            >
              Tampilkan
            </Button>
            <Tooltip title="Refresh">
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
              onClick={handlePrint}
              disabled={rows.length === 0 || loading}
            >
              Cetak
            </Button>
          </Stack>
        </Paper>

        {/* ── Error ── */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>
        )}

        {/* ── Summary chips ── */}
        {!loading && rows.length > 0 && (
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mb: 2 }} className="no-print">
            <Chip label={`Total temuan: ${rows.length}`} color="error" size="small" />
            <Chip
              label={`Alat terdampak: ${new Set(rows.map(r => r.alat?.id)).size}`}
              color="warning"
              size="small"
            />
          </Stack>
        )}

        {/* ── Loading ── */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {/* ── Empty ── */}
        {!loading && rows.length === 0 && !error && (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Tidak ada temuan untuk tanggal {formatDate(date + 'T00:00:00')}.
            </Typography>
          </Paper>
        )}

        {/* ── Table ── */}
        {!loading && rows.length > 0 && (
          <Paper elevation={2}>
            <TableContainer sx={{ maxHeight: 'calc(100vh - 320px)', overflow: 'auto' }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', width: 42 }}>No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>Waktu</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 180 }}>Nama Alat</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 130 }}>Jenis Alat</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Kelompok</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 240 }}>Temuan / Pertanyaan</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 220 }}>Catatan Temuan</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', minWidth: 160 }}>Teknisi</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', width: 70 }}>Foto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagedRows.map((r, idx) => {
                    const dt = r.performed_at ? new Date(r.performed_at) : null;
                    const timeStr = dt
                      ? `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`
                      : '-';
                    const imgUrl = normalizeMediaUrl(r.evidence_photo_url);
                    return (
                      <TableRow
                        key={r.id}
                        hover
                        sx={{ '&:nth-of-type(even)': { bgcolor: 'action.hover' } }}
                      >
                        <TableCell>{page * rowsPerPage + idx + 1}</TableCell>
                        <TableCell>
                          <Typography variant="body2">{dt ? formatDate(r.performed_at) : '-'}</Typography>
                          <Typography variant="caption" color="text.secondary">{timeStr}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {r.alat?.nama || '-'}
                          </Typography>
                          {r.alat?.kode && (
                            <Typography variant="caption" color="text.secondary">{r.alat.kode}</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.alat?.jenis_alat || '-'}</Typography>
                          <Typography variant="caption" color="text.secondary">{r.alat?.site?.name || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          {r.kelompok ? (
                            <Chip label={r.kelompok} size="small" variant="outlined" />
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.question_text || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{
                              color: r.evidence_note ? 'text.primary' : 'text.disabled',
                              fontStyle: r.evidence_note ? 'normal' : 'italic',
                            }}
                          >
                            {r.evidence_note || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{r.teknisi_name || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          {imgUrl ? (
                            <Tooltip title="Lihat foto bukti">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => { setPhotoUrl(imgUrl); setPhotoOpen(true); }}
                              >
                                <ImageIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Typography variant="caption" color="text.disabled">-</Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={e => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[25, 50, 100]}
              labelRowsPerPage="Baris:"
              labelDisplayedRows={({ from, to, count }) => `${from}–${to} dari ${count}`}
              className="no-print"
            />
          </Paper>
        )}
      </Box>

      {/* ── Photo dialog ── */}
      <Dialog open={photoOpen} onClose={() => setPhotoOpen(false)} maxWidth="md">
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Foto Bukti Temuan
          <IconButton onClick={() => setPhotoOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photoUrl}
              alt="Foto bukti temuan"
              style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain', display: 'block', margin: '0 auto' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
