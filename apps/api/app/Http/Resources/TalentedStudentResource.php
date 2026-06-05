<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TalentedStudentResource extends JsonResource
{
    /** XSS: barcha translatable plain-text field'lar escape qilinadi. */
    private function escapeTranslations(array $translations): array
    {
        return array_map(
            fn ($v) => $v === null ? null : htmlspecialchars((string) $v, ENT_NOQUOTES | ENT_HTML5, 'UTF-8'),
            $translations
        );
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->escapeTranslations($this->getTranslations('name')),
            'description' => $this->escapeTranslations($this->getTranslations('description')),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'photo' => $this->getFirstMediaUrl('photo') ?: null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
