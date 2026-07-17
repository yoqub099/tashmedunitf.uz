<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StaffResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $photo = $this->getFirstMedia('photo');

        return [
            'id' => $this->id,
            'full_name' => $this->getTranslations('full_name'),
            'position' => $this->getTranslations('position'),
            'bio' => $this->getTranslations('bio'),
            'phone' => $this->phone,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'photo' => $photo?->getUrl() ?: '',
            'photo_thumbnail' => $this->safeConversionUrl($photo, 'thumbnail'),
            'photo_medium' => $this->safeConversionUrl($photo, 'medium'),
            'department_id' => $this->department_id,
            'department' => new DepartmentResource($this->whenLoaded('department')),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
