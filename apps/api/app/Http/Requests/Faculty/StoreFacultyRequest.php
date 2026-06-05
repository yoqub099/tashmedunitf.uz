<?php

namespace App\Http\Requests\Faculty;

use App\Enums\DirectionLevel;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class StoreFacultyRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'array'],
            'name.uz' => ['required', 'string', 'max:255'],
            'name.ru' => ['nullable', 'string', 'max:255'],
            'name.en' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.uz' => ['nullable', 'string'],
            'description.ru' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'level' => ['required', 'string', Rule::in(DirectionLevel::cases())],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:5120'],
        ];
    }
}
