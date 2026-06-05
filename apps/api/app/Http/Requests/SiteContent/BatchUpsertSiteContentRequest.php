<?php

namespace App\Http\Requests\SiteContent;

use Illuminate\Foundation\Http\FormRequest;

class BatchUpsertSiteContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'items' => 'required|array|min:1|max:50',
            'items.*.key' => 'required|string|max:100',
            'items.*.section' => 'required|string|max:50',
            'items.*.value' => 'required|array',
            'items.*.value.uz' => 'required|string|max:2000',
            'items.*.value.ru' => 'nullable|string|max:2000',
            'items.*.value.en' => 'nullable|string|max:2000',
            'items.*.type' => 'nullable|string|in:text,textarea,html',
        ];
    }
}
