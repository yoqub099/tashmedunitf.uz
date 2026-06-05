<?php

namespace App\Http\Requests\LibraryResource;

use App\Http\Requests\BaseFormRequest;

class StoreLibraryResourceRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        // Route middleware `role:super-admin|admin` birinchi tekshiruv — bu qo'shimcha guard
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.uz' => ['required', 'string', 'max:255'],
            'title.ru' => ['nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.uz' => ['nullable', 'string', 'max:1000'],
            'description.ru' => ['nullable', 'string', 'max:1000'],
            'description.en' => ['nullable', 'string', 'max:1000'],
            'content' => ['nullable', 'array'],
            'content.uz' => ['nullable', 'string', 'max:500000'],
            'content.ru' => ['nullable', 'string', 'max:500000'],
            'content.en' => ['nullable', 'string', 'max:500000'],
            'category' => ['required', 'string', 'max:100'],
            'type' => ['nullable', 'string', 'max:100'],
            'url' => ['nullable', 'url', 'max:2048'],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'sort_order' => ['integer', 'min:0'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'document' => ['nullable', 'file', 'max:51200', 'mimes:pdf,doc,docx,epub,mobi'], // 50MB max, model bilan sinxron
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:5120'],
        ];
    }
}
