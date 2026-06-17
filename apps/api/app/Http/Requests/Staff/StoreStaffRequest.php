<?php

namespace App\Http\Requests\Staff;

use App\Http\Requests\BaseFormRequest;

class StoreStaffRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'full_name' => ['required', 'array'],
            'full_name.uz' => ['required', 'string', 'max:255'],
            'full_name.ru' => ['nullable', 'string', 'max:255'],
            'full_name.en' => ['nullable', 'string', 'max:255'],
            'position' => ['required', 'array'],
            'position.uz' => ['required', 'string', 'max:255'],
            'position.ru' => ['nullable', 'string', 'max:255'],
            'position.en' => ['nullable', 'string', 'max:255'],
            'department_id' => ['required_without:department_name', 'nullable', 'integer', 'exists:departments,id'],
            'department_name' => ['required_without:department_id', 'nullable', 'string', 'max:255'],
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
