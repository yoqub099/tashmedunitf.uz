<?php

namespace App\Http\Requests\JournalIssue;

use App\Http\Requests\BaseFormRequest;

class UpdateJournalIssueRequest extends BaseFormRequest
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
            'description' => ['nullable', 'array'],
            'description.uz' => ['nullable', 'string', 'max:1000'],
            'description.ru' => ['nullable', 'string', 'max:1000'],
            'description.en' => ['nullable', 'string', 'max:1000'],
            'date' => ['nullable', 'date'],
            'issue_number' => ['nullable', 'integer', 'min:1'],
            'year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'is_current' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
            'cover' => ['nullable', 'image', 'max:5120'],
            'remove_cover' => ['nullable', 'boolean'],
            'file' => ['nullable', 'file', 'mimes:pdf', 'max:51200'],
            'remove_file' => ['nullable', 'boolean'],
        ];
    }
}
