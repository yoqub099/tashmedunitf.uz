# 🚀 GO-LIVE RUNBOOK — TMTU Termiz

> Production-tayyorlikka yetish uchun aniq, ketma-ket qadamlar.
> Holat (2026-06-09): sayt jonli, ~85% tayyor. Quyidagilar — qolgan bloklovchilar.
> Har bir qadamni tartib bilan bajaring; oxirida "Yakuniy tekshiruv".
>
> Belgilar: 🔴 majburiy (blok) · 🟠 muhim · 🟡 tavsiya · ⏱️ taxminiy vaqt

Avtomatik bajarilgan (kod, jonli): media xavfsizligi (CV/hujjat maxfiy + audit + IDOR himoyasi),
408 tiqilgan rasm konversiyasi tozalandi, backup tuzatildi (17→1240 fayl), symfony/yaml CVE yopildi.

---

## 1. 🔴 HTTPS + Domen (eng muhim) ⏱️ ~30 daqiqa

> Hozir sayt `http://40.47.1.223` (ochiq HTTP). Shaxsiy ma'lumot + admin login uchun qabul qilib bo'lmaydi.
> Yaxshi xabar: HTTPS nginx konfigi ALLAQACHON repo'da — `infrastructure/nginx/nginx-production.conf`
> (tdtutf.uz, www.tdtutf.uz, app.tdtutf.uz uchun). Faqat faollashtirish kerak.

**1.1. DNS** — domen registratoringizda A-yozuvlar qo'shing:
```
tdtutf.uz       A   40.47.1.223
www.tdtutf.uz   A   40.47.1.223
app.tdtutf.uz   A   40.47.1.223     # admin panel
```
Tekshirish: `dig +short tdtutf.uz` → 40.47.1.223 qaytishi kerak (tarqalishi ~10 daqiqa–24 soat).

**1.2. SSL sertifikat** (certbot webroot — nginx konfigi `/var/www/certbot` ni kutadi):
```bash
sudo mkdir -p /var/www/certbot
sudo apt-get install -y certbot
sudo certbot certonly --webroot -w /var/www/certbot \
  -d tdtutf.uz -d www.tdtutf.uz -d app.tdtutf.uz \
  --email nurmamatovyoqub@gmail.com --agree-tos --no-eff-email
```

**1.3. Nginx konfigini faollashtirish:**
```bash
sudo cp /var/www/tmtu-termiz/infrastructure/nginx/nginx-production.conf /etc/nginx/sites-available/tmtu
sudo ln -sf /etc/nginx/sites-available/tmtu /etc/nginx/sites-enabled/tmtu
sudo nginx -t && sudo systemctl reload nginx
```

**1.4. Ilovani HTTPS + domenga moslash** — `apps/api/.env`:
```ini
APP_URL=https://tdtutf.uz
SANCTUM_STATEFUL_DOMAINS=tdtutf.uz,www.tdtutf.uz,app.tdtutf.uz
SESSION_DOMAIN=.tdtutf.uz
SESSION_SECURE_COOKIE=true
```
`apps/web/.env`:  `NEXT_PUBLIC_API_URL=https://tdtutf.uz/api`
`apps/admin/.env`: `NEXT_PUBLIC_API_URL=https://tdtutf.uz/api/v1`

So'ng:
```bash
cd /var/www/tmtu-termiz/apps/api && php artisan config:cache
cd /var/www/tmtu-termiz && pnpm --filter @tmtu/web build && pnpm --filter @tmtu/admin build
pm2 restart all   # yoki: sudo systemctl restart <web/admin service nomi>
```

---

## 2. 🔴 Queue worker doimiy tuzatish (sudo) ⏱️ ~5 daqiqa

> Worker faqat `default` navbatni eshitardi; rasm konversiyalari `media-conversions` ga boradi.
> Men backlogni tozaladim, lekin doimiy tuzatish systemd unitini o'zgartirishni talab qiladi.
> Worker `tashmed` sifatida ishlaydi, php-fpm esa `www-data` → fayl ruxsati mos kelmaydi.

