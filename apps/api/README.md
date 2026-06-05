# Backend — Laravel

TMTU Termiz Filiali — Backend (Laravel PHP)

## Texnologiyalar
- Laravel 11 (PHP 8.4)
- PostgreSQL 16+
- Redis 7
- Spatie Media Library, Permission, QueryBuilder

## Dastlabki sozlash (birinchi marta clone qilganda)

```bash
# 1. Composer paketlarini o'rnatish
composer install

# 2. .env faylni yaratish
cp .env.example .env

# 3. .env ichida DB va Redis sozlamalarini to'g'rilash:
#    DB_DATABASE=tmtu_termiz
#    DB_USERNAME=postgres
#    DB_PASSWORD=<parolingiz>

# 4. APP_KEY generatsiya qilish
php artisan key:generate

# 5. Storage symlink yaratish (MUHIM! Windows-da git clone symlink saqlamaydi)
php artisan storage:link

# 6. Migratsiyalarni ishga tushirish
php artisan migrate

# 7. Seed (ixtiyoriy — dastlabki ma'lumotlar)
php artisan db:seed
```

## Ishga tushirish

```bash
php artisan serve --port=8000
```

## Muhim eslatmalar

- **`php artisan storage:link`** — har bir yangi clone-dan so'ng bajarilishi shart! Aks holda yuklangan rasmlar ko'rinmaydi.
- **`.env`** fayl git-da saqlanmaydi — har bir kompyuterda alohida yaratilishi kerak.
- Database backup: `database_backup.sql` fayli mavjud — `pg_restore` yoki `psql` yordamida tiklash mumkin.
