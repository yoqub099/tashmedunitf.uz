<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Admin faoliyati audit yozuvi (/look kuzatuv markazi).
 *
 * Kim nimani qachon yaratdi/o'zgartirdi/o'chirdi — eski→yangi qiymat bilan.
 *
 * @see \App\Services\AuditLogger
 * @see \App\Observers\AuditObserver
 *
 * @property \Illuminate\Support\Carbon|null $created_at
 */
class ActivityLog extends Model
{
    /** Append-only — faqat created_at ishlatamiz (updated_at yo'q). */
    public $timestamps = false;

    protected $fillable = [
        'log_name',
        'event',
        'description',
        'causer_id',
        'causer_name',
        'causer_role',
        'subject_type',
        'subject_id',
        'subject_label',
        'old_values',
        'new_values',
        'properties',
        'ip',
        'user_agent',
        'url',
        'method',
        'created_at',
    ];

    protected function casts(): array
    {
        return [
            'old_values' => 'array',
            'new_values' => 'array',
            'properties' => 'array',
            'created_at' => 'datetime',
        ];
    }

    public function causer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'causer_id');
    }

    // ========================================
    // SCOPES
    // ========================================

    public function scopeLogName($query, string $logName)
    {
        return $query->where('log_name', $logName);
    }

    public function scopeEvent($query, string $event)
    {
        return $query->where('event', $event);
    }

    public function scopeByCauser($query, int $causerId)
    {
        return $query->where('causer_id', $causerId);
    }

    public function scopeRecent($query)
    {
        return $query->orderByDesc('created_at');
    }
}
