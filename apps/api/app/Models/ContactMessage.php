<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class ContactMessage extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes;

    public const STATUS_NEW = 'new';

    public const STATUS_ACCEPTED = 'accepted';

    public const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'name',
        'email',
        'phone',
        'subject',
        'message',
        'is_read',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
        ];
    }

    // ========================================
    // SCOPES — Index optimized
    // ========================================

    /**
     * PARTIAL INDEX: idx_contact_unread_date
     * O'qilmagan xabarlar (admin panel uchun)
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false)->orderByDesc('created_at');
    }

    /**
     * BRIN INDEX: idx_contact_created_brin
     * Vaqt oralig'ida qidiruv
     */
    public function scopeCreatedBetween($query, string $from, string $to)
    {
        return $query->whereBetween('created_at', [$from, $to]);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachment')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/gif'])
            ->useDisk('public');
    }
}
