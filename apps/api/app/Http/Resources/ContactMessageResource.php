<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactMessageResource extends JsonResource
{
    /**
     * XSS himoyasi — user-input matnlarida HTML tag'larni escape qilish.
     * Admin panelda raw ko'rinadi, lekin brauzerda safe render bo'ladi.
     */
    private function escape(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return htmlspecialchars($value, ENT_NOQUOTES | ENT_HTML5, 'UTF-8');
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->escape($this->name),
            'email' => $this->email, // email format o'zgartirilmaydi
            'phone' => $this->escape($this->phone),
            'subject' => $this->escape($this->subject),
            'message' => $this->escape($this->message),
            'is_read' => $this->is_read,
            'status' => $this->status,
            'attachment_url' => $this->getFirstMediaUrl('attachment') ?: null,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
