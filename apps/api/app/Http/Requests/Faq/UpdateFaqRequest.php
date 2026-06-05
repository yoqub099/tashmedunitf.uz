<?php

namespace App\Http\Requests\Faq;

use App\Http\Requests\BaseFormRequest;

class UpdateFaqRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        return [
            'question' => ['sometimes', 'array'],
            'question.uz' => ['required_with:question', 'string', 'max:500'],
            'question.ru' => ['nullable', 'string', 'max:500'],
            'question.en' => ['nullable', 'string', 'max:500'],
            'answer' => ['sometimes', 'array'],
            'answer.uz' => ['required_with:answer', 'string', 'max:10000'],
            'answer.ru' => ['nullable', 'string', 'max:10000'],
            'answer.en' => ['nullable', 'string', 'max:10000'],
            'category' => ['nullable', 'string', 'max:100'],
            'faculty_id' => ['nullable', 'integer', 'exists:faculties,id'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:32767'],
        ];
    }
}
