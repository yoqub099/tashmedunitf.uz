<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class News extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'is_published',
        'published_at',
    ];

    public array $translatable = ['title', 'excerpt', 'content'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate()
            ->preventOverwrite();
    }

    // ========================================
    // SCOPES — Har biri tegishli INDEX ishlatadi
    // ========================================

    /**
     * PARTIAL INDEX: idx_news_published_date
     * Faqat published yangiliklar (eng ko'p ishlatiladigan)
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at');
    }

    /**
     * PARTIAL INDEX: idx_news_category_published
     * Kategoriya bo'yicha filtrlash (published ichida)
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('is_published', true)
            ->where('category', $category)
            ->orderByDesc('published_at');
    }

    /**
     * GIN INDEX: idx_news_title_gin
     * 3 tilda sarlavha qidiruv (JSONB partial match — ILIKE)
     */
    public function scopeSearchTitle($query, string $search, string $locale = 'uz')
    {
        $locale = in_array($locale, ['uz', 'ru', 'en']) ? $locale : 'uz';

        return $query->whereRaw(
            'LOWER(title->>?) ILIKE ?',
            [$locale, '%'.mb_strtolower($search).'%']
        );
    }

    /**
     * GIN INDEX: idx_news_content_gin
     * 3 tilda content qidiruv
     */
    public function scopeSearchContent($query, string $search, string $locale = 'uz')
    {
        $locale = in_array($locale, ['uz', 'ru', 'en']) ? $locale : 'uz';

        return $query->whereRaw(
            'LOWER(content->>?) ILIKE ?',
            [$locale, '%'.mb_strtolower($search).'%']
        );
    }

    /**
     * BRIN INDEX: idx_news_created_brin
     * Vaqt oralig'ida qidiruv (arxiv uchun)
     */
    public function scopeCreatedBetween($query, string $from, string $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }

    // ========================================
    // MEDIA COLLECTIONS — Pro Level
    // ========================================

    /**
     * Yangilik uchun media collectionlar:
     *
     * 'thumbnail' — Asosiy rasm (1 ta)
     *   → jpg, png, webp, gif, avif | Max: 10MB
     *   → Auto: WebP thumbnail(400x300), medium(800x600), large(1920x1080)
     *
     * 'gallery' — Gallereya rasmlari (ko'p)
     * 'documents' — PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
     * 'videos' — MP4, WebM, MOV
     * 'audio' — MP3, WAV, OGG, FLAC (audio ma'ruza)
     * 'archives' — ZIP, RAR, 7Z (kurs materiallari)
     * 'books' — PDF, EPUB, MOBI (darsliklar)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('documents')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-powerpoint',
                'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'text/plain',
                'text/csv',
            ])
            ->useDisk('public');

        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/webm', 'video/mpeg', 'video/quicktime'])
            ->useDisk('public');

        $this->addMediaCollection('audio')
            ->acceptsMimeTypes(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac', 'audio/aac', 'audio/mp4'])
            ->useDisk('public');

        $this->addMediaCollection('archives')
            ->acceptsMimeTypes([
                'application/zip', 'application/x-zip-compressed',
                'application/x-rar-compressed', 'application/vnd.rar',
                'application/x-7z-compressed',
            ])
            ->useDisk('public');

        $this->addMediaCollection('books')
            ->acceptsMimeTypes(['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'])
            ->useDisk('public');
    }

    /**
     * Media conversions:
     * 'thumbnail' — Kichik thumbnail (600x450) — ro'yxat, kartochkalar
     * 'medium' — O'rtacha (1200x900) — admin panel, detail preview
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(600)
            ->height(450)
            ->format('webp')
            ->quality(85)
            ->sharpen(10)
            ->performOnCollections('thumbnail', 'gallery')
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(1200)
            ->height(900)
            ->format('webp')
            ->quality(90)
            ->performOnCollections('thumbnail', 'gallery')
            ->nonQueued();
    }
}
