<?php

namespace App\Http\Requests\News;

use App\Enums\NewsCategory;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class StoreNewsRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.uz' => ['required', 'string', 'max:255'],
            'title.ru' => ['nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'array'],
            'excerpt.uz' => ['nullable', 'string', 'max:500'],
            'excerpt.ru' => ['nullable', 'string', 'max:500'],
            'excerpt.en' => ['nullable', 'string', 'max:500'],
            'content' => ['required', 'array'],
            'content.uz' => ['required', 'string', 'max:500000'],
            'content.ru' => ['nullable', 'string', 'max:500000'],
            'content.en' => ['nullable', 'string', 'max:500000'],
            'category' => ['nullable', 'string', Rule::in(NewsCategory::cases())],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:5120'],
        ];
    }
}
