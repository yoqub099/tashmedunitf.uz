<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Maxfiy media fayllarga kirish izi (audit trail).
 *
 * @see \App\Http\Controllers\Api\MediaController::download()
 * @see \App\Http\Controllers\Api\MediaController::stream()
 */
class MediaAccessLog extends Model
{
    /** Faqat created_at ishlatamiz (updated_at yo'q). */
    public $timestamps = false;

    protected $fillable = [
        'media_id',
        'user_id',
        'action',
        'result',
        'disk',
        'collection_name',
        'model_type',
        'model_id',
        'ip',
        'user_agent',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
