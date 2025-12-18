// app/page.jsx
import Link from 'next/link'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function Page() {
  return (
    <Box className="hero" sx={{textAlign:'center',pt:8,pb:6}}>
      <Typography variant="h4" component="h2" sx={{color:'#6d28d9',mb:1}}>Selamat datang di SigapPlanner</Typography>
      <Typography sx={{color:'#374151',mb:3}}>Manajemen tugas sederhana dengan tema ungu.</Typography>
      <Box sx={{display:'flex',gap:2,justifyContent:'center'}}>
        <Link href="/login" legacyBehavior>
          <Button variant="contained">Masuk</Button>
        </Link>
        <Link href="/dashboard" legacyBehavior>
          <Button variant="outlined">Lihat Dashboard</Button>
        </Link>
      </Box>
    </Box>
  )
}
