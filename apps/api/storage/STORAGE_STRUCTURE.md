# TMTU Storage Structure — Pro Level

## Server: 60 GB RAM, 4 TB SSD

```
storage/app/
│
├── public/                          ← Nginx to'g'ridan-to'g'ri beradi
│   │                                  Symlink: public/storage → storage/app/public
│   │                                  URL: https://tdtutf.uz/storage/...
│   │
│   ├── news/                        ← YANGILIKLAR
│   │   └── {id}/
│   │       ├── thumbnail/           ← Asosiy rasm (1 ta)
│   │       │   ├── foto.webp        ← Original (WebP ga convert)
│   │       │   └── conversions/
│   │       │       ├── foto-thumbnail.webp   (600x450)
│   │       │       └── foto-medium.webp      (1200x900)
│   │       ├── gallery/             ← Galereya rasmlari (ko'p)
│   │       ├── documents/           ← PDF, Word, Excel, PPT
│   │       ├── videos/              ← MP4, WebM
│   │       ├── audio/               ← MP3, WAV, OGG
│   │       ├── archives/            ← ZIP, RAR, 7Z
│   │       └── books/               ← PDF, EPUB, MOBI
│   │
│   ├── pages/                       ← CMS SAHIFALAR
│   │   └── {id}/
│   │       ├── images/              ← Sahifa rasmlari
│   │       │   └── conversions/     ← thumbnail(400x300), medium(800x600), large(1920x1080)
│   │       ├── documents/
│   │       ├── videos/
│   │       ├── audio/
│   │       ├── archives/
│   │       └── books/
│   │
│   ├── staff/                       ← XODIMLAR
│   │   └── {id}/
│   │       ├── photo/               ← Profil rasm
│   │       │   └── conversions/     ← thumbnail(300x400), medium(600x800)
│   │       ├── cv/                  ← Rezyume (PDF)
│   │       ├── documents/           ← Boshqa hujjatlar
│   │       └── publications/        ← Ilmiy nashrlar (PDF, EPUB)
│   │
│   ├── departments/                 ← KAFEDRALAR
│   │   └── {id}/
│   │       ├── image/               ← Kafedra rasmi
│   │       ├── head_photo/          ← Mudirning rasmi
│   │       ├── gallery/             ← Galereya
│   │       ├── documents/
│   │       ├── videos/
│   │       ├── audio/
│   │       └── archives/
│   │
│   ├── banners/                     ← BANNERLAR / SLAYDERLAR
│   │   └── {id}/
│   │       ├── image/               ← Desktop banner
│   │       │   └── conversions/     ← desktop(1920x600), mobile(768x400), thumbnail(400x200)
│   │       ├── mobile_image/        ← Mobil banner
│   │       └── video/               ← Video banner
│   │
│   ├── directions/                  ← TA'LIM YO'NALISHLARI
│   │   └── {id}/
│   │       ├── image/
│   │       ├── curriculum/          ← O'quv reja (PDF)
│   │       ├── documents/
│   │       ├── videos/
│   │       ├── audio/
│   │       ├── books/               ← Darsliklar
│   │       └── archives/
│   │
│   ├── faculties/                   ← FAKULTETLAR
│   │   └── {id}/
│   │       └── image/               ← Fakultet rasmi
│   │
│   ├── library/                     ← KUTUBXONA RESURSLARI
│   │   └── {id}/
│   │       ├── cover/               ← Kitob muqovasi
│   │       ├── document/            ← Kitob fayli (PDF, EPUB, MOBI)
│   │       └── gallery/             ← Qo'shimcha rasmlar
│   │
│   ├── journal/                     ← ILMIY JURNAL
│   │   └── {id}/
│   │       ├── cover/               ← Jurnal muqovasi
│   │       └── file/                ← Jurnal PDF
│   │
│   ├── partners/                    ← HAMKORLAR
│   │   └── {id}/
│   │       └── logo/                ← Hamkor logotipi
│   │
│   ├── testimonials/                ← FIKRLAR / SHARXLAR
│   │   └── {id}/
│   │       └── photo/               ← Muallif rasmi
│   │
│   ├── students/                    ← TALABALAR
│   │   ├── talented/                ← Iqtidorli talabalar
│   │   │   └── {id}/photo/
│   │   └── life/                    ← Talabalar hayoti
│   │       └── {id}/photo/
│   │
│   ├── contacts/                    ← ALOQA XABARLARI
│   │   └── {id}/
│   │       └── attachment/          ← Biriktirma fayllar
│   │
│   ├── site/                        ← UMUMIY SAYT MEDIA
│   │   └── {id}/
│   │       └── file/                ← Turli media (rasm, video, PDF)
│   │
│   └── site-contents/               ← SAYT KONTENT RASMLARI
│       └── ...
│
├── private/                         ← MAXFIY — Nginx BERMAYDI!
│   │                                  Faqat PHP auth orqali beriladi
│   │                                  API: /api/v1/media/download/{id}
│   │
│   ├── jobs/                        ← ISH ARIZALARI
│   │   └── {id}/
│   │       ├── resume/              ← Rezyume
│   │       ├── photo/               ← Ariza beruvchi rasmi
│   │       ├── motivation_letter/
│   │       ├── work_report/
│   │       ├── future_vision/
│   │       ├── teaching_portfolio/
│   │       ├── research_statement/
│   │       ├── dissertation/
│   │       ├── recommendation/
│   │       ├── diplomas/
│   │       ├── transcripts/
│   │       └── english_cert/
│   │
│   ├── staff/                       ← XODIMLAR MAXFIY
│   │   └── {id}/private_docs/
│   │
│   └── pages/                       ← SAHIFA MAXFIY
│       └── {id}/private_docs/
│
├── temp/                            ← VAQTINCHALIK YUKLASHLAR
│   │                                  Chunked upload vaqtida
│   │                                  Har 6 soatda avtomatik tozalanadi
│   └── ...
│
├── backup/                          ← DATABASE BACKUP
│   └── ...
│
└── backups/                         ← MEDIA BACKUP ARXIVLAR
    └── media_backup_2026-04-08_03-30-00.zip
```

