<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $cover = $this->getFirstMedia('thumbnail');

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
            'cover' => $cover?->getUrl() ?: '',
            'cover_medium' => $this->safeConversionUrl($cover, 'medium') ?? '',
            'cover_thumbnail' => $this->safeConversionUrl($cover, 'thumbnail') ?? '',
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
