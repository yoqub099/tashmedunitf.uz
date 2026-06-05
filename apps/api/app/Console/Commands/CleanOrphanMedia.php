<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class CleanOrphanMedia extends Command
{
    protected $signature = 'media:clean-orphans
                            {--dry-run : Show what would be deleted without actually deleting}
                            {--force : Skip confirmation prompt}
                            {--days=7 : Only clean orphans older than this many days}';

    protected $description = 'Clean up orphan media records whose parent models no longer exist';

    /**
     * All models that use Spatie Media Library.
     * Automatically detected from the media table.
     */
    public function handle(): int
    {
        $dryRun = $this->option('dry-run');
        $days = (int) $this->option('days');
        $threshold = now()->subDays($days);

        $this->info($dryRun ? '🔍 DRY RUN — hech narsa o\'chirilmaydi' : '🧹 Orphan media tozalash boshlandi...');
        $this->info("  {$days} kundan eski orphanlar tekshiriladi (< {$threshold->toDateTimeString()})");
        $this->newLine();

        // Get all distinct model types from media table
        $modelTypes = DB::table('media')
            ->select('model_type')
            ->distinct()
            ->pluck('model_type');

        $totalOrphans = 0;
        $totalBytes = 0;
        $orphanDetails = [];

        foreach ($modelTypes as $modelType) {
            if (! class_exists($modelType)) {
                $this->warn("⚠ Model class not found: {$modelType}");

                continue;
            }

            // Get table name from model
            $model = new $modelType;
            $table = $model->getTable();

            // Check if model uses SoftDeletes — if so, include trashed
            $usesSoftDeletes = in_array(
                \Illuminate\Database\Eloquent\SoftDeletes::class,
                class_uses_recursive($modelType)
            );

            // Get all valid model IDs (including soft-deleted to be safe)
            if ($usesSoftDeletes) {
                $validIds = DB::table($table)->pluck('id');
            } else {
                $validIds = DB::table($table)->pluck('id');
            }

            // Find orphan media for this model type (older than threshold)
            $orphans = DB::table('media')
                ->where('model_type', $modelType)
                ->where('created_at', '<', $threshold)
                ->when($validIds->isNotEmpty(), function ($q) use ($validIds) {
                    $q->whereNotIn('model_id', $validIds);
                }, function ($q) {
                    // If table is completely empty, all media for this type are orphans
                    // But only if there truly are no records
                })
                ->get();

            // If validIds is empty, we need to handle differently
            if ($validIds->isEmpty()) {
                $orphans = DB::table('media')
                    ->where('model_type', $modelType)
                    ->where('created_at', '<', $threshold)
                    ->get();
            }

            if ($orphans->isEmpty()) {
                continue;
            }

            $shortName = class_basename($modelType);
            $this->line("📦 <comment>{$shortName}</comment>: {$orphans->count()} ta orphan media topildi");

            foreach ($orphans as $orphan) {
                $fileSize = $orphan->size ?? 0;
                $totalBytes += $fileSize;
                $totalOrphans++;

                $orphanDetails[] = [
                    'id' => $orphan->id,
                    'model' => $shortName,
                    'model_id' => $orphan->model_id,
                    'file' => $orphan->file_name,
                    'size' => $this->formatBytes($fileSize),
                    'created' => $orphan->created_at,
                ];
            }
        }

        if ($totalOrphans === 0) {
            $this->info('✅ DB orphan media topilmadi');
            // Still check disk-level orphans
            $this->cleanDiskOrphans();

            return self::SUCCESS;
        }

        // Show table of orphans
        $this->newLine();
        $this->table(
            ['ID', 'Model', 'Model ID', 'File', 'Size', 'Created'],
            $orphanDetails
        );

        $this->newLine();
        $this->info("Jami: {$totalOrphans} ta orphan media ({$this->formatBytes($totalBytes)})");

        if ($dryRun) {
            $this->warn('🔍 DRY RUN — o\'chirish uchun --dry-run ni olib tashlang');

            return self::SUCCESS;
        }

        // Confirmation
        if (! $this->option('force') && ! $this->confirm("Shu {$totalOrphans} ta orphan media o'chirilsinmi?")) {
            $this->info('Bekor qilindi.');

            return self::SUCCESS;
        }

        // Delete orphans using Spatie's built-in method (cleans files + conversions)
        $deletedCount = 0;
        $failedCount = 0;
        $orphanIds = collect($orphanDetails)->pluck('id');

        foreach ($orphanIds as $mediaId) {
            try {
                $media = Media::find($mediaId);
                if ($media) {
                    $media->delete(); // Spatie handles file cleanup automatically
                    $deletedCount++;
                } else {
                    // Record might already be deleted, clean DB row
                    DB::table('media')->where('id', $mediaId)->delete();
                    $deletedCount++;
                }
            } catch (\Throwable $e) {
                $failedCount++;
                $this->error("  ✗ Media #{$mediaId}: {$e->getMessage()}");
                Log::warning("Orphan media cleanup failed for #{$mediaId}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->newLine();
        $this->info("✅ {$deletedCount} ta orphan media o'chirildi ({$this->formatBytes($totalBytes)})");
        if ($failedCount > 0) {
            $this->warn("⚠ {$failedCount} ta o'chirishda xato yuz berdi (loglarni tekshiring)");
        }

        Log::info("Orphan media cleanup: {$deletedCount} deleted, {$failedCount} failed, {$this->formatBytes($totalBytes)} freed");

        // Also clean empty media directories on disk
        $this->cleanEmptyDirectories();

        // Clean disk-level orphans (directories with files but no DB record)
        $this->cleanDiskOrphans();

        return self::SUCCESS;
    }

    /**
     * Remove directories on disk whose media ID doesn't exist in the database.
     * This catches cases where Spatie deleted the DB record but failed to delete
     * the physical files (e.g., due to file locks on Windows).
     */
    private function cleanDiskOrphans(): void
    {
        $disk = Storage::disk('public');
        $directories = $disk->directories('media');
        $cleaned = 0;
        $freedBytes = 0;

        foreach ($directories as $dir) {
            $mediaId = basename($dir);
            if (! is_numeric($mediaId)) {
                continue;
            }

            $exists = Media::where('id', $mediaId)->exists();
            if ($exists) {
                continue;
            }

            // Orphan directory — has files but no DB record
            $files = $disk->allFiles($dir);
            foreach ($files as $file) {
                $freedBytes += $disk->size($file);
            }

            try {
                $disk->deleteDirectory($dir);
                $cleaned++;
                $this->line("  <fg=red>✗</> Disk orphan: {$dir}/ — <fg=red>O'CHIRILDI</>");
                Log::info("Disk orphan media cleaned: {$dir}");
            } catch (\Throwable $e) {
                $this->warn("  ⚠ Disk orphan o'chirib bo'lmadi: {$dir} — {$e->getMessage()}");
            }
        }

        if ($cleaned > 0) {
            $this->line("🗂 {$cleaned} ta disk orphan papka o'chirildi ({$this->formatBytes($freedBytes)} bo'shatildi)");
        }
    }

    /**
     * Remove empty directories in media storage.
     */
    private function cleanEmptyDirectories(): void
    {
        $mediaPath = storage_path('app/public/media');
        if (! is_dir($mediaPath)) {
            return;
        }

        $cleaned = 0;
        $dirs = glob($mediaPath.'/*', GLOB_ONLYDIR);
        foreach ($dirs as $dir) {
            // Check if directory is empty (no files, only maybe empty subdirs)
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS),
                \RecursiveIteratorIterator::CHILD_FIRST
            );

            $hasFiles = false;
            foreach ($files as $file) {
                if ($file->isFile()) {
                    $hasFiles = true;
                    break;
                }
            }

            if (! $hasFiles) {
                try {
                    $this->removeDirectory($dir);
                    $cleaned++;
                } catch (\Throwable $e) {
                    $this->warn("  ⚠ Papka o'chirib bo'lmadi: ".basename($dir)." — {$e->getMessage()}");
                }
            }
        }

        if ($cleaned > 0) {
            $this->line("🗂 {$cleaned} ta bo'sh media papka o'chirildi");
        }
    }

    /**
     * Recursively remove a directory.
     */
    private function removeDirectory(string $dir): void
    {
        if (! is_dir($dir)) {
            return;
        }

        $items = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS),
            \RecursiveIteratorIterator::CHILD_FIRST
        );

        foreach ($items as $item) {
            if ($item->isDir()) {
                rmdir($item->getPathname());
            } else {
                unlink($item->getPathname());
            }
        }

        rmdir($dir);
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes === 0) {
            return '0 B';
        }
        $units = ['B', 'KB', 'MB', 'GB'];
        $i = floor(log($bytes, 1024));

        return round($bytes / pow(1024, $i), 2).' '.$units[$i];
    }
}
