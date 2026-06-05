<?php

namespace App\Http\Requests\JobApplication;

use App\Http\Requests\BaseFormRequest;

class StoreJobApplicationRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return true; // Public — hammaga ochiq
    }

    public function rules(): array
    {
        return [
            // Asosiy ma'lumotlar
            'name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:20'],
            'email' => ['required', 'email', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'salary' => ['nullable', 'string', 'max:100'],
            'birthday' => ['nullable', 'date'],
            'skype' => ['nullable', 'string', 'max:255'],

            // Fayllar — model'dagi acceptsMimeTypes bilan sinxron
            'resume' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'photo' => ['nullable', 'file', 'max:10240', 'mimes:jpg,jpeg,png,webp'],
            'motivation_letter' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'work_report' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'future_vision' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'teaching_portfolio' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'research_statement' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'dissertation' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],
            'diplomas' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp'],
            'transcripts' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp'],
            'english_cert' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx,jpg,jpeg,png,webp'],
            'recommendation' => ['nullable', 'file', 'max:10240', 'mimes:pdf,doc,docx'],

            // Qo'shimcha ma'lumotlar
            'citizenship' => ['nullable', 'string', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:20'],
            'extra_email' => ['nullable', 'email', 'max:255'],
            'social_media_link' => ['nullable', 'string', 'max:500'],
            'is_convicted' => ['nullable', 'boolean'],
            'how_find_vacancy' => ['nullable', 'string', 'max:255'],
            'is_currently_working' => ['nullable', 'boolean'],
            'applied_before_comment' => ['nullable', 'string', 'max:1000'],
            'relative_detail_at_university' => ['nullable', 'string', 'max:1000'],
            'skills' => ['nullable', 'string', 'max:1000'],
            'additional_info' => ['nullable', 'string', 'max:2000'],
            'research_identifier' => ['nullable', 'string', 'max:255'],
            'degree' => ['nullable', 'string', 'max:255'],
            'is_currently_in_uzbekistan' => ['nullable', 'boolean'],
            'is_previously_worked_at_university' => ['nullable', 'boolean'],
            'about_motivation' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
