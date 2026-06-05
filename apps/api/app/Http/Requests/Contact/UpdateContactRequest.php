<?php

namespace App\Http\Requests\Contact;

use App\Http\Requests\BaseFormRequest;

class UpdateContactRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'subject' => ['sometimes', 'string', 'max:255'],
            'message' => ['sometimes', 'string', 'max:5000'],
            'is_read' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'string', 'in:new,accepted,completed'],
        ];
    }
}
