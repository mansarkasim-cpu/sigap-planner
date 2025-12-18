"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import apiClient from '../../lib/api-client'

export default function LoginPage(){
  const router = useRouter()
  const [nipp, setNipp] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    setLoading(true)
    try{
      const res = await apiClient('/auth/login', { method: 'POST', body: { nipp, password } })
      const token = res?.accessToken || res?.token || res?.access_token
      if (!token) throw new Error('No token returned')
      try { localStorage.setItem('token', token) } catch (e) {}
      try { document.cookie = `token=${token}; Path=/; SameSite=Lax` } catch (e) {}
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
      router.push('/dashboard')
    }catch(err){
      console.error('login error', err)
      setError(err?.message || 'Login failed')
    }finally{ setLoading(false) }
  }

  return (
    <Box sx={{minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', py:6}}>
      <Paper elevation={6} sx={{width:'100%', maxWidth:480, p:4, borderRadius:2}}>
        <Box sx={{textAlign:'center', mb:2}}>
          <Typography variant="h5" sx={{fontWeight:700}}>SigapPlanner</Typography>
          <Typography variant="body2" color="text.secondary">Masuk untuk melanjutkan ke Planner</Typography>
        </Box>

        {error && <Alert severity="error" sx={{mb:2}}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField label="NIPP" value={nipp} onChange={e=>setNipp(e.target.value)} fullWidth sx={{mb:2}} />
          <TextField label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} fullWidth sx={{mb:2}} />

          <Box sx={{display:'flex', alignItems:'center', justifyContent:'space-between', mt:2}}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={18} color="inherit" /> : 'Masuk'}
            </Button>
            <Button variant="text" onClick={()=>router.push('/')}>
              Kembali
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  )
}
