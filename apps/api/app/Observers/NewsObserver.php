<?php

namespace App\Observers;

use App\Models\News;
use App\Services\CacheService;
use App\Services\FrontendRevalidationService;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;

/**
 * NewsObserver — Yangiliklar o'zgarganda:
 * 1. Laravel cache tozalash
 * 2. Next.js frontend ISR cache revalidate qilish
 *
 * ShouldHandleEventsAfterCommit — DB commit bo'lgandan keyin ishlaydi
 */
class NewsObserver implements ShouldHandleEventsAfterCommit
{
    public function created(News $news): void
    {
        $this->clearAll($news, 'created');
        Log::info('News created', ['id' => $news->id, 'title' => $news->getTranslation('title', 'uz')]);
    }

    public function updated(News $news): void
    {
        $this->clearAll($news, 'updated');
    }

    public function deleted(News $news): void
    {
        $this->clearAll($news, 'deleted');
    }

    public function restored(News $news): void
    {
        $this->clearAll($news, 'restored');
    }

    public function forceDeleted(News $news): void
    {
        $this->clearAll($news, 'force_deleted');
        Log::warning('News force deleted', ['id' => $news->id]);
    }

    private function clearAll(News $news, string $action): void
    {
        // 1. Laravel cache
        CacheService::clearModel(CacheService::PREFIX_NEWS);
        CacheService::clearModel('search');

        // 2. Next.js frontend ISR cache
        FrontendRevalidationService::revalidateByPrefix(CacheService::PREFIX_NEWS);

        Log::info("News {$action}", ['id' => $news->id]);
    }
}
