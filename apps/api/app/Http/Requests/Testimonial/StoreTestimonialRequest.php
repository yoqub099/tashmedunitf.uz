<?php

namespace App\Http\Requests\Testimonial;

use App\Http\Requests\BaseFormRequest;

class StoreTestimonialRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|array',
            'name.uz' => 'required|string|max:255',
            'name.ru' => 'nullable|string|max:255',
            'name.en' => 'nullable|string|max:255',
            'role' => 'required|array',
            'role.uz' => 'required|string|max:255',
            'role.ru' => 'nullable|string|max:255',
            'role.en' => 'nullable|string|max:255',
            'text' => 'required|array',
            'text.uz' => 'required|string|max:5000',
            'text.ru' => 'nullable|string|max:5000',
            'text.en' => 'nullable|string|max:5000',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'photo' => 'nullable|image|max:5120',
        ];
    }
}
