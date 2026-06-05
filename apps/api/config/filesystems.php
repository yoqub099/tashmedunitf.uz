<?php

return [

    /*
    |--------------------------------------------------------------------------
    | DEFAULT DISK
    |--------------------------------------------------------------------------
    |
    | 'local' = storage/app/ (faqat server ichida ko'rinadi)
    | 'public' = storage/app/public/ (nginx orqali hamma ko'radi)
    |
    */

    'default' => env('FILESYSTEM_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | STORAGE DISKLARI
    |--------------------------------------------------------------------------
    |
    | 🔑 ASOSIY TUSHUNCHA:
    |
    | 'local' — MAXFIY fayllar (faqat server ichida)
    |   → storage/app/private/
    |
    | 'public' — OCHIQ fayllar (hamma ko'radi — rasmlar, PDF, video)
    |   → storage/app/public/
    |   → Nginx symlink: public/storage → storage/app/public
    |   → URL: https://tdtutf.uz/storage/media/1/photo.webp
    |
    | 'media' — MEDIA DEDICATED DISK (katta fayllar: video, kitob)
    |   → storage/app/public/media/
    |   → Production: /var/www/tmtu-termiz/storage/app/public/media/
    |
    | 'temp' — VAQTINCHALIK (chunked upload vaqtida)
    |   → storage/app/temp/
    |   → Har kuni avtomatik tozalanadi
    |
    */

    'disks' => [

        'local' => [
            'driver' => 'local',
            'root' => storage_path('app/private'),
            'serve' => true,
            'throw' => false,
        ],

        'public' => [
            'driver' => 'local',
            'root' => storage_path('app/public'),
            'url' => env('APP_URL').'/storage',
            'visibility' => 'public',
            'throw' => false,
        ],

        /*
        |--------------------------------------------------------------
        | MEDIA DISK — Barcha media fayllar shu yerda
        |--------------------------------------------------------------
        |
        | Papka strukturasi:
        |
        | storage/app/public/media/
        | ├── 1/                          ← media ID = 1
        | │   ├── yangilik-foto.jpg       ← ORIGINAL
        | │   └── conversions/
        | │       ├── yangilik-foto-thumbnail.webp   (400x300)
        | │       ├── yangilik-foto-medium.webp      (800x600)
        | │       └── yangilik-foto-large.webp       (1920x1080)
        | ├── 2/
        | │   └── kitob.pdf
        | ├── 3/
        | │   └── ma'ruza-video.mp4
        | └── ...
        |
        | URL: https://tdtutf.uz/storage/media/1/yangilik-foto.jpg
        |
        */

        'media' => [
            'driver' => 'local',
            'root' => storage_path('app/public/media'),
            'url' => env('APP_URL').'/storage/media',
            'visibility' => 'public',
            'throw' => false,
        ],

        /*
        |--------------------------------------------------------------
        | TEMP DISK — Vaqtinchalik yuklashlar
        |--------------------------------------------------------------
        |
        | Katta fayllar (video 500MB) bo'laklarga bo'lib yuklanadi
        | Yuklash tugagach, 'media' diskka ko'chiriladi
        | Har kuni cron bilan tozalanadi
        |
        */

        'temp' => [
            'driver' => 'local',
            'root' => storage_path('app/temp'),
            'throw' => false,
        ],

        /*
        |--------------------------------------------------------------
        | BACKUP DISK — Zaxira nusxalar
        |--------------------------------------------------------------
        |
        | Database va muhim fayllarning backup'i
        | Production: alohida disk yoki NAS
        |
        */

        'backup' => [
            'driver' => 'local',
            'root' => storage_path('app/backup'),
            'throw' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | SYMBOLIC LINK
    |--------------------------------------------------------------------------
    |
    | php artisan storage:link buyrug'i quyidagi symlinklarni yaratadi:
    |
    | public/storage → storage/app/public
    |
    | ⚡ Nginx bu symlink orqali fayllarni TO'G'RIDAN-TO'G'RI beradi
    |    PHP/Laravel ga UMUMAN tegmaydi = ULTRA TEZ!
    |
    */

    'links' => [
        public_path('storage') => storage_path('app/public'),
    ],
];
