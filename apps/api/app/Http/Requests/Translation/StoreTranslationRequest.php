<?php

namespace App\Http\Requests\Translation;

use App\Http\Requests\BaseFormRequest;

class StoreTranslationRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'key' => 'required|string|max:255|unique:translations,key',
            'group' => 'required|string|max:100',
            'value' => 'required|array',
            'value.uz' => 'required|string',
            'value.ru' => 'nullable|string',
            'value.en' => 'nullable|string',
        ];
    }
}
