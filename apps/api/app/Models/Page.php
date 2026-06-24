<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Page extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'content',
        'is_published',
        'parent_id',
        'sort_order',
        'depth',
        'path',
        'is_nav_item',
        'page_type',
        'external_url',
        'nav_icon',
    ];

    public array $translatable = ['title', 'content'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'is_nav_item' => 'boolean',
            'sort_order' => 'integer',
            'depth' => 'integer',
        ];
    }

    // ========================================
    // BOOT — Auto-compute depth & path
    // ========================================

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Page $page) {
            if ($page->isDirty('parent_id')) {
                if ($page->parent_id) {
                    $parent = Page::find($page->parent_id);
                    if ($parent) {
                        $page->depth = $parent->depth + 1;
                        $page->path = $parent->path ? $parent->path.'/'.$parent->id : (string) $parent->id;
                    }
                } else {
                    $page->depth = 0;
                    $page->path = null;
                }
            }
        });
    }

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_id')->orderBy('sort_order');
    }

    public function allChildren(): HasMany
    {
        return $this->hasMany(Page::class, 'parent_id')
            ->orderBy('sort_order')
            ->with('allChildren');
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
    // SCOPES — Index optimized
    // ========================================

    /**
     * PARTIAL INDEX: idx_pages_slug_published
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Faqat navigation elementlari
     */
    public function scopeNavItems($query)
    {
        return $query->where('is_nav_item', true);
    }

    /**
     * Faqat root (parent_id = null) sahifalar
     */
    public function scopeRoots($query)
    {
        return $query->whereNull('parent_id');
    }

    /**
     * Published + nav item sahifalar
     */
    public function scopePublishedNav($query)
    {
        return $query->where('is_published', true)->where('is_nav_item', true);
    }

    /**
     * GIN INDEX: idx_pages_title_gin
     */
    public function scopeSearchTitle($query, string $search, string $locale = 'uz')
    {
        return $query->whereRaw(
            'title @> ?::jsonb',
            [json_encode([$locale => $search])]
        );
    }

    /**
     * Sahifa uchun media collectionlar:
     *
     * 'images' — Sahifa rasmlari (ko'p)
     * 'documents' — PDF, Word, Excel, PPT, TXT (ko'p)
     * 'videos' — MP4, WebM, MOV (ko'p)
     * 'audio' — MP3, WAV, OGG, FLAC (audio ma'ruza)
     * 'archives' — ZIP, RAR, 7Z (kurs material to'plami)
     * 'books' — PDF, EPUB, MOBI (kutubxona)
     * 'private_docs' — MAXFIY hujjatlar (auth orqali ochiladi)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'])
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
                'text/rtf',
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

        // 🔒 MAXFIY HUJJATLAR — public emas, auth kerak
        $this->addMediaCollection('private_docs')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg', 'image/png',
            ])
            ->useDisk('local'); // ← LOCAL = storage/app/private/ (Nginx bermaydi!)
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(400)->height(300)
            ->format('webp')->quality(85)->sharpen(10)
            ->performOnCollections('images')
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(800)->height(600)
            ->format('webp')->quality(90)
            ->performOnCollections('images')
            ->nonQueued();

        $this->addMediaConversion('large')
            ->width(1920)->height(1080)
            ->format('webp')->quality(90)
            ->performOnCollections('images')
            ->nonQueued();
    }
}
