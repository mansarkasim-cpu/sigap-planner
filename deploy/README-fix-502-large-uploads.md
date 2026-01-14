# Fix 502 Bad Gateway for Large Image Uploads

## Problem
The mobile app gets 502 Bad Gateway errors when submitting realisasi with photos. This is caused by:
1. Nginx not configured for large request bodies (base64 images ~3-6MB)
2. Default proxy timeouts too short for image processing
3. Backend systemd service not properly configured

## Solution

### 1. Update Nginx Configuration

Copy the updated nginx config (CentOS uses conf.d):
```bash
sudo cp deploy/nginx/sigap.jasamaritim.co.id.conf /etc/nginx/conf.d/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

For Ubuntu/Debian (if using sites-available):
```bash
sudo cp deploy/nginx/sigap.jasamaritim.co.id.conf /etc/nginx/sites-available/
sudo ln -sf /etc/nginx/sites-available/sigap.jasamaritim.co.id.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

Key changes:
- `client_max_body_size 50M` - Allows uploads up to 50MB
- `proxy_*_timeout 300s` - 5-minute timeouts for processing
- Increased buffer sizes for large payloads

### 2. Create Backend Systemd Service

If not already created:
```bash
sudo cp deploy/systemd/sigap-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable sigap-backend
sudo systemctl start sigap-backend
sudo systemctl status sigap-backend
```

### 3. Verify Backend is Running

Check the backend is listening on port 4000:
```bash
sudo systemctl status sigap-backend
sudo netstat -tlnp | grep 4000
# or
sudo ss -tlnp | grep 4000
```

### 4. Check Logs

If issues persist:
```bash
# Backend logs
sudo journalctl -u sigap-backend -f

# Nginx logs
sudo tail -f /var/log/nginx/sigap.error.log
sudo tail -f /var/log/nginx/sigap.access.log
```

### 5. Common Issues

**Backend not responding:**
- Check if backend service is running: `sudo systemctl status sigap-backend`
- Check database connection in backend logs
- Verify .env file in `/home/deploy/apps/sigap-planner/backend/`

**Still getting 502:**
- Verify backend is on port 4000: `curl http://localhost:4000/api`
- Check firewall rules: `sudo ufw status`
- Check SELinux if enabled: `sestatus`

**413 Request Entity Too Large:**
- Increase `client_max_body_size` in nginx config further

## Testing

Test from mobile app:
1. Take a photo in realisasi submission
2. Submit the realisasi
3. Should now succeed instead of 502 error

Test from command line:
```bash
# Test backend directly
curl -X POST http://localhost:4000/api/realisasi/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":"...","taskId":"...","photoBase64":"..."}'

# Test through nginx
curl -X POST https://sigap.jasamaritim.co.id/api/realisasi/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"assignmentId":"...","taskId":"...","photoBase64":"..."}'
```
