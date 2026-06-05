<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DatabaseRestore extends Command
{
    protected $signature = 'db:restore
                            {file? : Backup file path (if empty, shows list of available backups)}
                            {--force : Skip confirmation prompt}';

    protected $description = 'Restore a PostgreSQL database from backup';

    public function handle(): int
    {
        $database = config('database.connections.pgsql.database');
        $username = config('database.connections.pgsql.username');
        $host = config('database.connections.pgsql.host');
        $port = config('database.connections.pgsql.port');
        $password = config('database.connections.pgsql.password');

        $file = $this->argument('file');

        // Agar fayl ko'rsatilmagan bo'lsa — mavjud backuplarni ko'rsat
        if (! $file) {
            $backupDir = storage_path('app/backups');
            if (! is_dir($backupDir)) {
                $this->error('Backup papkasi topilmadi: '.$backupDir);

                return self::FAILURE;
            }

            $backups = glob("{$backupDir}/{$database}_backup_*");
            if (empty($backups)) {
                $this->error('Hech qanday backup topilmadi. Avval: php artisan db:backup');

                return self::FAILURE;
            }

            usort($backups, fn ($a, $b) => filemtime($b) - filemtime($a));

            $choices = array_map(function ($path) {
                $size = round(filesize($path) / 1024 / 1024, 2);
                $date = date('Y-m-d H:i:s', filemtime($path));

                return basename($path)." ({$size} MB, {$date})";
            }, $backups);

            $selected = $this->choice('Qaysi backupni tiklash kerak?', $choices, 0);
            $index = array_search($selected, $choices);
            $file = $backups[$index];
        }

        if (! file_exists($file)) {
            $this->error("Fayl topilmadi: {$file}");

            return self::FAILURE;
        }

        $size = round(filesize($file) / 1024 / 1024, 2);

        if (! $this->option('force')) {
            $this->warn("⚠️  DIQQAT: Bu amaliyot hozirgi bazadagi BARCHA ma'lumotlarni o'chiradi!");
            $this->info('Backup: '.basename($file)." ({$size} MB)");
            $this->info("Database: {$database}");

            if (! $this->confirm('Davom etishni xohlaysizmi?', false)) {
                $this->info('Bekor qilindi.');

                return self::SUCCESS;
            }
        }

        $this->info("Ma'lumotlar bazasi tiklanmoqda...");

        // Windows va Linux da ishlashi uchun putenv orqali parol o'rnatamiz
        putenv('PGPASSWORD='.$password);

        // Barcha ulanishlarni uzish
        $dropConnections = sprintf(
            'psql -h %s -p %s -U %s -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = \'%s\' AND pid <> pg_backend_pid();" 2>&1',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            $database
        );
        exec($dropConnections);

        // Bazani qayta yaratish
        $command = sprintf(
            'pg_restore -h %s -p %s -U %s -d %s --clean --if-exists --no-owner --no-acl %s',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($database),
            escapeshellarg($file)
        );

        $output = [];
        $exitCode = 0;
        exec($command.' 2>&1', $output, $exitCode);

        // pg_restore exit code 1 = warnings (normal, e.g. "table does not exist" on --clean)
        if ($exitCode > 1) {
            $error = implode("\n", $output);
            $this->error("Restore failed: {$error}");
            Log::error('db:restore failed', ['error' => $error, 'file' => $file]);

            return self::FAILURE;
        }

        $this->info("✅ Ma'lumotlar bazasi muvaffaqiyatli tiklandi!");
        $this->info('   Backup: '.basename($file));
        Log::info('db:restore completed — '.basename($file));

        // Keshlarni tozalash
        $this->call('cache:clear');

        return self::SUCCESS;
    }
}
