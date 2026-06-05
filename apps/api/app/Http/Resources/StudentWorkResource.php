<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentWorkResource extends JsonResource
{
    /** XSS: plain-text user input fields'ni escape qilish. */
    private function escape(?string $value): ?string
    {
        return $value === null ? null : htmlspecialchars($value, ENT_NOQUOTES | ENT_HTML5, 'UTF-8');
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'fullname' => $this->escape($this->fullname),
            'organization' => $this->escape($this->organization),
            'email' => $this->email,
            'phone' => $this->escape($this->phone),
            'address' => $this->escape($this->address),
            'file_path' => $this->file_path ? asset('storage/'.$this->file_path) : null,
            'file_name' => $this->escape($this->file_name),
            'is_read' => $this->is_read,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
