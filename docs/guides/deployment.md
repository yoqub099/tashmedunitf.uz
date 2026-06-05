# Deployment Guide — TMTU Termiz Filiali

Production serverga chiqarish uchun to'liq yo'riqnoma.

---

## 📋 Serverga talablar

- **OS:** Ubuntu 22.04 LTS yoki yangiroq
- **CPU:** 2 yadro (4 tavsiya)
- **RAM:** 4 GB minimum (8 GB tavsiya)
- **Disk:** 40 GB SSD
- **Network:** Public IP, 80 va 443 portlar ochiq
- **Domain:** tashmedunitf.uz (DNS A record IP'ga yo'naltirilgan)

---

## 🔧 Birinchi o'rnatish

### 1. Server tayyorlash

```bash
# Foydalanuvchi va SSH key
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /home/deploy/.ssh
# ssh key qo'ying

# Kerakli paketlar
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx git

# Docker deploy uchun
sudo usermod -aG docker deploy
```

### 2. Loyiha klonlash

```bash
cd /var/www
sudo git clone <your-repo-url> tmtu-termiz
sudo chown -R deploy:deploy tmtu-termiz
cd tmtu-termiz
```

### 3. Environment fayllar

```bash
# Backend
cp apps/api/.env.example apps/api/.env
nano apps/api/.env
# To'ldiring: APP_KEY (keyin generate), DB_PASSWORD, REDIS_PASSWORD,
# MAIL_PASSWORD, SANCTUM_STATEFUL_DOMAINS, SENTRY_LARAVEL_DSN
# ⚠️ Production secret'larni Doppler/Vault'da saqlang, env'ga commit qilmang!

# Frontend & Admin
cp apps/web/.env.example apps/web/.env
cp apps/admin/.env.example apps/admin/.env
# URL'larni production'ga o'zgartiring
```

### 4. Docker stack'ni ishga tushirish

```bash
# Stack'ni build + up (avto-yaratiladi volume'lar)
pnpm docker:up
# yoki to'liq buyruq:
# docker compose -f infrastructure/docker/compose/compose.yml up -d --build

# Laravel kalitini generate qilish
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan key:generate --force
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan config:cache
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan route:cache

# Migrations
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan migrate --force
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan storage:link

# Dastlabki admin foydalanuvchisini yaratish
docker compose -f infrastructure/docker/compose/compose.yml exec app php artisan tinker --execute='
$u = new App\Models\User();
$u->name = "Super Admin";
$u->email = "admin@tashmedunitf.uz";
$u->password = bcrypt("CHANGE_ME_IMMEDIATELY");
$u->save();
$u->assignRole("super-admin");
echo "Created admin: {$u->email}\n";
'
```

### 5. Nginx reverse proxy

`/etc/nginx/sites-available/tashmedunitf.uz`:

```nginx
server {
    server_name tashmedunitf.uz www.tashmedunitf.uz;

    client_max_body_size 100M;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 80;
}

server {
    server_name admin.tashmedunitf.uz;
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    listen 80;
}

server {
    server_name api.tashmedunitf.uz;
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    listen 80;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/tashmedunitf.uz /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 6. SSL (Let's Encrypt)

```bash
sudo certbot --nginx -d tashmedunitf.uz -d www.tashmedunitf.uz -d admin.tashmedunitf.uz -d api.tashmedunitf.uz
```

Auto-renewal tekshirish: `sudo systemctl status certbot.timer`.

### 7. Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 🔄 Yangilash (ongoing deploy)

```bash
cd /var/www/tmtu-termiz
git pull origin main
docker compose up -d --build
docker compose exec app php artisan migrate --force
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan cache:clear
```

Avtomatik skript: [`deploy.sh`](./deploy.sh)

---

## 📊 Monitoring

### Loglar
```bash
# Laravel
docker compose logs -f app

# Frontend / Admin
docker compose logs -f frontend admin

# Nginx access
sudo tail -f /var/log/nginx/access.log
```

### Health check
- `https://api.tashmedunitf.uz/api/health` — qaytariladigan JSON `{"status":"healthy"}`

### Sentry (tavsiya)
`SENTRY_LARAVEL_DSN=` ni `.env`da o'rnating — crashlar avtomatik yuboriladi.

### Uptime monitoring
- [UptimeRobot](https://uptimerobot.com) — tekin
- [Healthchecks.io](https://healthchecks.io)

---

## 💾 Backup strategiyasi

### Cron job (har kuni 03:00)

`/etc/cron.d/tmtu-backup`:
```cron
0 3 * * * deploy cd /var/www/tmtu-termiz && docker compose -f infrastructure/docker/compose/compose.yml exec -T postgres pg_dump -U postgres tmtu_termiz | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz && find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### Offsite backup
- AWS S3 yoki Backblaze B2 ga sync
- `rclone sync /backups/ s3:tmtu-backups/ --min-age 1h`

---

## 🔒 Xavfsizlik tekshiruvi

Deploy'dan keyin:
- [ ] `APP_DEBUG=false`
- [ ] HTTPS ishlaydi (SSL Labs: https://www.ssllabs.com/ssltest/)
- [ ] Admin parolini o'zgartirdingiz
- [ ] Redis password o'rnatilgan
- [ ] Sentry DSN ishlaydi (test error yuboring)
- [ ] Backup cron ishlaydi
- [ ] `fail2ban` yoqilgan (optional)

---

## 🚨 Muammolar va yechimlar

| Muammo | Yechim |
|--------|--------|
| `storage:link` ishlamayapti | `docker compose exec app php artisan storage:link` |
| 500 xato (App Debug yopilgan) | `docker compose logs app \| tail -50` |
| CORS xato | `SANCTUM_STATEFUL_DOMAINS` + `config/cors.php` tekshiring |
| Rasm yuklanmayapti | `docker compose exec app chmod -R 775 storage/app/public` |
| Memory limit | `docker-compose.yml`'da `mem_limit: 2g` qo'shing |

---

## 📞 Support

Issue: https://github.com/<your-org>/tmtu-termiz/issues
