<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TestimonialResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $photo = $this->getFirstMedia('photo');

        return [
            'id' => $this->id,
            'name' => $this->getTranslations('name'),
            'role' => $this->getTranslations('role'),
            'text' => $this->getTranslations('text'),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'photo' => $photo?->getUrl() ?: '',
            'photo_thumbnail' => $this->safeConversionUrl($photo, 'thumbnail'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
