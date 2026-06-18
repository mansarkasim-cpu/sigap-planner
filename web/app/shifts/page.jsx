'use client';
import React, { useCallback } from 'react';
import ShiftManager from '../../components/ShiftManager';
import HelpTooltip from '../../components/HelpTooltip';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';

function startShiftTour() {
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
      overlayOpacity: 0.5,
      smoothScroll: true,
      steps: [
        {
          popover: {
            title: '👋 Panduan Shift Management',
            description:
              'Tutorial ini akan memandu Anda langkah demi langkah untuk mengatur jadwal shift teknisi. ' +
              'Klik <strong>Lanjut</strong> untuk memulai.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#shift-section-site',
          popover: {
            title: '1️⃣ Pilih Site',
            description:
              'Mulai dengan memilih <strong>site (lokasi)</strong> yang ingin dikelola dari dropdown ini. ' +
              'Semua data grup dan shift akan disesuaikan dengan site yang dipilih.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#shift-section-create-group',
          popover: {
            title: '2️⃣ Buat Grup Teknisi',
            description:
              '<ol style="margin:4px 0;padding-left:18px">' +
              '<li>Isi <strong>nama grup</strong> (misal: "Tim A" atau "Regu Pagi").</li>' +
              '<li>Cari dan <strong>centang teknisi</strong> yang menjadi anggota.</li>' +
              '<li>(Opsional) Pilih satu anggota sebagai <strong>leader</strong>.</li>' +
              '<li>Klik tombol <strong>Create</strong>.</li>' +
              '</ol>',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#shift-section-groups',
          popover: {
            title: '3️⃣ Kelola Grup yang Ada',
            description:
              'Daftar semua grup yang sudah dibuat untuk site ini muncul di sini.<br/><br/>' +
              '• Klik <strong>Edit</strong> untuk mengubah nama, anggota, atau leader.<br/>' +
              '• Klik <strong>Delete</strong> untuk menghapus grup (termasuk semua penugasannya).',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#shift-section-assign',
          popover: {
            title: '4️⃣ Tugaskan Grup ke Shift',
            description:
              '<ol style="margin:4px 0;padding-left:18px">' +
              '<li>Pilih <strong>tanggal</strong> shift.</li>' +
              '<li>Pilih <strong>slot shift</strong> (Shift 1 / 2 / 3) beserta jam kerjanya.</li>' +
              '<li>Pilih <strong>grup</strong> yang akan bertugas.</li>' +
              '<li>Klik <strong>Assign</strong> — penugasan langsung muncul di panel kanan.</li>' +
              '</ol>',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#shift-section-view',
          popover: {
            title: '5️⃣ Lihat Jadwal',
            description:
              'Panel ini menampilkan hasil penugasan shift dalam tiga tampilan:<br/><br/>' +
              '• <strong>Schedule</strong> — daftar shift untuk tanggal yang dipilih.<br/>' +
              '• <strong>Calendar</strong> — kalender bulanan; klik tanggal untuk detail.<br/>' +
              '• <strong>Monthly Planner</strong> — atur shift sebulan penuh sekaligus.<br/><br/>' +
              'Tombol <strong>Remove</strong> di tiap assignment untuk membatalkan penugasan.',
            side: 'left',
            align: 'start',
          },
        },
        {
          popover: {
            title: '🎉 Siap!',
            description:
              'Anda sudah memahami cara kerja Shift Management. ' +
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
    <div style={{ padding: 20, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
        <h1 style={{ marginTop: 0, marginBottom: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          Shift Management
          <HelpTooltip
            title="Buat kelompok teknisi dan tetapkan jadwal shift harian per site. Setiap shift dapat memiliki leader dan anggota yang berbeda."
            placement="right"
          />
        </h1>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MapIcon />}
          onClick={startShiftTour}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Panduan Interaktif
        </Button>
      </div>
      <p style={{ color: '#555', marginTop: 6 }}>Create technician groups and assign them to daily shifts per site.</p>
      <ShiftManager />
    </div>
  );
}

