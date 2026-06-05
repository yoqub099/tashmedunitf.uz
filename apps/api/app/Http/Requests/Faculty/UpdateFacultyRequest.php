<?php

namespace App\Http\Requests\Faculty;

use App\Enums\DirectionLevel;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class UpdateFacultyRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
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
            'level' => ['sometimes', 'string', Rule::in(DirectionLevel::cases())],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:5120'],
            'remove_image' => ['nullable', 'boolean'],
        ];
    }
}
