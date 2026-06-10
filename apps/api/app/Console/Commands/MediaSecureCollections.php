<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ============================================================
 * MEDIA SECURE COLLECTIONS — Maxfiy fayllarni private diskka ko'chirish
 * ============================================================
 *
 * config/media-security.php → private_collections asosida ishlaydi.
 * Ommaviy (public) diskdagi maxfiy collection fayllarini (CV, hujjat,
 * pasport...) MAXFIY ('local') diskka ko'chiradi va yo'lni normalizatsiya
 * qiladi: {model}/{id}/{collection}/{fayl}
 *
 * XAVFSIZLIK: avval NUSXALAYDI → hajmni TEKSHIRADI → keyin eskisini o'chiradi.
 * Xato bo'lsa asl fayl saqlanib qoladi.
 *
 *   php artisan media:secure-collections             # DRY-RUN (ko'rsatadi)
 *   php artisan media:secure-collections --execute   # haqiqiy ko'chirish
 *   php artisan media:secure-collections --model=Staff --execute
 * ============================================================
 */
class MediaSecureCollections extends Command
{
    protected $signature = 'media:secure-collections
                            {--execute : Haqiqiy ko\'chirish (default: dry-run)}
                            {--model= : Faqat bitta model (masalan: Staff)}';

    protected $description = 'Maxfiy collection fayllarini public diskdan local (maxfiy) diskka ko\'chiradi';

    private const TARGET_DISK = 'local';

    /** Model class → papka nomi (MediaPathGenerator bilan bir xil). */
    private const MODEL_FOLDERS = [
        'App\Models\News' => 'news',
        'App\Models\Page' => 'pages',
        'App\Models\Staff' => 'staff',
        'App\Models\Department' => 'departments',
        'App\Models\Banner' => 'banners',
        'App\Models\Direction' => 'directions',
        'App\Models\Faculty' => 'faculties',
        'App\Models\LibraryResource' => 'library',
        'App\Models\JournalIssue' => 'journal',
        'App\Models\Partner' => 'partners',
        'App\Models\Testimonial' => 'testimonials',
        'App\Models\TalentedStudent' => 'students/talented',
        'App\Models\StudentLifePhoto' => 'students/life',
        'App\Models\ContactMessage' => 'contacts',
        'App\Models\SiteMedia' => 'site',
        'App\Models\JobApplication' => 'jobs',
    ];

    private int $moved = 0;

    private int $alreadyPrivate = 0;

    private int $skipped = 0;

    private int $errors = 0;

    public function handle(): int
    {
        $execute = (bool) $this->option('execute');
        $modelFilter = $this->option('model');
        $publicDisks = config('media-security.public_disks', ['public', 'media']);
        $map = config('media-security.private_collections', []);

        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════╗');
        $this->info('║   MEDIA SECURE — public → local (maxfiy) disk     ║');
        $this->info('╚══════════════════════════════════════════════════╝');

        if (! $execute) {
            $this->warn('🔍 DRY-RUN — fayllar ko\'chirilmaydi (--execute bilan ishga tushiring)');
        }
        $this->newLine();

        foreach ($map as $modelClass => $collections) {
            if ($modelFilter && class_basename($modelClass) !== $modelFilter) {
                continue;
            }

            $folder = self::MODEL_FOLDERS[$modelClass] ?? null;
            if (! $folder) {
                $this->warn("⏭️  {$modelClass} — papka mappingida yo'q, o'tkazildi");

                continue;
            }

            $query = Media::query()->where('model_type', $modelClass);
            if (! in_array('*', $collections, true)) {
                $query->whereIn('collection_name', $collections);
            }

            foreach ($query->cursor() as $media) {
                $this->processMedia($media, $folder, $publicDisks, $execute);
            }
        }

        $this->newLine();
        $this->table(['Holat', 'Soni'], [
            [$execute ? '✅ Ko\'chirildi' : '• Ko\'chiriladi', $this->moved],
            ['🔒 Allaqachon maxfiy', $this->alreadyPrivate],
            ['⏭️  O\'tkazib yuborildi', $this->skipped],
            ['❌ Xatolar', $this->errors],
        ]);

        if (! $execute && $this->moved > 0) {
            $this->newLine();
            $this->warn("⚠️  {$this->moved} ta fayl ko'chirilishi kerak. --execute qo'shing.");
        }

        return $this->errors > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function processMedia(Media $media, string $folder, array $publicDisks, bool $execute): void
    {
        // Allaqachon maxfiy diskda — tegmaymiz
        if (! in_array($media->disk, $publicDisks, true)) {
            $this->alreadyPrivate++;

            return;
        }

        $srcDisk = Storage::disk($media->disk);
        $dstDisk = Storage::disk(self::TARGET_DISK);
        $srcRel = $media->getPathRelativeToRoot();

        if (! $srcDisk->exists($srcRel)) {
            $this->warn("  ⚠️  #{$media->id} fayl diskda topilmadi: {$srcRel}");
            $this->skipped++;

            return;
        }

        $collection = $media->collection_name ?: 'default';
        $newBase = "{$folder}/{$media->model_id}/{$collection}";
        $dstRel = "{$newBase}/{$media->file_name}";

        $this->line(sprintf(
            '  %s #%d [%s/%s]  %s → local:%s',
            $execute ? '🚚' : '•',
            $media->id,
            class_basename($media->model_type),
            $collection,
            $media->disk,
            $dstRel
        ));

        if (! $execute) {
            $this->moved++;

            return;
        }

        try {
            // 1. Asosiy faylni ko'chirish (stream)
            $this->copyFile($srcDisk, $srcRel, $dstDisk, $dstRel);

            // 2. VERIFIKATSIYA — mavjud + hajm mos
            if (! $dstDisk->exists($dstRel) || $dstDisk->size($dstRel) !== $srcDisk->size($srcRel)) {
                throw new \RuntimeException('Verifikatsiya muvaffaqiyatsiz — hajm mos kelmadi');
            }

            // 3. Conversions + responsive papkalarini ham ko'chirish
            $srcDir = dirname($srcRel);
            $this->copyDir($srcDisk, "{$srcDir}/conversions", $dstDisk, "{$newBase}/conversions");
            $this->copyDir($srcDisk, "{$srcDir}/responsive", $dstDisk, "{$newBase}/responsive");

            // 4. DB diskini yangilash (eventlarsiz)
            $media->disk = self::TARGET_DISK;
            if ($media->conversions_disk) {
                $media->conversions_disk = self::TARGET_DISK;
            }
            $media->saveQuietly();

            // 5. Eski (public) fayllarni o'chirish
            $srcDisk->delete($srcRel);
            if (empty($srcDisk->allFiles($srcDir))) {
                $srcDisk->deleteDirectory($srcDir);
            }

            $this->moved++;
        } catch (\Throwable $e) {
            $this->errors++;
            $this->error("  ❌ #{$media->id}: {$e->getMessage()}");
            Log::error('media:secure-collections error', [
                'media_id' => $media->id,
                'from' => "{$media->disk}:{$srcRel}",
                'to' => 'local:'.$dstRel,
                'error' => $e->getMessage(),
            ]);
        }
    }

    private function copyFile(Filesystem $srcDisk, string $src, Filesystem $dstDisk, string $dst): void
    {
        $stream = $srcDisk->readStream($src);
        if ($stream === null) {
            throw new \RuntimeException("Manba o'qib bo'lmadi: {$src}");
        }
        $dstDisk->writeStream($dst, $stream);
        if (is_resource($stream)) {
            fclose($stream);
        }
    }

    private function copyDir(Filesystem $srcDisk, string $srcDir, Filesystem $dstDisk, string $dstDir): void
    {
        if (! $srcDisk->exists($srcDir)) {
            return;
        }
        foreach ($srcDisk->files($srcDir) as $file) {
            $this->copyFile($srcDisk, $file, $dstDisk, $dstDir.'/'.basename($file));
        }
    }
}
