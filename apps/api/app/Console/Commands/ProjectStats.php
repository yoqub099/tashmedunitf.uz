<?php

namespace App\Console\Commands;

use App\Models\ContactMessage;
use App\Models\Department;
use App\Models\Direction;
use App\Models\News;
use App\Models\Staff;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class ProjectStats extends Command
{
    protected $signature = 'project:stats';

    protected $description = 'Display project statistics and health overview';

    public function handle(): int
    {
        $this->info('📊 TMTU Termiz — Project Statistics');
        $this->newLine();

        // Database stats
        $this->info('📦 Database Records:');
        $stats = [
            ['News', News::count(), News::where('is_published', true)->count().' published'],
            ['Departments', Department::count(), Department::where('is_active', true)->count().' active'],
            ['Staff', Staff::count(), Staff::where('is_active', true)->count().' active'],
            ['Directions', Direction::count(), Direction::where('is_active', true)->count().' active'],
            ['Contact Messages', ContactMessage::count(), ContactMessage::where('is_read', false)->count().' unread'],
            ['Media Files', Media::count(), $this->formatBytes(Media::sum('size'))],
        ];

        $this->table(['Resource', 'Total', 'Details'], $stats);

        // Storage
        $this->newLine();
        $this->info('💾 Storage:');
        $storagePath = storage_path('app');
        $totalSize = 0;
        if (is_dir($storagePath)) {
            $iterator = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($storagePath, \FilesystemIterator::SKIP_DOTS)
            );
            foreach ($iterator as $file) {
                $totalSize += $file->getSize();
            }
        }
        $this->line("  Total storage used: {$this->formatBytes($totalSize)}");

        // Database size
        try {
            $dbSize = DB::select('SELECT pg_size_pretty(pg_database_size(current_database())) as size');
            $this->line("  Database size: {$dbSize[0]->size}");
        } catch (\Throwable) {
            $this->line('  Database size: unavailable');
        }

        // Cache status
        $this->newLine();
        $this->info('🔧 System:');
        $this->line('  PHP: '.phpversion());
        $this->line('  Laravel: '.app()->version());
        $this->line('  Cache driver: '.config('cache.default'));
        $this->line('  Queue driver: '.config('queue.default'));
        $this->line('  Environment: '.config('app.env'));

        return self::SUCCESS;
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes >= 1073741824) {
            return round($bytes / 1073741824, 2).' GB';
        }
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 2).' MB';
        }
        if ($bytes >= 1024) {
            return round($bytes / 1024, 2).' KB';
        }

        return $bytes.' B';
    }
}
