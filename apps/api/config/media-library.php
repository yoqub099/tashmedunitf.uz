<?php

return [

    /*
    |--------------------------------------------------------------------------
    | MEDIA DISK — Fayllar qayerda saqlanadi
    |--------------------------------------------------------------------------
    |
    | 'public' = storage/app/public/media/ papkada
    | Nginx symlink orqali to'g'ridan-to'g'ri beradi (PHP ga tegmaydi)
    |
    | Production: /var/www/tmtu-termiz/storage/app/public/media/
    | URL: https://tdtutf.uz/storage/media/1/photo.webp
    |
    */

    'disk_name' => env('MEDIA_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | MAKSIMAL FAYL HAJMI (KB da)
    |--------------------------------------------------------------------------
    |
    | Rasmlar: 10MB, Videolar: 500MB, Hujjatlar: 100MB
    | Bu umumiy limit, har bir collection o'zida limitlaydi
    |
    */

    'max_file_size' => 1024 * 1024 * 500, // 500 MB (eng katta video uchun)

    /*
    |--------------------------------------------------------------------------
    | THUMBNAIL GENERATION — Queue bilan
    |--------------------------------------------------------------------------
    |
    | true = thumbnail yaratish background da ishlaydi (server qotmaydi)
    | false = thumbnail darhol yaratiladi
    |
    | Production da TRUE bo'lishi SHART! (1M user uchun)
    |
    */

    'queue_connection_name' => env('QUEUE_CONNECTION', 'database'),

    // Bo'sh qiymat = default navbat. Systemd worker (`queue:work redis`) faqat
    // default navbatni o'qiydi — alohida nom berilsa, worker'ga --queue=default,<nom>
    // qo'shilmaguncha konvertatsiya joblari ishlanmay qoladi.
    'queue_name' => env('MEDIA_QUEUE', ''),

    'generate_thumbnails_using_queue' => true,

    /*
    |--------------------------------------------------------------------------
    | URL GENERATOR — Faylga qanday havola yaratadi
    |--------------------------------------------------------------------------
    */

    'media_model' => Spatie\MediaLibrary\MediaCollections\Models\Media::class,

    /*
    |--------------------------------------------------------------------------
    | VERSION URLs — Cache-busting (rasm yangilanganda eski kesh yo'qoladi)
    |--------------------------------------------------------------------------
    |
    | Har bir media URL oxiriga ?v={updated_at} qo'shadi. Admin bannerning
    | rasmini yangilaganda media.updated_at o'zgaradi → URL o'zgaradi →
    | brauzer/telefon/Next image optimizer ESKI keshlangan rasmni emas,
    | YANGISINI oladi. Busiz: bir xil fayl nomi bilan almashtirilsa, URL
    | bir xil qoladi va qurilmalar 30 kungача eski rasmni ko'rsatadi.
    |
    */
    'version_urls' => true,

    /*
    |--------------------------------------------------------------------------
    | FILE REMOVER — Media o'chirilganda papkani to'liq tozalash
    |--------------------------------------------------------------------------
    |
    | DefaultFileRemover faqat fayllarni o'chiradi, papka qolishi mumkin.
    | ForceFileRemover butun papkani (conversions bilan) o'chiradi.
    |
    */

    'file_remover_class' => App\Services\ForceFileRemover::class,

    'use_default_collection_serialization' => false,

    'prefix' => '/media',

    /*
    |--------------------------------------------------------------------------
    | RESPONSIVE IMAGES — Har xil ekran uchun
    |--------------------------------------------------------------------------
    |
    | Telefon uchun kichik, kompyuter uchun katta rasm beradi
    | 1M user uchun MUHIM — traffic tejaydi
    |
    */

    'responsive_images' => [
        'use_tiny_placeholders' => true,  // Blur placeholder (instant ko'rinadi)
        'tiny_placeholder_generator' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | FAYL NOMINI TOZALASH
    |--------------------------------------------------------------------------
    */

    'file_namer' => Spatie\MediaLibrary\Support\FileNamer\DefaultFileNamer::class,

    'path_generator' => App\Services\MediaPathGenerator::class,

    /*
    |--------------------------------------------------------------------------
    | IMAGE OPTIMIZATION
    |--------------------------------------------------------------------------
    |
    | Rasmlarni avtomatik siqadi (hajmi 30-70% kamayadi, sifat saqlanadi)
    |
    */

    'image_optimizers' => [
        Spatie\ImageOptimizer\Optimizers\Jpegoptim::class => [
            '-m85',           // sifat 85%
            '--strip-all',    // metadata o'chirish
            '--all-progressive',
        ],
        Spatie\ImageOptimizer\Optimizers\Pngquant::class => [
            '--quality=85',
            '--force',
        ],
        Spatie\ImageOptimizer\Optimizers\Optipng::class => [
            '-i0',
            '-o2',
            '-quiet',
        ],
        Spatie\ImageOptimizer\Optimizers\Svgo::class => [
            '--disable=cleanupIDs',
        ],
        Spatie\ImageOptimizer\Optimizers\Gifsicle::class => [
            '-b',
            '-O3',
        ],
        Spatie\ImageOptimizer\Optimizers\Cwebp::class => [
            '-m 6',
            '-pass 10',
            '-mt',
            '-q 80',
        ],
        Spatie\ImageOptimizer\Optimizers\Avifenc::class => [
            '-a cq-level=23',
            '-j all',
            '--min 0',
            '--max 63',
            '--minalpha 0',
            '--maxalpha 63',
            '-a end-usage=q',
            '-a tune=ssim',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | IMAGE DRIVER
    |--------------------------------------------------------------------------
    */

    'image_driver' => env('IMAGE_DRIVER', 'gd'),

    /*
    |--------------------------------------------------------------------------
    | TEMPORARY UPLOAD — chunked upload uchun
    |--------------------------------------------------------------------------
    */

    'temporary_upload' => [
        'disk' => 'local',
        'directory' => 'temp-media-uploads',
    ],

    /*
    |--------------------------------------------------------------------------
    | JOBS — Konversiya ishlari
    |--------------------------------------------------------------------------
    */

    'jobs' => [
        'perform_conversions' => Spatie\MediaLibrary\Conversions\Jobs\PerformConversionsJob::class,
        'generate_responsive_images' => Spatie\MediaLibrary\ResponsiveImages\Jobs\GenerateResponsiveImagesJob::class,
    ],
];
