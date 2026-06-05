<?php

namespace App\Http\Requests\CareerCenterInfo;

use App\Http\Requests\BaseFormRequest;

class UpdateCareerCenterInfoRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|array',
            'title.uz' => 'required_with:title|string|max:255',
            'title.ru' => 'nullable|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'subtitle' => 'sometimes|array',
            'subtitle.uz' => 'nullable|string|max:500',
            'subtitle.ru' => 'nullable|string|max:500',
            'subtitle.en' => 'nullable|string|max:500',
            'content' => 'sometimes|array',
            'content.uz' => 'nullable|string|max:10000',
            'content.ru' => 'nullable|string|max:10000',
            'content.en' => 'nullable|string|max:10000',
            'address' => 'sometimes|array',
            'address.uz' => 'nullable|string|max:500',
            'address.ru' => 'nullable|string|max:500',
            'address.en' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ];
    }
}
