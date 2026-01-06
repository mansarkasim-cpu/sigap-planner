# Production Deployment Guide

## Daftar Perubahan Terakhir
- ✅ Fix file permissions otomatis pada upload foto (0644)
- ✅ Improvements di mobile app untuk pemilihan foto (camera/gallery)
- ✅ Hide tombol start saat unavailable

## Prerequisites
- SSH access ke server production
- Git repository sudah terhubung di server
- Node.js dan npm sudah terinstall

## Deployment Steps

### 1. SSH ke Server Production
```bash
ssh deploy@sigap.jasamaritim.co.id
# atau sesuai dengan server Anda
```

### 2. Navigate ke Project Directory
```bash
cd /home/deploy/apps/sigap-planner
```

### 3. Backup Current Code (Optional but Recommended)
```bash
git status
git log --oneline -5  # check recent commits
```

### 4. Pull Code Terbaru
```bash
git pull origin main
# atau branch yang Anda gunakan (develop, master, dll)
```

### 5. Install/Update Dependencies
```bash
# Backend
cd backend
npm install
npm run build

# Web (if needed)
cd ../web
npm install
npm run build
```

### 6. Restart Backend Service
```bash
sudo systemctl restart sigap-web.service
```

### 7. Fix Old Files (Run Once)
Jalankan script ini untuk memperbaiki permission file-file lama yang sudah ter-upload:

```bash
cd /home/deploy/apps/sigap-planner/deploy/scripts
chmod +x fix-uploads-permissions.sh
./fix-uploads-permissions.sh
```

### 8. Verify Deployment
```bash
# Check backend service status
sudo systemctl status sigap-web.service

# Test upload dengan curl
curl -X GET "http://sigap.jasamaritim.co.id/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Test photo URL access (pilih salah satu foto yang sudah ada)
# Pastikan foto dapat diakses tanpa error 403
```

## Troubleshooting

### Service tidak jalan
```bash
# Check error logs
sudo systemctl status sigap-web.service
sudo journalctl -u sigap-web.service -n 50 -f

# Restart service
sudo systemctl restart sigap-web.service
```

### Masih ada error 403 pada foto lama
```bash
# Run fix script lagi
./deploy/scripts/fix-uploads-permissions.sh

# Atau manual fix
chmod 755 /home/deploy/apps/sigap-planner/backend/uploads
find /home/deploy/apps/sigap-planner/backend/uploads -type f -exec chmod 644 {} \;
```

### Check permissions sudah benar
```bash
ls -la /home/deploy/apps/sigap-planner/backend/uploads/ | head -10
# Seharusnya tampilannya: -rw-r--r-- (644)
```

## Rollback (jika diperlukan)
```bash
cd /home/deploy/apps/sigap-planner

# Lihat commit sebelumnya
git log --oneline -10

# Revert ke commit sebelumnya (ganti COMMIT_HASH)
git reset --hard COMMIT_HASH

# Rebuild dan restart
cd backend && npm run build
sudo systemctl restart sigap-web.service
```

## Post-Deployment Checklist
- [ ] Backend service berjalan normal (systemctl status)
- [ ] Tidak ada error di backend logs
- [ ] Test API endpoint berfungsi
- [ ] Test upload foto baru dan verify dapat diakses
- [ ] Test old photos dapat diakses (tidak 403)
- [ ] Mobile app masih connect ke backend
- [ ] Web dashboard masih berfungsi

## Monitoring
Setelah deploy, monitor logs selama beberapa jam:

```bash
# Watch backend logs
sudo journalctl -u sigap-web.service -f

# Watch nginx error logs
sudo tail -f /var/log/nginx/sigap.error.log

# Check disk usage (uploads folder tidak terlalu besar)
du -sh /home/deploy/apps/sigap-planner/backend/uploads
```

## Emergency Contact
Jika ada masalah saat deployment:
- Check logs di atas
- Rollback ke versi sebelumnya
- Contact: [sesuaikan dengan contact person di team Anda]
