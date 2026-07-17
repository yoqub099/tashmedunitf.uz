<?php

namespace App\Http\Resources\Concerns;

use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Konversiya URL'larini xavfsiz qurish.
 *
 * Muammo: `getFirstMediaUrl($collection, $conversion)` konversiya fayli
 * diskda YO'Q bo'lsa ham URL qaytaradi (mavjudlikni tekshirmaydi) —
 * frontend 404 beruvchi rasm URL oladi. 2026-06 navbat/huquq muammosi
 * davrida yuklangan ~21 ta media konversiyasiz qolgan; kelajakda ham
 * konversiya xato ketsa sayt buzilmasligi kerak.
 *
 * Yechim: konversiya haqiqatan yaratilgan bo'lsa — uning URL'i, aks holda
 * original fayl URL'i (PageResource'dagi hasGeneratedConversion patterni).
 */
trait HasSafeConversionUrls
{
    /**
     * Konversiya bor → konversiya URL; yo'q → original URL; media yo'q → null.
     */
    protected function safeConversionUrl(?Media $media, string $conversion): ?string
    {
        if (! $media) {
            return null;
        }

        return $media->hasGeneratedConversion($conversion)
            ? $media->getUrl($conversion)
            : $media->getUrl();
    }
}
