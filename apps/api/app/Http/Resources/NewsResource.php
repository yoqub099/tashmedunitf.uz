<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'slug' => $this->slug,
            'excerpt' => $this->getTranslations('excerpt'),
            'content' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getTranslations('content')
            ),
            'category' => $this->category,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toISOString(),
            'cover' => $this->getFirstMediaUrl('thumbnail'),
            'cover_medium' => $this->getFirstMediaUrl('thumbnail', 'medium') ?: $this->getFirstMediaUrl('thumbnail'),
            'cover_thumbnail' => $this->getFirstMediaUrl('thumbnail', 'thumbnail') ?: $this->getFirstMediaUrl('thumbnail'),
            // Gallery faqat detail sahifada kerak (content bor bo'lganda)
            'gallery' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getMedia('gallery')->map(fn ($media) => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'name' => $media->name,
                ])
            ),
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
