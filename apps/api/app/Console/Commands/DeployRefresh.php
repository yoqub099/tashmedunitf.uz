<?php

namespace App\Console\Commands;

use App\Services\FrontendRevalidationService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

/**
 * ============================================================
 * DEPLOY REFRESH — Deploy qilganda barcha cache tozalash
 * ============================================================
 *
 * Deploy qilganda SHU KOMANDANI ISHGA TUSHIRING:
 *
 *   php artisan deploy:refresh
 *
 * Nima qiladi:
 * 1. Laravel cache tozalaydi (Redis/File)
 * 2. Route cache yangilaydi
 * 3. Config cache yangilaydi
 * 4. View cache yangilaydi
 * 5. Next.js frontend ISR cache revalidate qiladi
 * 6. Queue worker'larni restart qiladi
 *
 * Bu 999 million user darhol yangi sahifani ko'rishini ta'minlaydi.
 *
 * ============================================================
 */
class DeployRefresh extends Command
{
    protected $signature = 'deploy:refresh
                            {--skip-frontend : Frontend revalidation qilmaslik}
                            {--skip-cache : Laravel cache tozalamaslik}';

    protected $description = 'Deploy qilganda barcha cache tozalash — 999M user darhol yangi sahifani ko\'radi';

    public function handle(): int
    {
        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════════════╗');
        $this->info('║         DEPLOY REFRESH — Barcha cache tozalash          ║');
        $this->info('║         '.now()->format('Y-m-d H:i:s').'                             ║');
        $this->info('╚══════════════════════════════════════════════════════════╝');
        $this->newLine();

        // 1. Laravel cache
        if (! $this->option('skip-cache')) {
            $this->info('1. Laravel cache tozalanmoqda...');
            Cache::flush();
            $this->line('   <fg=green>✓</> Application cache tozalandi');

            $this->call('config:cache');
            $this->line('   <fg=green>✓</> Config cache yangilandi');

            $this->call('route:cache');
            $this->line('   <fg=green>✓</> Route cache yangilandi');

            $this->call('view:cache');
            $this->line('   <fg=green>✓</> View cache yangilandi');

            $this->call('event:cache');
            $this->line('   <fg=green>✓</> Event cache yangilandi');
        }

        // 2. Queue restart
        $this->newLine();
        $this->info('2. Queue worker restart...');
        $this->call('queue:restart');
        $this->line('   <fg=green>✓</> Queue worker restart signali yuborildi');

        // 3. Frontend revalidation
        if (! $this->option('skip-frontend')) {
            $this->newLine();
            $this->info('3. Next.js frontend revalidation...');

            $frontendUrl = config('app.frontend_url');
            $secret = config('app.revalidation_secret');

            if ($frontendUrl && $secret) {
                try {
                    FrontendRevalidationService::revalidateAll();
                    $this->line('   <fg=green>✓</> Frontend revalidation yuborildi → '.$frontendUrl);
                } catch (\Throwable $e) {
                    $this->warn('   ⚠ Frontend revalidation xatosi: '.$e->getMessage());
                    $this->line('   Qo\'lda bajaring: curl -X POST '.$frontendUrl.'/api/revalidate');
                }
            } else {
                $this->warn('   ⚠ FRONTEND_URL yoki REVALIDATION_SECRET .env da sozlanmagan');
                $this->line('   .env ga qo\'shing:');
                $this->line('     FRONTEND_URL=https://tdtutf.uz');
                $this->line('     REVALIDATION_SECRET=your-secret-key');
            }
        }

        // 4. Cache warm
        $this->newLine();
        $this->info('4. Cache isitish (warm)...');
        try {
            $this->call('cache:warm');
        } catch (\Throwable $e) {
            $this->warn('   ⚠ Cache warm xatosi: '.$e->getMessage());
        }

        // NATIJA
        $this->newLine();
        $this->info('╔══════════════════════════════════════════════════════════╗');
        $this->info('║  ✅ DEPLOY REFRESH TAYYOR — 999M user yangi sahifani    ║');
        $this->info('║     ko\'radi!                                            ║');
        $this->info('╚══════════════════════════════════════════════════════════╝');
        $this->newLine();

        Log::info('deploy:refresh completed');

        return self::SUCCESS;
    }
}
