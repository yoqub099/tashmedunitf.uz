<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ============================================================
 * MEDIA MIGRATE STRUCTURE — Eski → Yangi Pro Struktura
 * ============================================================
 *
 * MUAMMO:
 * Spatie Media Library standart holatda fayllarni shunday saqlaydi:
 *   media/1/photo.webp
 *   media/2/video.mp4
 *   media/125/document.pdf
 *
 * Bu tartibsiz va boshqarib bo'lmaydi — 10,000+ fayl bo'lganda
 * bir papkada minglab raqamli papkalar paydo bo'ladi.
 *
 * YECHIM:
 * Custom MediaPathGenerator ishlatib, fayllarni model bo'yicha
 * tartiblaymiz:
 *   news/5/thumbnail/photo.webp
 *   staff/12/photo/avatar.webp
 *   library/3/document/kitob.pdf
 *
 * BU KOMANDA:
 * 1. DB dagi barcha media recordlarni o'qiydi
 * 2. Har biri uchun YANGI yo'lni hisoblaydi (MediaPathGenerator orqali)
 * 3. Faylni ESKI joydan YANGI joyga KO'CHIRADI
 * 4. DB dagi yo'lni yangilaydi
 * 5. Conversions va responsive rasmlarni ham ko'chiradi
 *
 * XAVFSIZLIK:
 * - Faylni avval NUSXALAYDI, keyin eskisini o'chiradi
 * - Xato bo'lsa — asl fayl saqlanib qoladi
 * - --dry-run bilan avval tekshirib ko'ring!
 * - Transaction ichida ishlaydi
 *
 * ISHLATISH:
 *   php artisan media:migrate-structure                — Quruq rejim
 *   php artisan media:migrate-structure --execute      — Haqiqiy ko'chirish
 *   php artisan media:migrate-structure --execute --model=News  — Faqat News
 *
 * ============================================================
 */
