const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.utils.book_new();

// Main alats sheet with example row
const alats = [
  ['nama','kode','kode_alias','serial_no','jenis','site','notes','status'],
  ['Sample Equipment','EQ-001','EQ1','SN12345','Generator','Site A','Example notes','ACTIVE']
];
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(alats), 'alats-template');

// Provide a helper sheet for jenis alat (so user can copy/paste existing jenis or add new ones)
const jenis = [
  ['id','nama','description'],
  [1,'Generator','Diesel generator set'],
  [2,'Pump','Water pump / centrifugal'],
  [3,'Compressor','Air compressor']
];
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(jenis), 'jenis-template');

// Provide a helper sheet for sites
const sites = [
  ['id','name','code'],
  [10,'Site A','SITE-A'],
  [20,'Site B','SITE-B']
];
XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(sites), 'sites-template');

const outPath = path.join(__dirname, 'alats-template.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Wrote', outPath);
