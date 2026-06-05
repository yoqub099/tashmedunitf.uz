<?php

namespace App\Http\Requests\Partner;

use App\Http\Requests\BaseFormRequest;

class StorePartnerRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'url' => 'nullable|url|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
            'logo' => 'nullable|image|max:5120',
        ];
    }
}
