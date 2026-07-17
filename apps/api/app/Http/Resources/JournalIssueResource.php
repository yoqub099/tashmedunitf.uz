<?php

namespace App\Http\Resources;

use App\Http\Resources\Concerns\HasSafeConversionUrls;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JournalIssueResource extends JsonResource
{
    use HasSafeConversionUrls;

    public function toArray(Request $request): array
    {
        $cover = $this->getFirstMedia('cover');

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
            'cover' => $cover?->getUrl() ?: '',
            'cover_medium' => $this->safeConversionUrl($cover, 'medium') ?? '',
            'cover_thumbnail' => $this->safeConversionUrl($cover, 'thumbnail') ?? '',
            'file_url' => $this->getFirstMediaUrl('file'),
            'file_name' => $this->getFirstMedia('file')?->file_name,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
