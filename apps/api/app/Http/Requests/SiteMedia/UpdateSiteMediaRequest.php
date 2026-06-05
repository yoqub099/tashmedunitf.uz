<?php

namespace App\Http\Requests\SiteMedia;

use App\Http\Requests\BaseFormRequest;

class UpdateSiteMediaRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'boolean',
            'file' => 'nullable|file|max:51200', // 50MB max (video)
        ];
    }
}
