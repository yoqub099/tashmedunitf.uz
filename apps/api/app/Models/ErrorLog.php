<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Backend + frontend xatolik yozuvi (/look kuzatuv markazi).
 *
 * source = backend   → Laravel exception handler
 * source = web|admin → Next.js brauzer xatolari
 *
 * @see \App\Services\ErrorLogger
 */
class ErrorLog extends Model
{
    protected $fillable = [
        'source',
        'level',
        'type',
        'message',
        'file',
        'line',
        'url',
        'method',
        'status_code',
        'user_id',
        'user_name',
        'ip',
        'user_agent',
        'context',
        'fingerprint',
        'count',
    ];

    protected function casts(): array
    {
        return [
            'context' => 'array',
            'line' => 'integer',
            'status_code' => 'integer',
            'count' => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ========================================
    // SCOPES
    // ========================================

    public function scopeSource($query, string $source)
    {
        return $query->where('source', $source);
    }

    public function scopeLevel($query, string $level)
    {
        return $query->where('level', $level);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at');
    }
}
