<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteMediaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'key' => $this->key,
            'title' => $this->title,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'file_url' => $this->getFirstMediaUrl('file'),
            'file_mime' => $this->getFirstMedia('file')?->mime_type,
            'file_name' => $this->getFirstMedia('file')?->file_name,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
