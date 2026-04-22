const XLSX = require('xlsx');
const path = require('path');

const wb = XLSX.utils.book_new();
const data = [
  ['nama','kode','kode_alias','serial_no','jenis','site','notes','status'],
  ['Sample Equipment','EQ-001','EQ1','SN12345','Generator','Site A','Example notes','ACTIVE']
];
const ws = XLSX.utils.aoa_to_sheet(data);
XLSX.utils.book_append_sheet(wb, ws, 'alats-template');

const outPath = path.join(__dirname, 'alats-template.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Wrote', outPath);
