<?php

namespace App\Http\Requests\StudentLifePhoto;

use App\Http\Requests\BaseFormRequest;

class StoreStudentLifePhotoRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'nullable|array',
            'title.uz' => 'nullable|string|max:255',
            'title.ru' => 'nullable|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'photo' => 'required|image|mimes:jpeg,png,webp,avif|max:10240',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
