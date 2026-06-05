<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'subtitle' => $this->getTranslations('subtitle'),
            'link' => $this->link,
            'button_text' => $this->getTranslations('button_text'),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'image' => $this->getFirstMediaUrl('image'),
            'image_desktop' => $this->getFirstMediaUrl('image', 'desktop') ?: null,
            'image_mobile' => $this->getFirstMediaUrl('image', 'mobile') ?: null,
            'image_thumbnail' => $this->getFirstMediaUrl('image', 'thumbnail') ?: null,
            'mobile_image' => $this->getFirstMediaUrl('mobile_image'),
            'video' => $this->getFirstMediaUrl('video'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
