<?php

namespace App\Http\Requests\ConferenceRegistration;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreConferenceRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $newsId = (int) $this->input('news_id', 0);

        return [
            'news_id' => ['required', 'integer', 'exists:news,id'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            // Bir email bir tadbirga faqat 1 marta ro'yxatdan o'ta oladi
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('conference_registrations')
                    ->where(fn ($q) => $q->where('news_id', $newsId)->whereNull('deleted_at')),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => "Bu email bilan siz ushbu tadbirga allaqachon ro'yxatdan o'tgansiz.",
        ];
    }
}
