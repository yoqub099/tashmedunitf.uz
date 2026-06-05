<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DepartmentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
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
            'image' => $this->getFirstMediaUrl('image'),
            'image_thumbnail' => $this->getFirstMediaUrl('image', 'thumbnail') ?: null,
            'image_medium' => $this->getFirstMediaUrl('image', 'medium') ?: null,
            'head_photo' => $this->getFirstMediaUrl('head_photo'),
            'head_photo_thumbnail' => $this->getFirstMediaUrl('head_photo', 'thumbnail') ?: null,
            'head_photo_medium' => $this->getFirstMediaUrl('head_photo', 'medium') ?: null,
            'staff' => StaffResource::collection($this->whenLoaded('staff')),
            'staff_count' => $this->whenCounted('staff'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
