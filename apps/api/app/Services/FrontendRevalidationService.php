<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * ============================================================
 * FRONTEND REVALIDATION SERVICE
 * ============================================================
 *
 * Laravel model o'zgarganda Next.js frontend cache'ni tozalaydi.
 *
 * MUAMMO:
 * Laravel cache tozalansa ham, Next.js ISR cache eski sahifani beradi.
 * 999 million user eski sahifani ko'radi.
 *
 * YECHIM:
 * Model o'zgarganda bu service Next.js /api/revalidate endpoint'ga
 * HTTP request yuboradi → Next.js revalidateTag() chaqiradi →
 * keyingi request da yangi sahifa generatsiya qilinadi.
 *
 * ISHLATISH:
 *   FrontendRevalidationService::revalidate(['news', 'banners']);
 *   FrontendRevalidationService::revalidateAll();
 *
 * ============================================================
 */
class FrontendRevalidationService
{
    /**
     * Laravel cache prefix → Next.js revalidation tag mapping
     */
    private const PREFIX_TO_TAG = [
        CacheService::PREFIX_NEWS => 'news',
        CacheService::PREFIX_DEPARTMENTS => 'departments',
        CacheService::PREFIX_STAFF => 'staff',
        CacheService::PREFIX_DIRECTIONS => 'directions',
        CacheService::PREFIX_FAQS => 'faqs',
        CacheService::PREFIX_TESTIMONIALS => 'testimonials',
        CacheService::PREFIX_PARTNERS => 'partners',
        CacheService::PREFIX_BANNERS => 'banners',
        CacheService::PREFIX_PAGES => 'pages',
        CacheService::PREFIX_NAV => 'navigation',
        CacheService::PREFIX_SITE_CONTENTS => 'site-contents',
        CacheService::PREFIX_FACULTIES => 'faculties',
        CacheService::PREFIX_LIBRARY_RESOURCES => 'library-resources',
        CacheService::PREFIX_JOURNAL_ISSUES => 'journal-issues',
        CacheService::PREFIX_TRANSLATIONS => 'translations',
        // Yetishmagan mappingar — frontend tag konvensiyasi (dash bilan)
        CacheService::PREFIX_TALENTED_STUDENTS => 'talented-students',
        CacheService::PREFIX_CAREER_CENTER_INFOS => 'career-center-infos',
        CacheService::PREFIX_STUDENT_LIFE_PHOTOS => 'student-life-photos',
        CacheService::PREFIX_SITE_MEDIA => 'site-media',
        CacheService::PREFIX_CONTACT_LOCATIONS => 'contact-locations',
        CacheService::PREFIX_STUDENT_WORKS => 'student-works',
    ];

    /**
     * Next.js frontend cache'ni tag bo'yicha tozalash
     *
     * @param  string[]|string  $tags  — Next.js revalidation tag(lar)
     * @param  string[]|string|null  $paths  — Qo'shimcha path(lar) revalidate qilish
     */
    public static function revalidate(array|string $tags, array|string|null $paths = null): void
    {
        $frontendUrl = config('app.frontend_url');
        $secret = config('app.revalidation_secret');

        if (! $frontendUrl || ! $secret) {
            return; // Config sozlanmagan — o'tkazib yuborish
        }

        $tags = is_string($tags) ? [$tags] : $tags;
        $paths = $paths ? (is_string($paths) ? [$paths] : $paths) : null;

        // Fire-and-forget — frontend javobini kutmaymiz (async)
        try {
            Http::timeout(5)
                ->retry(2, 500)
                ->post("{$frontendUrl}/api/revalidate", [
                    'tags' => $tags,
                    'paths' => $paths,
                    'secret' => $secret,
                ]);
        } catch (\Throwable $e) {
            // Xato bo'lsa ham admin ishini to'xtatmaymiz
            Log::warning('Frontend revalidation failed', [
                'tags' => $tags,
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Cache prefix dan Next.js tag'ga o'girish va revalidate qilish
     *
     * Observer'lardan chaqiriladi:
     *   FrontendRevalidationService::revalidateByPrefix('news');
     */
    public static function revalidateByPrefix(string $prefix): void
    {
        $tag = self::PREFIX_TO_TAG[$prefix] ?? $prefix;
        self::revalidate([$tag]);
    }

    /**
     * BARCHA cache'ni tozalash (deploy paytida)
     *
     *   FrontendRevalidationService::revalidateAll();
     */
    public static function revalidateAll(): void
    {
        self::revalidate(array_values(self::PREFIX_TO_TAG), ['/']);
    }
}
