'use client'
import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const TOUR_KEY = 'sigap_tour_done'
const TOUR_TRIGGER_KEY = 'sigap_tour_pending'

/**
 * ProductTour — shows an interactive guided tour on first login.
 *
 * Flow:
 *  1. login/page.jsx sets localStorage.sigap_tour_pending = '1' after successful login.
 *  2. This component mounts in the layout, detects the flag, and fires the tour
 *     once the user lands on /dashboard (so all nav elements are visible).
 *  3. On tour complete / skip, sets sigap_tour_done = '1' so it never shows again.
 *     A "Ulang Tour" button in the nav can clear the flag to re-trigger the tour.
 */
export default function ProductTour() {
  const pathname = usePathname()
  const started = useRef(false)

  useEffect(() => {
    // Only run on dashboard and only once per mount attempt
    if (typeof window === 'undefined') return
    if (pathname !== '/dashboard') return
    if (started.current) return

    const pending = localStorage.getItem(TOUR_TRIGGER_KEY)
    const done = localStorage.getItem(TOUR_KEY)

    // Show tour when: pending flag set (just logged in) OR explicitly re-triggered
    if (!pending && done) return

    started.current = true

    // Dynamically import driver.js (client-side only)
    Promise.all([
      import('driver.js'),
      import('driver.js/dist/driver.css'),
    ]).then(([{ driver }]) => {
      const driverObj = driver({
        animate: true,
        showProgress: true,
        progressText: 'Langkah {{current}} dari {{total}}',
        nextBtnText: 'Lanjut →',
        prevBtnText: '← Kembali',
        doneBtnText: 'Selesai ✓',
        allowClose: true,
        overlayOpacity: 0.55,
        smoothScroll: true,
        onDestroyed: () => {
          localStorage.setItem(TOUR_KEY, '1')
          localStorage.removeItem(TOUR_TRIGGER_KEY)
        },
        steps: [
          {
            // Welcome — no target, centered popover
            popover: {
              title: '👋 Selamat Datang di SigapPlanner!',
              description:
                'Panduan singkat ini akan menunjukkan fitur-fitur utama sistem. ' +
                'Klik <strong>Lanjut</strong> untuk memulai, atau <strong>×</strong> untuk melewati.',
              side: 'over',
              align: 'center',
            },
          },
          {
            element: '#nav-dashboard',
            popover: {
              title: '🏠 Dashboard',
              description:
                'Halaman utama. Menampilkan ringkasan statistik work order, daftar yang akan datang, dan yang sudah melewati tenggat.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-stats',
            popover: {
              title: '📊 Statistik Work Order',
              description:
                'Lihat total, yang sedang berjalan, selesai, dan yang overdue secara real-time. Data diperbarui setiap 5 menit.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#tour-upcoming',
            popover: {
              title: '📅 Upcoming & Overdue',
              description:
                'Daftar work order yang jatuh tempo dalam 7 hari ke depan dan yang sudah melewati tenggat. Klik item untuk melihat detail.',
              side: 'top',
              align: 'start',
            },
          },
          {
            element: '#nav-work-order',
            popover: {
              title: '🗂️ Work Order',
              description:
                'Kelola semua work order: buat baru, update status, dan lihat riwayat pengerjaan. Termasuk view Gantt Chart dan Realisasi.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#nav-daily-checklist',
            popover: {
              title: '✅ Daily Checklist',
              description:
                'Rekam dan pantau hasil pemeriksaan harian peralatan. Termasuk laporan temuan dan monitoring ketaatan.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#nav-monitor',
            popover: {
              title: '📈 Monitor',
              description:
                'Pantau riwayat PM, kalender PM, dan performa Daily Checklist per site.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            element: '#btn-alat-readiness',
            popover: {
              title: '🔧 Kesiapan Alat',
              description:
                'Lihat status kesiapan seluruh alat/peralatan di site Anda secara cepat.',
              side: 'bottom',
              align: 'end',
            },
          },
          {
            element: '#nav-konfigurasi',
            popover: {
              title: '⚙️ Konfigurasi',
              description:
                'Atur jadwal shift dan pengaturan lainnya yang dibutuhkan tim Anda.',
              side: 'bottom',
              align: 'start',
            },
          },
          {
            // Final step — no target
            popover: {
              title: '🎉 Siap Digunakan!',
              description:
                'Anda sudah mengenal fitur utama SigapPlanner. Jika butuh panduan lagi, klik tombol ' +
                '<strong>"Ulang Tour"</strong> di navigasi kapan saja. Selamat bekerja!',
              side: 'over',
              align: 'center',
            },
          },
        ],
      })

      // Small delay so DOM elements are fully rendered
      setTimeout(() => driverObj.drive(), 600)
    }).catch((err) => {
      console.warn('ProductTour: gagal memuat driver.js', err)
      localStorage.removeItem(TOUR_TRIGGER_KEY)
    })
  }, [pathname])

  return null
}
