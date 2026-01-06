# Troubleshooting Upload 403 Errors

## Masalah
Foto yang di-upload menghasilkan error 403 saat diakses melalui URL seperti:
```
http://sigap.jasamaritim.co.id/uploads/pending_photo_xxxx.jpg
```

## Penyebab
Error 403 biasanya disebabkan oleh:
1. File permissions tidak tepat (file tidak readable oleh nginx)
2. Folder permissions tidak mengizinkan nginx untuk membaca isi folder
3. Ownership file tidak sesuai dengan user yang menjalankan nginx

## Solusi

### 1. Solusi Otomatis (RECOMMENDED)
Backend sekarang sudah diupdate untuk **otomatis set permissions yang benar** (0644) setiap kali file di-upload. File yang baru di-upload seharusnya tidak mengalami masalah 403.

### 2. Fix File Yang Sudah Ada
Untuk memperbaiki file-file lama yang sudah ter-upload, jalankan script berikut di server:

```bash
cd /home/deploy/apps/sigap-planner/deploy/scripts
chmod +x fix-uploads-permissions.sh
./fix-uploads-permissions.sh
```

### 3. Manual Fix (jika diperlukan)
Jika script di atas tidak berhasil, lakukan manual:

```bash
# Set permissions untuk folder uploads
chmod 755 /home/deploy/apps/sigap-planner/backend/uploads

# Set permissions untuk semua file di dalam folder uploads
find /home/deploy/apps/sigap-planner/backend/uploads -type f -exec chmod 644 {} \;

# Set permissions untuk semua subfolder
find /home/deploy/apps/sigap-planner/backend/uploads -type d -exec chmod 755 {} \;
```

### 4. Cek Ownership (Optional)
Pastikan ownership file sesuai dengan user yang menjalankan backend service:

```bash
# Cek user yang menjalankan backend
ps aux | grep node

# Set ownership jika perlu (ganti 'deploy' dengan user yang sesuai)
chown -R deploy:deploy /home/deploy/apps/sigap-planner/backend/uploads
```

### 5. SELinux (jika enabled)
Jika server menggunakan SELinux, jalankan:

```bash
restorecon -R /home/deploy/apps/sigap-planner/backend/uploads
```

## Verifikasi
Setelah menjalankan fix di atas, cek:

1. Test akses foto dari browser:
   ```
   http://sigap.jasamaritim.co.id/uploads/pending_photo_xxxx.jpg
   ```

2. Cek nginx error log jika masih ada masalah:
   ```bash
   tail -f /var/log/nginx/sigap.error.log
   ```

3. Cek file permissions:
   ```bash
   ls -la /home/deploy/apps/sigap-planner/backend/uploads/
   ```
   
   Output yang benar:
   ```
   -rw-r--r-- 1 deploy deploy 123456 Jan 06 12:34 pending_photo_xxxx.jpg
   ```

## Pencegahan
Dengan update code yang sudah dilakukan, setiap file baru yang di-upload akan:
- Otomatis di-set dengan permission 0644 (rw-r--r--)
- Readable oleh nginx dan semua users
- Writable hanya oleh owner (backend service user)

Ini mencegah masalah 403 terjadi lagi untuk upload baru.

## Deployment Checklist
Saat deploy versi backend yang baru:

1. ✅ Pull/deploy code terbaru (sudah include fix permissions)
2. ✅ Restart backend service
   ```bash
   sudo systemctl restart sigap-web.service
   ```
3. ✅ Jalankan fix-uploads-permissions.sh untuk file lama
4. ✅ Test upload foto baru dan verify dapat diakses
