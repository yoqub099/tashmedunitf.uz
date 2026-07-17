<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LibraryResourceResource extends JsonResource
{
    use HasSafeConversionUrls;

    /**
     * XSS protection — plain-text translatable fields'ni escape qilish.
     * Content (rich HTML) escape qilinmaydi — frontend DOMPurify tozalaydi.
     */
    private function escapeTranslations(array $translations): array
    {
        return array_map(
            fn ($v) => $v === null ? null : htmlspecialchars((string) $v, ENT_NOQUOTES | ENT_HTML5, 'UTF-8'),
            $translations
        );
    }

    public function toArray(Request $request): array
    {
        $cover = $this->getFirstMedia('cover');

        return [
            'id' => $this->id,
            'title' => $this->escapeTranslations($this->getTranslations('title')),
            'slug' => $this->slug,
            'description' => $this->escapeTranslations($this->getTranslations('description')),
            'content' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getTranslations('content') // HTML kontent — frontend DOMPurify tozalaydi
            ),
            'category' => $this->category,
            'type' => $this->type,
            'url' => $this->url,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toISOString(),
            'sort_order' => $this->sort_order,
            'cover' => $cover?->getUrl() ?: '',
            'cover_medium' => $this->safeConversionUrl($cover, 'medium') ?? '',
            'cover_thumbnail' => $this->safeConversionUrl($cover, 'thumbnail') ?? '',
            'document' => $this->getFirstMediaUrl('document'),
            'document_name' => $this->getFirstMedia('document')?->file_name,
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
