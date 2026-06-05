<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

/**
 * ⚠️ Xavfsiz Seed — avtomatik backup yaratib, keyin seed qiladi.
 *
 * Bu komanda `php artisan db:seed` o'rniga ishlatilishi kerak.
 * Har doim avval backup oladi, shundan keyin seed qiladi.
 */
class SafeSeed extends Command
{
    protected $signature = 'db:safe-seed
        {--class= : Seeder klassi nomi}
        {--force : Production da ham bajarish}';

    protected $description = '⚠️ Avval backup olib, keyin xavfsiz seed qiladi';

    public function handle(): int
    {
        $this->warn('╔══════════════════════════════════════════════╗');
        $this->warn('║  🛡️  XAVFSIZ SEED — Avval backup olinadi   ║');
        $this->warn('╚══════════════════════════════════════════════╝');

        $env = app()->environment();

        if ($env === 'production') {
            $this->error('⛔ Production muhitda seed qilish xavfli!');
            if (! $this->confirm('Haqiqatan ham PRODUCTION da seed qilmoqchimisiz?', false)) {
                $this->info('❌ Bekor qilindi.');

                return 1;
            }

            // Production da ikkinchi tasdiqlash
            $confirm = $this->ask('Tasdiqlash uchun "SEED-PRODUCTION" deb yozing:');
            if ($confirm !== 'SEED-PRODUCTION') {
                $this->error('❌ Noto\'g\'ri tasdiqlash. Bekor qilindi.');

                return 1;
            }
        }

        // 1. Backup olish
        $this->info('📦 Backup olinmoqda...');
        $backupResult = $this->call('db:backup', ['--compress' => true]);

        if ($backupResult !== 0) {
            $this->error('❌ Backup olib bo\'lmadi! Seed bekor qilindi.');

            return 1;
        }

        $this->info('✅ Backup muvaffaqiyatli olindi.');
        $this->newLine();

        // 2. Seed qilish
        $this->info('🌱 Seed boshlanmoqda...');

        $seedArgs = [];
        if ($this->option('class')) {
            $seedArgs['--class'] = $this->option('class');
        }
        if ($this->option('force') || $env === 'production') {
            $seedArgs['--force'] = true;
        }

        try {
            $this->call('db:seed', $seedArgs);
            $this->newLine();
            $this->info('✅ Seed muvaffaqiyatli bajarildi!');
            $this->info('💡 Agar muammo bo\'lsa: php artisan db:restore');
        } catch (\Exception $e) {
            $this->error("❌ Seed xatosi: {$e->getMessage()}");
            $this->warn('💡 Backup dan tiklash: php artisan db:restore');

            return 1;
        }

        return 0;
    }
}
