<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BannerResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $image = $this->getFirstMedia('image');

        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'subtitle' => $this->getTranslations('subtitle'),
            'link' => $this->link,
            'button_text' => $this->getTranslations('button_text'),
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'image' => $image?->getUrl() ?: '',
            'image_desktop' => $this->safeConversionUrl($image, 'desktop'),
            'image_mobile' => $this->safeConversionUrl($image, 'mobile'),
            'image_thumbnail' => $this->safeConversionUrl($image, 'thumbnail'),
            'mobile_image' => $this->getFirstMediaUrl('mobile_image'),
            'video' => $this->getFirstMediaUrl('video'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
