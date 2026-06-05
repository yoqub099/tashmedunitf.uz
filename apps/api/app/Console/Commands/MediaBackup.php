<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class MediaBackup extends Command
{
    protected $signature = 'media:backup
                            {--path= : Custom backup directory}';

    protected $description = 'Backup all media files (Spatie Media Library + site-contents rasmlar)';

    public function handle(): int
    {
        $backupDir = $this->option('path') ?: storage_path('app/backups');

        if (! is_dir($backupDir)) {
            mkdir($backupDir, 0755, true);
        }

        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "media_backup_{$timestamp}.zip";
        $filepath = "{$backupDir}/{$filename}";

        $this->info('Media fayllarni arxivlash...');

        $sourceDirs = [
            storage_path('app/public/media'),
            storage_path('app/public/site-contents'),
        ];

        $zip = new \ZipArchive;
        if ($zip->open($filepath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            $this->error('ZIP fayl yaratib bo\'lmadi');

            return self::FAILURE;
        }

        $totalFiles = 0;
        foreach ($sourceDirs as $sourceDir) {
            if (! is_dir($sourceDir)) {
                $this->line("  ⚠ Papka yo'q: ".basename($sourceDir));

                continue;
            }

            $dirName = basename($sourceDir);
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($sourceDir, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($iterator as $file) {
                if ($file->isFile()) {
                    $relativePath = $dirName.'/'.substr($file->getPathname(), strlen($sourceDir) + 1);
                    $zip->addFile($file->getPathname(), $relativePath);
                    $totalFiles++;
                }
            }
        }

        $zip->close();

        if ($totalFiles === 0) {
            unlink($filepath);
            $this->warn('Hech qanday media fayl topilmadi.');

            return self::SUCCESS;
        }

        $size = round(filesize($filepath) / 1024 / 1024, 2);
        $this->info("✅ Media backup yaratildi: {$filename} ({$totalFiles} fayl, {$size} MB)");
        Log::info("media:backup — {$filename} ({$totalFiles} files, {$size} MB)");

        // Eski backuplarni tozalash (5 tadan ko'p bo'lsa)
        $backups = glob("{$backupDir}/media_backup_*.zip");
        if (count($backups) > 5) {
            usort($backups, fn ($a, $b) => filemtime($a) - filemtime($b));
            $toDelete = array_slice($backups, 0, count($backups) - 5);
            foreach ($toDelete as $old) {
                unlink($old);
                $this->line("  Eski backup o'chirildi: ".basename($old));
            }
        }

        return self::SUCCESS;
    }
}
