'use client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const theme = createTheme({
  palette: {
    primary: { main: '#7c3aed' },
    secondary: { main: '#6d28d9' },
    background: { default: '#fafafa', paper: '#fff' },
  },
  typography: {
    fontFamily: "Inter, Roboto, 'Helvetica Neue', Arial",
  },
  shape: { borderRadius: 12 },
})

export default function MuiProviders({ children }){
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
