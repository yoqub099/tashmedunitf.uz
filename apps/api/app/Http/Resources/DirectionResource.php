<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DirectionResource extends JsonResource
{
    use HasSafeConversionUrls;

    /** XSS: plain-text translatable fields escape. Description HTML — frontend DOMPurify tozalaydi. */
    private function escapeTranslations(array $translations): array
    {
        return array_map(
            fn ($v) => $v === null ? null : htmlspecialchars((string) $v, ENT_NOQUOTES | ENT_HTML5, 'UTF-8'),
            $translations
        );
    }

    private function escape(?string $value): ?string
    {
        return $value === null ? null : htmlspecialchars($value, ENT_NOQUOTES | ENT_HTML5, 'UTF-8');
    }

    public function toArray(Request $request): array
    {
        // Media uchun bir marta query, keyin URL variantlar tayyorlanadi (N+1 oldini olish)
        $image = $this->getFirstMedia('image');

        return [
            'id' => $this->id,
            'faculty_id' => $this->faculty_id,
            'name' => $this->escapeTranslations($this->getTranslations('name')),
            'code' => $this->escape($this->code),
            'level' => $this->level,
            'description' => $this->getTranslations('description'), // HTML — frontend DOMPurify
            'duration' => $this->escape($this->duration),
            'price_daytime' => $this->price_daytime,
            'price_remote' => $this->price_remote,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'exam_subjects' => array_map(
                fn ($s) => $this->escape((string) $s),
                $this->exam_subjects ?? []
            ),
            'image' => $image?->getUrl() ?: '',
            'image_thumbnail' => $this->safeConversionUrl($image, 'thumbnail'),
            'image_medium' => $this->safeConversionUrl($image, 'medium'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
