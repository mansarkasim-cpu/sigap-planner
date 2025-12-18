import './globals.css'
import Link from 'next/link'
import MuiProviders from './MuiProviders'
import RouteGuard from '../components/RouteGuard'
import Nav from '../components/Nav'
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
          <header className="site-header">
            <div className="container header-inner">
              <Link href="/" className="brand">SigapPlanner</Link>
              {/* Nav moved to client component so it can hide itself on /login */}
              <Nav />
              <RouteGuard />
            </div>
          </header>
          <LoadingOverlay />
          <main className="container main-content">{children}</main>
        </MuiProviders>
      </body>
    </html>
  )
}
