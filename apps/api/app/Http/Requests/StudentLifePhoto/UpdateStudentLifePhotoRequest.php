<?php

namespace App\Http\Requests\StudentLifePhoto;

use App\Http\Requests\BaseFormRequest;

class UpdateStudentLifePhotoRequest extends BaseFormRequest
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
            'photo' => 'nullable|image|mimes:jpeg,png,webp,avif|max:10240',
            'remove_photo' => 'nullable|boolean',
            'is_active' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ];
    }
}
