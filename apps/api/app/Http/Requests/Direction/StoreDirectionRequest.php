<?php

namespace App\Http\Requests\Direction;

use App\Enums\DirectionLevel;
use App\Http\Requests\BaseFormRequest;
use Illuminate\Validation\Rule;

class StoreDirectionRequest extends BaseFormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin']);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'array'],
            'name.uz' => ['required', 'string', 'max:255'],
            'name.ru' => ['nullable', 'string', 'max:255'],
            'name.en' => ['nullable', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:50', 'unique:directions,code'],
            'level' => ['required', 'string', Rule::in(DirectionLevel::cases())],
            'description' => ['nullable', 'array'],
            'description.uz' => ['nullable', 'string'],
            'description.ru' => ['nullable', 'string'],
            'description.en' => ['nullable', 'string'],
            'duration' => ['nullable', 'string', 'max:50'],
            'price_daytime' => ['nullable', 'integer', 'min:0'],
            'price_remote' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'image' => ['nullable', 'image', 'max:5120'],
            'faculty_id' => ['nullable', 'integer', 'exists:faculties,id'],
            'exam_subjects' => ['nullable', 'array'],
            'exam_subjects.*' => ['string', 'max:255'],
        ];
    }

    /**
     * Faculty-level cross-check: direction level must match faculty level.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $facultyId = $this->input('faculty_id');
            $level = $this->input('level');
            if (! $facultyId || ! $level) {
                return;
            }

            $faculty = \App\Models\Faculty::find($facultyId);
            if ($faculty && $faculty->level !== $level) {
                $validator->errors()->add(
                    'faculty_id',
                    "Fakultet darajasi ({$faculty->level}) yo'nalish darajasi ({$level}) bilan mos kelmaydi."
                );
            }
        });
    }
}
