 'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import apiClient from '../../lib/api-client'

export default function AlatReadiness(){
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState([])
  const [readyAssets, setReadyAssets] = useState([])
  const [notReadyAssets, setNotReadyAssets] = useState([])
  const [sites, setSites] = useState([])
  const [jenisOptions, setJenisOptions] = useState([])
  const [filterSite, setFilterSite] = useState('')
  const [filterJenis, setFilterJenis] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)
  const [combined, setCombined] = useState([])
  const [pageSize] = useState(8)
  const [currentPage, setCurrentPage] = useState(0)
  const [paused, setPaused] = useState(false)

  function normalizeStatus(s){
    if (!s) return ''
    return s.toString().toUpperCase().replace(/[-\s]/g,'_')
  }

  function formatToDdMmYyyyHHmmWithZone(val){
    if (!val) return '-'
    const d = new Date(val)
    if (isNaN(d.getTime())) return String(val)
    try{
      const opts = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short' }
      // use en-GB to ensure dd/mm/yyyy ordering
      return new Intl.DateTimeFormat('en-GB', opts).format(d).replace(',', '')
    }catch(e){
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth()+1).padStart(2,'0');
      const dd = String(d.getDate()).padStart(2,'0');
      const hh = String(d.getHours()).padStart(2,'0');
      const min = String(d.getMinutes()).padStart(2,'0');
      const tz = (()=>{
        const off = -d.getTimezoneOffset();
        const sign = off >= 0 ? '+' : '-'
        const abs = Math.abs(off)
        const h = String(Math.floor(abs/60)).padStart(2,'0')
        const m = String(abs%60).padStart(2,'0')
        return `GMT${sign}${h}:${m}`
      })()
      return `${dd}/${mm}/${yyyy} ${hh}:${min} ${tz}`
    }
  }

  async function load(){
    setLoading(true)
    setError(null)
    try{
      const res = await apiClient('/work-orders?page=1&pageSize=2000')
      const rows = res?.data ?? res ?? []

      const [alatRes, sitesRes, jenisRes] = await Promise.all([
        apiClient('/master/alats'),
        apiClient('/master/sites'),
        apiClient('/master/jenis-alat'),
      ])

      const alats = Array.isArray(alatRes) ? alatRes : (alatRes?.data || [])
      setAssets(alats)
      setSites(Array.isArray(sitesRes) ? sitesRes : (sitesRes?.data || []))
      setJenisOptions(Array.isArray(jenisRes) ? jenisRes : (jenisRes?.data || []))

      // collect assets that have at least one IN_PROGRESS work order
      // or a breakdown work order that is not completed
      const inProgressSet = new Set()
      const assetWoMap = new Map()
      for (const r of (rows || [])){
        const statusRaw = String(r.status || r.raw?.status || r.raw?.doc_status || '').toLowerCase()
        const status = normalizeStatus(r.status || r.raw?.status || r.raw?.doc_status || '')

        // detect work type (work_type, raw.work_type, raw.type_work)
        const wt = String(r.work_type || r.raw?.work_type || r.raw?.type_work || r.type || r.raw?.type || '').toLowerCase()

        // helper to record mapping for asset id/name
        const recordMatch = (assetId, assetName) => {
          if (assetId) {
            const key = String(assetId)
            inProgressSet.add(key)
            if (!assetWoMap.has(key)) assetWoMap.set(key, r)
          }
          if (assetName) {
            const key = String((assetName||'').toLowerCase())
            inProgressSet.add(key)
            if (!assetWoMap.has(key)) assetWoMap.set(key, r)
          }
        }

        // mark as in-progress if status indicates IN_PROGRESS
        if (status === 'IN_PROGRESS' || status === 'IN-PROGRESS' || statusRaw.includes('in progress') || statusRaw.includes('in_progress')){
          recordMatch(r.asset_id, r.asset_name)
          continue
        }

        // if work type is breakdown/failure/accident and not completed, consider not ready
        if (/(breakdown|failure|bd|accident|accid)/i.test(wt) && !(statusRaw.includes('completed') || statusRaw.includes('done'))){
          recordMatch(r.asset_id, r.asset_name)
          continue
        }
      }

      const notReady = []
      const ready = []
      for (const a of (alats || [])){
        const idKey = String(a.id)
        const nameKey = String((a.nama||a.name||'').toLowerCase())
        if (inProgressSet.has(idKey) || inProgressSet.has(nameKey)){
          const wo = assetWoMap.get(idKey) || assetWoMap.get(nameKey) || null
          notReady.push({ ...a, __wo: wo })
        } else {
          ready.push(a)
        }
      }

      setNotReadyAssets(notReady)
      setReadyAssets(ready)
      // combined list with status
      const comb = [
        ...notReady.map((x)=>({ ...x, __status: 'NOT_READY' })),
        ...ready.map((x)=>({ ...x, __status: 'READY' })),
      ]
      setCombined(comb)
      setLastUpdated(new Date().toLocaleString())
    }catch(err){
      console.error('load alat readiness', err)
      setError(err?.message || String(err))
    }finally{ setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  function applyFilters(list){
    return (list || []).filter((a)=>{
      if (filterStatus) {
        // combined items carry __status
        if (filterStatus === 'READY' && a.__status !== 'READY') return false
        if (filterStatus === 'NOT_READY' && a.__status !== 'NOT_READY') return false
      }
      if (filterSite) {
        const siteId = a.site?.id ?? a.site_id ?? a.site?.site_id
        if (!siteId || String(siteId) !== String(filterSite)) return false
      }
      if (filterJenis) {
        const jenisId = a.jenis_alat?.id ?? a.jenis_alat_id ?? a.jenis_id
        if (!jenisId || String(jenisId) !== String(filterJenis)) return false
      }
      return true
    })
  }

  useEffect(()=>{ setCurrentPage(0) }, [filterSite, filterJenis, filterStatus])

  // paginated view of combined list
  const filteredCombined = applyFilters(combined)
  const pages = Math.max(1, Math.ceil((filteredCombined?.length || 0) / pageSize))
  const pageStart = currentPage * pageSize
  const pageItems = (filteredCombined || []).slice(pageStart, pageStart + pageSize)

  useEffect(()=>{
    if (pages <= 1) return
    if (paused) return
    const id = setInterval(()=>{
      setCurrentPage((p)=> (p+1) % pages)
    }, 5000)
    return () => clearInterval(id)
  }, [pages, paused])

  // auto-refresh data every 5 minutes
  useEffect(() => {
    const refreshId = setInterval(() => {
      load()
    }, 5 * 60 * 1000)
    return () => clearInterval(refreshId)
  }, [])

  return (
    <Box sx={{p:2}}>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:2}}>
        <Typography variant="h5">Kesiapan Alat</Typography>
        <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
          <FormControl size="small" sx={{minWidth:160}}>
            <InputLabel id="site-label">Site</InputLabel>
            <Select labelId="site-label" value={filterSite} label="Site" onChange={(e)=>setFilterSite(e.target.value)}>
              <MenuItem value="">Semua</MenuItem>
              {sites.map(s=> <MenuItem key={s.id} value={String(s.id)}>{s.name || s.nama || s.label || s.id}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{minWidth:180}}>
            <InputLabel id="jenis-label">Jenis Alat</InputLabel>
            <Select labelId="jenis-label" value={filterJenis} label="Jenis Alat" onChange={(e)=>setFilterJenis(e.target.value)}>
              <MenuItem value="">Semua</MenuItem>
              {jenisOptions.map(j=> <MenuItem key={j.id} value={String(j.id)}>{j.name || j.nama || j.label || j.id}</MenuItem>)}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{minWidth:160}}>
            <InputLabel id="status-label">Status</InputLabel>
            <Select labelId="status-label" value={filterStatus} label="Status" onChange={(e)=>setFilterStatus(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="READY">Ready</MenuItem>
              <MenuItem value="NOT_READY">Not Ready</MenuItem>
            </Select>
          </FormControl>

          <Button size="small" sx={{mr:1}} onClick={() => router.push('/dashboard')}>Kembali</Button>
          <Button size="small" variant="contained" onClick={load}>Refresh</Button>
        </Box>
      </Box>

      {loading ? <LinearProgress sx={{mb:2}} /> : null}

      {error && (
        <Paper sx={{p:1, mb:2, background:'#fff3f3', color:'#8a1f1f'}}>
          <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <Box>Gagal memuat data: {String(error)}</Box>
            <Button size="small" onClick={load}>Coba lagi</Button>
          </Box>
        </Paper>
      )}

      <Paper sx={{p:2}} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:1}}>
          <Box>
            <Typography variant="subtitle1" sx={{fontWeight:700}}>Kesiapan Alat</Typography>
            <Typography variant="caption" sx={{color:'text.secondary'}}>Menampilkan {filteredCombined.length || 0} alat — halaman {currentPage+1}/{pages}</Typography>
          </Box>
          <Box sx={{display:'flex',gap:1,alignItems:'center'}}>
            <Chip label={`Not Ready: ${notReadyAssets.length}`} color={notReadyAssets.length? 'error' : 'default'} />
            <Chip label={`Ready: ${readyAssets.length}`} color={'success'} />
          </Box>
        </Box>

        <Grid container spacing={1} sx={{height:'520px', overflow:'hidden'}}>
          {pageItems.length === 0 && (
            <Grid item xs={12}>
              <Box sx={{p:4, textAlign:'center'}}><Typography sx={{color:'#666'}}>Tidak ada alat untuk ditampilkan</Typography></Box>
            </Grid>
          )}

          {pageItems.map((a)=> (
            <Grid key={a.id} item xs={3}>
              <Card
                variant="outlined"
                sx={{height:250, display:'flex', flexDirection:'column'}}
                onClick={() => router.push(`/master/alats?q=${encodeURIComponent(String(a.nama||a.kode||a.serial_no||a.id))}`)}
              >
                <CardContent sx={{display:'flex',gap:1,alignItems:'center',flexDirection:'column',py:1, px:2, flex:'0 0 auto'}}>
                  {a.__status !== 'NOT_READY' && (
                    <Avatar sx={{bgcolor: 'success.main', width:56, height:56}}>
                      {String((a.nama||a.name||'')[0]||'A').toUpperCase()}
                    </Avatar>
                  )}
                  <Typography sx={{fontWeight:700,textAlign:'center'}}>{a.nama || a.name}</Typography>
                  <Typography variant="caption" sx={{color:'text.secondary'}}>{a.kode ? `Kode: ${a.kode}` : (a.serial_no? `SN: ${a.serial_no}` : '')}</Typography>
                  <Box sx={{mt:1}}>
                    <Chip label={a.__status === 'NOT_READY' ? 'Not Ready' : 'Ready'} color={a.__status === 'NOT_READY' ? 'error' : 'success'} size="small" />
                  </Box>
                </CardContent>

                <CardContent sx={{flex:'1 1 auto', overflowY:'auto', px:2, pt:0}}>
                  {a.__status === 'NOT_READY' && a.__wo && (
                    <Box sx={{width:'100%', textAlign:'center'}}>
                      <Typography variant="caption" sx={{display:'block',fontWeight:700}}>{a.__wo.doc_no || a.__wo.name || a.__wo.id}</Typography>
                      <Typography variant="caption" sx={{display:'block',color:'text.secondary',whiteSpace:'normal',wordBreak:'break-word', fontSize:10}}>
                        {a.__wo.description || a.__wo.raw?.description || a.__wo.raw?.desc || '-'}
                      </Typography>
                      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',gap:1,mt:0.5}}>
                        <Typography variant="caption" sx={{color:'text.secondary'}}>Est. selesai:</Typography>
                        <Box component="span" sx={{backgroundColor:'rgba(25,118,210,0.08)',color:'primary.main',px:0.8,py:0.3,borderRadius:1,fontWeight:700,fontSize:'0.8rem'}}>
                          {formatToDdMmYyyyHHmmWithZone(a.__wo.end_date || a.__wo.raw?.end_date || a.__wo.raw?.expected_end || a.__wo.raw?.eta || null)}
                        </Box>
                      </Box>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{display:'flex',justifyContent:'center',gap:0.5,mt:2}}>
          {Array.from({length:pages}).map((_,i)=> (
            <Box key={i} onClick={() => setCurrentPage(i)} sx={{width:10,height:10,borderRadius:'50%',bgcolor: i===currentPage ? 'primary.main' : '#ddd', cursor:'pointer'}} />
          ))}
        </Box>
      </Paper>

      <Box sx={{mt:2, fontSize:12, color:'#666'}}>Last updated: {lastUpdated || '-'}</Box>
    </Box>
  )
}
