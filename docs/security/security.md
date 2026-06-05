# Security — TMTU Termiz Filiali

## 🔐 Mavjud xavfsizlik mexanizmlari

### Autentifikatsiya
- **Laravel Sanctum:** Bearer token'lar (256-bit hash)
- **bcrypt parollar:** 12 round (production), 4 round (testing)
- **Multi-session:** 24 soat davomida eski tokenlar saqlanadi (telefon + laptop)
- **Brute-force protection:**
  - 5 xato urinishdan so'ng 15 daqiqa lockout
  - Per email+IP kombinatsiya (cache asosida)
  - Qolgan urinishlar soni xabarda ko'rsatiladi

### Rol asosida kirish
- **super-admin:** to'liq huquq + foydalanuvchilar boshqaruvi
- **admin:** barcha kontent CRUD
- **editor:** faqat kontent ko'rish/yaratish/tahrirlash (delete yo'q)

Ruxsatlar `config/permission.php` + `spatie/laravel-permission` orqali.

### Parolni tiklash
- **Tokenlar:** `Str::random(64)` — hashed DB'da saqlanadi
- **TTL:** 60 daqiqa
- **Email enumeration himoya:** har doim "success" qaytaradi
- **Rate limit:** 10/min + 5/hour per email+IP

### Rate Limiting
| Endpoint | Limit |
|----------|-------|
| Global API | 120 req/min |
| Login | 20/min |
| Forgot password | 10/min + 5/hour per email+IP |
| Contact form | 10/min |
| Conference, Job, Student-work | 10/min (ba'zilari 10/5min) |

### CORS
- Strict `allowed_origins` — faqat ro'yxatdagi domenlar
- Pattern-based (localhost variants) lokal dev uchun
- `supports_credentials: true` — Sanctum stateful auth uchun

### Xavfsizlik sarlavhalari (Next.js)
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: frame-ancestors 'self'
```

### XSS himoyasi
- **React auto-escape** barcha `{text}` da
- `dangerouslySetInnerHTML` faqat `DOMPurify.sanitize()` bilan
- Content-Security-Policy `frame-ancestors 'self'`

### SQL Injection himoyasi
- **Eloquent ORM** — parametrized queries
- **Spatie QueryBuilder** — allowlist'lar bilan (SQL injection xavfsiz)

### Fayl yuklash
- File type whitelist (PDF/DOC/DOCX, PNG/JPG/WebP, MP4)
- Max hajm limitlari
- MIME type double-check (Laravel Validator)
- Random file name (original saqlanmaydi)

### Sessiyalar
- HTTPS-only cookies in production (`SESSION_SECURE_COOKIE=true`)
- SameSite=Lax
- `HttpOnly` (JS kira olmaydi)

---

## ⚠️ Hali tuzatilmagan

- [ ] **2FA / OTP** — ikki faktorli autentifikatsiya yo'q
- [ ] **Virus scan** — ClamAV integratsiyasi yo'q
- [ ] **Fail2Ban** — SSH level brute force uchun
- [ ] **WAF (Web Application Firewall)** — masalan, Cloudflare
- [ ] **CSP nonce** — inline script'lar uchun (hozir `unsafe-inline`)

---

## 🚨 Xavfsizlik muammosini xabar qilish

Xavfsizlik zaifliklari aniqlasangiz, **OMMAVIY** issue ochmang.

Email: security@tashmedunitf.uz
Javob muddati: 48 soat

---

## 📅 Oxirgi xavfsizlik auditi

**Sana:** 2026-04-20

**Topilgan va tuzatilgan muammolar:**
1. CORS preflight fail (`127.0.0.1` origin) — tuzatildi
2. Multi-session logout (login har doim barcha tokenlarni o'chirar edi) — tuzatildi
3. XSS 2 ta admin komponentida (sanitizeHtml yo'q) — tuzatildi
4. Git'da sekret (`backend/.token` tracked edi) — olib tashlandi
5. Mail config noto'g'ri (mailpit ishlamayotgan) — log drayveriga o'tkazildi

**Tashqi audit:** Hali o'tkazilmagan. Professional pentest tavsiya etiladi.

---

## 🔑 Sekret boshqaruvi

### Rotation policy
- **APP_KEY:** yilda 1 marta (sessiyalarni invalidate qilinadi)
- **DB_PASSWORD:** 3 oyda
- **REDIS_PASSWORD:** 6 oyda
- **MAIL_PASSWORD:** faqat leak holatida

### Saqlash
- **Production:** server `.env` + yopiq fayl ruxsatlari (chmod 640)
- **Ishlab chiqish:** mahalliy `.env` (gitignored)
- **CI/CD:** GitHub Secrets / GitLab CI Variables
- **Jamoa hamkorligi:** 1Password / Bitwarden shared vault

### Hech qachon
- ❌ `.env` git'ga commit qilmang
- ❌ Sekretlarni log'larga yozmaman
- ❌ Sekretlarni URL parametrlari / query string'ga qo'yma
- ❌ Sekretlarni frontend JS bundle'ga qo'yma (`NEXT_PUBLIC_*` sekret emas!)

---

## 📚 Havolalar

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Laravel Security](https://laravel.com/docs/12.x/authentication)
- [Sanctum Best Practices](https://laravel.com/docs/12.x/sanctum#protecting-routes)
