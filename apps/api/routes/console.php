<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Task Scheduling — TMTU Production Server
|--------------------------------------------------------------------------
|
| Server: 60 GB RAM, 4 TB SSD
| Cron: * * * * * cd /var/www/tmtu-termiz/apps/api && /usr/bin/php8.4 artisan schedule:run >/dev/null 2>&1
|
| TARTIB (tungi ishlar — foydalanuvchilar kam paytda):
|
| 02:00 — Media health check (diagnostika)
| 03:00 — Database backup
| 03:30 — Media backup
| 04:00 — Orphan media cleanup (haftalik)
| 04:30 — Full media cleanup (haftalik)
| 04:45 — Look monitoring loglarini tozalash (activity 180 kun / error 60 kun)
|
| KUNLIK:
| Har 6 soat — Temp fayllar tozalash
| Har 1 soat — Spatie media-library clean
| Har 30 min — Cache warm
| Har kuni 08:00 — Project statistika
|
|--------------------------------------------------------------------------
*/

// ══════════════════════════════════════
// TEZ-TEZ ISHLAYDIGAN (har soat / har necha daqiqa)
// ══════════════════════════════════════

// Kesh isitish — har 30 daqiqada
Schedule::command('cache:warm')
    ->everyThirtyMinutes()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/cache-warm.log'));

// Spatie media-library clean — har soatda
Schedule::command('media-library:clean')
    ->hourly()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/media-clean.log'));

// Temp fayllar tozalash — har 6 soatda
Schedule::command('media:cleanup-temp --hours=24')
    ->everySixHours()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/cleanup.log'));

// ══════════════════════════════════════
// TUNGI ISHLAR (02:00 — 05:00)
// ══════════════════════════════════════

// Storage salomatlik tekshiruvi — har kuni 02:00 da
Schedule::command('media:health --json')
    ->dailyAt('02:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/health.log'));

// Database backup — har kuni 03:00 da
Schedule::command('db:backup --compress')
    ->dailyAt('03:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/backup.log'));

// Media backup — har kuni 03:30 da
Schedule::command('media:backup')
    ->dailyAt('03:30')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/media-backup.log'));

// Orphan media tozalash (DB record) — haftalik yakshanba 04:00 da
Schedule::command('media:clean-orphans --force --days=7')
    ->weeklyOn(0, '04:00')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/orphan-cleanup.log'));

// Full media cleanup (disk) — haftalik yakshanba 04:30 da
Schedule::command('media:cleanup --force --days=60')
    ->weeklyOn(0, '04:30')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/media-cleanup.log'));

// ══════════════════════════════════════
// STATISTIKA
// ══════════════════════════════════════

// Project statistika — har kuni 08:00 da
Schedule::command('project:stats')
    ->dailyAt('08:00')
    ->appendOutputTo(storage_path('logs/stats.log'));

// ══════════════════════════════════════
// /LOOK — kuzatuv markazi jurnallarini tozalash
// ══════════════════════════════════════

// Eski audit/xato yozuvlarini tozalash — har kuni 04:45 da
Schedule::command('look:cleanup')
    ->dailyAt('04:45')
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/look-cleanup.log'));
