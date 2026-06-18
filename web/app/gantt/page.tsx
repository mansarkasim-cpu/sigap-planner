// app/gantt/page.tsx
'use client';
import React from 'react';
import GanttChart from '../../components/GanttChart';
import HelpTooltip from '../../components/HelpTooltip';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';

function startGanttTour() {
  Promise.all([
    import('driver.js'),
    // @ts-ignore — CSS module, no type declarations needed
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
      overlayOpacity: 0.5,
      smoothScroll: true,
      steps: [
        {
          popover: {
            title: '📊 Panduan Gantt Chart',
            description:
              'Tutorial ini akan memandu Anda memahami setiap bagian dari Gantt Chart work order. ' +
              'Klik <strong>Lanjut</strong> untuk memulai.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#gantt-filters',
          popover: {
            title: '1️⃣ Filter & Navigasi Tanggal',
            description:
              '<ul style="margin:4px 0;padding-left:18px">' +
              '<li><strong>Tanggal</strong> — pilih hari yang ingin ditampilkan di Gantt.</li>' +
              '<li><strong>Site</strong> — filter work order berdasarkan lokasi/site.</li>' +
              '<li><strong>Jenis WO</strong> — filter berdasarkan tipe work order (PM, DAILY, dll). Bisa pilih lebih dari satu.</li>' +
              '</ul>',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#gantt-zoom-controls',
          popover: {
            title: '2️⃣ Zoom & Kontrol Tampilan',
            description:
              '• <strong>🔍− / 🔍+</strong> — perkecil atau perbesar skala timeline horizontal.<br/>' +
              '• <strong>↻</strong> — refresh data terbaru dari server.<br/>' +
              '• <strong>⛶</strong> — tampilkan fullscreen untuk fokus bekerja tanpa gangguan.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#gantt-legend',
          popover: {
            title: '3️⃣ Legenda Warna Status',
            description:
              'Setiap warna mewakili status work order:<br/><br/>' +
              '• Bar berwarna menunjukkan status saat ini (misal: In Progress, Completed, Overdue).<br/>' +
              '• Warna membantu Anda langsung melihat kondisi keseluruhan jadwal tanpa harus membuka tiap item.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#gantt-chart-body',
          popover: {
            title: '4️⃣ Area Timeline Gantt',
            description:
              'Inilah visualisasi utama jadwal work order:<br/><br/>' +
              '• <strong>Baris kiri</strong> — nama aset & nomor dokumen work order.<br/>' +
              '• <strong>Bar horizontal</strong> — durasi WO (mulai hingga selesai). Panjang bar = durasi.<br/>' +
              '• <strong>Klik bar</strong> — buka panel detail WO (status, teknisi, tanggal, dll).<br/>' +
              '• <strong>Scroll horizontal</strong> — geser untuk melihat hari lain dalam rentang yang sama.',
            side: 'top',
            align: 'start',
          },
        },
        {
          popover: {
            title: '🎉 Siap Digunakan!',
            description:
              'Anda sudah mengenal seluruh fitur Gantt Chart. ' +
              'Tekan tombol <strong>Panduan Interaktif</strong> kapan saja untuk mengulang tutorial ini.',
            side: 'over',
            align: 'center',
          },
        },
      ],
    });
    setTimeout(() => driverObj.drive(), 300);
  });
}

export default function Page() {
  return (
    <main style={{ padding: 20, background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <h2 style={{ margin: 0 }}>Gantt Chart</h2>
          <HelpTooltip
            title="Visualisasi jadwal work order dalam bentuk timeline. Geser/klik bar untuk melihat detail. Gunakan tombol zoom untuk menyesuaikan rentang waktu."
            placement="right"
          />
        </div>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MapIcon />}
          onClick={startGanttTour}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Panduan Interaktif
        </Button>
      </div>
      <GanttChart />
    </main>
  );
}
