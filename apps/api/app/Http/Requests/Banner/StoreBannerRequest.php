<?php

namespace App\Http\Requests\Banner;

use App\Http\Requests\BaseFormRequest;

class StoreBannerRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'title' => 'required|array',
            'title.uz' => 'required|string|max:255',
            'title.ru' => 'nullable|string|max:255',
            'title.en' => 'nullable|string|max:255',
            'subtitle' => 'nullable|array',
            'subtitle.uz' => 'nullable|string|max:500',
            'subtitle.ru' => 'nullable|string|max:500',
            'subtitle.en' => 'nullable|string|max:500',
            'link' => 'nullable|string|max:500',
            'button_text' => 'nullable|array',
            'button_text.uz' => 'nullable|string|max:100',
            'button_text.ru' => 'nullable|string|max:100',
            'button_text.en' => 'nullable|string|max:100',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'image' => 'nullable|image|max:10240',
            'mobile_image' => 'nullable|image|max:5120',
        ];
    }
}
