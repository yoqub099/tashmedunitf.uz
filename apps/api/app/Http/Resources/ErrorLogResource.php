<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\ErrorLog
 */
class ErrorLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'source' => $this->source,
            'level' => $this->level,
            'type' => $this->type,
            'message' => $this->message,
            'file' => $this->file,
            'line' => $this->line,
            'url' => $this->url,
            'method' => $this->method,
            'status_code' => $this->status_code,
            'user' => [
                'id' => $this->user_id,
                'name' => $this->user_name,
            ],
            'ip' => $this->ip,
            'user_agent' => $this->user_agent,
            'context' => $this->context,
            'fingerprint' => $this->fingerprint,
            'count' => $this->count,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