## Artisan Komandalar

| Komanda | Maqsad |
|---------|--------|
| `php artisan storage:setup` | Barcha papkalarni yaratish (deploy uchun) |
| `php artisan storage:setup --production` | Production huquqlar bilan |
| `php artisan media:health` | Storage salomatligini tekshirish |
| `php artisan media:health --json` | JSON formatda diagnostika |
| `php artisan media:health --fix` | Muammolarni avtomatik tuzatish |
| `php artisan media:cleanup` | Yetim fayllarni topish (quruq rejim) |
| `php artisan media:cleanup --force` | Yetim fayllarni o'chirish |
| `php artisan media:clean-orphans` | DB orphan recordlarni topish |
| `php artisan media:clean-orphans --force` | DB orphan recordlarni o'chirish |
| `php artisan media:cleanup-temp` | Temp fayllarni tozalash |
| `php artisan media:backup` | Media fayllarni ZIP ga arxivlash |
| `php artisan media:migrate-structure` | Eski strukturani yangilash (quruq) |
| `php artisan media:migrate-structure --execute` | Haqiqiy ko'chirish |

## Deploy Qilish Tartibi

```bash
# 1. Kod yuklash
git pull origin main

# 2. Dependencies
composer install --no-dev --optimize-autoloader
cd frontend && npm ci && npm run build
cd admin && npm ci && npm run build

# 3. Storage setup (birinchi marta)
php artisan storage:setup --production

# 4. Database
php artisan migrate --force

# 5. Kesh
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan cache:warm

# 6. Queue worker restart
php artisan queue:restart

# 7. Health check
php artisan media:health
```

## Cron Schedule

```
* * * * * cd /var/www/tmtu-termiz/backend && php artisan schedule:run >> /dev/null 2>&1
```

| Vaqt | Komanda | Chastota |
|------|---------|----------|
| Har 30 min | `cache:warm` | Kesh isitish |
| Har 1 soat | `media-library:clean` | Spatie tozalash |
| Har 6 soat | `media:cleanup-temp` | Temp tozalash |
| 02:00 | `media:health --json` | Diagnostika |
| 03:00 | `db:backup --compress` | DB backup |
| 03:30 | `media:backup` | Media backup |
| Yaksh 04:00 | `media:clean-orphans --force` | Orphan tozalash |
| Yaksh 04:30 | `media:cleanup --force` | Full tozalash |
| 08:00 | `project:stats` | Statistika |
