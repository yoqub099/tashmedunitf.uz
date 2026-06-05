<?php

namespace App\Http\Requests\TalentedStudent;

use App\Http\Requests\BaseFormRequest;

class UpdateTalentedStudentRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|array',
            'name.uz' => 'required_with:name|string|max:255',
            'name.ru' => 'nullable|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'description' => 'sometimes|array',
            'description.uz' => 'required_with:description|string|max:5000',
            'description.ru' => 'nullable|string|max:5000',
            'description.en' => 'nullable|string|max:5000',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'photo' => 'nullable|image|max:5120',
            'remove_photo' => 'nullable|boolean',
        ];
    }
}
