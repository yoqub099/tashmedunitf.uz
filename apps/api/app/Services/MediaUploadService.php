<?php

namespace App\Services;

use App\Traits\ConvertsToWebp;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ============================================================
 * MEDIA UPLOAD SERVICE — Pro Level for 1,000,000 Users
 * ============================================================
 *
 * Bu service barcha media fayllarni boshqaradi:
 * - Rasmlar (jpg, png, webp) → Auto WebP konversiya
 * - Videolar (mp4, webm) → Streaming ready
 * - Hujjatlar (pdf, doc, xls, ppt)
 * - Kitoblar (pdf) → Cover image generatsiya
 *
 * ISHLASH TARTIBI:
 * 1. Fayl serverga yuklanadi (PHP tmp folder)
 * 2. Validatsiya (hajm, tur, double-extension, SVG XSS)
 * 3. MIME-Extension cross-validation
 * 4. Fayl nomi tozalanadi (XSS, path traversal himoya)
 * 5. DB transaction ichida Spatie Media Library ga yoziladi
 * 6. Queue da konversiyalar boshlanadi (thumbnail, WebP)
 * 7. PostgreSQL ga metadata yoziladi (path, size, mime)
 *
 * XAVFSIZLIK:
 * - Fayl nomi sanitize qilinadi (XSS, path traversal)
 * - MIME type + extension cross-validation
 * - Double-extension attack himoyasi (shell.php.jpg)
 * - SVG fayllar XSS tekshiruvi (script, onload, iframe)
 * - Hajm cheklanadi (rasm 10MB, video 100MB, hujjat 100MB)
 * - PHP shell, executable fayllar BLOKLANGAN
 *
 * ============================================================
 */
class MediaUploadService
{
    use ConvertsToWebp;

    public function __construct(
        private readonly VirusScanner $virusScanner
    ) {}

    /**
     * Bir vaqtda yuklanadigan maksimal fayllar soni
     */
    public const MAX_BATCH_FILES = 50;

    // ========================================
    // FAYL TURLARI VA LIMITLARI
    // ========================================

    /**
     * Har bir fayl turi uchun MAKSIMAL HAJM (bytes)
     * Nginx client_max_body_size=100M va PHP upload_max_filesize=100M bilan mos
     *
     * Rasm:     10 MB  = 10,485,760 bytes
     * Hujjat:   100 MB = 104,857,600 bytes
     * Video:    100 MB = 104,857,600 bytes
     * Kitob:    100 MB = 104,857,600 bytes
     */
    public const FILE_LIMITS = [

        // ========================================
        // 1. IMAGE — Rasmlar
        // ========================================
        'image' => [
            'max_size' => 10 * 1024 * 1024, // 10 MB
            'mimes' => [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/svg+xml',
                'image/gif',
                'image/avif',
                'image/bmp',
                'image/tiff',
                'image/x-icon',
                'image/vnd.microsoft.icon',
            ],
            'extensions' => ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'avif', 'bmp', 'tiff', 'ico'],
        ],

