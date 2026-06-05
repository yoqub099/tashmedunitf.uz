<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;

class CleanupTempFiles extends Command
{
    protected $signature = 'media:cleanup-temp
                            {--hours=24 : Delete temp files older than this many hours}
                            {--dry-run : Show what would be deleted without actually deleting}';

    protected $description = 'Clean up temporary and orphaned media files';

    public function handle(): int
    {
        $hours = (int) $this->option('hours');
        $dryRun = $this->option('dry-run');
        $threshold = now()->subHours($hours);
        $deletedCount = 0;
        $freedBytes = 0;

        $this->info("Cleaning up temp files older than {$hours} hours...");

        // Clean Laravel temp directory
        $tempPath = storage_path('app/temp');
        if (File::isDirectory($tempPath)) {
            foreach (File::files($tempPath) as $file) {
                if ($file->getMTime() < $threshold->timestamp) {
                    $freedBytes += $file->getSize();
                    $deletedCount++;
                    if (! $dryRun) {
                        File::delete($file->getPathname());
                    }
                    $this->line('  '.($dryRun ? '[DRY] ' : '')."Deleted: {$file->getFilename()}");
                }
            }
        }

        // Clean Spatie medialibrary temp directory
        $spatieTemp = storage_path('media-library/temp');
        if (File::isDirectory($spatieTemp)) {
            foreach (File::allFiles($spatieTemp) as $file) {
                if ($file->getMTime() < $threshold->timestamp) {
                    $freedBytes += $file->getSize();
                    $deletedCount++;
                    if (! $dryRun) {
                        File::delete($file->getPathname());
                    }
                }
            }
        }

        // Clean PHP temp uploads
        $phpTemp = sys_get_temp_dir();
        $phpFiles = glob($phpTemp.'/php*');
        if ($phpFiles) {
            foreach ($phpFiles as $file) {
                if (is_file($file) && filemtime($file) < $threshold->timestamp) {
                    $freedBytes += filesize($file);
                    $deletedCount++;
                    if (! $dryRun) {
                        @unlink($file);
                    }
                }
            }
        }

        $freedMB = round($freedBytes / 1024 / 1024, 2);
        $prefix = $dryRun ? '[DRY RUN] ' : '';

        $this->newLine();
        $this->info("{$prefix}Cleanup complete:");
        $this->line("  Files deleted: {$deletedCount}");
        $this->line("  Space freed: {$freedMB} MB");

        Log::info("media:cleanup-temp — {$prefix}{$deletedCount} files, {$freedMB} MB freed");

        return self::SUCCESS;
    }
}
