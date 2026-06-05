<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;

/**
 * Centralized cache management for TDTUTF
 *
 * Redis: Cache::tags() orqali guruhlash va tozalash
 * File/DB: Key tracking orqali tegishli cachlarni aniq tozalash
 *
 * Cache TTL strategy:
 * - Static data (banners, partners, FAQs): 1 soat
 * - Semi-dynamic (departments, staff, directions): 5 daqiqa
 * - Dynamic (news): 1 daqiqa
 * - Pages: 5 daqiqa
 *
 * Observer-lar o'zgarganda cache tozalaydi, TTL faqat xavfsizlik uchun
 */
class CacheService
{
    // Cache TTL in seconds
    public const TTL_SHORT = 60;          // 1 daqiqa

    public const TTL_MEDIUM = 300;        // 5 daqiqa

    public const TTL_LONG = 3600;         // 1 soat

    public const TTL_PAGE = 300;          // 5 daqiqa

    // Cache key prefixes
    public const PREFIX_NEWS = 'news';

    public const PREFIX_DEPARTMENTS = 'departments';

    public const PREFIX_STAFF = 'staff';

    public const PREFIX_DIRECTIONS = 'directions';

    public const PREFIX_FAQS = 'faqs';

    public const PREFIX_TESTIMONIALS = 'testimonials';

    public const PREFIX_PARTNERS = 'partners';

    public const PREFIX_BANNERS = 'banners';

    public const PREFIX_PAGES = 'pages';

    public const PREFIX_NAV = 'navigation';

    public const PREFIX_SEARCH = 'search';

    public const PREFIX_SITE_CONTENTS = 'site_contents';

    public const PREFIX_FACULTIES = 'faculties';

    public const PREFIX_TALENTED_STUDENTS = 'talented_students';

    public const PREFIX_CAREER_CENTER_INFOS = 'career_center_infos';

    public const PREFIX_STUDENT_LIFE_PHOTOS = 'student_life_photos';

    public const PREFIX_SITE_MEDIA = 'site_media';

    public const PREFIX_CONTACT_LOCATIONS = 'contact_locations';

    public const PREFIX_LIBRARY_RESOURCES = 'library_resources';

    public const PREFIX_JOURNAL_ISSUES = 'journal_issues';

    public const PREFIX_TRANSLATIONS = 'translations';

    public const PREFIX_STUDENT_WORKS = 'student_works';

    /**
     * Generate cache key from prefix and params
     */
    public static function key(string $prefix, string ...$parts): string
    {
        return $prefix.':'.implode(':', $parts);
    }

    /**
     * Generate cache key from request query string
     */
    public static function requestKey(string $prefix, array $params = []): string
    {
        ksort($params);

        return $prefix.':list:'.md5(serialize($params));
    }

    /**
     * Redis yoki yo'qligini tekshirish
     */
    private static function isRedis(): bool
    {
        return Cache::getStore() instanceof \Illuminate\Cache\RedisStore;
    }

    /**
     * File driver uchun key tracking — saqlangan keylarni kuzatish
     */
    private static function trackKey(string $prefix, string $key): void
    {
        $trackingKey = "_tracked_keys:{$prefix}";
        $keys = Cache::get($trackingKey, []);
        if (! in_array($key, $keys)) {
            $keys[] = $key;
            Cache::put($trackingKey, $keys, 86400 * 7); // 1 hafta
        }
    }

    /**
     * Clear all cache for a specific model type
     * Redis: tags()->flush() — O(1) tez
     * File: tracked keylarni birma-bir o'chirish
     */
    public static function clearModel(string $prefix): void
    {
        if (self::isRedis()) {
            Cache::tags([$prefix])->flush();

            return;
        }

        // File/DB driver — tracked keylarni o'chirish
        $trackingKey = "_tracked_keys:{$prefix}";
        $keys = Cache::get($trackingKey, []);

        foreach ($keys as $key) {
            Cache::forget($key);
        }

        Cache::forget($trackingKey);
    }

    /**
     * Remember with tag support
     * Redis: Cache::tags() bilan saqlash (clearModel() bilan to'g'ri tozalanadi)
     * File: oddiy Cache::remember() + key tracking
     *
     * @param  string  $key  Cache kaliti
     * @param  int  $ttl  Muddat (soniyalarda)
     * @param  callable  $callback  Ma'lumot olish funksiyasi
     * @param  string|null  $tag  Redis tag nomi (null = keydan avtomatik aniqlash)
     */
    public static function remember(string $key, int $ttl, callable $callback, ?string $tag = null): mixed
    {
        // Tag nomini kalitdan avtomatik aniqlash: "news:list:abc" -> "news"
        $tag = $tag ?? explode(':', $key)[0];

        if (self::isRedis()) {
            return Cache::tags([$tag])->remember($key, $ttl, $callback);
        }

        // File driver — oddiy remember + key tracking
        self::trackKey($tag, $key);

        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Forget a specific key
     */
    public static function forget(string $key): void
    {
        if (self::isRedis()) {
            $tag = explode(':', $key)[0];
            Cache::tags([$tag])->forget($key);

            return;
        }

        Cache::forget($key);
    }
}
