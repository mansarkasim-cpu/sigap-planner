'use client';

import WorkOrderForm from '../../components/WorkOrderForm';
import WorkOrderList from '../../components/WorkOrderList';
import HelpTooltip from '../../components/HelpTooltip';
import Button from '@mui/material/Button';
import MapIcon from '@mui/icons-material/Map';
import { useRef } from 'react';

function startWorkOrderTour() {
  Promise.all([
    import('driver.js'),
    // @ts-ignore
    import('driver.js/dist/driver.css'),
  ]).then(([{ driver }]) => {
    const driverObj = driver({
      animate: true,
      showProgress: true,
      progressText: 'Langkah {{current}} dari {{total}}',
      nextBtnText: 'Lanjut \u2192',
      prevBtnText: '\u2190 Kembali',
      doneBtnText: 'Selesai \u2713',
      allowClose: true,
      overlayOpacity: 0.5,
      smoothScroll: true,
      steps: [
        {
          popover: {
            title: '\uD83D\uDCCB Panduan Halaman Work Order',
            description:
              'Halaman ini digunakan untuk mengelola semua Work Order (WO) \u2014 membuat, melihat, mengedit status, dan menugaskan teknisi. ' +
              'Klik <strong>Lanjut</strong> untuk mempelajari setiap bagiannya.',
            side: 'over',
            align: 'center',
          },
        },
        {
          element: '#wo-form',
          popover: {
            title: '1\uFE0F\u20E3 Form Tambah Work Order',
            description:
              'Gunakan form ini untuk mengimpor work order baru dari sistem SIGAP.<br/><br/>' +
              '\u2022 Masukkan <strong>ID SIGAP</strong> (nomor dokumen dari sistem sumber).<br/>' +
              '\u2022 Klik <strong>Add</strong> \u2014 sistem akan mengambil data WO dari SIGAP dan menyimpannya di SigapPlanner.<br/>' +
              '\u2022 WO yang berhasil ditambahkan akan langsung muncul di daftar di bawah.',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#wo-filter-bar',
          popover: {
            title: '2\uFE0F\u20E3 Filter & Pencarian',
            description:
              '<ul style="margin:4px 0;padding-left:18px">' +
              '<li><strong>Lokasi</strong> \u2014 saring WO berdasarkan site/lokasi aset.</li>' +
              '<li><strong>Status</strong> \u2014 pilih satu atau lebih status: PREPARATION, ASSIGNED, IN_PROGRESS, COMPLETED, dll. Secara default, WO yang sudah COMPLETED disembunyikan.</li>' +
              '<li><strong>Search</strong> \u2014 cari berdasarkan nomor dokumen, nama aset, atau deskripsi.</li>' +
              '<li><strong>Export Excel</strong> \u2014 unduh daftar WO yang sedang ditampilkan ke file Excel.</li>' +
              '</ul>',
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '#wo-list',
          popover: {
            title: '3\uFE0F\u20E3 Daftar Work Order',
            description:
              'Setiap baris menampilkan satu work order dengan kolom: Doc No, tipe, tanggal start & end, nama aset, status, site, dan deskripsi.<br/><br/>' +
              '<strong>Status badge</strong> menunjukkan tahapan WO saat ini (PREPARATION \u2192 ASSIGNED \u2192 IN_PROGRESS \u2192 COMPLETED).<br/>' +
              '<strong>Progress bar</strong> muncul saat status IN_PROGRESS, menunjukkan persentase penyelesaian task.<br/><br/>' +
              'Di kolom kanan terdapat 4 tombol aksi:<br/>' +
              '\u24D8 <strong>Detail</strong> \u2014 buka ringkasan lengkap WO (info aset, tanggal, teknisi yang ditugaskan, dll).<br/>' +
              '\uD83D\uDCCB <strong>Lihat Task</strong> \u2014 buka daftar task/aktivitas dalam WO. Di sini Anda bisa menugaskan teknisi ke tiap task dan menandai task sebagai selesai.<br/>' +
              '\u270F\uFE0F <strong>Edit Tanggal</strong> \u2014 ubah jadwal start & end WO tanpa mengubah data lainnya.<br/>' +
              '\uD83D\uDDD1\uFE0F <strong>Hapus</strong> \u2014 hapus WO dari sistem (akan meminta konfirmasi terlebih dahulu).',
            side: 'top',
            align: 'start',
          },
        },
        {
          popover: {
            title: '\uD83C\uDF89 Siap!',
            description:
              'Anda sudah memahami cara menggunakan halaman Work Order. ' +
              'Klik <strong>Panduan Interaktif</strong> kapan saja untuk mengulang panduan ini.',
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
  const refreshRef = useRef<(() => Promise<void>) | null>(null);
  const WorkOrderListAny = WorkOrderList as any;

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, system-ui, -apple-system, Roboto, "Helvetica Neue", Arial' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
          Work Orders
          <HelpTooltip
            title="Daftar semua work order. Gunakan form di atas untuk membuat baru. Klik baris untuk melihat atau mengubah detail. Filter berdasarkan status, site, atau tanggal."
            placement="right"
          />
        </h1>
        <Button
          variant="outlined"
          size="small"
          startIcon={<MapIcon />}
          onClick={startWorkOrderTour}
          sx={{ whiteSpace: 'nowrap' }}
        >
          Panduan Interaktif
        </Button>
      </div>

      <section style={{ marginBottom: 20 }}>
        <WorkOrderForm onCreated={() => refreshRef.current?.()} />
      </section>

      <section>
        <WorkOrderListAny excludeWorkType="DAILY" onRefreshRequested={(fn: any) => { return refreshRef.current = fn; }} />
      </section>
    </main>
  );
}

