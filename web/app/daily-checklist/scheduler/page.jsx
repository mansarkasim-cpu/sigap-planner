"use client";
import React from 'react';
import MonthlyChecklistScheduler from '../../../components/MonthlyChecklistScheduler';
import HelpTooltip from '../../../components/HelpTooltip';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';

function startSchedulerTour() {
  Promise.all([
    import('driver.js'),
    // @ts-ignore
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
            title: '📅 Panduan Daily Checklist Scheduler',
            description:
              'Halaman ini digunakan untuk membuat dan mengelola jadwal daily checklist per teknisi per alat. ' +
              'Klik <strong>Lanjut</strong> untuk mempelajari setiap bagiannya.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#scheduler-toolbar',
          popover: {
            title: '1️⃣ Filter & Kontrol Utama',
            description:
              '<ul style="margin:4px 0;padding-left:18px">' +
              '<li><strong>Site</strong> — pilih lokasi/site yang akan dijadwalkan.</li>' +
              '<li><strong>Tanggal</strong> — pilih tanggal acuan (sistem akan menyesuaikan jadwal shift pada hari tersebut).</li>' +
              '<li><strong>Load Preview</strong> — muat data alat, teknisi, dan shift assignment untuk site & tanggal yang dipilih.</li>' +
              '<li><strong>Rebuild Preview</strong> — bangun ulang tabel preview tanpa reload dari server.</li>' +
              '<li><strong>Auto Assign</strong> — sistem otomatis mendistribusikan alat ke teknisi berdasarkan shift aktif.</li>' +
              '</ul>',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#scheduler-toolbar',
          popover: {
            title: '2️⃣ Simpan & Cetak Jadwal',
            description:
              '<ul style="margin:4px 0;padding-left:18px">' +
              '<li><strong>Print Jadwal Minggu</strong> — cetak jadwal dalam format print-friendly untuk semua hari dalam minggu berjalan.</li>' +
              '<li><strong>Simpan Jadwal / Update Jadwal</strong> — simpan hasil penugasan ke database. Jika jadwal sudah pernah disimpan sebelumnya, tombol berubah menjadi <em>Update Jadwal</em>.</li>' +
              '<li><strong>Page size</strong> — atur jumlah baris teknisi yang ditampilkan per halaman.</li>' +
              '</ul>',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#scheduler-summary',
          popover: {
            title: '3️⃣ Ringkasan Penugasan',
            description:
              'Bar ringkasan menampilkan:<br/><br/>' +
              '• <strong>Technicians</strong> — jumlah teknisi aktif yang terdaftar dalam shift pada tanggal terpilih.<br/>' +
              '• <strong>Assigned assets</strong> — berapa alat sudah ditugaskan vs total alat di site tersebut.<br/>' +
              '• Chip <strong>Jadwal tersimpan</strong> (hijau) muncul jika jadwal untuk tanggal ini sudah pernah disimpan ke database.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#scheduler-table',
          popover: {
            title: '4️⃣ Tabel Penugasan Alat',
            description:
              'Setiap baris = satu teknisi (dikelompokkan per grup shift).<br/><br/>' +
              '• Kolom <strong>Assets</strong> — daftar alat yang ditugaskan ke teknisi tersebut pada tanggal yang dipilih. Klik tanda <strong>×</strong> pada chip alat untuk menghapus penugasan.<br/>' +
              '• Kolom <strong>Actions</strong> — gunakan dropdown untuk menambahkan alat secara manual ke teknisi tertentu.<br/><br/>' +
              'Setelah semua alat terdistribusi, klik <strong>Simpan Jadwal</strong> di toolbar atas.',
            side: 'top',
            align: 'start',
          },
        },
        {
          popover: {
            title: '🎉 Siap!',
            description:
              'Alur kerja singkat:<br/>' +
              '<ol style="margin:6px 0;padding-left:18px">' +
              '<li>Pilih <strong>Site</strong> & <strong>Tanggal</strong>.</li>' +
              '<li>Klik <strong>Load Preview</strong>.</li>' +
              '<li>Klik <strong>Auto Assign</strong> untuk distribusi otomatis, atau atur manual di tabel.</li>' +
              '<li>Klik <strong>Simpan Jadwal</strong>.</li>' +
              '</ol>' +
              'Klik ikon 🗺 di pojok kanan atas kapan saja untuk mengulang panduan ini.',
            side: 'over',
            align: 'center',
          },
        },
      ],
    });
    setTimeout(() => driverObj.drive(), 300);
  });
}

export default function Page(){
  return (
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 style={{ marginTop: 0, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          Daily Checklist Scheduler
          <HelpTooltip
            title="Buat jadwal daily checklist per alat berdasarkan shift teknisi. Pilih site & tanggal, load preview, lalu auto-assign atau atur manual, kemudian simpan."
            placement="right"
          />
        </h1>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MapIcon />}
          onClick={startSchedulerTour}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Panduan Interaktif
        </Button>
      </div>
      <p style={{ color: '#555', marginTop: 6 }}>Buat jadwal daily checklist per alat selama sebulan berdasarkan jadwal shift teknisi.</p>
      <MonthlyChecklistScheduler />
    </div>
  );
}
