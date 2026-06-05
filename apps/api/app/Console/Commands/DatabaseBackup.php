<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class DatabaseBackup extends Command
{
    protected $signature = 'db:backup
                            {--path= : Custom backup directory path}
                            {--compress : Compress the backup with gzip}';

    protected $description = 'Create a PostgreSQL database backup';

    public function handle(): int
    {
        $database = config('database.connections.pgsql.database');
        $username = config('database.connections.pgsql.username');
        $host = config('database.connections.pgsql.host');
        $port = config('database.connections.pgsql.port');

        $backupDir = $this->option('path') ?: storage_path('app/backups');
        $compress = $this->option('compress');

        if (! is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "{$database}_backup_{$timestamp}.sql";
        $filepath = "{$backupDir}/{$filename}";

        $this->info("Creating backup of database '{$database}'...");

        // Windows va Linux da ishlashi uchun putenv orqali parol o'rnatamiz
        putenv('PGPASSWORD='.config('database.connections.pgsql.password'));

        $command = sprintf(
            'pg_dump -h %s -p %s -U %s -Fc -f %s %s',
            escapeshellarg($host),
            escapeshellarg($port),
            escapeshellarg($username),
            escapeshellarg($filepath),
            escapeshellarg($database)
        );

        $output = [];
        $exitCode = 0;
        exec($command.' 2>&1', $output, $exitCode);

        if ($exitCode !== 0) {
            $error = implode("\n", $output);
            $this->error("Backup failed: {$error}");
            Log::error('db:backup failed', ['error' => $error]);

            return self::FAILURE;
        }

        if ($compress) {
            // PHP built-in gzencode — Windows da ham ishlaydi
            $data = file_get_contents($filepath);
            if ($data !== false) {
                file_put_contents($filepath.'.gz', gzencode($data, 9));
                unlink($filepath);
                $filepath .= '.gz';
                $filename .= '.gz';
            }
        }

        $size = round(filesize($filepath) / 1024 / 1024, 2);

        $this->info("✅ Backup created: {$filename} ({$size} MB)");
        Log::info("db:backup completed — {$filename} ({$size} MB)");

        // Clean old backups (keep last 10)
        $backups = glob("{$backupDir}/{$database}_backup_*");
        if (count($backups) > 10) {
            usort($backups, fn ($a, $b) => filemtime($a) - filemtime($b));
            $toDelete = array_slice($backups, 0, count($backups) - 10);
            foreach ($toDelete as $old) {
                unlink($old);
                $this->line('  Removed old backup: '.basename($old));
            }
        }

        return self::SUCCESS;
    }
}
