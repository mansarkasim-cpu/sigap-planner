#!/bin/bash

# Script untuk memperbaiki permissions pada folder uploads
# Jalankan script ini setelah deploy atau saat terjadi masalah 403

DEPLOY_DIR="${DEPLOY_DIR:-/home/deploy/apps/sigap-planner}"
UPLOADS_DIR="$DEPLOY_DIR/backend/uploads"

echo "Fixing permissions for uploads directory: $UPLOADS_DIR"

# Buat folder jika belum ada
mkdir -p "$UPLOADS_DIR"

# Set ownership ke user yang menjalankan aplikasi (biasanya deploy atau www-data)
# Sesuaikan dengan user yang menjalankan service backend Anda
# Uncomment salah satu baris di bawah sesuai dengan setup server Anda
# chown -R deploy:deploy "$UPLOADS_DIR"
# chown -R www-data:www-data "$UPLOADS_DIR"

# Set permissions folder: 755 (rwxr-xr-x)
chmod 755 "$UPLOADS_DIR"

# Set permissions untuk semua file yang sudah ada: 644 (rw-r--r--)
find "$UPLOADS_DIR" -type f -exec chmod 644 {} \;

# Set permissions untuk semua subfolder: 755 (rwxr-xr-x)
find "$UPLOADS_DIR" -type d -exec chmod 755 {} \;

echo "✓ Permissions fixed for $UPLOADS_DIR"
echo "  - Folders: 755 (rwxr-xr-x)"
echo "  - Files: 644 (rw-r--r--)"
echo ""
echo "If you still get 403 errors, check:"
echo "  1. Nginx user has read access to the uploads directory"
echo "  2. SELinux context (if enabled): restorecon -R $UPLOADS_DIR"
echo "  3. Ownership matches the backend service user"