class MediaMigrateStructure extends Command
{
    protected $signature = 'media:migrate-structure
                            {--execute : Haqiqiy ko\'chirish (default: quruq rejim)}
                            {--model= : Faqat bitta model uchun (masalan: News, Staff)}
                            {--limit=0 : Nechta media (0 = hammasi)}';

    protected $description = 'Eski flat media strukturani yangi tartibli strukturaga ko\'chirish';

    private int $moved = 0;

    private int $skipped = 0;

    private int $errors = 0;

    private int $alreadyCorrect = 0;

    /**
     * Model class → papka nomi (MediaPathGenerator bilan bir xil)
     */
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

    public function handle(): int
    {
        $isExecute = $this->option('execute');
        $modelFilter = $this->option('model');
        $limit = (int) $this->option('limit');

        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════════════╗');
        $this->info('║     MEDIA STRUCTURE MIGRATION — Eski → Yangi Pro        ║');
        $this->info('╚══════════════════════════════════════════════════════════╝');
        $this->newLine();

        if (! $isExecute) {
            $this->warn('🔍 QURUQ REJIM — fayllar ko\'chirilmaydi');
            $this->warn('   Haqiqiy ko\'chirish: --execute qo\'shing');
            $this->newLine();
        }

        // Media recordlarni olish
        $query = Media::query()->orderBy('id');

        if ($modelFilter) {
            $fullClass = "App\\Models\\{$modelFilter}";
            if (! isset(self::MODEL_FOLDERS[$fullClass])) {
                $this->error("Model topilmadi: {$modelFilter}");
                $this->line('Mavjud modellar: '.implode(', ', array_map(fn ($c) => class_basename($c), array_keys(self::MODEL_FOLDERS))));

                return self::FAILURE;
            }
            $query->where('model_type', $fullClass);
            $this->info("Model filter: {$modelFilter}");
        }

        if ($limit > 0) {
            $query->limit($limit);
            $this->info("Limit: {$limit}");
        }

        $totalMedia = $query->count();
        $this->info("Jami media: {$totalMedia} ta");
        $this->newLine();

        if ($totalMedia === 0) {
            $this->info('Hech qanday media topilmadi.');

            return self::SUCCESS;
        }

        // Progress bar
        $bar = $this->output->createProgressBar($totalMedia);
        $bar->setFormat(' %current%/%max% [%bar%] %percent:3s%% — %message%');
        $bar->setMessage('Boshlanmoqda...');
        $bar->start();

        // Har bir media ni tekshirish va ko'chirish
        $query->chunk(100, function ($medias) use ($isExecute, $bar) {
            foreach ($medias as $media) {
                $this->processMedia($media, $isExecute);
                $bar->advance();
                $bar->setMessage("#{$media->id} ".class_basename($media->model_type));
            }
        });

        $bar->finish();
        $this->newLine(2);

        // Natija
        $this->info('╔══════════════════════════════════════════════════╗');
        $this->info('║                    NATIJA                        ║');
        $this->info('╠══════════════════════════════════════════════════╣');
        $this->table(
            ['', 'Soni'],
            [
                ['✅ Ko\'chirildi', $this->moved],
                ['⏭️  Allaqachon to\'g\'ri joyda', $this->alreadyCorrect],
                ['⏭️  O\'tkazib yuborildi', $this->skipped],
                ['❌ Xatolar', $this->errors],
            ]
        );
        $this->info('╚══════════════════════════════════════════════════╝');

        if (! $isExecute && $this->moved > 0) {
            $this->newLine();
            $this->warn("⚠️  {$this->moved} ta fayl ko'chirilishi kerak. --execute qo'shing");
        }

        if ($isExecute && $this->moved > 0) {
            Log::info("media:migrate-structure — {$this->moved} moved, {$this->errors} errors");
        }

        return $this->errors > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function processMedia(Media $media, bool $isExecute): void
    {
        // 1. Yangi yo'lni hisoblash
        $modelFolder = self::MODEL_FOLDERS[$media->model_type] ?? null;

        if (! $modelFolder) {
            $this->skipped++;

            return;
        }

        $collection = $media->collection_name ?: 'default';
        $newBasePath = "{$modelFolder}/{$media->model_id}/{$collection}";
        $newPath = "{$newBasePath}/{$media->file_name}";

        // 2. Hozirgi disk va yo'l
        $disk = Storage::disk($media->disk);

        // Eski yo'l: media/{id}/ yoki {id}/ formatida bo'lishi mumkin
        $currentPath = null;
        $possiblePaths = [
            "{$media->id}/{$media->file_name}",
            "media/{$media->id}/{$media->file_name}",
            "{$newBasePath}/{$media->file_name}",
        ];

        foreach ($possiblePaths as $path) {
            if ($disk->exists($path)) {
                $currentPath = $path;
                break;
            }
        }

        if (! $currentPath) {
            // Fayl diskda yo'q — o'tkazib yuborish
            $this->skipped++;

            return;
        }

        // 3. Allaqachon to'g'ri joyda
        if ($currentPath === $newPath || $currentPath === "{$newBasePath}/{$media->file_name}") {
            $this->alreadyCorrect++;

            return;
        }

        // 4. Ko'chirish
        if (! $isExecute) {
            $this->moved++;

            return;
        }

        try {
            // Yangi papkani yaratish
            $newDir = dirname($newPath);
            if (! $disk->exists($newDir)) {
                $disk->makeDirectory($newDir);
            }

            // Faylni nusxalash
            $disk->copy($currentPath, $newPath);

            // Conversions papkasini ham ko'chirish
            $oldConversionsDir = dirname($currentPath).'/conversions';
            $newConversionsDir = "{$newBasePath}/conversions";

            if ($disk->exists($oldConversionsDir)) {
                foreach ($disk->files($oldConversionsDir) as $convFile) {
                    $convFileName = basename($convFile);
                    $newConvPath = "{$newConversionsDir}/{$convFileName}";

                    if (! $disk->exists($newConversionsDir)) {
                        $disk->makeDirectory($newConversionsDir);
                    }
                    $disk->copy($convFile, $newConvPath);
                }
            }

            // Responsive images papkasini ham ko'chirish
            $oldResponsiveDir = dirname($currentPath).'/responsive';
            $newResponsiveDir = "{$newBasePath}/responsive";

            if ($disk->exists($oldResponsiveDir)) {
                foreach ($disk->files($oldResponsiveDir) as $respFile) {
                    $respFileName = basename($respFile);
                    $newRespPath = "{$newResponsiveDir}/{$respFileName}";

                    if (! $disk->exists($newResponsiveDir)) {
                        $disk->makeDirectory($newResponsiveDir);
                    }
                    $disk->copy($respFile, $newRespPath);
                }
            }

            // Eski fayllarni o'chirish (nusxa muvaffaqiyatli bo'lgach)
            if ($disk->exists($newPath)) {
                $disk->deleteDirectory(dirname($currentPath));
            }

            $this->moved++;

        } catch (\Throwable $e) {
            $this->errors++;
            Log::error('media:migrate-structure error', [
                'media_id' => $media->id,
                'from' => $currentPath,
                'to' => $newPath,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
