<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PartnerResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $logo = $this->getFirstMedia('logo');

        return [
            'id' => $this->id,
            'name' => $this->name,
            'url' => $this->url,
            'is_active' => $this->is_active,
            'sort_order' => $this->sort_order,
            'logo' => $logo?->getUrl() ?: '',
            'logo_thumbnail' => $this->safeConversionUrl($logo, 'thumbnail'),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
