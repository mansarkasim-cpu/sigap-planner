import './globals.css'
import Link from 'next/link'
import MuiProviders from './MuiProviders'
import SiteHeader from '../components/SiteHeader'
import LoadingOverlay from '../components/LoadingOverlay'
import pkg from '../package.json'

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
          <footer className="container site-footer">
            <div style={{ textAlign: 'right', padding: '8px 0' }}>
              <small>Versi: {pkg.version}</small>
            </div>
          </footer>
        </MuiProviders>
      </body>
    </html>
  )
}
