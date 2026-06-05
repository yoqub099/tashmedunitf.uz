<?php

namespace App\Http\Requests\ContactLocation;

use App\Http\Requests\BaseFormRequest;

class UpdateContactLocationRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'array'],
            'name.uz' => ['sometimes', 'string', 'max:255'],
            'name.ru' => ['nullable', 'string', 'max:255'],
            'name.en' => ['nullable', 'string', 'max:255'],
            'address' => ['sometimes', 'array'],
            'address.uz' => ['sometimes', 'string', 'max:1000'],
            'address.ru' => ['nullable', 'string', 'max:1000'],
            'address.en' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'email', 'max:255'],
            'lat' => ['nullable', 'numeric', 'between:-90,90'],
            'lng' => ['nullable', 'numeric', 'between:-180,180'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ];
    }
}
