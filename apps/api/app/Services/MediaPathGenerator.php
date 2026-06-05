<?php

namespace App\Services;

use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\PathGenerator\PathGenerator;

/**
 * ============================================================
 * CUSTOM PATH GENERATOR — Professional Storage Structure
 * ============================================================
 *
 * YANGI fayllar uchun tartibli yo'l yaratadi:
 *   news/5/thumbnail/photo.webp
 *   staff/12/photo/avatar.webp
 *
 * ESKI fayllar (media/{id}/) uchun — avvalgi yo'lni saqlaydi!
 * Agar DB dagi media record eski formatda bo'lsa, o'sha yo'lni
 * qaytaradi. Bu mavjud fayllar buzilmasligini ta'minlaydi.
 *
 * ============================================================
 */
class MediaPathGenerator implements PathGenerator
{
    /**
     * Model class → papka nomi mapping
     */
    private const MODEL_FOLDERS = [
        'App\Models\News' => 'news',
        'App\Models\Page' => 'pages',
        'App\Models\Staff' => 'staff',
        'App\Models\Department' => 'departments',
        'App\Models\Banner' => 'banners',
        'App\Models\Direction' => 'directions',
        'App\Models\Faculty' => 'faculties',
        'App\Models\LibraryResource' => 'library',
        'App\Models\JournalIssue' => 'journal',
        'App\Models\Partner' => 'partners',
        'App\Models\Testimonial' => 'testimonials',
        'App\Models\TalentedStudent' => 'students/talented',
        'App\Models\StudentLifePhoto' => 'students/life',
        'App\Models\ContactMessage' => 'contacts',
        'App\Models\SiteMedia' => 'site',
        'App\Models\JobApplication' => 'jobs',
    ];

    public function getPath(Media $media): string
    {
        // ESKI FAYLLAR: Agar media allaqachon saqlangan bo'lsa va
        // eski formatda (media/{id}/ yoki {id}/) bo'lsa — o'sha yo'lni qaytarish
        if ($this->isLegacyMedia($media)) {
            return $media->id.'/';
        }

        return $this->buildPath($media).'/';
    }

    public function getPathForConversions(Media $media): string
    {
        if ($this->isLegacyMedia($media)) {
            return $media->id.'/conversions/';
        }

        return $this->buildPath($media).'/conversions/';
    }

    public function getPathForResponsiveImages(Media $media): string
    {
        if ($this->isLegacyMedia($media)) {
            return $media->id.'/responsive/';
        }

        return $this->buildPath($media).'/responsive/';
    }

    /**
     * Yangi yo'l qurilishi:
     * {model_folder}/{model_id}/{collection}
     *
     * Masalan: news/5/thumbnail
     */
    private function buildPath(Media $media): string
    {
        $modelFolder = self::MODEL_FOLDERS[$media->model_type] ?? $this->fallbackFolder($media->model_type);
        $modelId = $media->model_id;
        $collection = $media->collection_name ?: 'default';

        return "{$modelFolder}/{$modelId}/{$collection}";
    }

    /**
     * Eski formatdagi media ekanligini aniqlash
     *
     * Eski fayllar `media/{id}/filename` formatida saqlangan.
     * Agar diskda shu yo'lda fayl mavjud bo'lsa — bu eski media.
     *
     * Yangi fayllar `news/{model_id}/collection/filename` formatida bo'ladi.
     */
    private function isLegacyMedia(Media $media): bool
    {
        // Agar media hali saqlanmagan (yangi) bo'lsa — yangi format
        if (! $media->exists || ! $media->id) {
            return false;
        }

        // Eski yo'lda fayl borligini tekshirish
        $disk = $media->disk ?: config('media-library.disk_name', 'public');
        $legacyPath = $media->id.'/'.$media->file_name;

        try {
            return \Illuminate\Support\Facades\Storage::disk($disk)->exists($legacyPath);
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Noma'lum model uchun class nomidan papka yaratish
     * App\Models\SomeModel → some-model
     */
    private function fallbackFolder(string $modelType): string
    {
        $className = class_basename($modelType);

        return strtolower(preg_replace('/([a-z])([A-Z])/', '$1-$2', $className));
    }
}
