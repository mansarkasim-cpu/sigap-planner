"use client"
import { useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import apiClient from '../../../lib/api-client'

export default function ChangePasswordPage(){
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  async function submit(e){
    e.preventDefault()
    setMessage(null)
    if (!newPassword) return setMessage('New password is required')
    if (newPassword !== confirmPassword) return setMessage('Passwords do not match')
    setLoading(true)
    try{
      await apiClient('/auth/me/password', { method: 'PATCH', body: { currentPassword, newPassword } })
      setMessage('Password updated')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }catch(err){
      setMessage(err?.body?.message || err?.message || String(err))
    }finally{ setLoading(false) }
  }

  return (
    <Box sx={{ p:2, maxWidth:540 }}>
      <h2>Change Password</h2>
      <form onSubmit={submit}>
        <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
          <TextField label="Current password" type="password" fullWidth value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} />
          <TextField label="New password" type="password" fullWidth value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
          <TextField label="Confirm new password" type="password" fullWidth value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
          {message && <div style={{ color: message === 'Password updated' ? 'green' : 'red' }}>{message}</div>}
          <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Change Password'}</Button>
        </Box>
      </form>
    </Box>
  )
}
