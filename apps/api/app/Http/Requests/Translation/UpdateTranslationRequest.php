<?php

namespace App\Http\Requests\Translation;

use App\Http\Requests\BaseFormRequest;

class UpdateTranslationRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'key' => 'sometimes|string|max:255|unique:translations,key,'.$this->route('id'),
            'group' => 'sometimes|string|max:100',
            'value' => 'sometimes|array',
            'value.uz' => 'required_with:value|string',
            'value.ru' => 'nullable|string',
            'value.en' => 'nullable|string',
        ];
    }
}
