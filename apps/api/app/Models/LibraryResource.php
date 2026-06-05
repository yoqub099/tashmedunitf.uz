<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Spatie\Translatable\HasTranslations;

class LibraryResource extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTranslations, InteractsWithMedia;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'content',
        'category',
        'type',
        'url',
        'is_published',
        'published_at',
        'sort_order',
    ];

    public array $translatable = ['title', 'description', 'content'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
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
    // SCOPES
    // ========================================

    public function scopePublished($query)
    {
        return $query->where('is_published', true)
            ->orderBy('sort_order')
            ->orderByDesc('published_at');
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopeSearchTitle($query, string $search, string $locale = 'uz')
    {
        $locale = in_array($locale, ['uz', 'ru', 'en']) ? $locale : 'uz';

        return $query->where("title->{$locale}", 'ILIKE', "%{$search}%");
    }

    // ========================================
    // MEDIA
    // ========================================

    public function registerMediaCollections(): void
    {
        // Kitob/resurs muqovasi
        $this->addMediaCollection('cover')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
            ->useDisk('public')
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumbnail')
                    ->width(400)->height(300)
                    ->format('webp')->quality(85)->sharpen(10)
                    ->queued();

                $this->addMediaConversion('medium')
                    ->width(800)->height(600)
                    ->format('webp')->quality(90)->sharpen(10)
                    ->queued();
            });

        // Hujjat fayli (PDF, Word, Excel, kitob)
        $this->addMediaCollection('document')
            ->singleFile()
            ->acceptsMimeTypes([
                'application/pdf',
                'application/epub+zip',
                'application/x-mobipocket-ebook',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ])
            ->useDisk('public');

        // Galeriya rasmlari
        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
            ->useDisk('public');
    }
}
