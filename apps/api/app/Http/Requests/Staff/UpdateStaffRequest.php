<?php

namespace App\Http\Requests\Staff;

use App\Http\Requests\BaseFormRequest;

class UpdateStaffRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        return [
            'full_name' => ['sometimes', 'array'],
            'full_name.uz' => ['required_with:full_name', 'string', 'max:255'],
            'full_name.ru' => ['nullable', 'string', 'max:255'],
            'full_name.en' => ['nullable', 'string', 'max:255'],
            'position' => ['sometimes', 'array'],
            'position.uz' => ['required_with:position', 'string', 'max:255'],
            'position.ru' => ['nullable', 'string', 'max:255'],
            'position.en' => ['nullable', 'string', 'max:255'],
            'department_id' => ['sometimes', 'nullable', 'integer', 'exists:departments,id'],
            'department_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'array'],
            'bio.uz' => ['nullable', 'string'],
            'bio.ru' => ['nullable', 'string'],
            'bio.en' => ['nullable', 'string'],
            'phone' => ['nullable', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'photo' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
