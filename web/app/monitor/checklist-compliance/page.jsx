"use client"
import { useEffect, useState, useMemo, useCallback } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Tooltip from '@mui/material/Tooltip'
import Alert from '@mui/material/Alert'
import LinearProgress from '@mui/material/LinearProgress'
import PrintIcon from '@mui/icons-material/Print'
import RefreshIcon from '@mui/icons-material/Refresh'
import apiClient from '../../../lib/api-client'

// ─── helpers ─────────────────────────────────────────────────────────────────

function currentYearMonth() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function daysInMonth(ym) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

function dayLabel(ym, day) {
  const [y, m] = ym.split('-').map(Number)
  const dt = new Date(y, m - 1, day)
  const wd = dt.toLocaleDateString('id-ID', { weekday: 'short' })
  return { day, wd }
}

function isSunday(ym, day) {
  const [y, m] = ym.split('-').map(Number)
  return new Date(y, m - 1, day).getDay() === 0
}

function toYMD(ym, day) {
  const [y, m] = ym.split('-').map(Number)
  return `${y}-${String(m).padStart(2,'0')}-${String(day).padStart(2,'0')}`
}

function monthLabel(ym) {
  if (!ym) return ''
  const [y, m] = ym.split('-').map(Number)
  const dt = new Date(y, m - 1, 1)
  return dt.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

function complianceColor(pct) {
  if (pct === null || pct === undefined) return 'default'
  if (pct >= 90) return 'success'
  if (pct >= 70) return 'warning'
  return 'error'
}

function complianceBg(pct) {
  if (pct === null || pct === undefined) return undefined
  if (pct >= 90) return '#e8f5e9'
  if (pct >= 70) return '#fff8e1'
  return '#ffebee'
}

const STATUS_LABEL = {
  DONE:    'Done',
  MISS:    'Miss',
  PENDING: 'Pending',
}

const STATUS_STYLE = {
  DONE:    { bg: '#4caf50', color: '#fff', label: '\u2713' },
  MISS:    { bg: '#f44336', color: '#fff', label: '\u2717' },
  PENDING: { bg: '#ff9800', color: '#fff', label: '?' },
}

function todayYMD() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// SKIPPED or PENDING on a past date → MISS
function effectiveStatus(status, ymd, today) {
  if (status === 'SKIPPED') return 'MISS'
  if (status === 'PENDING' && ymd < today) return 'MISS'
  return status
}

// ─── main component ───────────────────────────────────────────────────────────

export default function ChecklistCompliancePage() {
  const [month, setMonth] = useState(currentYearMonth)
  const [siteId, setSiteId] = useState('')
  const [sites, setSites] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null) // { month, scheduleDates, technicians }

  // pre-load sites — auto-select user's site if available
  useEffect(() => {
    async function loadSites() {
      try {
        const me = await apiClient('/auth/me').catch(() => null)
        const userSite = me?.site || me?.data?.site || null
        if (userSite && (userSite.id || userSite.code || userSite.name)) {
          const siteObj = {
            id: userSite.id ?? userSite.site_id ?? userSite.code ?? userSite.name,
            name: userSite.name || userSite.nama || userSite.label || userSite.code || String(userSite.id),
          }
          setSites([siteObj])
          setSiteId(String(siteObj.id))
          return
        }
        const res = await apiClient('/master/sites')
        setSites(res?.data || res || [])
      } catch (e) {
        console.error(e)
      }
    }
    loadSites()
  }, [])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const qs = new URLSearchParams({ month })
      if (siteId) qs.set('site_id', siteId)
      const res = await apiClient(`/monitor/checklist-compliance?${qs}`)
      setData(res)
    } catch (e) {
      setError(e?.message || 'Gagal memuat data')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [month, siteId])

  useEffect(() => { load() }, [load])

  // Build list of days for the selected month
  const totalDays = useMemo(() => daysInMonth(month), [month])
  const daysList = useMemo(() => Array.from({ length: totalDays }, (_, i) => i + 1), [totalDays])

  // Set of dates that had at least one schedule (for dimming unscheduled days)
  const scheduledDatesSet = useMemo(() => new Set(data?.scheduleDates || []), [data])

  const today = useMemo(() => todayYMD(), [])

  // Adjust each technician's per-day statuses: PENDING on a past date → MISS
  const technicians = useMemo(() => {
    const raw = data?.technicians || []
    return raw.map(tech => {
      let done = 0, miss = 0, pending = 0
      const adjustedDays = {}
      for (const [ymd, statuses] of Object.entries(tech.days)) {
        // statuses is now an array of {status, alat} objects
        const arr = Array.isArray(statuses) ? statuses : [statuses]
        const effList = arr.map(item => {
          const s = typeof item === 'object' ? item.status : item
          const alat = typeof item === 'object' ? item.alat : '-'
          return { status: effectiveStatus(s, ymd, today), alat }
        })
        adjustedDays[ymd] = effList
        for (const { status: eff } of effList) {
          if (eff === 'DONE') done++
          else if (eff === 'MISS') miss++
          else pending++
        }
      }
      const compliance = tech.total > 0 ? Math.round((done / tech.total) * 100) : null
      return { ...tech, days: adjustedDays, done, miss, pending, compliance }
    })
  }, [data, today])

  // Summary stats
  const totals = useMemo(() => {
    if (!technicians.length) return null
    const total = technicians.reduce((a, t) => a + t.total, 0)
    const done = technicians.reduce((a, t) => a + t.done, 0)
    const miss = technicians.reduce((a, t) => a + t.miss, 0)
    const pending = technicians.reduce((a, t) => a + t.pending, 0)
    return { total, done, miss, pending, compliance: total > 0 ? Math.round((done / total) * 100) : null }
  }, [technicians])

  return (
    <Box sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Print-only header */}
      <Box className="print-header" sx={{ display: 'none' }}>
        <Typography variant="h6" fontWeight={700} align="center" gutterBottom>
          Monitoring Performansi Daily Checklist
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Periode: {monthLabel(month)}{sites.find(s => String(s.id) === String(siteId)) ? ` · Site: ${sites.find(s => String(s.id) === String(siteId))?.name || siteId}` : ''}
        </Typography>
        <Typography variant="caption" align="center" display="block" sx={{ mb: 1, color: 'text.secondary' }}>
          Dicetak: {new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
        </Typography>
      </Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1} mb={2}>
        <Typography variant="h5" fontWeight={700}>
          Monitoring Performansi Daily Checklist
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          className="no-print"
        >
          Cetak
        </Button>
      </Stack>

      {/* Filters */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }} className="no-print">
        <TextField
          label="Bulan"
          type="month"
          size="small"
          value={month}
          onChange={e => setMonth(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Site"
          select
          size="small"
          value={siteId}
          onChange={e => setSiteId(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {sites.map(s => (
            <MenuItem key={s.id} value={s.id}>{s.name || s.nama || s.code || s.id}</MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={load}
          disabled={loading}
        >
          Refresh
        </Button>
      </Paper>

      {/* Loading / Error */}
      {loading && (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CircularProgress size={20} />
          <Typography variant="body2">Loading...</Typography>
        </Box>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Summary cards */}
      {totals && !loading && (
        <Stack direction="row" gap={2} mb={2} flexWrap="wrap">
          <Paper variant="outlined" sx={{ p: 1.5, minWidth: 110, textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary">Total Tasks</Typography>
            <Typography variant="h6" fontWeight={700}>{totals.total}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.5, minWidth: 110, textAlign: 'center', bgcolor: '#e8f5e9' }}>
            <Typography variant="caption" color="text.secondary">Done</Typography>
            <Typography variant="h6" fontWeight={700} color="success.main">{totals.done}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.5, minWidth: 110, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="caption" color="text.secondary">Pending</Typography>
            <Typography variant="h6" fontWeight={700} color="error.main">{totals.pending}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.5, minWidth: 110, textAlign: 'center', bgcolor: '#ffebee' }}>
            <Typography variant="caption" color="text.secondary">Miss</Typography>
            <Typography variant="h6" fontWeight={700} color="error.main">{totals.miss}</Typography>
          </Paper>
          <Paper variant="outlined" sx={{ p: 1.5, minWidth: 140, textAlign: 'center', bgcolor: complianceBg(totals.compliance) }}>
            <Typography variant="caption" color="text.secondary">Avg. Compliance</Typography>
            <Typography variant="h6" fontWeight={700}>{totals.compliance !== null ? `${totals.compliance}%` : '-'}</Typography>
            {totals.compliance !== null && (
              <LinearProgress
                variant="determinate"
                value={totals.compliance}
                color={complianceColor(totals.compliance)}
                sx={{ mt: 0.5, borderRadius: 1, height: 6 }}
              />
            )}
          </Paper>
        </Stack>
      )}

      {/* Legend */}
      {!loading && technicians.length > 0 && (
        <Stack direction="row" gap={1} mb={1.5} flexWrap="wrap" className="no-print">
          {[
            { key: 'DONE',    label: 'Done' },
            { key: 'MISS',    label: 'Miss' },
            { key: 'PENDING', label: 'Pending' },
          ].map(({ key, label }) => {
            const v = STATUS_STYLE[key]
            return (
              <Box key={key} display="flex" alignItems="center" gap={0.5}>
                <Box sx={{ width: 16, height: 16, borderRadius: '3px', bgcolor: v.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: v.color, lineHeight: 1 }}>{v.label}</Typography>
                </Box>
                <Typography variant="caption">{label}</Typography>
              </Box>
            )
          })}
          <Box display="flex" alignItems="center" gap={0.5}>
            <Box sx={{ width: 16, height: 16, borderRadius: '3px', bgcolor: '#f5f5f5', border: '1px solid #ddd' }} />
            <Typography variant="caption">Not Scheduled</Typography>
          </Box>
        </Stack>
      )}

      {/* Compliance table */}
      {!loading && technicians.length > 0 && (
        <Paper variant="outlined" sx={{ overflow: 'auto' }} className="print-table-wrapper">
          <Table size="small" stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 700, minWidth: 160, position: 'sticky', left: 0, zIndex: 3,
                    bgcolor: 'grey.100', borderRight: '2px solid #e0e0e0',
                  }}
                  className="print-sticky-off"
                >
                  Technician
                </TableCell>
                {daysList.map(d => {
                  const { wd } = dayLabel(month, d)
                  const sun = isSunday(month, d)
                  return (
                    <TableCell
                      key={d}
                      align="center"
                      sx={{
                        fontWeight: 600, px: 0.5, py: 0.75, minWidth: 32,
                        bgcolor: sun ? '#fce4ec' : 'grey.100',
                        color: sun ? 'error.main' : 'inherit',
                        fontSize: '0.7rem',
                        borderBottom: '2px solid #e0e0e0',
                      }}
                    >
                      <div>{d}</div>
                      <div style={{ fontSize: '0.65rem', fontWeight: 400, opacity: 0.7 }}>{wd}</div>
                    </TableCell>
                  )
                })}
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100', minWidth: 60, fontSize: '0.75rem' }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100', minWidth: 60, fontSize: '0.75rem', color: 'success.main' }}>Done</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100', minWidth: 60, fontSize: '0.75rem', color: 'error.main' }}>Miss</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100', minWidth: 60, fontSize: '0.75rem', color: 'warning.main' }}>Pending</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, bgcolor: 'grey.100', minWidth: 90, fontSize: '0.75rem' }}>Compliance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {technicians.map(tech => (
                <TableRow key={tech.id} hover>
                  <TableCell
                    sx={{
                      position: 'sticky', left: 0, zIndex: 2, bgcolor: 'background.paper',
                      borderRight: '2px solid #e0e0e0', py: 0.75,
                    }}
                    className="print-sticky-off"
                  >
                    <Typography variant="body2" fontWeight={600} noWrap>{tech.name}</Typography>
                    {tech.nipp && (
                      <Typography variant="caption" color="text.secondary">NIPP: {tech.nipp}</Typography>
                    )}
                  </TableCell>
                  {daysList.map(d => {
                    const ymd = toYMD(month, d)
                    const effList = tech.days[ymd] // {status, alat}[] | undefined
                    const isScheduled = scheduledDatesSet.has(ymd)
                    return (
                      <TableCell key={d} align="center" sx={{ p: 0.25 }}>
                        {effList && effList.length > 0 ? (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '2px', justifyContent: 'center' }}>
                            {effList.map(({ status: eff, alat }, i) => {
                              const style = STATUS_STYLE[eff] || STATUS_STYLE.MISS
                              return (
                                <Tooltip key={i} title={`${alat} — ${STATUS_LABEL[eff] || eff}`} placement="top">
                                  <Box
                                    sx={{
                                      width: 18, height: 18, borderRadius: '3px',
                                      bgcolor: style.bg, color: style.color,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      fontSize: '0.6rem', fontWeight: 700, cursor: 'default', flexShrink: 0,
                                    }}
                                  >
                                    {style.label}
                                  </Box>
                                </Tooltip>
                              )
                            })}
                          </Box>
                        ) : (
                          <Box
                            sx={{
                              width: 18, height: 18, borderRadius: '3px', mx: 'auto',
                              bgcolor: isScheduled ? '#fff3e0' : '#f9f9f9',
                              border: '1px solid #e0e0e0',
                            }}
                          />
                        )}
                      </TableCell>
                    )
                  })}
                  {/* Summary */}
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{tech.total}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'success.main' }}>{tech.done}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'error.main' }}>{tech.miss}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600, fontSize: '0.8rem', color: 'warning.main' }}>{tech.pending}</TableCell>
                  <TableCell align="center" sx={{ minWidth: 90 }}>
                    {tech.compliance !== null ? (
                      <Box>
                        <Chip
                          label={`${tech.compliance}%`}
                          size="small"
                          color={complianceColor(tech.compliance)}
                          sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                        />
                        <LinearProgress
                          variant="determinate"
                          value={tech.compliance}
                          color={complianceColor(tech.compliance)}
                          sx={{ mt: 0.5, borderRadius: 1, height: 4 }}
                          className="no-print"
                        />
                      </Box>
                    ) : (
                      <Typography variant="caption" color="text.secondary">-</Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {!loading && !error && technicians.length === 0 && (
        <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No daily checklist schedule data found for this month.
          </Typography>
        </Paper>
      )}

      {/* Print styles */}
      <style jsx global>{`
        /* ── Print header (hidden on screen) ── */
        .print-header { display: none; }

        @media print {
          /* Page: A4 landscape, tight margins */
          @page { size: A4 landscape; margin: 8mm 6mm; }

          /* Hide everything we don't need */
          .no-print { display: none !important; }
          header, nav, footer,
          .site-header, .main-content > *:not(.print-root) { /* scoped below */ }

          /* Force full-width white background */
          html, body { background: #fff !important; font-size: 8px !important; }

          /* Show the print-only header */
          .print-header { display: block !important; margin-bottom: 6px; }

          /* Remove Paper scrollable overflow so table expands */
          .print-table-wrapper {
            overflow: visible !important;
            border: 1px solid #ccc !important;
            box-shadow: none !important;
            page-break-inside: avoid;
          }

          /* Scale the compliance table to fit the page */
          .print-table-wrapper table {
            width: 100% !important;
            min-width: unset !important;
            font-size: 7.5px !important;
            border-collapse: collapse !important;
          }

          /* Compact cells */
          .print-table-wrapper th,
          .print-table-wrapper td {
            padding: 1px 2px !important;
            min-width: unset !important;
          }

          /* Remove sticky positioning (breaks print layout) */
          .print-sticky-off {
            position: static !important;
            left: unset !important;
            z-index: auto !important;
          }

          /* Keep background colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Status indicator boxes: slightly smaller */
          .print-table-wrapper td > div > div {
            width: 14px !important;
            height: 14px !important;
            font-size: 7px !important;
          }

          /* Chip (compliance %) — shrink */
          .MuiChip-root {
            height: 18px !important;
            font-size: 7px !important;
          }

          /* Hide MUI Paper elevation shadow */
          .MuiPaper-root {
            box-shadow: none !important;
          }

          /* Avoid page breaks inside a technician row */
          tbody tr { page-break-inside: avoid; }

          /* Repeat table header on each printed page */
          thead { display: table-header-group; }
        }
      `}</style>
    </Box>
  )
}
