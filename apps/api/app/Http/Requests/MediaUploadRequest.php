<?php

namespace App\Http\Requests;

use App\Services\MediaUploadService;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Media Upload Request — Enterprise validatsiya
 *
 * 8 ta fayl turi:
 * - image:        max 10MB  | jpg, png, webp, gif, avif, svg, bmp, tiff
 * - video:        max 500MB | mp4, webm, mpeg, mov, avi, mkv
 * - document:     max 100MB | pdf, doc, docx, xls, xlsx, ppt, pptx, txt, csv
 * - book:         max 200MB | pdf, epub, mobi, fb2
 * - audio:        max 100MB | mp3, wav, ogg, aac, flac, m4a
 * - archive:      max 500MB | zip, rar, 7z, gz, tar
 * - presentation: max 200MB | ppt, pptx, odp
 * - spreadsheet:  max 50MB  | xls, xlsx, ods, csv
 */
class MediaUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasAnyRole(['super-admin', 'admin', 'editor']);
    }

    public function rules(): array
    {
        $type = $this->input('type', 'image');

        $rules = [
            'model_type' => 'required|string|in:news,department,staff,direction,banner,partner,page,faculty,testimonial,talented-student,student-life-photo,library-resource,journal-issue,contact-message,site-media,job-application',
            'model_id' => 'required|integer|min:1',
            'collection' => 'required|string|max:50',
            'type' => 'required|string|in:image,video,document,book,audio,archive,presentation,spreadsheet',
            'visibility' => 'sometimes|string|in:public,private',
        ];

        // Fayl validatsiyasi — turga qarab
        $limits = MediaUploadService::FILE_LIMITS[$type] ?? MediaUploadService::FILE_LIMITS['image'];
        $maxKb = (int) ($limits['max_size'] / 1024);
        $extensions = implode(',', $limits['extensions']);

        if ($this->hasFile('files')) {
            $rules['files'] = 'required|array|max:20';
            $rules['files.*'] = "required|file|max:{$maxKb}|mimes:{$extensions}";
        } else {
            $rules['file'] = "required|file|max:{$maxKb}|mimes:{$extensions}";
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Fayl tanlang.',
            'file.max' => 'Fayl juda katta. Maksimal hajm: :max KB.',
            'file.mimes' => 'Noto\'g\'ri fayl turi. Ruxsat berilgan: :values',
            'files.max' => 'Maksimal 20 ta fayl yuklash mumkin.',
            'files.*.max' => 'Har bir fayl :max KB dan oshmasligi kerak.',
            'files.*.mimes' => 'Noto\'g\'ri fayl turi. Ruxsat berilgan: :values',
            'model_type.in' => 'Noto\'g\'ri model turi.',
            'type.in' => 'Noto\'g\'ri fayl turi. Ruxsat berilgan: image, video, document, book, audio, archive, presentation, spreadsheet',
            'visibility.in' => 'Visibility faqat public yoki private bo\'lishi mumkin.',
        ];
    }
}
