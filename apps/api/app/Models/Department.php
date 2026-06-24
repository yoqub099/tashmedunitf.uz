<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class Department extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'head_name',
        'head_title',
        'phone',
        'email',
        'is_active',
        'sort_order',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public array $translatable = ['name', 'description', 'head_name', 'head_title'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug')
            ->doNotGenerateSlugsOnUpdate()
            ->preventOverwrite();
    }

    // ========================================
    // SCOPES — Index optimized
    // ========================================

    /**
     * PARTIAL INDEX: idx_departments_active_sort
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    /**
     * GIN INDEX: idx_departments_name_gin
     * 3 tilda nom qidiruv
     */
    public function scopeSearchName($query, string $search, string $locale = 'uz')
    {
        return $query->whereRaw(
            'name @> ?::jsonb',
            [json_encode([$locale => $search])]
        );
    }

    public function staff(): HasMany
    {
        return $this->hasMany(Staff::class);
    }

    /**
     * Kafedra uchun media collectionlar:
     *
     * 'image' — Kafedra rasmi (1 ta)
     * 'head_photo' — Kafedra boshlig'i rasmi (1 ta)
     * 'gallery' — Kafedra galereyasi (ko'p)
     * 'documents' — PDF, Word, Excel, PPT
     * 'videos' — Kafedra haqida video
     * 'audio' — Audio materiallar
     * 'archives' — Kurs material to'plamlari (ZIP, RAR)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('head_photo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
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
            ])
            ->useDisk('public');

        $this->addMediaCollection('videos')
            ->acceptsMimeTypes(['video/mp4', 'video/webm', 'video/mpeg', 'video/quicktime'])
            ->useDisk('public');

        $this->addMediaCollection('audio')
            ->acceptsMimeTypes(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'])
            ->useDisk('public');

        $this->addMediaCollection('archives')
            ->acceptsMimeTypes([
                'application/zip', 'application/x-zip-compressed',
                'application/x-rar-compressed', 'application/vnd.rar',
                'application/x-7z-compressed',
            ])
            ->useDisk('public');
    }

    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(400)->height(300)
            ->format('webp')->quality(85)->sharpen(10)
            ->performOnCollections('image', 'head_photo', 'gallery')
            ->nonQueued();

        $this->addMediaConversion('medium')
            ->width(800)->height(600)
            ->format('webp')->quality(90)
            ->performOnCollections('image', 'head_photo', 'gallery')
            ->nonQueued();
    }
}
