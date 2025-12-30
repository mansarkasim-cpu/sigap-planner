import './globals.css'
import Link from 'next/link'
import MuiProviders from './MuiProviders'
import SiteHeader from '../components/SiteHeader'
import LoadingOverlay from '../components/LoadingOverlay'

export const metadata = {
  title: 'SigapPlanner',
  description: 'Planner sederhana dengan tema ungu',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <MuiProviders>
          <SiteHeader />
          <LoadingOverlay />
          <main className="container main-content">{children}</main>
        </MuiProviders>
      </body>
    </html>
  )
}
