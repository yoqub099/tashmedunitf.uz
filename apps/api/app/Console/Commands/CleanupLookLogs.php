<?php

namespace App\Console\Commands;

use App\Models\ActivityLog;
use App\Models\ErrorLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

/**
 * /look jurnallarini tozalash — eski audit va xato yozuvlarini o'chiradi.
 *
 *   php artisan look:cleanup                         # default: 180 / 60 kun
 *   php artisan look:cleanup --activity-days=365 --error-days=90
 */
class CleanupLookLogs extends Command
{
    protected $signature = 'look:cleanup
                            {--activity-days=180 : Faollik yozuvlarini necha kundan keyin o\'chirish}
                            {--error-days=60 : Xato yozuvlarini necha kundan keyin o\'chirish}';

    protected $description = 'Eski activity_logs va error_logs yozuvlarini tozalaydi (/look kuzatuv markazi)';

    public function handle(): int
    {
        $activityDays = max(1, (int) $this->option('activity-days'));
        $errorDays = max(1, (int) $this->option('error-days'));

        $activityDeleted = ActivityLog::where('created_at', '<', now()->subDays($activityDays))->delete();
        $errorDeleted = ErrorLog::where('created_at', '<', now()->subDays($errorDays))->delete();

        $this->info("✅ Tozalandi: {$activityDeleted} ta faollik (>{$activityDays} kun) · {$errorDeleted} ta xato (>{$errorDays} kun)");
        Log::info('look:cleanup', [
            'activity_deleted' => $activityDeleted,
            'error_deleted' => $errorDeleted,
        ]);

        return self::SUCCESS;
    }
}
