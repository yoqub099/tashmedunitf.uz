<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'slug' => $this->slug,
            // content faqat detail sahifada kerak (findBySlug)
            'content' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getTranslations('content')
            ),
            'is_published' => $this->is_published,
            'parent_id' => $this->parent_id,
            'sort_order' => $this->sort_order,
            'depth' => $this->depth,
            'path' => $this->path,
            'is_nav_item' => $this->is_nav_item,
            'page_type' => $this->page_type,
            'external_url' => $this->external_url,
            'nav_icon' => $this->nav_icon,
            'children' => self::collection($this->whenLoaded('children')),
            'children_count' => $this->whenCounted('children'),
            // images faqat content bor bo'lganda
            'images' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getMedia('images')->map(fn ($media) => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'thumbnail_url' => $media->hasGeneratedConversion('thumbnail') ? $media->getUrl('thumbnail') : $media->getUrl(),
                    'medium_url' => $media->hasGeneratedConversion('medium') ? $media->getUrl('medium') : $media->getUrl(),
                    'large_url' => $media->hasGeneratedConversion('large') ? $media->getUrl('large') : $media->getUrl(),
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'mime_type' => $media->mime_type,
                    'size' => $media->size,
                ])
            ),
            // documents (PDF, Word, Excel...)
            'documents' => $this->when(
                array_key_exists('content', $this->resource->getAttributes()),
                fn () => $this->getMedia('documents')->map(fn ($media) => [
                    'id' => $media->id,
                    'url' => $media->getUrl(),
                    'name' => $media->name,
                    'file_name' => $media->file_name,
                    'size' => $media->size,
                    'mime_type' => $media->mime_type,
                ])
            ),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
