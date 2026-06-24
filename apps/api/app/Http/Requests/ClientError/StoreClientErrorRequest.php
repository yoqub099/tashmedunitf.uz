<?php

namespace App\Http\Requests\ClientError;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Frontend (Next.js) xatolik payload validatsiyasi.
 * Public endpoint — POST /api/v1/client-errors (throttled).
 */
class StoreClientErrorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // public — har qanday brauzer xato yubora oladi
    }

    public function rules(): array
    {
        return [
            'source' => 'required|string|in:web,admin',
            'message' => 'required|string|max:5000',
            'type' => 'nullable|string|max:255',
            'level' => 'nullable|string|in:error,warning,critical,info',
            'stack' => 'nullable|string|max:20000',
            'componentStack' => 'nullable|string|max:10000',
            'url' => 'nullable|string|max:2000',
            'file' => 'nullable|string|max:1000',
            'line' => 'nullable|integer',
            'status_code' => 'nullable|integer',
            'extra' => 'nullable|array',
        ];
    }
}
