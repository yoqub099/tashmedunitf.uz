<?php

namespace App\Services;

use App\Models\Department;
use App\Models\Direction;
use App\Models\Faq;
use App\Models\News;
use App\Models\Page;
use App\Models\Staff;

/**
 * Global Search Service — Barcha GIN indexlarni ishlatadi
 *
 * Bu service barcha jadvallardan bir vaqtda JSONB qidiruv qiladi.
 * Har bir model uchun tegishli GIN index avtomatik ishlatiladi:
 * - idx_news_title_gin, idx_news_content_gin
 * - idx_departments_name_gin
 * - idx_staff_fullname_gin
 * - idx_directions_name_gin
 * - idx_faqs_question_gin
 * - idx_pages_title_gin
 */
class SearchService
{
    /**
     * Global qidiruv — barcha jadvallarda
     *
     * Misol: /api/v1/search?q=tibbiyot&locale=uz
     */
    public function search(string $query, string $locale = 'uz', int $limit = 10): array
    {
        // Locale whitelist — SQL injection oldini olish
        $allowedLocales = ['uz', 'ru', 'en'];
        $locale = in_array($locale, $allowedLocales) ? $locale : 'uz';

        $likeQuery = $query.'%';

        $cacheKey = CacheService::key('search', md5($query.$locale.$limit));

        return CacheService::remember($cacheKey, config('cache.ttl.search', 300), function () use ($locale, $likeQuery, $limit) {
            return [
                'news' => News::where(function ($q) use ($locale, $likeQuery) {
                    $q->whereRaw('title->>? ILIKE ?', [$locale, $likeQuery])
                        ->orWhereRaw('content->>? ILIKE ?', [$locale, $likeQuery]);
                })
                    ->where('is_published', true)
                    ->limit($limit)
                    ->get(['id', 'title', 'slug', 'category']),

                'departments' => Department::whereRaw('name->>? ILIKE ?', [$locale, $likeQuery])
                    ->where('is_active', true)
                    ->limit($limit)
                    ->get(['id', 'name', 'slug']),

                'staff' => Staff::whereRaw('full_name->>? ILIKE ?', [$locale, $likeQuery])
                    ->where('is_active', true)
                    ->limit($limit)
                    ->get(['id', 'full_name', 'position', 'department_id']),

                'directions' => Direction::whereRaw('name->>? ILIKE ?', [$locale, $likeQuery])
                    ->where('is_active', true)
                    ->limit($limit)
                    ->get(['id', 'name', 'code', 'level']),

                'faqs' => Faq::whereRaw('question->>? ILIKE ?', [$locale, $likeQuery])
                    ->where('is_active', true)
                    ->limit($limit)
                    ->get(['id', 'question', 'answer', 'category']),

                'pages' => Page::whereRaw('title->>? ILIKE ?', [$locale, $likeQuery])
                    ->where('is_published', true)
                    ->limit($limit)
                    ->get(['id', 'title', 'slug']),
            ];
        });
    }
}
