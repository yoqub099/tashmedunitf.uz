<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ActivityLog
 */
class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'log_name' => $this->log_name,
            'event' => $this->event,
            'description' => $this->description,
            'causer' => [
                'id' => $this->causer_id,
                'name' => $this->causer_name,
                'role' => $this->causer_role,
            ],
            'subject' => [
                'type' => $this->subject_type,
                'id' => $this->subject_id,
                'label' => $this->subject_label,
            ],
            'old_values' => $this->old_values,
            'new_values' => $this->new_values,
            'properties' => $this->properties,
            'ip' => $this->ip,
            'method' => $this->method,
            'url' => $this->url,
            'user_agent' => $this->user_agent,
            'created_at' => $this->created_at?->toISOString(),
        ];
    }
}
