<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobApplicationResource extends JsonResource
{
    /** XSS: plain-text user input fields'ni escape qilish. */
    private function escape(?string $value): ?string
    {
        return $value === null ? null : htmlspecialchars($value, ENT_NOQUOTES | ENT_HTML5, 'UTF-8');
    }

    /**
     * Private (local) disk fayllar uchun auth-protected download URL.
     * URL auth:sanctum + role:super-admin|admin talab qiladi (api.php).
     */
    private function fileInfo(string $collection): ?array
    {
        $media = $this->getFirstMedia($collection);
        if (! $media) {
            return null;
        }

        return [
            'id' => $media->id,
            'url' => url("/api/v1/media/download/{$media->id}"),
            'name' => $media->file_name,
            'size' => $media->size,
            'mime_type' => $media->mime_type,
        ];
    }

    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->escape($this->name),
            'last_name' => $this->escape($this->last_name),
            'middle_name' => $this->escape($this->middle_name),
            'phone' => $this->escape($this->phone),
            'email' => $this->email,
            'position' => $this->escape($this->position),
            'company' => $this->escape($this->company),
            'salary' => $this->escape($this->salary),
            'birthday' => $this->birthday?->format('Y-m-d'),
            'skype' => $this->escape($this->skype),

            'citizenship' => $this->escape($this->citizenship),
            'contact_phone' => $this->escape($this->contact_phone),
            'extra_email' => $this->extra_email,
            'social_media_link' => $this->escape($this->social_media_link),
            'is_convicted' => $this->is_convicted,
            'how_find_vacancy' => $this->escape($this->how_find_vacancy),
            'is_currently_working' => $this->is_currently_working,
            'applied_before_comment' => $this->escape($this->applied_before_comment),
            'relative_detail_at_university' => $this->escape($this->relative_detail_at_university),
            'skills' => $this->escape($this->skills),
            'additional_info' => $this->escape($this->additional_info),
            'research_identifier' => $this->escape($this->research_identifier),
            'degree' => $this->escape($this->degree),
            'is_currently_in_uzbekistan' => $this->is_currently_in_uzbekistan,
            'is_previously_worked_at_university' => $this->is_previously_worked_at_university,
            'about_motivation' => $this->escape($this->about_motivation),

            'is_read' => $this->is_read,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),

            // Fayllar — auth-protected download URL'lari (private local disk)
            'files' => [
                'resume' => $this->fileInfo('resume'),
                'photo' => $this->fileInfo('photo'),
                'motivation_letter' => $this->fileInfo('motivation_letter'),
                'work_report' => $this->fileInfo('work_report'),
                'future_vision' => $this->fileInfo('future_vision'),
                'teaching_portfolio' => $this->fileInfo('teaching_portfolio'),
                'research_statement' => $this->fileInfo('research_statement'),
                'dissertation' => $this->fileInfo('dissertation'),
                'diplomas' => $this->fileInfo('diplomas'),
                'transcripts' => $this->fileInfo('transcripts'),
                'english_cert' => $this->fileInfo('english_cert'),
                'recommendation' => $this->fileInfo('recommendation'),
            ],
        ];
    }
}
