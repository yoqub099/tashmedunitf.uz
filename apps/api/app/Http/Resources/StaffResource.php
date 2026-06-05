<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->getTranslations('full_name'),
            'position' => $this->getTranslations('position'),
            'bio' => $this->getTranslations('bio'),
            'phone' => $this->phone,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'photo' => $this->getFirstMediaUrl('photo'),
            'photo_thumbnail' => $this->getFirstMediaUrl('photo', 'thumbnail') ?: null,
            'photo_medium' => $this->getFirstMediaUrl('photo', 'medium') ?: null,
            'department_id' => $this->department_id,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
