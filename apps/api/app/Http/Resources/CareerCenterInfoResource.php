<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CareerCenterInfoResource extends JsonResource
{
    /** XSS: plain-text field'lar escape qilinadi. `content` HTML (frontend DOMPurify). */
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
        return [
            'id' => $this->id,
            'title' => $this->escapeTranslations($this->getTranslations('title')),
            'subtitle' => $this->escapeTranslations($this->getTranslations('subtitle')),
            'content' => $this->getTranslations('content'), // HTML — frontend DOMPurify
            'address' => $this->escapeTranslations($this->getTranslations('address')),
            'phone' => $this->escape($this->phone),
            'email' => $this->email, // email format sabr
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
