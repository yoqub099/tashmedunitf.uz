<?php

return [

    /*
    |--------------------------------------------------------------------------
    | MAXFIY COLLECTIONLAR
    |--------------------------------------------------------------------------
    |
    | Bu collectionlar HECH QACHON ommaviy diskda turmasligi kerak — ular
    | shaxsiy ma'lumot (CV, pasport, diplom, transkript, kontrakt) saqlaydi.
    |
    | `media:secure-collections` komandasi shu ro'yxat asosida mavjud
    | fayllarni public → local (maxfiy) diskka ko'chiradi.
    |
    | Format:  ModelClass::class => ['collection1', 'collection2']
    |          ModelClass::class => ['*']   // modelning BARCHA collectionlari
    |
    */

    'private_collections' => [
        App\Models\Staff::class => ['cv', 'documents', 'private_docs'],
        App\Models\Page::class => ['private_docs'],
        App\Models\JobApplication::class => ['*'],
    ],

    /*
    |--------------------------------------------------------------------------
    | OMMAVIY DISKLAR
    |--------------------------------------------------------------------------
    |
    | Shu ro'yxatdagi disklar "ommaviy" hisoblanadi (Nginx to'g'ridan beradi).
    | Qolgan barcha disklar (masalan 'local') MAXFIY deb qaraladi va faqat
    | autentifikatsiyalangan `media/download/{id}` orqali beriladi.
    |
    */

    'public_disks' => ['public', 'media'],

    // Upload'da `visibility=private` berilsa, fayl shu diskka majburan saqlanadi
    // (collection o'z diskini belgilamagan bo'lsa ham).
    'private_disk' => env('MEDIA_PRIVATE_DISK', 'local'),

    /*
    |--------------------------------------------------------------------------
    | VIRUS TEKSHIRUVI (ClamAV)
    |--------------------------------------------------------------------------
    |
    | Default: O'CHIQ. Yoqish uchun serverga clamav-daemon o'rnatib,
    | .env ga MEDIA_VIRUS_SCAN=true qo'ying.
    |
    |   sudo apt-get install clamav clamav-daemon
    |   sudo systemctl enable --now clamav-daemon
    |
    | fail_closed=true  → clamd ishlamasa, yuklash RAD etiladi (qattiq rejim)
    | fail_closed=false → clamd ishlamasa, ogohlantirib o'tkazib yuboriladi
    |
    */

    'virus_scan' => [
        'enabled' => env('MEDIA_VIRUS_SCAN', false),
        'socket' => env('CLAMAV_SOCKET', '/var/run/clamav/clamd.ctl'),
        'host' => env('CLAMAV_HOST', '127.0.0.1'),
        'port' => (int) env('CLAMAV_PORT', 3310),
        'timeout' => (int) env('CLAMAV_TIMEOUT', 30),
        'fail_closed' => env('MEDIA_VIRUS_SCAN_FAIL_CLOSED', false),
    ],

];
