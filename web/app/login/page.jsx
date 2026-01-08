"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import apiClient from '../../lib/api-client'

export default function LoginPage(){
  const router = useRouter()
  useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (t) router.replace('/dashboard')
      // prefill nipp if user chose remember me
      const remembered = typeof window !== 'undefined' ? localStorage.getItem('remember_nipp') : null
      if (remembered) {
        setNipp(remembered)
        setRememberMe(true)
      }
    } catch (e) {}
  }, [router])
  const [nipp, setNipp] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      // POST to auth login endpoint (resolves to /api/auth/login via API_BASE)
      const res = await apiClient('/auth/login', { method: 'POST', body: { nipp, password } })
      const token = res?.accessToken || res?.token || res?.access_token
      if (!token) throw new Error('No token returned')
      try { localStorage.setItem('token', token) } catch (e) {}
      try { document.cookie = `token=${token}; Path=/; SameSite=Lax` } catch (e) {}
      // persist remembered nipp
      try {
        if (rememberMe) {
          localStorage.setItem('remember_nipp', nipp)
        } else {
          localStorage.removeItem('remember_nipp')
        }
      } catch (e) {}
      try {
        const name = res?.user?.name || res?.user?.username || res?.user?.nipp || nipp
        if (name) {
          localStorage.setItem('sigap_user', name)
          try { document.cookie = `sigap_user=${encodeURIComponent(name)}; Path=/; SameSite=Lax` } catch (e) {}
        }
        // persist role information if present
        const role = res?.user?.role || res?.user?.roles || res?.roles
        if (role) {
          // store as JSON string when array/object
          const roleValue = typeof role === 'string' ? role : JSON.stringify(role)
          try { localStorage.setItem('sigap_role', roleValue) } catch (e) {}
          try { document.cookie = `sigap_role=${encodeURIComponent(roleValue)}; Path=/; SameSite=Lax` } catch (e) {}
        }
      } catch (e) {}
      router.replace('/dashboard')
    }catch(err){
      console.error('login error', err)
      setError(err?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <Box sx={{minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', py:6}}>
      <Paper elevation={6} sx={{width:'100%', maxWidth:480, p:4, borderRadius:2}}>
        <Box sx={{textAlign:'center', mb:2}}>
          {/* Inline simple logo representing port equipment + gear */}
          <Box sx={{display:'flex', alignItems:'center', justifyContent:'center', mb:1}}>
            <svg width="84" height="84" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect width="64" height="64" rx="8" fill="#0B74DE" />
              <g transform="translate(6,6)" fill="none" stroke="none">
                {/* container */}
                <rect x="8" y="30" width="40" height="12" rx="1.5" fill="#fff" />
                <rect x="12" y="34" width="12" height="6" fill="#0B74DE" />
                <rect x="28" y="34" width="12" height="6" fill="#0B74DE" />

                {/* crane boom */}
                <rect x="36" y="6" width="3" height="28" rx="1" fill="#fff" transform="rotate(18 36 6)" />
                <rect x="28" y="8" width="18" height="3" rx="1" fill="#fff" transform="rotate(18 28 8)" />

                {/* hook / cable */}
                <path d="M48 28 v8 c0 1 -1 2 -2 2 h-6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                {/* gear symbol (white circle with blue gear strokes) */}
                <circle cx="18" cy="18" r="7" fill="#fff" />
                <g stroke="#0B74DE" strokeWidth="1.1" strokeLinecap="round">
                  <path d="M18 11 v-2" />
                  <path d="M18 25 v2" />
                  <path d="M25 18 h2" />
                  <path d="M11 18 h-2" />
                  <path d="M23 13 l1.4 -1.4" />
                  <path d="M13 23 l-1.4 1.4" />
                  <path d="M23 23 l1.4 1.4" />
                  <path d="M13 13 l-1.4 -1.4" />
                </g>
              </g>
            </svg>
          </Box>
          <Typography variant="h5" sx={{fontWeight:700}}>SigapPlanner</Typography>
          <Typography variant="body2" color="text.secondary">Masuk untuk melanjutkan ke Planner</Typography>
        </Box>

        {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField label="NIPP" value={nipp} onChange={e=>setNipp(e.target.value)} fullWidth sx={{mb:2}} />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e=>setPassword(e.target.value)}
            fullWidth
            sx={{mb:2}}
            inputProps={{ autoComplete: 'current-password' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} onClick={()=>setShowPassword(s=>!s)} edge="end">
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5C7 5 2.7 8.1 1 12c1.7 3.9 6 7 11 7s9.3-3.1 11-7c-1.7-3.9-6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" fill="#000"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2l20 20-1.4 1.4L16 17.8A9.5 9.5 0 0112 19c-5 0-9.3-3.1-11-7 1.1-2.5 2.9-4.6 5-6.1L3.4 3.4 2 2z" fill="#000"/></svg>
                    )}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mb:1}}>
            <FormControlLabel control={<Checkbox checked={rememberMe} onChange={e=>setRememberMe(e.target.checked)} />} label="Ingat saya" />
          </Box>

          <Box sx={{display:'flex', alignItems:'center', justifyContent:'flex-end', mt:2}}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={18} color="inherit" /> : 'Masuk'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
