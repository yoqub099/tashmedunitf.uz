<?php

namespace App\Http\Requests\Testimonial;

use App\Http\Requests\BaseFormRequest;

class UpdateTestimonialRequest extends BaseFormRequest
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
            'role' => 'sometimes|array',
            'role.uz' => 'required_with:role|string|max:255',
            'role.ru' => 'nullable|string|max:255',
            'role.en' => 'nullable|string|max:255',
            'text' => 'sometimes|array',
            'text.uz' => 'required_with:text|string|max:5000',
            'text.ru' => 'nullable|string|max:5000',
            'text.en' => 'nullable|string|max:5000',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'photo' => 'nullable|image|max:5120',
        ];
    }
}
