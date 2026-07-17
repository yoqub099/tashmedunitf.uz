<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $image = $this->getFirstMedia('image');
        $headPhoto = $this->getFirstMedia('head_photo');

        return [
            'id' => $this->id,
            'name' => $this->getTranslations('name'),
            'slug' => $this->slug,
            'description' => $this->getTranslations('description'),
            'head_name' => $this->getTranslations('head_name'),
            'head_title' => $this->getTranslations('head_title'),
            'phone' => $this->phone,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'image' => $image?->getUrl() ?: '',
            'image_thumbnail' => $this->safeConversionUrl($image, 'thumbnail'),
            'image_medium' => $this->safeConversionUrl($image, 'medium'),
            'head_photo' => $headPhoto?->getUrl() ?: '',
            'head_photo_thumbnail' => $this->safeConversionUrl($headPhoto, 'thumbnail'),
            'head_photo_medium' => $this->safeConversionUrl($headPhoto, 'medium'),
            'staff' => StaffResource::collection($this->whenLoaded('staff')),
            'staff_count' => $this->whenCounted('staff'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