        // ========================================
        // 2. VIDEO — Videolar
        // ========================================
        'video' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB (Nginx/PHP limit bilan mos)
            'mimes' => [
                'video/mp4',
                'video/webm',
                'video/mpeg',
                'video/quicktime',  // .mov
                'video/x-msvideo',  // .avi
                'video/x-matroska', // .mkv
                'video/3gpp',       // .3gp (mobil)
                'video/x-flv',      // .flv
            ],
            'extensions' => ['mp4', 'webm', 'mpeg', 'mov', 'avi', 'mkv', '3gp', 'flv'],
        ],

        // ========================================
        // 3. DOCUMENT — Hujjatlar
        // ========================================
        'document' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB
            'mimes' => [
                'application/pdf',
                // Word
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                // Excel
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                // PowerPoint
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                // Text
                'text/plain',
                'text/csv',
                'text/rtf',
                'application/rtf',
            ],
            'extensions' => ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv', 'rtf'],
        ],

        // ========================================
        // 4. BOOK — Elektron kitoblar
        // ========================================
        'book' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB (Nginx/PHP limit bilan mos)
            'mimes' => [
                'application/pdf',
                'application/epub+zip',          // .epub
                'application/x-mobipocket-ebook', // .mobi
                'application/x-fictionbook+xml',  // .fb2
                'application/x-cbz',              // .cbz (komiks)
            ],
            'extensions' => ['pdf', 'epub', 'mobi', 'fb2', 'cbz', 'djvu'],
        ],

        // ========================================
        // 5. AUDIO — Audio fayllar
        // ========================================
        'audio' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB
            'mimes' => [
                'audio/mpeg',        // .mp3
                'audio/wav',         // .wav
                'audio/x-wav',
                'audio/ogg',         // .ogg
                'audio/aac',         // .aac
                'audio/flac',        // .flac (lossless)
                'audio/mp4',         // .m4a
                'audio/webm',        // .weba
                'audio/x-m4a',
            ],
            'extensions' => ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a', 'weba'],
        ],

        // ========================================
        // 6. ARCHIVE — Arxiv fayllar
        // ========================================
        'archive' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB (Nginx/PHP limit bilan mos)
            'mimes' => [
                'application/zip',
                'application/x-zip-compressed',
                'application/x-rar-compressed',
                'application/vnd.rar',
                'application/x-7z-compressed',
                'application/gzip',
                'application/x-tar',
                'application/x-bzip2',
            ],
            'extensions' => ['zip', 'rar', '7z', 'gz', 'tar', 'bz2', 'tar.gz'],
        ],

        // ========================================
        // 7. PRESENTATION — Taqdimotlar
        // ========================================
        'presentation' => [
            'max_size' => 100 * 1024 * 1024, // 100 MB (Nginx/PHP limit bilan mos)
            'mimes' => [
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'application/vnd.oasis.opendocument.presentation', // .odp
            ],
            'extensions' => ['ppt', 'pptx', 'odp'],
        ],

        // ========================================
        // 8. SPREADSHEET — Jadvallar
        // ========================================
        'spreadsheet' => [
            'max_size' => 50 * 1024 * 1024, // 50 MB
            'mimes' => [
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.oasis.opendocument.spreadsheet', // .ods
                'text/csv',
            ],
            'extensions' => ['xls', 'xlsx', 'ods', 'csv'],
        ],
    ];

    /**
     * XAVFLI fayl kengaytmalari — BLOKLANGAN!
     * PHP shell, executable fayllar yuklash mumkin EMAS
     */
    private const BLOCKED_EXTENSIONS = [
        'php', 'phtml', 'php3', 'php4', 'php5', 'php7', 'php8', 'phps',
        'exe', 'bat', 'cmd', 'sh', 'bash', 'cgi', 'pl', 'py', 'rb',
        'jar', 'war', 'jsp', 'jspx', 'asp', 'aspx', 'htaccess', 'htpasswd',
        'com', 'scr', 'msi', 'dll', 'vbs', 'vbe', 'wsf', 'wsh', 'ps1',
    ];

    /**
     * SVG ichida BLOKLANGAN teglar (XSS himoya)
     */
    private const SVG_BLOCKED_TAGS = [
        'script', 'iframe', 'object', 'embed', 'applet', 'form',
        'input', 'textarea', 'button', 'select', 'link', 'meta',
    ];

    /**
     * SVG ichida BLOKLANGAN attributlar (XSS himoya)
     */
    private const SVG_BLOCKED_ATTRIBUTES = [
        'onload', 'onerror', 'onclick', 'onmouseover', 'onmouseout',
        'onfocus', 'onblur', 'onsubmit', 'onreset', 'onchange',
        'onkeydown', 'onkeyup', 'onkeypress', 'onabort', 'onresize',
    ];

    // ========================================
    // ASOSIY YUKLASH METODI
    // ========================================

    /**
     * Bitta faylni modelga yuklash
     *
     * @param  HasMedia  $model  — Qaysi modelga (News, Staff, Department...)
     * @param  UploadedFile  $file  — Yuklangan fayl
     * @param  string  $collection  — Collection nomi ('thumbnail', 'gallery', 'photo'...)
     * @param  array  $properties  — Qo'shimcha xususiyatlar (custom_properties)
     * @return Media — Yaratilgan media record
     *
     * @throws \InvalidArgumentException — Fayl noto'g'ri bo'lsa
     *
     * Misol:
     *   $media = $this->uploadFile($news, $request->file('image'), 'thumbnail');
     *   // Natija: storage/app/public/1/yangilik.webp
     *   // URL:    https://tdtutf.uz/storage/1/yangilik.webp
     */
    public function uploadFile(
        HasMedia $model,
        UploadedFile $file,
        string $collection = 'default',
        array $properties = [],
        ?string $diskName = null
    ): Media {
        // 0. FAYL YAROQLILIGINI TEKSHIRISH
        if (! $file->isValid()) {
            throw new \InvalidArgumentException(
                "Fayl yaroqsiz: {$file->getErrorMessage()}"
            );
        }

        // 1. XAVFSIZLIK TEKSHIRUVI (MIME + extension + hajm + SVG + double-ext)
        $fileType = $this->getFileType($file);
        $this->validateFile($file, $fileType);

        // 1.5. VIRUS TEKSHIRUVI (config bilan yoqiladi; default o'chiq — ClamAV)
        $this->virusScanner->scan((string) $file->getRealPath());

        // 2. FAYL NOMINI TOZALASH (xavfsiz nom)
        $sanitizedName = $this->sanitizeFileName($file->getClientOriginalName());

        // 2.5. RASMNI WEBP GA CONVERT QILISH (jpg/png → webp)
        if ($fileType === 'image' && $file->getMimeType() !== 'image/svg+xml') {
            $file = $this->convertToWebp($file, 1920);
            $sanitizedName = pathinfo($sanitizedName, PATHINFO_FILENAME).'.webp';
        }

        // 3. DB TRANSACTION ICHIDA YUKLASH
        return DB::transaction(function () use ($model, $file, $sanitizedName, $collection, $properties, $diskName) {
            // 4. FAYLNI YUKLASH (Spatie Media Library)
            $mediaAdder = $model
                ->addMedia($file)
                ->usingFileName($sanitizedName)
                ->usingName(pathinfo($sanitizedName, PATHINFO_FILENAME));

            // 5. CUSTOM PROPERTIES QO'SHISH (opsional)
            if (! empty($properties)) {
                $mediaAdder->withCustomProperties($properties);
            }

            // 6. MEDIA COLLECTION GA SAQLASH ('' = collection o'zi belgilagan disk)
            $media = $mediaAdder->toMediaCollection($collection, $diskName ?? '');

            // 7. LOG YOZISH (media obyektidan o'lchov olish — temp fayl endi ko'chirilgan)
            Log::info('Media uploaded', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'collection' => $collection,
                'file_name' => $media->file_name,
                'size' => $media->size,
                'mime' => $media->mime_type,
            ]);

            return $media;
        });
    }

    /**
     * Ko'p fayllarni bir vaqtda yuklash (gallery, documents)
     *
     * @param  HasMedia  $model  — Qaysi model
     * @param  array  $files  — UploadedFile[] massivi
     * @param  string  $collection  — Collection nomi
     * @param  int  $maxFiles  — Maksimal fayllar soni (himoya)
     * @return array{uploaded: Media[], errors: array} — Natijalar va xatoliklar
     *
     * Misol:
     *   $result = $this->uploadMultiple($news, $request->file('gallery'), 'gallery');
     *   // $result['uploaded'] — muvaffaqiyatli yuklangan fayllar
     *   // $result['errors']   — xatolar ro'yxati
     */
    public function uploadMultiple(
        HasMedia $model,
        array $files,
        string $collection = 'default',
        int $maxFiles = self::MAX_BATCH_FILES,
        ?string $diskName = null
    ): array {
        if (count($files) > $maxFiles) {
            throw new \InvalidArgumentException(
                "Bir vaqtda maksimal {$maxFiles} fayl yuklash mumkin. Berilgan: ".count($files)
            );
        }

        $uploaded = [];
        $errors = [];

        foreach ($files as $index => $file) {
            if (! $file instanceof UploadedFile) {
                $errors[] = ['index' => $index, 'error' => 'UploadedFile emas'];

                continue;
            }

            if (! $file->isValid()) {
                $errors[] = ['index' => $index, 'error' => $file->getErrorMessage()];

                continue;
            }

            try {
                $uploaded[] = $this->uploadFile($model, $file, $collection, [], $diskName);
            } catch (\Throwable $e) {
                $errors[] = [
                    'index' => $index,
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ];
                Log::warning('uploadMultiple: file failed', [
                    'index' => $index,
                    'file' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return ['uploaded' => $uploaded, 'errors' => $errors];
    }

    // ========================================
    // YANGILASH VA O'CHIRISH
    // ========================================

    /**
     * Media faylni yangilash (eskisini o'chiradi, yangisini qo'yadi)
     *
     * Eski collectionni DB transaction ichida tozalab, yangi faylni qo'yadi
     *
     * Misol:
     *   $this->replaceFile($news, $request->file('image'), 'thumbnail');
     */
    public function replaceFile(
        HasMedia $model,
        UploadedFile $file,
        string $collection = 'default'
    ): Media {
        return DB::transaction(function () use ($model, $file, $collection) {
            // Eski medialarni o'chirish
            $model->clearMediaCollection($collection);

            return $this->uploadFile($model, $file, $collection);
        });
    }

    /**
     * Bitta media faylni o'chirish
     *
     * @throws \Illuminate\Database\Eloquent\ModelNotFoundException
     */
    public function deleteMedia(int $mediaId): bool
    {
        $media = Media::findOrFail($mediaId);
        $modelType = $media->model_type;

        DB::transaction(function () use ($media, $mediaId) {
            $media->delete();

            Log::info('Media deleted', [
                'media_id' => $mediaId,
                'file_name' => $media->file_name,
                'size' => $media->size,
            ]);
        });

        // Media o'chirilganda tegishli model keshini tozalash
        $prefixMap = [
            'App\\Models\\Page' => [CacheService::PREFIX_PAGES, CacheService::PREFIX_NAV],
            'App\\Models\\News' => [CacheService::PREFIX_NEWS],
            'App\\Models\\Department' => [CacheService::PREFIX_DEPARTMENTS],
            'App\\Models\\Staff' => [CacheService::PREFIX_STAFF],
            'App\\Models\\Direction' => [CacheService::PREFIX_DIRECTIONS],
            'App\\Models\\Banner' => [CacheService::PREFIX_BANNERS],
            'App\\Models\\Partner' => [CacheService::PREFIX_PARTNERS],
        ];

        foreach ($prefixMap[$modelType] ?? [] as $prefix) {
            CacheService::clearModel($prefix);
        }

        return true;
    }

    /**
     * Modelning barcha medialarini o'chirish
     */
    public function deleteAllMedia(HasMedia $model, ?string $collection = null): bool
    {
        DB::transaction(function () use ($model, $collection) {
            if ($collection) {
                $model->clearMediaCollection($collection);
            } else {
                $model->clearMediaCollection();
            }

            Log::info('All media cleared', [
                'model' => get_class($model),
                'model_id' => $model->id,
                'collection' => $collection ?? 'all',
            ]);
        });

        return true;
    }

    // ========================================
    // URL VA MA'LUMOT OLISH
    // ========================================

    /**
     * Media URL olish (konversiya bilan)
     *
     * Misol:
     *   $url = $this->getMediaUrl($news, 'thumbnail', 'medium');
     *   // → https://tdtutf.uz/storage/1/conversions/yangilik-medium.webp
     *
     * @param  HasMedia&InteractsWithMedia  $model
     */
    public function getMediaUrl(HasMedia $model, string $collection, ?string $conversion = null): ?string
    {
        /** @var HasMedia&InteractsWithMedia $model */
        $media = $model->getFirstMedia($collection);

        if (! $media) {
            return null;
        }

        if ($conversion && $media->hasGeneratedConversion($conversion)) {
            return $media->getUrl($conversion);
        }

        return $media->getUrl();
    }

    /**
     * Barcha media URL larini olish (collection bo'yicha)
     *
     * @return array — [{id, url, thumbnail_url, name, size, mime}]
     */
    public function getMediaUrls(HasMedia $model, string $collection, ?string $conversion = null): array
    {
        return $model->getMedia($collection)->map(function (Media $media) use ($conversion) {
            $data = [
                'id' => $media->id,
                'uuid' => $media->uuid,
                'name' => $media->name,
                'file_name' => $media->file_name,
                'mime_type' => $media->mime_type,
                'size' => $media->size,
                'human_size' => $this->humanFileSize((int) ($media->size ?? 0)),
                'url' => $media->getUrl(),
                'created_at' => $media->created_at?->toISOString(),
            ];

            // Konversiya URL lari (agar mavjud)
            foreach (['thumbnail', 'medium', 'large'] as $conversionName) {
                if ($media->hasGeneratedConversion($conversionName)) {
                    $data["{$conversionName}_url"] = $media->getUrl($conversionName);
                }
            }

            if ($conversion && $media->hasGeneratedConversion($conversion)) {
                $data['conversion_url'] = $media->getUrl($conversion);
            }

            return $data;
        })->toArray();
    }

    // ========================================
    // VALIDATSIYA VA XAVFSIZLIK
    // ========================================

    /**
     * Fayl validatsiyasi:
     * 1. Extension bo'sh emasligini tekshirish
     * 2. Extension bloklangan emasligini tekshirish
     * 3. Double-extension attack himoyasi
     * 4. MIME type ruxsat berilganligini tekshirish
     * 5. MIME-Extension cross-validation
     * 6. Hajm limitdan oshmaganligini tekshirish
     * 7. SVG XSS tekshiruvi
     *
     * @throws \InvalidArgumentException
     */
    public function validateFile(UploadedFile $file, string $type = 'image'): void
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $originalName = $file->getClientOriginalName();

        // 1. BO'SH EXTENSION TEKSHIRUVI
        if (empty($extension)) {
            throw new \InvalidArgumentException(
                "Fayl kengaytmasi topilmadi: {$originalName}"
            );
        }

        // 2. BLOKLANGAN EXTENSION
        if (in_array($extension, self::BLOCKED_EXTENSIONS, true)) {
            Log::warning('Blocked file upload attempt', [
                'file' => $originalName,
                'extension' => $extension,
                'ip' => request()->ip(),
            ]);
            throw new \InvalidArgumentException(
                "Xavfli fayl turi: .{$extension} — yuklab bo'lmaydi!"
            );
        }

        // 3. DOUBLE-EXTENSION ATTACK HIMOYASI (shell.php.jpg, virus.exe.pdf)
        $this->checkDoubleExtension($originalName);

        // 4. MIME TYPE TEKSHIRUVI
        $limits = self::FILE_LIMITS[$type] ?? self::FILE_LIMITS['image'];
        $mime = $file->getMimeType();

        if (! in_array($mime, $limits['mimes'], true)) {
            $allowed = implode(', ', $limits['extensions']);
            throw new \InvalidArgumentException(
                "Noto'g'ri fayl turi: {$mime}. Ruxsat berilgan: {$allowed}"
            );
        }

        // 5. MIME-EXTENSION CROSS-VALIDATION
        if (! in_array($extension, $limits['extensions'], true)) {
            throw new \InvalidArgumentException(
                "Extension '.{$extension}' bu fayl turi uchun ruxsat berilmagan"
            );
        }

        // 6. HAJM TEKSHIRUVI
        $fileSize = $file->getSize();
        if ($fileSize === false || $fileSize > $limits['max_size']) {
            $maxMb = $limits['max_size'] / (1024 * 1024);
            $fileMb = $fileSize !== false ? round($fileSize / (1024 * 1024), 2) : '?';
            throw new \InvalidArgumentException(
                "Fayl juda katta: {$fileMb}MB. Maksimal: {$maxMb}MB"
            );
        }

        // 7. SVG XSS TEKSHIRUVI
        if ($mime === 'image/svg+xml') {
            $this->validateSvgContent($file);
        }
    }

    /**
     * Double-extension attack tekshiruvi
     *
     * "shell.php.jpg"  → BLOKLANGAN (php topildi)
     * "virus.exe.pdf"  → BLOKLANGAN (exe topildi)
     * "rasm.2024.jpg"  → OK (son — xavfsiz)
     *
     * @throws \InvalidArgumentException
     */
    private function checkDoubleExtension(string $fileName): void
    {
        $parts = explode('.', strtolower($fileName));

        // Kamida 3 qism bo'lsa tekshiramiz (name.hidden.ext)
        if (count($parts) < 3) {
            return;
        }

        // Oxirgi extensionni olib tashlaymiz, qolganlarini tekshiramiz
        array_pop($parts);   // Haqiqiy extension
        array_shift($parts); // Fayl nomi

        foreach ($parts as $part) {
            if (in_array($part, self::BLOCKED_EXTENSIONS, true)) {
                Log::warning('Double-extension attack detected', [
                    'file' => $fileName,
                    'hidden_ext' => $part,
                    'ip' => request()->ip(),
                ]);
                throw new \InvalidArgumentException(
                    "Xavfli fayl nomi: yashirin '.{$part}' kengaytma topildi!"
                );
            }
        }
    }

    /**
     * SVG fayl ichidagi XSS elementlarni tekshirish
     *
     * SVG XML formatida bo'lgani uchun ichida <script>, onload= kabi
     * xavfli kodlar bo'lishi mumkin. Bu metod ularni bloklaydi.
     *
     * @throws \InvalidArgumentException
     */
    private function validateSvgContent(UploadedFile $file): void
    {
        $content = file_get_contents($file->getPathname());

        if ($content === false) {
            throw new \InvalidArgumentException('SVG fayl o\'qib bo\'lmadi');
        }

        $contentLower = strtolower($content);

        // Bloklangan teglarni tekshirish
        foreach (self::SVG_BLOCKED_TAGS as $tag) {
            if (preg_match('/<\s*'.preg_quote($tag, '/').'[\s>\/]/i', $content)) {
                Log::warning('SVG XSS attack blocked', [
                    'file' => $file->getClientOriginalName(),
                    'blocked_tag' => $tag,
                    'ip' => request()->ip(),
                ]);
                throw new \InvalidArgumentException(
                    "SVG faylda xavfli <{$tag}> tegi topildi — yuklash taqiqlangan!"
                );
            }
        }

        // Bloklangan attributlarni tekshirish
        foreach (self::SVG_BLOCKED_ATTRIBUTES as $attr) {
            if (str_contains($contentLower, $attr.'=')) {
                Log::warning('SVG XSS attribute blocked', [
                    'file' => $file->getClientOriginalName(),
                    'blocked_attr' => $attr,
                    'ip' => request()->ip(),
                ]);
                throw new \InvalidArgumentException(
                    "SVG faylda xavfli '{$attr}' attribut topildi — yuklash taqiqlangan!"
                );
            }
        }

        // javascript: URL sxemasini tekshirish
        if (preg_match('/javascript\s*:/i', $content) || preg_match('/data\s*:\s*text\/html/i', $content)) {
            Log::warning('SVG javascript: URL blocked', [
                'file' => $file->getClientOriginalName(),
                'ip' => request()->ip(),
            ]);
            throw new \InvalidArgumentException(
                'SVG faylda xavfli javascript: yoki data: URL topildi!'
            );
        }
    }

    /**
     * Fayl nomini tozalash (xavfsizlik)
     *
     * "../../etc/passwd"     → "etcpasswd-Abc12345.bin"
     * "rasm <script>.jpg"    → "rasm-script-Abc12345.jpg"
     * "foto 2024 (1).png"    → "foto-2024-1-Abc12345.png"
     * ""                     → "file-Abc12345.bin"
     */
    public function sanitizeFileName(string $fileName): string
    {
        // Extension ajratish
        $extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $name = pathinfo($fileName, PATHINFO_FILENAME);

        // Bo'sh extension uchun himoya
        if (empty($extension)) {
            $extension = 'bin';
        }

        // Xavfli belgilarni olib tashlash (faqat harf, raqam, bo'sh joy, tire, pastki chiziq)
        $name = preg_replace('/[^\p{L}\p{N}\s\-_]/u', '', $name) ?? '';
        $name = preg_replace('/[\s]+/', '-', $name) ?? '';
        $name = preg_replace('/[-]+/', '-', $name) ?? '';
        $name = trim($name, '-');

        // Bo'sh bo'lib qolsa, tasodifiy nom
        if (empty($name)) {
            $name = 'file';
        }

        // Uzunlikni cheklash (filesystem limit, extension uchun joy qoldirish)
        $maxNameLength = 200 - strlen($extension);
        $name = Str::limit($name, max($maxNameLength, 10), '');

        // Unikal qilish (bir xil nomli fayllar uchun)
        $name = $name.'-'.Str::random(8);

        return $name.'.'.$extension;
    }

    /**
     * Fayl turini aniqlash (MIME type + extension bo'yicha)
     */
    public function getFileType(UploadedFile $file): string
    {
        $mime = $file->getMimeType() ?? '';
        $extension = strtolower($file->getClientOriginalExtension());

        // MIME type bo'yicha aniqlash
        if (Str::startsWith($mime, 'image/')) {
            return 'image';
        }

        if (Str::startsWith($mime, 'video/')) {
            return 'video';
        }

        if (Str::startsWith($mime, 'audio/')) {
            return 'audio';
        }

        // Archive
        if (in_array($mime, self::FILE_LIMITS['archive']['mimes'], true)
            || in_array($extension, ['zip', 'rar', '7z', 'gz', 'tar', 'bz2'], true)) {
            return 'archive';
        }

        // Book
        if (in_array($mime, self::FILE_LIMITS['book']['mimes'], true)
            || in_array($extension, ['epub', 'mobi', 'fb2', 'cbz', 'djvu'], true)) {
            return 'book';
        }

        // Presentation
        if (in_array($mime, self::FILE_LIMITS['presentation']['mimes'], true)
            || in_array($extension, ['ppt', 'pptx', 'odp'], true)) {
            return 'presentation';
        }

        // Spreadsheet
        if (in_array($mime, self::FILE_LIMITS['spreadsheet']['mimes'], true)
            || in_array($extension, ['xls', 'xlsx', 'ods'], true)) {
            return 'spreadsheet';
        }

        // Document (default)
        return 'document';
    }

    // ========================================
    // YORDAMCHI METODLAR
    // ========================================

    /**
     * Fayl hajmini odam tushunadigan formatda ko'rsatish
     *
     * 1024      → "1 KB"
     * 1048576   → "1 MB"
     * 524288000 → "500 MB"
     */
    public function humanFileSize(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        if ($bytes <= 0) {
            return '0 B';
        }

        $pow = floor(log($bytes) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision).' '.$units[(int) $pow];
    }

    /**
     * Disk ishlatilgan joyni tekshirish
     *
     * @return array — [total, used, free, percent_used]
     */
    public function getDiskUsage(): array
    {
        $storagePath = storage_path('app/public');

        if (! is_dir($storagePath)) {
            @mkdir($storagePath, 0755, true);
        }

        $total = disk_total_space($storagePath);
        $free = disk_free_space($storagePath);

        if ($total === false || $free === false) {
            return [
                'total' => '0 B', 'used' => '0 B', 'free' => '0 B',
                'percent_used' => 0,
                'total_bytes' => 0, 'used_bytes' => 0, 'free_bytes' => 0,
            ];
        }

        $used = $total - $free;

        return [
            'total' => $this->humanFileSize((int) $total),
            'used' => $this->humanFileSize((int) $used),
            'free' => $this->humanFileSize((int) $free),
            'percent_used' => $total > 0 ? round(($used / $total) * 100, 2) : 0,
            'total_bytes' => $total,
            'used_bytes' => $used,
            'free_bytes' => $free,
        ];
    }

    /**
     * Media statistikasi
     *
     * @return array — Har bir tur bo'yicha soni va hajmi
     */
    public function getMediaStats(): array
    {
        $stats = Media::query()
            ->selectRaw("
                COUNT(*) as total_count,
                COALESCE(SUM(size), 0) as total_size,
                COUNT(CASE WHEN mime_type LIKE 'image/%' THEN 1 END) as image_count,
                COALESCE(SUM(CASE WHEN mime_type LIKE 'image/%' THEN size ELSE 0 END), 0) as image_size,
                COUNT(CASE WHEN mime_type LIKE 'video/%' THEN 1 END) as video_count,
                COALESCE(SUM(CASE WHEN mime_type LIKE 'video/%' THEN size ELSE 0 END), 0) as video_size,
                COUNT(CASE WHEN mime_type LIKE 'audio/%' THEN 1 END) as audio_count,
                COALESCE(SUM(CASE WHEN mime_type LIKE 'audio/%' THEN size ELSE 0 END), 0) as audio_size,
                COUNT(CASE WHEN mime_type = 'application/pdf' THEN 1 END) as pdf_count,
                COALESCE(SUM(CASE WHEN mime_type = 'application/pdf' THEN size ELSE 0 END), 0) as pdf_size,
                COUNT(CASE WHEN mime_type IN (
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'text/plain', 'text/csv', 'text/rtf', 'application/rtf'
                ) THEN 1 END) as doc_count,
                COALESCE(SUM(CASE WHEN mime_type IN (
                    'application/msword',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/vnd.ms-excel',
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'application/vnd.ms-powerpoint',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'text/plain', 'text/csv', 'text/rtf', 'application/rtf'
                ) THEN size ELSE 0 END), 0) as doc_size,
                COUNT(CASE WHEN mime_type IN (
                    'application/epub+zip', 'application/x-mobipocket-ebook',
                    'application/x-fictionbook+xml'
                ) THEN 1 END) as book_count,
                COALESCE(SUM(CASE WHEN mime_type IN (
                    'application/epub+zip', 'application/x-mobipocket-ebook',
                    'application/x-fictionbook+xml'
                ) THEN size ELSE 0 END), 0) as book_size,
                COUNT(CASE WHEN mime_type IN (
                    'application/zip', 'application/x-zip-compressed',
                    'application/x-rar-compressed', 'application/vnd.rar',
                    'application/x-7z-compressed', 'application/gzip'
                ) THEN 1 END) as archive_count,
                COALESCE(SUM(CASE WHEN mime_type IN (
                    'application/zip', 'application/x-zip-compressed',
                    'application/x-rar-compressed', 'application/vnd.rar',
                    'application/x-7z-compressed', 'application/gzip'
                ) THEN size ELSE 0 END), 0) as archive_size
            ")
            ->first();

        return [
            'total' => [
                'count' => (int) $stats->total_count,
                'size' => $this->humanFileSize((int) $stats->total_size),
            ],
            'images' => [
                'count' => (int) $stats->image_count,
                'size' => $this->humanFileSize((int) $stats->image_size),
            ],
            'videos' => [
                'count' => (int) $stats->video_count,
                'size' => $this->humanFileSize((int) $stats->video_size),
            ],
            'audio' => [
                'count' => (int) $stats->audio_count,
                'size' => $this->humanFileSize((int) $stats->audio_size),
            ],
            'pdfs' => [
                'count' => (int) $stats->pdf_count,
                'size' => $this->humanFileSize((int) $stats->pdf_size),
            ],
            'documents' => [
                'count' => (int) $stats->doc_count,
                'size' => $this->humanFileSize((int) $stats->doc_size),
            ],
            'books' => [
                'count' => (int) $stats->book_count,
                'size' => $this->humanFileSize((int) $stats->book_size),
            ],
            'archives' => [
                'count' => (int) $stats->archive_count,
                'size' => $this->humanFileSize((int) $stats->archive_size),
            ],
            'disk' => $this->getDiskUsage(),
        ];
    }

    /**
     * Eski/foydalanilmayotgan temp fayllarni tozalash
     * Cron job bilan har kuni ishlatiladi
     */
    public function cleanupTempFiles(int $hoursOld = 24): int
    {
        $tempPath = storage_path('app/temp');

        if (! is_dir($tempPath)) {
            return 0;
        }

        $deleted = 0;
        $cutoff = now()->subHours($hoursOld)->timestamp;

        try {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($tempPath, \FilesystemIterator::SKIP_DOTS)
            );

            foreach ($files as $file) {
                if ($file->isFile() && $file->getMTime() < $cutoff) {
                    if (@unlink($file->getPathname())) {
                        $deleted++;
                    } else {
                        Log::warning('Failed to delete temp file', [
                            'path' => $file->getPathname(),
                        ]);
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::error('Temp cleanup failed', ['error' => $e->getMessage()]);
        }

        if ($deleted > 0) {
            Log::info("Temp cleanup: {$deleted} files deleted");
        }

        return $deleted;
    }
}
