<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class SiteMedia extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $table = 'site_media';

    protected $fillable = [
        'key',
        'title',
        'description',
        'is_active',
    ];

    protected $attributes = [
        'is_active' => true,
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function registerMediaCollections(): void
    {
        // Sayt umumiy media — rasm, video, hujjat, audio
        $this->addMediaCollection('file')
            ->singleFile()
            ->acceptsMimeTypes([
                // Rasmlar
                'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml',
                // Videolar
                'video/mp4', 'video/webm',
                // Hujjatlar
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                // Audio
                'audio/mpeg', 'audio/wav', 'audio/ogg',
            ])
            ->useDisk('public');
    }
}
