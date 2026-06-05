<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Banner extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'title',
        'subtitle',
        'link',
        'button_text',
        'is_active',
        'sort_order',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public array $translatable = ['title', 'subtitle', 'button_text'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Banner uchun media collectionlar:
     *
     * 'image' — Banner rasmi (1 ta) | KATTA: 1920x600+
     * 'mobile_image' — Mobil versiya rasmi (1 ta) | 768x400
     * 'video' — Banner video (promo) (1 ta)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('mobile_image')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
            ->useDisk('public');

        $this->addMediaCollection('video')
            ->singleFile()
            ->acceptsMimeTypes(['video/mp4', 'video/webm'])
            ->useDisk('public');
    }

    /**
     * Konversiya kerak emas — original allaqachon WebP formatda saqlanadi.
     * ConvertsToWebp trait service'da convert qiladi.
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('desktop')
            ->width(1920)->height(600)
            ->format('webp')->quality(90)
            ->performOnCollections('image')
            ->queued();

        $this->addMediaConversion('mobile')
            ->width(768)->height(400)
            ->format('webp')->quality(85)
            ->performOnCollections('image', 'mobile_image')
            ->queued();

        $this->addMediaConversion('thumbnail')
            ->width(400)->height(200)
            ->format('webp')->quality(80)
            ->performOnCollections('image')
            ->queued();
    }
}
