# TDTUTF — Production Deployment Guide

Monorepo: **Laravel API** (`apps/api`), **Next.js web** (`apps/web`), **Next.js admin** (`apps/admin`).
Verified 2026-06-05: production build passes (web + admin, TypeScript clean), backend tests 12/12 pass.

> ⚠️ The existing `scripts/deploy-production.sh` was written for the **old flat layout**
> (Laravel at repo root). In this monorepo Laravel lives in `apps/api/`, and the script does
> **not** start the Next.js apps. Use the steps below (or fix that script's paths) — they are
> monorepo-correct.

---

## 0. What's verified ready vs. what YOU must configure

| Item | Status |
|------|--------|
| `pnpm build` (web 263 routes + admin 103) | ✅ passes, TypeScript clean |
| Backend test suite (`php artisan test`) | ✅ 12 passed / 46 assertions |
| DB schema (PostgreSQL, 49 migrations) | ✅ applied |
| Security headers, `output: standalone` | ✅ configured in `next.config.ts` |
| `REVALIDATION_SECRET` guessable fallback | ✅ removed (must be set in prod `.env`) |
| Production `.env` (secrets, domain, DB pwd) | ⬜ **you set these** (§3) |
| Server (PHP 8.4, Node ≥20, PG 16+, Redis, Nginx) | ⬜ **you provision** (§1) |
| `nginx-production.conf` | ✅ created (adjust domains) |
| Frontend process manager (pm2/systemd) | ⬜ **you set up** (§4) |
| Journal `/imgs/journal/*` images | ⬜ supply real images (pre-existing gap) |

---

## 1. Server prerequisites (Ubuntu)

```bash
# PHP 8.4 + extensions (pdo_pgsql, mbstring, gd, intl, zip, redis, bcmath, curl, opcache)
sudo add-apt-repository -y ppa:ondrej/php && sudo apt update
sudo apt install -y php8.4-fpm php8.4-pgsql php8.4-mbstring php8.4-xml php8.4-bcmath \
  php8.4-curl php8.4-gd php8.4-intl php8.4-zip php8.4-redis php8.4-opcache
sudo apt install -y postgresql postgresql-contrib redis-server nginx supervisor git
# Node 20 LTS + pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - && sudo apt install -y nodejs
sudo npm i -g pnpm@10 pm2
# Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

## 2. Get the code + install + build

```bash
sudo git clone <your-repo> /var/www/tmtu-termiz
cd /var/www/tmtu-termiz
pnpm install --frozen-lockfile
composer install --working-dir=apps/api --optimize-autoloader --no-dev
pnpm build                       # builds web + admin (standalone output)
```

## 3. Environment configuration (CRITICAL — set real secrets)

**`apps/api/.env`** (copy from `.env.example`, then set):
```dotenv
APP_ENV=production
APP_DEBUG=false                  # NEVER true in prod
APP_URL=https://tdtutf.uz
APP_KEY=                         # php artisan key:generate (do this once)
FRONTEND_URL=https://tdtutf.uz
ADMIN_URL=https://admin.tdtutf.uz
REVALIDATION_SECRET=             # `openssl rand -hex 32` — MUST match the web/admin value
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_DATABASE=tmtu_termiz
DB_USERNAME=tmtu
DB_PASSWORD=<strong-db-password> # NOT empty, NOT committed
CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
SANCTUM_STATEFUL_DOMAINS=tdtutf.uz,admin.tdtutf.uz
SESSION_DOMAIN=.tdtutf.uz
ADMIN_PASSWORD=<strong-admin-password>
```
**`apps/web/.env`**: `NEXT_PUBLIC_API_URL=https://tdtutf.uz/api` and `REVALIDATION_SECRET=<same as API>`
**`apps/admin/.env`**: `NEXT_PUBLIC_API_URL=https://tdtutf.uz/api/v1` and `REVALIDATION_SECRET=<same as API>`

```bash
cd apps/api
php artisan key:generate
php artisan storage:link            # public/storage -> storage/app/public (REQUIRED for media)
php artisan migrate --force
php artisan db:seed --force         # creates roles/permissions + admin user
php artisan config:cache && php artisan route:cache && php artisan event:cache && php artisan optimize
```

## 4. Run the THREE services

**Laravel API** — via `php8.4-fpm` (Nginx talks to it; see §5). Queue worker via Supervisor:
```ini
# /etc/supervisor/conf.d/tmtu-worker.conf
[program:tmtu-worker]
command=php /var/www/tmtu-termiz/apps/api/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
directory=/var/www/tmtu-termiz/apps/api
user=www-data
numprocs=4
process_name=%(program_name)s_%(process_num)02d
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/www/tmtu-termiz/apps/api/storage/logs/worker.log
```
Also add the scheduler to cron:
`* * * * * cd /var/www/tmtu-termiz/apps/api && php artisan schedule:run >/dev/null 2>&1`

**Next.js web + admin** — standalone Node servers, managed by pm2:
```bash
# next build produces a self-contained server.js per app
PORT=3000 pm2 start "node apps/web/.next/standalone/apps/web/server.js"   --name tmtu-web
PORT=3001 pm2 start "node apps/admin/.next/standalone/apps/admin/server.js" --name tmtu-admin
# IMPORTANT: copy static assets next to the standalone output:
cp -r apps/web/.next/static  apps/web/.next/standalone/apps/web/.next/
cp -r apps/web/public        apps/web/.next/standalone/apps/web/
cp -r apps/admin/.next/static apps/admin/.next/standalone/apps/admin/.next/
cp -r apps/admin/public       apps/admin/.next/standalone/apps/admin/
pm2 save && pm2 startup       # survive reboots
```

## 5. Nginx + SSL

```bash
sudo cp /var/www/tmtu-termiz/nginx-production.conf /etc/nginx/sites-available/tdtutf.uz
sudo ln -s /etc/nginx/sites-available/tdtutf.uz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d tdtutf.uz -d www.tdtutf.uz -d admin.tdtutf.uz
```
(Ensure the http{} zones `media_cache`, `api`, `upload` exist in the main `nginx.conf` — see the
header of `nginx-production.conf`.)

## 6. Pre-launch security checklist

- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] `APP_KEY` generated; `REVALIDATION_SECRET` = `openssl rand -hex 32`, identical on api+web+admin
- [ ] Strong, non-empty `DB_PASSWORD` and `ADMIN_PASSWORD`; rotate the dev defaults
- [ ] DB user is least-privilege (not the `postgres` superuser)
- [ ] HTTPS enforced (certbot), HSTS header present (already in `next.config.ts`)
- [ ] `php artisan optimize` (config/route/event cache) run
- [ ] Firewall: only 80/443 public; 5432/6379/3000/3001/php-fpm bound to localhost
- [ ] `.env` files are `chmod 600`, owned by `www-data`, never committed

## 7. Verify after deploy

```bash
curl -fsS https://tdtutf.uz/api/health        # {"status":"healthy",...}
curl -fsS -o /dev/null -w '%{http_code}\n' https://tdtutf.uz/uz          # 200
curl -fsS -o /dev/null -w '%{http_code}\n' https://admin.tdtutf.uz/login # 200
```

---

## Local test run (developer note)
`phpunit.xml` uses an empty `DB_PASSWORD` (for CI's trust-auth Postgres). To run tests against a
password-protected local Postgres:
`cd apps/api && DB_PASSWORD=<your-local-pg-password> php artisan test`
