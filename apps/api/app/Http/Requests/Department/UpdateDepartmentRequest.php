<?php

namespace App\Http\Requests\Department;

use App\Http\Requests\BaseFormRequest;

class UpdateDepartmentRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'array'],
            'name.uz' => ['required_with:name', 'string', 'max:255'],
            'name.ru' => ['nullable', 'string', 'max:255'],
            'name.en' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.uz' => ['nullable', 'string'],
            'description.ru' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'head_name' => ['nullable', 'array'],
            'head_name.uz' => ['nullable', 'string', 'max:255'],
            'head_name.ru' => ['nullable', 'string', 'max:255'],
            'head_name.en' => ['nullable', 'string', 'max:255'],
            'head_title' => ['nullable', 'array'],
            'head_title.uz' => ['nullable', 'string', 'max:255'],
            'head_title.ru' => ['nullable', 'string', 'max:255'],
            'head_title.en' => ['nullable', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:5120'],
            'head_photo' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
