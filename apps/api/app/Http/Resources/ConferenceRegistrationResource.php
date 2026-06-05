<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConferenceRegistrationResource extends JsonResource
{
    /**
     * XSS himoyasi — user-input matnlarini HTML entities sifatida escape qilish.
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
            'news_id' => $this->news_id,
            'news' => $this->whenLoaded('news', fn () => [
                'id' => $this->news->id,
                'title' => $this->news->title,
                'slug' => $this->news->slug,
            ]),
            'first_name' => $this->escape($this->first_name),
            'last_name' => $this->escape($this->last_name),
            'email' => $this->email, // email format o'zgartirilmaydi
            'phone' => $this->escape($this->phone),
            'address' => $this->escape($this->address),
            'is_read' => $this->is_read,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
