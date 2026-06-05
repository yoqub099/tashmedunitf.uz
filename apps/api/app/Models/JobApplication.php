<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class JobApplication extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia, SoftDeletes;

    protected $fillable = [
        'name',
        'last_name',
        'middle_name',
        'phone',
        'email',
        'position',
        'company',
        'salary',
        'birthday',
        'skype',
        'citizenship',
        'contact_phone',
        'extra_email',
        'social_media_link',
        'is_convicted',
        'how_find_vacancy',
        'is_currently_working',
        'applied_before_comment',
        'relative_detail_at_university',
        'skills',
        'additional_info',
        'research_identifier',
        'degree',
        'is_currently_in_uzbekistan',
        'is_previously_worked_at_university',
        'about_motivation',
        'is_read',
    ];

    protected function casts(): array
    {
        return [
            'is_read' => 'boolean',
            'is_convicted' => 'boolean',
            'is_currently_working' => 'boolean',
            'is_currently_in_uzbekistan' => 'boolean',
            'is_previously_worked_at_university' => 'boolean',
            'birthday' => 'date',
        ];
    }

    /**
     * Ish arizasi hujjatlari — MAXFIY (local disk)
     *
     * Barcha HR hujjatlar private saqlash:
     * - Nginx bermaydi, faqat auth orqali yuklab olish mumkin
     * - storage/app/private/jobs/{id}/{collection}/
     */
    public function registerMediaCollections(): void
    {
        $docMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        $imageMimes = ['image/jpeg', 'image/png', 'image/webp'];

        // Rezyume — PDF, Word
        $this->addMediaCollection('resume')
            ->singleFile()->acceptsMimeTypes($docMimes)->useDisk('local');

        // Foto — rasm
        $this->addMediaCollection('photo')
            ->singleFile()->acceptsMimeTypes($imageMimes)->useDisk('local');

        // Hujjatlar — PDF, Word
        foreach (['motivation_letter', 'work_report', 'future_vision', 'teaching_portfolio',
            'research_statement', 'dissertation', 'recommendation'] as $collection) {
            $this->addMediaCollection($collection)
                ->singleFile()->acceptsMimeTypes($docMimes)->useDisk('local');
        }

        // Sertifikat va diplomlar — PDF, Word, rasm
        foreach (['diplomas', 'transcripts', 'english_cert'] as $collection) {
            $this->addMediaCollection($collection)
                ->singleFile()->acceptsMimeTypes(array_merge($docMimes, $imageMimes))->useDisk('local');
        }
    }

    public function scopeUnread($query)
    {
        return $query->where('is_read', false)->orderByDesc('created_at');
    }
}
