Deploy steps for CentOS (sigap.jasamaritim.co.id)

Prereqs (on the CentOS server):
- root / sudo access
- DNS A record for `sigap.jasamaritim.co.id` -> server IP

1) Install packages

```bash
sudo yum install -y epel-release
sudo yum install -y nginx
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y certbot python3-certbot-nginx
```

2) Prepare app directory

```bash
sudo mkdir -p /var/www/sigap
sudo chown -R $USER:www-data /var/www/sigap
# copy or git clone project into /var/www/sigap
cd /var/www/sigap/web
npm ci --production
npm run build
```

3) Set production env

Create `/var/www/sigap/web/.env.production` with:

```
NEXT_PUBLIC_API_URL=https://sigap.jasamaritim.co.id/api
```

4) Install systemd unit

Copy `deploy/systemd/sigap-web.service` to `/etc/systemd/system/sigap-web.service` and then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now sigap-web
```

Note: the unit expects `npm start` to run the production server (package.json `start` => `next start`).

5) Configure nginx

Copy `deploy/nginx/sigap.jasamaritim.co.id.conf` to `/etc/nginx/conf.d/` (or sites-available) then test and restart:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

6) Firewall & SELinux

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
# allow nginx to make outbound network connections (backend, certbot)
sudo setsebool -P httpd_can_network_connect 1
```

7) Obtain TLS certificate (Certbot)

```bash
sudo certbot --nginx -d sigap.jasamaritim.co.id
```

8) Verify & logs

```bash
# nginx
sudo tail -n 200 /var/log/nginx/sigap.error.log
# frontend service
sudo journalctl -u sigap-web -f
# backend (example service name: sigap-backend)
sudo journalctl -u sigap-backend -f
```

Important notes:
- Ensure backend is running on `127.0.0.1:4000` (or update the nginx proxy `proxy_pass` and `NEXT_PUBLIC_API_URL`).
- If backend uses a systemd service, get its name and ensure it's enabled & running.
- If you prefer `pm2` instead of `systemd`, I can provide `pm2` instructions.
