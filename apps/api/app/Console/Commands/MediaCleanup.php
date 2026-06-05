<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ============================================================
 * MEDIA CLEANUP COMMAND
 * ============================================================
 *
 * Server diskini tozalash:
 * 1. Yetim fayllar (DB da yo'q, diskda bor) — o'chirish
 * 2. Yetim papkalar (bo'sh papkalar) — o'chirish
 * 3. Temp fayllar (24+ soat oldingi) — o'chirish
 * 4. Soft-deleted modellar medialari (90+ kun) — o'chirish
 *
 * Ishlatish:
 *   php artisan media:cleanup              — quruq rejim (o'chirmaydi)
 *   php artisan media:cleanup --force      — haqiqiy o'chirish
 *   php artisan media:cleanup --days=30    — 30 kundan eski soft-deleted
 *
 * Cron:
 *   Har hafta: php artisan media:cleanup --force
 *
 * ============================================================
 */
class MediaCleanup extends Command
{
    protected $signature = 'media:cleanup
                            {--force : Haqiqiy o\'chirish (quruq rejim o\'rniga)}
                            {--days=90 : Soft-deleted fayllar uchun kun chegarasi}';

    protected $description = 'Yetim media fayllar, bo\'sh papkalar va eskirgan temp fayllarni tozalash';

    private int $orphanedFiles = 0;

    private int $emptyDirs = 0;

    private int $tempFiles = 0;

    private int $expiredMedia = 0;

    private int $freedBytes = 0;

    public function handle(): int
    {
        $isDryRun = ! $this->option('force');
        $days = (int) $this->option('days');

        $this->info('');
        $this->info('=== MEDIA CLEANUP ===');
        $this->info($isDryRun ? '🔍 QURUQ REJIM (--force bilan haqiqiy o\'chirish)' : '🗑️  HAQIQIY O\'CHIRISH REJIMI');
        $this->info('');

        $this->cleanOrphanedFiles($isDryRun);
        $this->cleanTempFiles($isDryRun);
        $this->cleanExpiredSoftDeleted($isDryRun, $days);
        $this->cleanEmptyDirectories($isDryRun);

        $this->info('');
        $this->info('=== NATIJA ===');
        $this->table(
            ['Turi', 'Soni', 'Hajmi'],
            [
                ['Yetim fayllar', $this->orphanedFiles, $this->humanSize($this->freedBytes)],
                ['Temp fayllar', $this->tempFiles, '-'],
                ['Eskirgan media', $this->expiredMedia, '-'],
                ['Bo\'sh papkalar', $this->emptyDirs, '-'],
            ]
        );

        if ($isDryRun && ($this->orphanedFiles + $this->tempFiles + $this->expiredMedia) > 0) {
            $this->warn('⚠️  O\'chirish uchun --force qo\'shing: php artisan media:cleanup --force');
        }

        return self::SUCCESS;
    }

    /**
     * DB da yo'q lekin diskda bor fayllar
     *
     * Ikkala strukturani tekshiradi:
     * 1. ESKI: media/{id}/filename.ext
     * 2. YANGI: news/{model_id}/collection/filename.ext
     */
    private function cleanOrphanedFiles(bool $isDryRun): void
    {
        $this->info('1. Yetim fayllar tekshirilmoqda...');

        $disk = Storage::disk('public');

        // DB dagi barcha media file_name larni (yo'l bilan) olish
        $dbMediaPaths = [];
        Media::select('id', 'model_type', 'model_id', 'collection_name', 'file_name', 'disk')
            ->chunk(500, function ($medias) use (&$dbMediaPaths) {
                foreach ($medias as $media) {
                    try {
                        // Spatie getPath() bilan to'liq yo'l olish
                        $relativePath = $media->getPathRelativeToRoot();
                        $dbMediaPaths[$relativePath] = $media->id;
                    } catch (\Throwable $e) {
                        // Model o'chirilgan bo'lishi mumkin
                    }
                }
            });

        // Yangi PathGenerator papkalarini tekshirish
        $modelFolders = [
            'news', 'pages', 'staff', 'departments', 'banners', 'directions',
            'faculties', 'library', 'journal', 'partners', 'testimonials',
            'students', 'contacts', 'site', 'site-contents',
        ];

        // ESKI media/{id}/ formatni tekshirish
        if ($disk->exists('media')) {
            $allFiles = $disk->allFiles('media');
            foreach ($allFiles as $file) {
                if (str_contains($file, '/conversions/') || str_contains($file, '/responsive/')) {
                    continue; // Konversiyalarni o'tkazib yuborish
                }

                if (! isset($dbMediaPaths[$file])) {
                    $this->processOrphanFile($disk, $file, $isDryRun);
                }
            }
        }

        // YANGI model/id/collection/ formatni tekshirish
        foreach ($modelFolders as $folder) {
            if (! $disk->exists($folder)) {
                continue;
            }

            $allFiles = $disk->allFiles($folder);
            foreach ($allFiles as $file) {
                if (str_contains($file, '/conversions/') || str_contains($file, '/responsive/')) {
                    continue;
                }
                if (basename($file) === '.gitkeep') {
                    continue;
                }

                if (! isset($dbMediaPaths[$file])) {
                    $this->processOrphanFile($disk, $file, $isDryRun);
                }
            }
        }

        $this->info("   Topildi: {$this->orphanedFiles} ta yetim fayl");
    }

    /**
     * Yetim faylni qayta ishlash
     */
    private function processOrphanFile($disk, string $file, bool $isDryRun): void
    {
        try {
            $size = $disk->size($file);
        } catch (\Throwable $e) {
            $size = 0;
        }

        $this->freedBytes += $size;
        $this->orphanedFiles++;

        if ($isDryRun) {
            $this->line("   [QURUQ] O'chiriladi: {$file} ({$this->humanSize($size)})");
        } else {
            $disk->delete($file);
            $this->line("   [O'CHIRILDI] {$file}");
        }
    }

    /**
     * 24 soatdan eski temp fayllar
     */
    private function cleanTempFiles(bool $isDryRun): void
    {
        $this->info('2. Temp fayllar tekshirilmoqda...');

        $disk = Storage::disk('local');
        $tempPaths = ['temp', 'temp-media-uploads'];
        $cutoff = now()->subHours(24)->getTimestamp();

        foreach ($tempPaths as $tempPath) {
            if (! $disk->exists($tempPath)) {
                continue;
            }

            foreach ($disk->allFiles($tempPath) as $file) {
                if ($disk->lastModified($file) < $cutoff) {
                    $this->tempFiles++;
                    if (! $isDryRun) {
                        $disk->delete($file);
                    }
                }
            }
        }

        $this->info("   Topildi: {$this->tempFiles} ta eski temp fayl");
    }

    /**
     * Soft-deleted modellarning N kundan eski medialari
     */
    private function cleanExpiredSoftDeleted(bool $isDryRun, int $days): void
    {
        $this->info("3. {$days} kundan eski soft-deleted media tekshirilmoqda...");

        $cutoff = now()->subDays($days);

        // Soft-deleted modellar bilan bog'liq medialar
        $modelsWithSoftDelete = [
            'App\Models\News', 'App\Models\Page', 'App\Models\Staff',
            'App\Models\Department', 'App\Models\Banner', 'App\Models\Direction',
            'App\Models\Faculty', 'App\Models\Partner', 'App\Models\Testimonial',
            'App\Models\JobApplication', 'App\Models\JournalIssue',
            'App\Models\LibraryResource', 'App\Models\TalentedStudent',
            'App\Models\StudentLifePhoto', 'App\Models\ContactMessage',
        ];

        foreach ($modelsWithSoftDelete as $modelClass) {
            if (! class_exists($modelClass)) {
                continue;
            }

            $deletedIds = $modelClass::onlyTrashed()
                ->where('deleted_at', '<', $cutoff)
                ->pluck('id')
                ->toArray();

            if (empty($deletedIds)) {
                continue;
            }

            $orphanedMedia = Media::where('model_type', $modelClass)
                ->whereIn('model_id', $deletedIds)
                ->get();

            foreach ($orphanedMedia as $media) {
                $this->expiredMedia++;
                if (! $isDryRun) {
                    $media->delete();
                }
            }
        }

        $this->info("   Topildi: {$this->expiredMedia} ta eskirgan media");
    }

    /**
     * Bo'sh papkalarni tozalash
     */
    private function cleanEmptyDirectories(bool $isDryRun): void
    {
        $this->info('4. Bo\'sh papkalar tekshirilmoqda...');

        $mediaRoot = storage_path('app/public/media');
        if (! is_dir($mediaRoot)) {
            return;
        }

        $this->removeEmptyDirs($mediaRoot, $isDryRun);

        $this->info("   Topildi: {$this->emptyDirs} ta bo'sh papka");
    }

    private function removeEmptyDirs(string $path, bool $isDryRun): bool
    {
        if (! is_dir($path)) {
            return false;
        }

        $items = array_diff(scandir($path), ['.', '..']);
        $isEmpty = true;

        foreach ($items as $item) {
            $fullPath = $path.DIRECTORY_SEPARATOR.$item;
            if (is_dir($fullPath)) {
                if (! $this->removeEmptyDirs($fullPath, $isDryRun)) {
                    $isEmpty = false;
                }
            } else {
                $isEmpty = false;
            }
        }

        if ($isEmpty && $path !== storage_path('app/public/media')) {
            $this->emptyDirs++;
            if (! $isDryRun) {
                rmdir($path);
            }
        }

        return $isEmpty;
    }

    private function humanSize(int $bytes): string
    {
        if ($bytes < 1024) {
            return $bytes.' B';
        }
        if ($bytes < 1024 * 1024) {
            return round($bytes / 1024, 1).' KB';
        }
        if ($bytes < 1024 * 1024 * 1024) {
            return round($bytes / (1024 * 1024), 1).' MB';
        }

        return round($bytes / (1024 * 1024 * 1024), 2).' GB';
    }
}
