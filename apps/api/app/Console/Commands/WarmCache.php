<?php

namespace App\Console\Commands;

use App\Services\BannerService;
use App\Services\DepartmentService;
use App\Services\DirectionService;
use App\Services\FaqService;
use App\Services\NewsService;
use App\Services\PageService;
use App\Services\PartnerService;
use App\Services\TestimonialService;
use Illuminate\Console\Command;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class WarmCache extends Command
{
    protected $signature = 'cache:warm
                            {--only= : Warm only specific resources (comma-separated: news,banners,departments)}';

    protected $description = 'Pre-warm cache for frequently accessed data';

    public function handle(): int
    {
        $only = $this->option('only')
            ? explode(',', $this->option('only'))
            : null;

        $this->info('🔥 Warming cache...');
        $warmed = 0;
        $request = new Request;

        $resources = [
            'news' => fn () => app(NewsService::class)->getAll($request),
            'departments' => fn () => app(DepartmentService::class)->getAll($request),
            'directions' => fn () => app(DirectionService::class)->getAll($request),
            'faqs' => fn () => app(FaqService::class)->getAll($request),
            'banners' => fn () => app(BannerService::class)->getAll($request),
            'partners' => fn () => app(PartnerService::class)->getAll($request),
            'testimonials' => fn () => app(TestimonialService::class)->getAll($request),
            'pages' => fn () => app(PageService::class)->getAll($request),
        ];

        foreach ($resources as $name => $loader) {
            if ($only && ! in_array($name, $only)) {
                continue;
            }

            try {
                $start = microtime(true);
                $loader();
                $elapsed = round((microtime(true) - $start) * 1000);
                $this->line("  ✅ {$name} — cached ({$elapsed}ms)");
                $warmed++;
            } catch (\Throwable $e) {
                $this->error("  ❌ {$name} — failed: {$e->getMessage()}");
                Log::error("cache:warm failed for {$name}", ['error' => $e->getMessage()]);
            }
        }

        $this->newLine();
        $this->info("Cache warming complete: {$warmed} resources cached.");
        Log::info("cache:warm completed — {$warmed} resources cached");

        return self::SUCCESS;
    }
}
