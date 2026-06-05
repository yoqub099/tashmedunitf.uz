<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class FullBackup extends Command
{
    protected $signature = 'backup:full
                            {--path= : Custom backup directory}';

    protected $description = 'Full backup: Database (pg_dump) + Media fayllar (ZIP) — bir komandada';

    public function handle(): int
    {
        $this->info('');
        $this->info('╔══════════════════════════════════════╗');
        $this->info('║     TTATF — TO\'LIQ BACKUP           ║');
        $this->info('╚══════════════════════════════════════╝');
        $this->info('');

        $path = $this->option('path');

        // 1. Database backup
        $this->info('📦 1/2 — Database backup...');
        $dbResult = $this->call('db:backup', array_filter([
            '--path' => $path,
            '--compress' => true,
        ]));

        if ($dbResult !== self::SUCCESS) {
            $this->error('Database backup xatolik bilan yakunlandi!');

            return self::FAILURE;
        }

        // 2. Media backup
        $this->info('');
        $this->info('📸 2/2 — Media backup...');
        $mediaResult = $this->call('media:backup', array_filter([
            '--path' => $path,
        ]));

        if ($mediaResult !== self::SUCCESS) {
            $this->warn('Media backup xatolik bilan yakunlandi!');
        }

        $this->info('');
        $this->info('🎉 TO\'LIQ BACKUP MUVAFFAQIYATLI YAKUNLANDI!');
        $this->info('   📁 Joylashuv: '.($path ?: storage_path('app/backups')));
        $this->info('');

        return self::SUCCESS;
    }
}
