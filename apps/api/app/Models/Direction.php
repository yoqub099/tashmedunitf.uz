<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Direction extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'level',
        'description',
        'duration',
        'price_daytime',
        'price_remote',
        'is_active',
        'sort_order',
        'faculty_id',
        'exam_subjects',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public array $translatable = ['name', 'description'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'exam_subjects' => 'array',
        ];
    }

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    // ========================================
    // SCOPES — Index optimized
    // ========================================

    /**
     * PARTIAL INDEX: idx_directions_level_active_sort
     * Level bo'yicha (bachelor/master/residency)
     */
    public function scopeByLevel($query, string $level)
    {
        return $query->where('is_active', true)
            ->where('level', $level)
            ->orderBy('sort_order');
    }

    /**
     * GIN INDEX: idx_directions_name_gin
     */
    public function scopeSearchName($query, string $search, string $locale = 'uz')
    {
        return $query->whereRaw(
            'name @> ?::jsonb',
            [json_encode([$locale => $search])]
        );
    }

    /**
     * Yo'nalish uchun media collectionlar:
     *
     * 'image' — Yo'nalish rasmi (1 ta)
     * 'curriculum' — O'quv dasturi PDF (1 ta)
     * 'documents' — PDF, Word, Excel, PPT
     * 'videos' — Yo'nalish haqida video
     * 'audio' — Audio ma'ruzalar
     * 'books' — Darsliklar (PDF, EPUB, MOBI)
     * 'archives' — Kurs materiallari to'plami
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('curriculum')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf'])
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
            ->acceptsMimeTypes(['video/mp4', 'video/webm', 'video/mpeg'])
            ->useDisk('public');

        $this->addMediaCollection('audio')
            ->acceptsMimeTypes(['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'])
            ->useDisk('public');

        $this->addMediaCollection('books')
            ->acceptsMimeTypes(['application/pdf', 'application/epub+zip', 'application/x-mobipocket-ebook'])
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
            ->width(400)
            ->height(300)
            ->format('webp')
            ->quality(85)
            ->sharpen(10)
            ->queued()
            ->performOnCollections('image');

        $this->addMediaConversion('medium')
            ->width(800)
            ->height(600)
            ->format('webp')
            ->quality(85)
            ->sharpen(10)
            ->queued()
            ->performOnCollections('image');
    }
}
