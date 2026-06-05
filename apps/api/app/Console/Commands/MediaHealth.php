<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * ============================================================
 * MEDIA HEALTH CHECK — Server Storage Diagnostikasi
 * ============================================================
 *
 * Server storage salomatligini to'liq tekshiradi:
 *
 * 1. DISK — 4TB SSD holati (band/bo'sh, foiz)
 * 2. SYMLINK — public/storage → storage/app/public
 * 3. PAPKALAR — Barcha kerakli papkalar mavjudligi
 * 4. HUQUQLAR — Yozish/o'qish ruxsati
 * 5. DB SYNC — DB va disk sinxronligi
 * 6. YETIMLAR — DB da yo'q, diskda bor fayllar
 * 7. YO'Q FAYLLAR — DB da bor, diskda yo'q
 * 8. STATISTIKA — Har bir model uchun media soni/hajmi
 *
 * Ishlatish:
 *   php artisan media:health           — To'liq tekshiruv
 *   php artisan media:health --quick   — Tez tekshiruv (disk + symlink)
 *   php artisan media:health --json    — JSON formatda natija
 *
 * Cron (har hafta):
 *   php artisan media:health --json >> storage/logs/health.log
 *
 * ============================================================
 */
class MediaHealth extends Command
{
    protected $signature = 'media:health
                            {--quick : Tez tekshiruv (faqat disk va symlink)}
                            {--json : JSON formatda natija}
                            {--fix : Muammolarni avtomatik tuzatish}';

    protected $description = 'Storage salomatligini tekshirish — disk, papkalar, huquqlar, DB sync';

    private array $results = [];

    private int $warnings = 0;

    private int $errors = 0;

    private int $passed = 0;

    public function handle(): int
    {
        $isQuick = $this->option('quick');
        $isJson = $this->option('json');
        $shouldFix = $this->option('fix');

        if (! $isJson) {
            $this->newLine();
            $this->info('╔══════════════════════════════════════════════════════╗');
            $this->info('║         MEDIA HEALTH CHECK — TMTU Server             ║');
            $this->info('║         '.now()->format('Y-m-d H:i:s').'                          ║');
            $this->info('╚══════════════════════════════════════════════════════╝');
            $this->newLine();
        }

        // 1. DISK HOLATI
        $this->checkDiskSpace();

        // 2. SYMLINK TEKSHIRUVI
        $this->checkSymlink($shouldFix);

        // 3. PAPKALAR TEKSHIRUVI
        $this->checkDirectories($shouldFix);

        // 4. YOZISH HUQUQLARI
        $this->checkWritePermissions();

        if (! $isQuick) {
            // 5. DB-DISK SINXRONLIGI
            $this->checkDbDiskSync();

            // 6. MEDIA STATISTIKA
            $this->checkMediaStats();

            // 7. KATTA FAYLLAR TEKSHIRUVI
            $this->checkLargeFiles();

            // 8. KONVERSIYALAR TEKSHIRUVI
            $this->checkConversions();
        }

        // NATIJA
        if ($isJson) {
            $this->line(json_encode([
                'timestamp' => now()->toISOString(),
                'passed' => $this->passed,
                'warnings' => $this->warnings,
                'errors' => $this->errors,
                'checks' => $this->results,
            ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } else {
            $this->newLine();
            $this->info('╔══════════════════════════════════════════════════════╗');
            $this->info('║                   UMUMIY NATIJA                      ║');
            $this->info('╠══════════════════════════════════════════════════════╣');

            $status = $this->errors > 0 ? '❌ MUAMMOLAR BOR' : ($this->warnings > 0 ? '⚠️  OGOHLANTIRISHLAR' : '✅ HAMMASI YAXSHI');

            $this->table(
                ['', 'Soni'],
                [
                    ['✅ Muvaffaqiyatli', $this->passed],
                    ['⚠️  Ogohlantirishlar', $this->warnings],
                    ['❌ Xatolar', $this->errors],
                    ['Holat', $status],
                ]
            );
            $this->info('╚══════════════════════════════════════════════════════╝');
        }

        // Log yozish
        Log::info('media:health', [
            'passed' => $this->passed,
            'warnings' => $this->warnings,
            'errors' => $this->errors,
        ]);

        return $this->errors > 0 ? self::FAILURE : self::SUCCESS;
    }

    // ═══════════════════════════════════════
    // 1. DISK HOLATI
    // ═══════════════════════════════════════
    private function checkDiskSpace(): void
    {
        $this->section('DISK HOLATI');

        $storagePath = storage_path('app/public');
        $total = @disk_total_space($storagePath);
        $free = @disk_free_space($storagePath);

        if ($total === false || $free === false) {
            $this->addResult('disk_space', 'error', 'Disk ma\'lumotini o\'qib bo\'lmadi');

            return;
        }

        $used = $total - $free;
        $percentUsed = round(($used / $total) * 100, 1);

        $this->line("   Total:  {$this->humanSize($total)}");
        $this->line("   Used:   {$this->humanSize($used)} ({$percentUsed}%)");
        $this->line("   Free:   {$this->humanSize($free)}");

        // Progress bar
        $barLength = 40;
        $filled = (int) round($percentUsed / 100 * $barLength);
        $empty = $barLength - $filled;

        $color = $percentUsed > 90 ? 'red' : ($percentUsed > 75 ? 'yellow' : 'green');
        $bar = str_repeat('█', $filled).str_repeat('░', $empty);
        $this->line("   <fg={$color}>[{$bar}]</> {$percentUsed}%");

        if ($percentUsed > 90) {
            $this->addResult('disk_space', 'error', "Disk 90% dan ortiq band! ({$percentUsed}%)");
        } elseif ($percentUsed > 75) {
            $this->addResult('disk_space', 'warning', "Disk 75% dan ortiq band ({$percentUsed}%)");
        } else {
            $this->addResult('disk_space', 'pass', "Disk holati yaxshi ({$percentUsed}% band)");
        }
    }

    // ═══════════════════════════════════════
    // 2. SYMLINK TEKSHIRUVI
    // ═══════════════════════════════════════
    private function checkSymlink(bool $shouldFix): void
    {
        $this->section('SYMLINK');

        $link = public_path('storage');
        $target = storage_path('app/public');

        if (is_link($link) || is_dir($link)) {
            $realTarget = realpath($link);
            $expectedTarget = realpath($target);

            if ($realTarget === $expectedTarget) {
                $this->addResult('symlink', 'pass', 'Symlink to\'g\'ri: public/storage → storage/app/public');
            } else {
                $this->addResult('symlink', 'warning', "Symlink noto'g'ri manzilga ko'rsatmoqda: {$realTarget}");
            }
        } else {
            if ($shouldFix) {
                try {
                    $this->call('storage:link');
                    $this->addResult('symlink', 'pass', 'Symlink yaratildi (--fix)');
                } catch (\Throwable $e) {
                    $this->addResult('symlink', 'error', 'Symlink yaratib bo\'lmadi: '.$e->getMessage());
                }
            } else {
                $this->addResult('symlink', 'error', 'Symlink MAVJUD EMAS! `php artisan storage:link` yoki --fix');
            }
        }
    }

    // ═══════════════════════════════════════
    // 3. PAPKALAR TEKSHIRUVI
    // ═══════════════════════════════════════
    private function checkDirectories(bool $shouldFix): void
    {
        $this->section('PAPKALAR');

        $requiredDirs = [
            'app/public/news' => 'Yangiliklar media',
            'app/public/pages' => 'CMS sahifalar',
            'app/public/staff' => 'Xodimlar',
            'app/public/departments' => 'Kafedralar',
            'app/public/banners' => 'Bannerlar',
            'app/public/directions' => 'Ta\'lim yo\'nalishlari',
            'app/public/faculties' => 'Fakultetlar',
            'app/public/library' => 'Kutubxona',
            'app/public/journal' => 'Ilmiy jurnal',
            'app/public/partners' => 'Hamkorlar',
            'app/public/testimonials' => 'Fikrlar',
            'app/public/students/talented' => 'Iqtidorli talabalar',
            'app/public/students/life' => 'Talabalar hayoti',
            'app/public/contacts' => 'Aloqa xabarlari',
            'app/public/site' => 'Sayt media',
            'app/public/site-contents' => 'Sayt kontent',
            'app/private/jobs' => 'Ish arizalari (MAXFIY)',
            'app/private/staff' => 'Xodimlar maxfiy',
            'app/private/pages' => 'Sahifa maxfiy',
            'app/temp' => 'Vaqtinchalik fayllar',
            'app/backup' => 'Zaxira nusxalar',
        ];

        $missing = 0;
        foreach ($requiredDirs as $dir => $label) {
            $fullPath = storage_path($dir);
            if (File::isDirectory($fullPath)) {
                $this->line("   <fg=green>✓</> {$dir}/ — {$label}");
            } else {
                $missing++;
                if ($shouldFix) {
                    File::makeDirectory($fullPath, 0775, true);
                    $this->line("   <fg=green>✓</> {$dir}/ — {$label} <fg=cyan>(yaratildi)</>");
                } else {
                    $this->line("   <fg=red>✗</> {$dir}/ — {$label} <fg=red>(YO'Q)</>");
                }
            }
        }

        if ($missing > 0 && ! $shouldFix) {
            $this->addResult('directories', 'error', "{$missing} ta papka topilmadi. --fix yoki `php artisan storage:setup`");
        } else {
            $this->addResult('directories', 'pass', 'Barcha papkalar mavjud');
        }
    }

    // ═══════════════════════════════════════
    // 4. YOZISH HUQUQLARI
    // ═══════════════════════════════════════
    private function checkWritePermissions(): void
    {
        $this->section('YOZISH HUQUQLARI');

        $paths = [
            storage_path('app/public') => 'Public storage',
            storage_path('app/private') => 'Private storage',
            storage_path('app/temp') => 'Temp storage',
            storage_path('logs') => 'Logs',
        ];

        foreach ($paths as $path => $label) {
            if (! File::isDirectory($path)) {
                $this->line("   <fg=yellow>○</> {$label} — papka yo'q");

                continue;
            }

            if (is_writable($path)) {
                $this->line("   <fg=green>✓</> {$label} — yozish mumkin");
            } else {
                $this->addResult('permissions_'.$label, 'error', "{$label} papkaga yozish mumkin EMAS!");
                $this->line("   <fg=red>✗</> {$label} — YOZISH MUMKIN EMAS!");
            }
        }

        if ($this->errors === 0 || ! isset($this->results['permissions_Public storage'])) {
            $this->addResult('permissions', 'pass', 'Barcha papkalarga yozish mumkin');
        }
    }

    // ═══════════════════════════════════════
    // 5. DB-DISK SINXRONLIGI
    // ═══════════════════════════════════════
    private function checkDbDiskSync(): void
    {
        $this->section('DB-DISK SINXRONLIGI');

        // DB dagi media soni
        $dbCount = Media::count();
        $this->line("   DB dagi media: {$dbCount} ta");

        // DB da bor, diskda yo'q
        $missingOnDisk = 0;
        $missingFiles = [];

        Media::select('id', 'disk', 'model_type', 'file_name', 'size')
            ->chunk(500, function ($medias) use (&$missingOnDisk, &$missingFiles) {
                foreach ($medias as $media) {
                    try {
                        $path = $media->getPath();
                        if (! file_exists($path)) {
                            $missingOnDisk++;
                            if (count($missingFiles) < 10) {
                                $missingFiles[] = "#{$media->id} ({$media->file_name})";
                            }
                        }
                    } catch (\Throwable $e) {
                        $missingOnDisk++;
                    }
                }
            });

        if ($missingOnDisk > 0) {
            $this->addResult('db_disk_sync', 'warning', "{$missingOnDisk} ta media DB da bor, lekin diskda YO'Q");
            $this->line("   <fg=yellow>⚠</> {$missingOnDisk} ta fayl diskda topilmadi:");
            foreach ($missingFiles as $file) {
                $this->line("      — {$file}");
            }
            if ($missingOnDisk > 10) {
                $this->line('      — ... va yana '.($missingOnDisk - 10).' ta');
            }
        } else {
            $this->addResult('db_disk_sync', 'pass', "Barcha {$dbCount} ta media DB va diskda sinxron");
        }
    }

    // ═══════════════════════════════════════
    // 6. MEDIA STATISTIKA
    // ═══════════════════════════════════════
    private function checkMediaStats(): void
    {
        $this->section('MEDIA STATISTIKA');

        $stats = DB::table('media')
            ->selectRaw('
                model_type,
                COUNT(*) as count,
                COALESCE(SUM(size), 0) as total_size
            ')
            ->groupBy('model_type')
            ->orderByDesc('total_size')
            ->get();

        $rows = [];
        $grandTotal = 0;
        $grandCount = 0;

        foreach ($stats as $stat) {
            $modelName = class_basename($stat->model_type);
            $rows[] = [
                $modelName,
                $stat->count,
                $this->humanSize((int) $stat->total_size),
            ];
            $grandTotal += $stat->total_size;
            $grandCount += $stat->count;
        }

        $rows[] = ['─────────────', '─────', '──────────'];
        $rows[] = ['JAMI', $grandCount, $this->humanSize((int) $grandTotal)];

        $this->table(['Model', 'Soni', 'Hajmi'], $rows);

        $this->addResult('media_stats', 'pass', "{$grandCount} ta media, {$this->humanSize((int) $grandTotal)}");
    }

    // ═══════════════════════════════════════
    // 7. KATTA FAYLLAR
    // ═══════════════════════════════════════
    private function checkLargeFiles(): void
    {
        $this->section('KATTA FAYLLAR (TOP 10)');

        $largeFiles = Media::orderByDesc('size')
            ->limit(10)
            ->get(['id', 'model_type', 'collection_name', 'file_name', 'size', 'mime_type']);

        if ($largeFiles->isEmpty()) {
            $this->line('   Media fayllar topilmadi');

            return;
        }

        $rows = [];
        foreach ($largeFiles as $media) {
            $rows[] = [
                "#{$media->id}",
                class_basename($media->model_type),
                $media->collection_name,
                strlen($media->file_name) > 30 ? substr($media->file_name, 0, 27).'...' : $media->file_name,
                $this->humanSize((int) ($media->size ?? 0)),
            ];
        }

        $this->table(['ID', 'Model', 'Collection', 'Fayl', 'Hajmi'], $rows);

        // 100MB dan katta fayllar haqida ogohlantirish
        $veryLarge = Media::where('size', '>', 100 * 1024 * 1024)->count();
        if ($veryLarge > 0) {
            $this->addResult('large_files', 'warning', "{$veryLarge} ta fayl 100MB dan katta");
        } else {
            $this->addResult('large_files', 'pass', 'Haddan tashqari katta fayllar yo\'q');
        }
    }

    // ═══════════════════════════════════════
    // 8. KONVERSIYALAR TEKSHIRUVI
    // ═══════════════════════════════════════
    private function checkConversions(): void
    {
        $this->section('KONVERSIYALAR (thumbnail/medium)');

        // Faqat rasm media uchun konversiyalar tekshirish
        $imageMedia = Media::where('mime_type', 'like', 'image/%')
            ->whereIn('collection_name', ['thumbnail', 'image', 'photo', 'logo', 'cover', 'gallery', 'images', 'head_photo', 'mobile_image'])
            ->count();

        $withConversions = Media::where('mime_type', 'like', 'image/%')
            ->whereIn('collection_name', ['thumbnail', 'image', 'photo', 'logo', 'cover', 'gallery', 'images', 'head_photo', 'mobile_image'])
            ->whereRaw("generated_conversions::text != '{}'")
            ->whereRaw("generated_conversions::text != 'null'")
            ->count();

        $missing = $imageMedia - $withConversions;

        $this->line("   Rasm media: {$imageMedia} ta");
        $this->line("   Konversiyali: {$withConversions} ta");
        $this->line("   Konversiyasiz: {$missing} ta");

        if ($missing > 0 && $imageMedia > 0) {
            $percent = round(($missing / $imageMedia) * 100);
            if ($percent > 30) {
                $this->addResult('conversions', 'warning', "{$missing} ta rasm ({$percent}%) konversiyasiz — queue ishlamoqdami?");
            } else {
                $this->addResult('conversions', 'pass', "Konversiyalar deyarli to'liq ({$percent}% kutilmoqda)");
            }
        } else {
            $this->addResult('conversions', 'pass', 'Barcha rasm konversiyalari tayyor');
        }
    }

    // ═══════════════════════════════════════
    // YORDAMCHI METODLAR
    // ═══════════════════════════════════════

    private function section(string $title): void
    {
        if (! $this->option('json')) {
            $this->newLine();
            $this->info("── {$title} ".str_repeat('─', max(0, 45 - strlen($title))));
        }
    }

    private function addResult(string $key, string $level, string $message): void
    {
        $this->results[$key] = ['level' => $level, 'message' => $message];

        match ($level) {
            'pass' => $this->passed++,
            'warning' => $this->warnings++,
            'error' => $this->errors++,
            default => null,
        };

        if (! $this->option('json')) {
            $icon = match ($level) {
                'pass' => '<fg=green>✅</>',
                'warning' => '<fg=yellow>⚠️</>',
                'error' => '<fg=red>❌</>',
                default => '  ',
            };
            $this->line("   {$icon} {$message}");
        }
    }

    private function humanSize(int $bytes): string
    {
        if ($bytes <= 0) {
            return '0 B';
        }
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $pow = floor(log($bytes) / log(1024));
        $pow = min($pow, count($units) - 1);

        return round($bytes / pow(1024, $pow), 2).' '.$units[(int) $pow];
    }
}
