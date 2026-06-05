<?php

namespace App\Http\Requests\SiteContent;

use Illuminate\Foundation\Http\FormRequest;

class UpsertSiteContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string|max:100',
            'section' => 'required|string|max:50',
            'value' => 'required|array',
            'value.uz' => 'required|string|max:2000',
            'value.ru' => 'nullable|string|max:2000',
            'value.en' => 'nullable|string|max:2000',
            'type' => 'nullable|string|in:text,textarea,html',
        ];
    }
}
