# Session Handoff — 2026-06-05

> **Ertaga davom etish uchun:** Sayt ishlayapti → http://40.47.1.223/uz (sayt),
> http://40.47.1.223:8080 (admin, login `admin@tdtutf.uz`). Local kod va serverdagi kod **bir xil**
> (760 ta fayl tekshirildi). Kesh muammosi (admin rasm/yozuvni yangilaganda foydalanuvchida eski
> ko'rinishi) **to'liq tuzatildi**. Serverga kirish: `ssh tashmed@40.47.1.223`, parol `Filial@2026`.
> Qolgan ishlar: domen + HTTPS (`tdtutf.uz`), SMTP pochta. Batafsil pastda.

This document is the single read-first summary of the deployment + caching work. It complements the
deeper notes in `PROJECT_DEEP_DIVE_2026-06.md`, `FULL_PROJECT_READ_2026-06.md`, and the runbook scripts
in `infrastructure/server-setup/`.

---

## 1. Production status

| What        | Where                                                                                             |
| ----------- | ------------------------------------------------------------------------------------------------- |
| Public site | http://40.47.1.223/uz (also `/ru`, `/en`)                                                         |
| Admin panel | http://40.47.1.223:8080 — login `admin@tdtutf.uz`                                                 |
| API health  | http://40.47.1.223/api/health                                                                     |
| Server      | `ssh tashmed@40.47.1.223` (password `Filial@2026`, also sudo password)                            |
| App root    | `/var/www/tmtu-termiz` (owner `tashmed:www-data`)                                                 |
| Secrets     | `/etc/tmtu/secrets.env` (root-only, 0600): `DB_PASSWORD`, `REVALIDATION_SECRET`, `ADMIN_PASSWORD` |

**Stack on the server:** Ubuntu 22.04.5 (12 cores, 16 GB RAM, 156 GB disk) · PHP 8.4-fpm ·
PostgreSQL 16 · Redis · Nginx · Node 20 + pnpm 10 · pm2 (`tmtu-web` :3000, `tmtu-admin` :3001) ·
systemd `tmtu-queue` (queue worker) · cron (scheduler). Nginx `:80` → web + Laravel `/api`,`/storage`;
`:8080` → admin. No domain yet → IP + HTTP only.

The complete, repeatable provisioning + deploy is captured as numbered scripts in
`infrastructure/server-setup/` (`01-prep.sh` … `21-test-revalidation.sh`). These ARE the deploy record.

---

## 2. What was done this session

1. **Local ↔ server sync verified (bir xilmi).** A normalized-content SHA-256 manifest of all **760**
   source files under `apps/api/{app,config,database,routes}`, `apps/web/src`, `apps/admin/src` was
   generated on both sides and diffed — **empty diff, byte-for-byte identical** (line endings
   normalized). Server-only edits made during deploy were folded back into the local repo:
   - `transpilePackages: ["@tmtu/utils", "@tmtu/types"]` added to both `apps/web/next.config.ts` and
     `apps/admin/next.config.ts` (monorepo packages ship as TS source → Next must transpile them).
   - `{ protocol: "http", hostname: "40.47.1.223", pathname: "/storage/**" }` added to both
     `remotePatterns` (so the Next image optimizer accepts server-hosted images).
   - `fakerphp/faker` moved from `require-dev` → `require` in `apps/api/composer.json` (+ `composer.lock`)
     so production `composer install --no-dev` still has it for seeders.
   - `version_urls` cache-bust (see §3).
   - `.env*` files intentionally differ per environment (gitignored) — not part of the sync.

2. **Stale-cache fix (the main ask).** Detailed in §3 below — fully fixed and verified end-to-end.

3. **This handoff** (+ the read-first note in Claude's memory).

Earlier in the broader effort: verified the backend is PostgreSQL, ran the project locally, fixed
faculty/journal 404s, made the repo deploy-ready, provisioned + deployed the server from scratch, fixed
the banner-not-showing bug (stale `public/storage` dir vs symlink), and removed the hardcoded
`StatsCounterSection`.

---

## 3. The stale-cache fix — "admin yangilaganda foydalanuvchida eski rasm/yozuv ko'rinadi"

**Problem:** after an admin updated a banner's image or text, users' browsers/phones kept showing the
old version.

Three independent cache layers were addressed; all are now closed:

### a) Text (page content)

The homepage HTML is served with `Cache-Control: public, max-age=0, s-maxage=60,
stale-while-revalidate=30`. `max-age=0` forces the **browser** to revalidate on every load. On an admin
edit, a Laravel model observer calls `FrontendRevalidationService`, which POSTs to the web app's
`/api/revalidate` (Next.js `revalidateTag` / `revalidatePath`) → the page re-renders server-side, so the
next request returns fresh text. **Verified:** updating a banner title propagated to the homepage HTML.

### b) Image (the real culprit) — `version_urls`

Images are served by nginx from `/storage/` with `Cache-Control: max-age=2592000` (30 days). The custom
`App\Services\MediaPathGenerator` builds image paths as
`{model_folder}/{model_id}/{collection}/{filename}` — e.g. `banners/1/image/photo.webp`. Because the
path keys on the **model id + collection + filename** (not the unique media id), replacing a banner image
with a file of the **same name produced the identical URL** → the device (and Next's image optimizer,
which has `minimumCacheTTL: 2592000`) kept serving the 30-day-cached old image.

**Fix:** enabled Spatie Media Library's built-in versioning in `apps/api/config/media-library.php`:

```php
'version_urls' => true,
```

Every media URL now ends with `?v={media.updated_at.timestamp}`. Replacing an image creates a new media
record with a fresh `updated_at` → the URL changes → both the browser cache and the Next optimizer cache
miss and fetch the new image. Text-only edits leave the media `updated_at` (and thus the image URL)
unchanged, so there's no needless re-fetch.

**Verified end-to-end on the server:**

- API now emits `...photo.webp?v=1780680395`.
- Raw versioned image → `200`.
- **Next image optimizer with the versioned source → `200`** (the `?v=` query is accepted;
  `remotePatterns` without a `search` field allows query strings — confirmed against both versioned and
  unversioned URLs).
- Homepage re-rendered (revalidate `200`) and references the versioned URLs.

### c) Laravel application cache

Model observers already flush the relevant Redis cache keys on update.

After the config change the server was reconciled with `php8.4 artisan config:cache`,
`systemctl reload php8.4-fpm`, `systemctl restart tmtu-queue`.

---

## 4. Operating the server (cheatsheet)

```bash
ssh tashmed@40.47.1.223                 # password: Filial@2026

# Backend (Laravel) — after editing config/code:
cd /var/www/tmtu-termiz/apps/api
php8.4 artisan config:cache
sudo systemctl reload php8.4-fpm
sudo systemctl restart tmtu-queue       # if queue/observer behavior changed

# Frontend (Next web/admin) — NEXT_PUBLIC_* is baked at BUILD time:
cd /var/www/tmtu-termiz
pnpm build                              # rebuild after code or env URL changes
pm2 restart tmtu-web tmtu-admin
pm2 status                              # health

# Read secrets (root-only):
sudo cat /etc/tmtu/secrets.env

# Uploaded image not showing? FIRST check the symlink:
ls -ld /var/www/tmtu-termiz/apps/api/public/storage   # must be a symlink, not a dir
```

**Windows automation note:** non-interactive SSH used `plink`/`pscp` (OpenSSH `ssh.exe` can't do
password auth non-interactively) with `-hostkey SHA256:NTAsJQc5nwQZ0wsYY7diEqZFgRbClAwhvvyFx4T2x+Q -pw
Filial@2026 -batch`. Always strip CRLF from transferred files: `sed -i 's/\r$//' <file>`.

---

## 5. Still pending (future sessions)

- **Domain + HTTPS.** No domain points at the server yet. Once `tdtutf.uz` (or similar) resolves to
  `40.47.1.223`: run `sudo certbot --nginx`, then change the three `.env` URLs to `https://…` and rebuild
  web + admin (NEXT*PUBLIC*\* is build-time).
- **Email.** Mail driver is `log`. Configure real SMTP in `apps/api/.env` for contact-form / notification
  email.
- **Known minor gaps** from the deep-dive: some shared `packages/*` are scaffolding only; revalidation
  SSE is effectively a polling stream. See the architecture docs for the full register.

---

## 6. Gotchas worth remembering (bit us this effort)

- Dev `apps/{web,admin}/.env.local` (localhost:8000) **overrides** the prod `.env` at build → SSR
  `ECONNREFUSED` → every faculty page showed "Fakultet topilmadi". Delete `.env.local` on the server,
  rebuild. (`tar --exclude='.env'` does NOT exclude `.env.local`.)
- `public/storage` can arrive from a tarball as a **stale directory**, so `php artisan storage:link`
  silently skips it and uploads 404. Fix: `rm -rf public/storage && php artisan storage:link`.
- Nginx routed **all** `/api/` to Laravel, shadowing the web app's own `/api/revalidate(/stream)`. A
  longer-prefix `location /api/revalidate { proxy_pass http://tmtu_web; proxy_buffering off; }` fixes it
  (`infrastructure/server-setup/20-fix-revalidate.sh`).
- The Next image optimizer 400s for a host that isn't in `remotePatterns` — the server IP had to be added
  (and a rebuild done).
