<?php

namespace App\Http\Requests\News;

use App\Enums\NewsCategory;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateNewsRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'array'],
            'title.uz' => ['required_with:title', 'string', 'max:255'],
            'title.ru' => ['nullable', 'string', 'max:255'],
            'title.en' => ['nullable', 'string', 'max:255'],
            'excerpt' => ['nullable', 'array'],
            'excerpt.uz' => ['nullable', 'string', 'max:500'],
            'excerpt.ru' => ['nullable', 'string', 'max:500'],
            'excerpt.en' => ['nullable', 'string', 'max:500'],
            'content' => ['sometimes', 'array'],
            'content.uz' => ['nullable', 'string', 'max:500000'],
            'content.ru' => ['nullable', 'string', 'max:500000'],
            'content.en' => ['nullable', 'string', 'max:500000'],
            'category' => ['nullable', 'string', Rule::in(NewsCategory::cases())],
            'is_published' => ['boolean'],
            'published_at' => ['nullable', 'date'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'remove_cover' => ['nullable', 'boolean'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'max:5120'],
        ];
    }
}
