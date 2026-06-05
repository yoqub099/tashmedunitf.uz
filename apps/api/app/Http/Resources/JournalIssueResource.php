<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalIssueResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->getTranslations('title'),
            'slug' => $this->slug,
            'description' => $this->getTranslations('description'),
            'date' => $this->date?->toDateString(),
            'issue_number' => $this->issue_number,
            'year' => $this->year,
            'is_current' => $this->is_current,
            'is_published' => $this->is_published,
            'sort_order' => $this->sort_order,
            'cover' => $this->getFirstMediaUrl('cover'),
            'cover_medium' => $this->getFirstMediaUrl('cover', 'medium') ?: $this->getFirstMediaUrl('cover'),
            'cover_thumbnail' => $this->getFirstMediaUrl('cover', 'thumbnail') ?: $this->getFirstMediaUrl('cover'),
            'file_url' => $this->getFirstMediaUrl('file'),
            'file_name' => $this->getFirstMedia('file')?->file_name,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
