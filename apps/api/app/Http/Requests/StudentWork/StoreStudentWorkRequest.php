<?php

namespace App\Http\Requests\StudentWork;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentWorkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'fullname' => ['required', 'string', 'max:255'],
            'organization' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'address' => ['required', 'string', 'max:500'],
            'file' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:2048'],
        ];
    }
}
