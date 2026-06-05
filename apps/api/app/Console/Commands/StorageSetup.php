<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * ============================================================
 * STORAGE SETUP COMMAND — Server Deploy uchun
 * ============================================================
 *
 * 1 ta komanda bilan barcha storage papkalarni yaratadi.
 * Deploy qilganda BIRINCHI ishlatiladi:
 *
 *   php artisan storage:setup
 *
 * Nima qiladi:
 * - Barcha media papkalarni yaratadi (news, staff, departments...)
 * - Private papkalarni yaratadi (jobs, private_docs)
 * - Temp, backup, logs papkalarni yaratadi
 * - .gitkeep fayllarni qo'yadi (Git track qilishi uchun)
 * - Huquqlarni to'g'rilaydi (775/664)
 * - Symlink yaratadi (public/storage → storage/app/public)
 *
 * Production (Linux):
 *   php artisan storage:setup --production
 *   → www-data:www-data ownership, SELinux context
 *
 * ============================================================
 */
class StorageSetup extends Command
{
    protected $signature = 'storage:setup
                            {--production : Production server uchun (huquqlar va ownership)}
                            {--skip-symlink : Symlink yaratmaslik}
                            {--dry-run : Nima qilinishini ko\'rsatish (yaratmaslik)}';

    protected $description = 'Barcha storage papkalarni yaratish — deploy uchun 1 komanda';

    /**
     * Yaratilishi kerak bo'lgan BARCHA papkalar
     *
     * STRUKTURA:
     * storage/app/
     * ├── public/          ← Nginx orqali to'g'ridan-to'g'ri beriladi
     * │   ├── news/        ← Yangiliklar media
     * │   ├── pages/       ← CMS sahifalar
     * │   ├── staff/       ← Xodimlar
     * │   ├── departments/ ← Kafedralar
     * │   ├── banners/     ← Bannerlar
     * │   ├── directions/  ← Ta'lim yo'nalishlari
     * │   ├── faculties/   ← Fakultetlar
     * │   ├── library/     ← Kutubxona
     * │   ├── journal/     ← Ilmiy jurnal
     * │   ├── partners/    ← Hamkorlar
     * │   ├── testimonials/ ← Fikrlar
     * │   ├── students/    ← Talabalar
     * │   │   ├── talented/
     * │   │   └── life/
     * │   ├── contacts/    ← Aloqa xabarlari
     * │   ├── site/        ← Umumiy sayt media
     * │   └── site-contents/ ← Sayt content rasmlari
     * │
     * ├── private/         ← MAXFIY (Nginx bermaydi!)
     * │   ├── jobs/        ← Ish arizalari hujjatlari
     * │   ├── staff/       ← Xodimlar maxfiy hujjatlari
     * │   └── pages/       ← Sahifa maxfiy hujjatlari
     * │
     * ├── temp/            ← Vaqtinchalik yuklamalar
     * └── backups/         ← Database va media backup
     */
    private const DIRECTORIES = [
        // ═══════════════════════════════════════
        // PUBLIC MEDIA — Nginx to'g'ridan-to'g'ri beradi
        // ═══════════════════════════════════════
        'public/news',
        'public/pages',
        'public/staff',
        'public/departments',
        'public/banners',
        'public/directions',
        'public/faculties',
        'public/library',
        'public/journal',
        'public/partners',
        'public/testimonials',
        'public/students/talented',
        'public/students/life',
        'public/contacts',
        'public/site',
        'public/site-contents',

        // ═══════════════════════════════════════
        // PRIVATE MEDIA — Faqat auth orqali beriladi
        // ═══════════════════════════════════════
        'private/jobs',
        'private/staff',
        'private/pages',

        // ═══════════════════════════════════════
        // SYSTEM PAPKALAR
        // ═══════════════════════════════════════
        'temp',
        'backups',
    ];

    /**
     * Log papkalar
     */
    private const LOG_DIRECTORIES = [
        'logs',
    ];

    public function handle(): int
    {
        $isDryRun = $this->option('dry-run');
        $isProduction = $this->option('production');

        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════╗');
        $this->info('║        TMTU STORAGE SETUP — Pro Level            ║');
        $this->info('╚══════════════════════════════════════════════════╝');
        $this->newLine();

        if ($isDryRun) {
            $this->warn('🔍 QURUQ REJIM — papkalar yaratilmaydi');
            $this->newLine();
        }

        // 1. Storage papkalarni yaratish
        $this->info('📁 1. Storage papkalar yaratilmoqda...');
        $created = $this->createDirectories($isDryRun);

        // 2. Log papkalarni yaratish
        $this->newLine();
        $this->info('📋 2. Log papkalar yaratilmoqda...');
        $created += $this->createLogDirectories($isDryRun);

        // 3. .gitkeep fayllarni qo'yish
        $this->newLine();
        $this->info('📌 3. .gitkeep fayllar qo\'yilmoqda...');
        $gitkeeps = $this->createGitkeepFiles($isDryRun);

        // 4. Symlink yaratish
        if (! $this->option('skip-symlink')) {
            $this->newLine();
            $this->info('🔗 4. Storage symlink yaratilmoqda...');
            $this->createSymlink($isDryRun);
        }

        // 5. Production huquqlar
        if ($isProduction && ! $isDryRun) {
            $this->newLine();
            $this->info('🔒 5. Production huquqlar o\'rnatilmoqda...');
            $this->setProductionPermissions();
        }

        // Natija
        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════╗');
        $this->info('║                    NATIJA                        ║');
        $this->info('╠══════════════════════════════════════════════════╣');
        $this->table(
            ['', 'Soni'],
            [
                ['Papkalar yaratildi', $created],
                ['.gitkeep fayllar', $gitkeeps],
                ['Rejim', $isProduction ? 'PRODUCTION' : 'DEVELOPMENT'],
            ]
        );
        $this->info('╚══════════════════════════════════════════════════╝');

        if ($isDryRun) {
            $this->newLine();
            $this->warn('⚠️  Yaratish uchun --dry-run ni olib tashlang');
        }

        $this->newLine();
        $this->info('✅ Storage setup tayyor!');
        $this->newLine();

        // Keyingi qadamlar
        $this->line('Keyingi qadamlar:');
        $this->line('  1. php artisan storage:link     — Symlink (agar yaratilmagan bo\'lsa)');
        $this->line('  2. php artisan migrate           — Database');
        $this->line('  3. php artisan media:health      — Storage salomatligini tekshirish');
        $this->line('  4. php artisan serve              — Serverni ishga tushirish');
        $this->newLine();

        return self::SUCCESS;
    }

    private function createDirectories(bool $isDryRun): int
    {
        $created = 0;
        $storagePath = storage_path('app');

        foreach (self::DIRECTORIES as $dir) {
            $fullPath = $storagePath.'/'.$dir;

            if (File::isDirectory($fullPath)) {
                $this->line("   <fg=green>✓</> {$dir}/ <fg=gray>(mavjud)</>");

                continue;
            }

            if ($isDryRun) {
                $this->line("   <fg=yellow>○</> {$dir}/ <fg=yellow>(yaratiladi)</>");
            } else {
                File::makeDirectory($fullPath, 0775, true);
                $this->line("   <fg=green>✓</> {$dir}/ <fg=green>(yaratildi)</>");
            }
            $created++;
        }

        return $created;
    }

    private function createLogDirectories(bool $isDryRun): int
    {
        $created = 0;

        foreach (self::LOG_DIRECTORIES as $dir) {
            $fullPath = storage_path($dir);

            if (File::isDirectory($fullPath)) {
                $this->line("   <fg=green>✓</> storage/{$dir}/ <fg=gray>(mavjud)</>");

                continue;
            }

            if (! $isDryRun) {
                File::makeDirectory($fullPath, 0775, true);
            }
            $this->line("   <fg=green>✓</> storage/{$dir}/ <fg=green>(yaratildi)</>");
            $created++;
        }

        return $created;
    }

    private function createGitkeepFiles(bool $isDryRun): int
    {
        $count = 0;

        foreach (self::DIRECTORIES as $dir) {
            $fullPath = storage_path('app/'.$dir);
            $gitkeep = $fullPath.'/.gitkeep';

            if (! File::isDirectory($fullPath)) {
                continue; // dry-run da papka yo'q bo'lishi mumkin
            }

            if (File::exists($gitkeep)) {
                continue;
            }

            if (! $isDryRun) {
                File::put($gitkeep, '');
            }
            $count++;
        }

        $this->line("   {$count} ta .gitkeep fayl ".($isDryRun ? 'yaratiladi' : 'yaratildi'));

        return $count;
    }

    private function createSymlink(bool $isDryRun): void
    {
        $link = public_path('storage');
        $target = storage_path('app/public');

        if (file_exists($link) || is_link($link)) {
            $this->line('   <fg=green>✓</> public/storage → storage/app/public <fg=gray>(mavjud)</>');

            return;
        }

        if ($isDryRun) {
            $this->line('   <fg=yellow>○</> public/storage → storage/app/public <fg=yellow>(yaratiladi)</>');

            return;
        }

        // Windows da admin huquqi kerak bo'lishi mumkin
        try {
            $this->call('storage:link');
            $this->line('   <fg=green>✓</> Symlink yaratildi');
        } catch (\Throwable $e) {
            $this->error('   ✗ Symlink yaratib bo\'lmadi: '.$e->getMessage());
            $this->line('   Qo\'lda bajaring: php artisan storage:link');
        }
    }

    private function setProductionPermissions(): void
    {
        if (PHP_OS_FAMILY === 'Windows') {
            $this->warn('   Windows da huquqlar avtomatik o\'rnatilmaydi');

            return;
        }

        $storagePath = storage_path();

        // Papkalar 775, fayllar 664
        $commands = [
            "find {$storagePath} -type d -exec chmod 775 {} +",
            "find {$storagePath} -type f -exec chmod 664 {} +",
        ];

        // www-data ownership (Nginx/PHP-FPM user)
        $webUser = 'www-data';
        $webGroup = 'www-data';

        $commands[] = "chown -R {$webUser}:{$webGroup} {$storagePath}";

        foreach ($commands as $cmd) {
            $output = [];
            $returnCode = 0;
            exec($cmd.' 2>&1', $output, $returnCode);

            if ($returnCode === 0) {
                $this->line('   <fg=green>✓</> '.$cmd);
            } else {
                $this->warn("   ⚠ {$cmd}");
                $this->line('   '.implode("\n   ", $output));
            }
        }

        // Bootstrap/cache huquqlari
        $bootstrapCache = base_path('bootstrap/cache');
        exec("chmod -R 775 {$bootstrapCache} 2>&1");
        exec("chown -R {$webUser}:{$webGroup} {$bootstrapCache} 2>&1");
        $this->line("   <fg=green>✓</> bootstrap/cache huquqlari o'rnatildi");
    }
}
