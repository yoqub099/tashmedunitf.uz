<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Base FormRequest – normalizes boolean string values before validation.
 *
 * "true"/"false" → true/false
 * All form requests that have boolean rules should extend this instead of FormRequest.
 */
class BaseFormRequest extends FormRequest
{
    /**
     * Boolean field names — auto-detected from rules() array.
     * Override this to add custom fields if needed.
     */
    protected function booleanFields(): array
    {
        $fields = [];
        foreach ($this->rules() as $key => $rule) {
            $ruleString = is_array($rule) ? implode('|', array_map('strval', $rule)) : (string) $rule;
            if (str_contains($ruleString, 'boolean')) {
                $fields[] = $key;
            }
        }

        return $fields;
    }

    protected function prepareForValidation(): void
    {
        foreach ($this->booleanFields() as $field) {
            if ($this->has($field)) {
                $val = $this->input($field);
                if (is_string($val)) {
                    $lower = strtolower($val);
                    if (in_array($lower, ['true', '1', 'yes', 'on'], true)) {
                        $this->merge([$field => true]);
                    } elseif (in_array($lower, ['false', '0', 'no', 'off', ''], true)) {
                        $this->merge([$field => false]);
                    }
                }
            }
        }
    }
}
