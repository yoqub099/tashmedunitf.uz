<?php

namespace App\Observers;

use App\Services\CacheService;
use App\Services\FrontendRevalidationService;
use Illuminate\Support\Facades\Log;

/**
 * ModelCacheObserver — Har qanday model uchun cache tozalash
 *
 * Bitta universal observer — barcha modellar uchun ishlaydi
 * Model o'zgarganda:
 * 1. Laravel Redis cache tozalanadi
 * 2. Next.js frontend ISR cache revalidate qilinadi
 *
 * Bu 999 million user har doim yangi ma'lumot ko'rishini ta'minlaydi.
 */
class ModelCacheObserver
{
    public function __construct(
        private readonly string $cachePrefix = 'default'
    ) {}

    public function created($model): void
    {
        $this->clearAll($model, 'created');
    }

    public function updated($model): void
    {
        $this->clearAll($model, 'updated');
    }

    public function deleted($model): void
    {
        $this->clearAll($model, 'deleted');
    }

    public function restored($model): void
    {
        $this->clearAll($model, 'restored');
    }

    public function forceDeleted($model): void
    {
        $this->clearAll($model, 'force_deleted');
        Log::warning("{$this->cachePrefix} force deleted", ['id' => $model->id]);
    }

    /**
     * Laravel cache + Next.js frontend cache tozalash
     */
    private function clearAll($model, string $action): void
    {
        // 1. Laravel Redis/File cache tozalash
        CacheService::clearModel($this->cachePrefix);
        CacheService::clearModel('search');

        // 2. Next.js frontend ISR cache revalidate qilish
        // Fire-and-forget — admin ishini to'xtatmaydi
        FrontendRevalidationService::revalidateByPrefix($this->cachePrefix);

        Log::info("{$this->cachePrefix} {$action}", ['id' => $model->id]);
    }
}
