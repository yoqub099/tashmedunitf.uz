<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ConferenceRegistration extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'news_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false)->orderByDesc('created_at');
    }
}