```bash
# Worker ikkala navbatni eshitsin + www-data sifatida ishlasin
sudo sed -i 's|queue:work redis|queue:work redis --queue=default,media-conversions|; s|^User=.*|User=www-data|' /etc/systemd/system/tmtu-queue.service
sudo systemctl daemon-reload && sudo systemctl restart tmtu-queue

# Storage ruxsatini moslash (www-data yoza olsin + kelajak uchun setgid)
sudo chown -R tashmed:www-data /var/www/tmtu-termiz/apps/api/storage/app/public
sudo chmod -R 2775 /var/www/tmtu-termiz/apps/api/storage/app/public

# Ruxsat tufayli fail bo'lgan 3 konversiyani qayta ishlash
cd /var/www/tmtu-termiz/apps/api && php artisan queue:retry all
```
Tekshirish: `sudo systemctl status tmtu-queue` → active; failed_jobs → 0.

---

## 3. 🟠 Email (real SMTP) ⏱️ ~10 daqiqa

> Hozir `MAIL_MAILER=log` — kontakt forma, konferensiya tasdig'i, parol tiklash HECH KIMGA bormaydi.

`apps/api/.env` (haqiqiy SMTP bilan to'ldiring):
```ini
MAIL_MAILER=smtp
MAIL_HOST=smtp.yourprovider.com
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@tdtutf.uz
MAIL_FROM_NAME="TMTU Termiz"
```
```bash
cd /var/www/tmtu-termiz/apps/api && php artisan config:cache
php artisan tinker --execute='Mail::raw("Test", fn($m)=>$m->to("siz@example.com")->subject("Test"));'
```
> ⚠️ Email yoqishdan OLDIN 4-bo'limdagi dependency yangilanishini bajaring (email-injection CVE'lari bor).

---

## 4. 🟠 Dependency xavfsizlik yangilanishi (STAGING/CI da — prod'da ko'r-ko'rona EMAS) ⏱️ ~30 daqiqa

> `composer audit`: 9 ta advisory (1 high — symfony/mime SMTP-injection, 4 medium), Laravel+Symfony core.
> Bularni yopish `-W` (keng) yangilanishni talab qiladi. Jonli serverda test'siz qilish XAVFLI
> (test to'plamini bu yerda xavfsiz ishlatib bo'lmaydi — cached config + umumiy DB footgun).

To'g'ri yo'l — staging yoki CI da:
```bash
composer update -W                 # Laravel + Symfony patch/minor
php artisan test                   # IZOLYATSIYALANGAN test DB bilan (CI da)
composer audit                     # 0 advisory bo'lishi kerak
# tahlil o'tgach → deploy (scripts/deploy.sh)
```

---

## 5. 🟡 Xato monitoringi (Sentry) ⏱️ ~10 daqiqa
```bash
cd /var/www/tmtu-termiz/apps/api && composer require sentry/sentry-laravel
# .env: SENTRY_LARAVEL_DSN=https://...   SENTRY_TRACES_SAMPLE_RATE=0.2
php artisan config:cache
```

## 6. 🟡 Virus tekshiruvi (ClamAV) ⏱️ ~10 daqiqa
```bash
sudo apt-get install -y clamav clamav-daemon
sudo systemctl enable --now clamav-daemon
# apps/api/.env:  MEDIA_VIRUS_SCAN=true
cd /var/www/tmtu-termiz/apps/api && php artisan config:cache
```
> Kod tayyor (`App\Services\VirusScanner`) — faqat daemon + flag kerak.

## 7. 🔵 Talaba hujjatlari moduli (mahsulot qarori kerak)
> Pasport/diplom/transkript qaysi obyektga biriktiriladi? Hozir `Student` modeli yo'q.
> Xavfsiz saqlash infratuzilmasi (maxfiy disk + audit + ruxsat) TAYYOR.
> Spetsifikatsiya bering (maydonlar, kim ko'radi) → modul yoziladi.

---

## ✅ Yakuniy tekshiruv (hammasidan keyin)
```bash
curl -I https://tdtutf.uz                       # 200 + valid TLS
curl -s https://tdtutf.uz/api/health            # status: healthy
sudo systemctl status tmtu-queue                # active (www-data, both queues)
cd /var/www/tmtu-termiz/apps/api && composer audit   # 0 advisories
php artisan tinker --execute='echo DB::table("failed_jobs")->count();'  # 0
php artisan media:backup                         # ~1240+ fayl
```
Hammasi ✅ bo'lsa — shaxsiy ma'lumotni xavfsiz boshqarishga production-tayyor.
