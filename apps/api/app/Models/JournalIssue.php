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

class JournalIssue extends Model implements HasMedia
{
    use HasFactory, HasSlug, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'date',
        'issue_number',
        'year',
        'is_current',
        'is_published',
        'sort_order',
    ];

    public array $translatable = ['title', 'description'];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'issue_number' => 'integer',
            'year' => 'integer',
            'is_current' => 'boolean',
            'is_published' => 'boolean',
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
            ->orderByDesc('date')
            ->orderBy('sort_order');
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    public function scopeByYear($query, int $year)
    {
        return $query->where('year', $year);
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
        // Jurnal muqovasi — rasm
        $this->addMediaCollection('cover')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
            ->useDisk('public')
            ->registerMediaConversions(function (Media $media) {
                $this->addMediaConversion('thumbnail')
                    ->width(400)->height(533)
                    ->format('webp')->quality(85)->sharpen(10)
                    ->nonQueued();

                $this->addMediaConversion('medium')
                    ->width(800)->height(1067)
                    ->format('webp')->quality(90)->sharpen(10)
                    ->nonQueued();
            });

        // Jurnal PDF fayli
        $this->addMediaCollection('file')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf'])
            ->useDisk('public');
    }
}
