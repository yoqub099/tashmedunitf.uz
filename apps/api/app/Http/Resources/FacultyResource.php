<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacultyResource extends JsonResource
{
    /** XSS: plain-text translatable fields escape. Description HTML — frontend DOMPurify tozalaydi. */
    private function escapeTranslations(array $translations): array
    {
        return array_map(
            fn ($v) => $v === null ? null : htmlspecialchars((string) $v, ENT_NOQUOTES | ENT_HTML5, 'UTF-8'),
            $translations
        );
    }

    public function toArray(Request $request): array
    {
        // Media uchun bir marta query, keyin URL variantlar tayyorlanadi (N+1 oldini olish)
        $image = $this->getFirstMedia('image');

        return [
            'id' => $this->id,
            'name' => $this->escapeTranslations($this->getTranslations('name')),
            'description' => $this->getTranslations('description'), // HTML — frontend DOMPurify
            'level' => $this->level,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'image' => $image?->getUrl() ?: '',
            'image_thumbnail' => $image?->getUrl('thumbnail') ?: null,
            'image_medium' => $image?->getUrl('medium') ?: null,
            'directions' => DirectionResource::collection($this->whenLoaded('activeDirections')),
            'directions_count' => $this->whenLoaded('activeDirections', fn () => $this->activeDirections->count()),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
