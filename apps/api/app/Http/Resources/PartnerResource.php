<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartnerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'logo' => $this->getFirstMediaUrl('logo'),
            'logo_thumbnail' => $this->getFirstMediaUrl('logo', 'thumbnail') ?: null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
