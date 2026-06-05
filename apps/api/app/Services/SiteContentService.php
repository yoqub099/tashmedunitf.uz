<?php

namespace App\Services;

use App\Models\SiteContent;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class SiteContentService
{
    /**
     * Bo'lim bo'yicha barcha kontentlarni olish (public)
     */
    public function getBySection(string $section): Collection
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_SITE_CONTENTS, $section);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($section) {
            return SiteContent::where('section', $section)->get();
        });
    }

    /**
     * Barcha kontentlarni olish (admin)
     */
    public function getAll(?string $section = null): Collection
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_SITE_CONTENTS, 'all', $section ?? 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($section) {
            $query = SiteContent::query();

            if ($section) {
                $query->where('section', $section);
            }

            return $query->orderBy('section')->orderBy('key')->get();
        });
    }

    /**
     * Kontentni yaratish yoki yangilash (upsert)
     */
    public function upsert(string $key, string $section, array $value, string $type = 'text'): SiteContent
    {
        $content = DB::transaction(function () use ($key, $section, $value, $type) {
            return SiteContent::updateOrCreate(
                ['key' => $key],
                [
                    'section' => $section,
                    'value' => $value,
                    'type' => $type,
                ]
            );
        });

        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);

        return $content;
    }

    /**
     * Kontentni o'chirish
     */
    public function delete(string $key): bool
    {
        $deleted = SiteContent::where('key', $key)->delete();
        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);

        return $deleted > 0;
    }

    /**
     * Bir nechta kontentlarni bir vaqtda yangilash (batch upsert)
     */
    public function batchUpsert(array $items): array
    {
        $results = DB::transaction(function () use ($items) {
            $updated = [];

            foreach ($items as $item) {
                $updated[] = SiteContent::updateOrCreate(
                    ['key' => $item['key']],
                    [
                        'section' => $item['section'],
                        'value' => $item['value'],
                        'type' => $item['type'] ?? 'text',
                    ]
                );
            }

            return $updated;
        });

        CacheService::clearModel(CacheService::PREFIX_SITE_CONTENTS);

        return $results;
    }
}
