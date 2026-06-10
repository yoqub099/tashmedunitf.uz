<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\Translatable\HasTranslations;

class Staff extends Model implements HasMedia
{
    use HasFactory, HasTranslations, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'full_name',
        'position',
        'department_id',
        'bio',
        'phone',
        'email',
        'is_active',
        'sort_order',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public array $translatable = ['full_name', 'position', 'bio'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // ========================================
    // SCOPES — Index optimized
    // ========================================

    /**
     * COMPOSITE INDEX: idx_staff_dept_active_sort
     * Kafedra + aktiv + tartib
     */
    public function scopeByDepartment($query, int $departmentId)
    {
        return $query->where('is_active', true)
            ->where('department_id', $departmentId)
            ->orderBy('sort_order');
    }

    /**
     * GIN INDEX: idx_staff_fullname_gin
     * 3 tilda ism qidiruv
     */
    public function scopeSearchName($query, string $search, string $locale = 'uz')
    {
        return $query->whereRaw(
            'full_name @> ?::jsonb',
            [json_encode([$locale => $search])]
        );
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Xodim uchun media collectionlar:
     *
     * 'photo' — Profil rasmi (1 ta) | Max: 5MB
     * 'cv' — Resume/CV hujjat (1 ta) | PDF
     * 'documents' — Sertifikat, diplom va boshqa hujjatlar
     * 'publications' — Ilmiy maqolalar, kitoblar (PDF)
     * 'private_docs' — Shaxsiy hujjatlar (MAXFIY, auth kerak)
     */
    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('photo')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp'])
            ->useDisk('public');

        // 🔒 MAXFIY — CV shaxsiy ma'lumot (telefon, manzil, tug'ilgan sana)
        $this->addMediaCollection('cv')
            ->singleFile()
            ->acceptsMimeTypes(['application/pdf'])
            ->useDisk('local');

        // 🔒 MAXFIY — diplom, sertifikat va boshqa shaxsiy hujjatlar
        $this->addMediaCollection('documents')
            ->acceptsMimeTypes([
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'image/jpeg', 'image/png',
            ])
            ->useDisk('local');

        $this->addMediaCollection('publications')
            ->acceptsMimeTypes(['application/pdf', 'application/epub+zip'])
            ->useDisk('public');

        // 🔒 MAXFIY — shaxsiy kontrakt, pasport skaner
        $this->addMediaCollection('private_docs')
            ->acceptsMimeTypes(['application/pdf', 'image/jpeg', 'image/png'])
            ->useDisk('local');
    }

    /**
     * Xodim rasmi konversiyalari:
     * - thumbnail: 200x200 (avatar uchun — ro'yxatda)
     * - medium: 400x500 (profil sahifasi uchun)
     */
    public function registerMediaConversions(?Media $media = null): void
    {
        $this->addMediaConversion('thumbnail')
            ->width(300)
            ->height(400)
            ->format('webp')
            ->quality(85)
            ->sharpen(10)
            ->queued()
            ->performOnCollections('photo');

        $this->addMediaConversion('medium')
            ->width(600)
            ->height(800)
            ->format('webp')
            ->quality(85)
            ->sharpen(10)
            ->queued()
            ->performOnCollections('photo');
    }
}
