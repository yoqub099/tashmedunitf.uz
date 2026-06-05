<?php

namespace App\Services;

use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class JobApplicationService
{
    /**
     * File collection nomlari (Spatie Media Library)
     */
    private const FILE_COLLECTIONS = [
        'resume',
        'photo',
        'motivation_letter',
        'work_report',
        'future_vision',
        'teaching_portfolio',
        'research_statement',
        'dissertation',
        'diplomas',
        'transcripts',
        'english_cert',
        'recommendation',
    ];

    public function getAll(Request $request): LengthAwarePaginator
    {
        return QueryBuilder::for(JobApplication::class)
            ->with('media')
            ->allowedFilters([
                AllowedFilter::exact('is_read'),
                AllowedFilter::partial('name'),
                AllowedFilter::partial('email'),
                AllowedFilter::exact('position'),
                AllowedFilter::exact('degree'),
            ])
            ->allowedSorts(['created_at', 'is_read', 'name', 'position'])
            ->defaultSort('-created_at')
            ->paginate(max(1, min((int) $request->get('per_page', 20), 100)));
    }

    public function findById(int $id): JobApplication
    {
        return JobApplication::findOrFail($id);
    }

    public function create(array $data, Request $request): JobApplication
    {
        // File maydonlarini ajratib olamiz
        $fields = collect($data)->except(self::FILE_COLLECTIONS)->toArray();

        // DB transaction — agar fayl yuklashda xato bo'lsa, ariza ham rollback qilinadi
        return DB::transaction(function () use ($fields, $request) {
            $application = JobApplication::create($fields);

            // Fayllarni Spatie Media Library orqali saqlash
            foreach (self::FILE_COLLECTIONS as $collection) {
                /** @var UploadedFile|null $file */
                $file = $request->file($collection);
                if ($file) {
                    try {
                        $application
                            ->addMedia($file)
                            ->toMediaCollection($collection);
                    } catch (\Throwable $e) {
                        Log::error("Failed to add media to collection [{$collection}]", [
                            'job_application_id' => $application->id,
                            'error' => $e->getMessage(),
                        ]);
                        // Transaction rollback — ariza ham o'chiriladi
                        throw $e;
                    }
                }
            }

            return $application;
        });
    }

    public function markAsRead(int $id): JobApplication
    {
        $application = JobApplication::findOrFail($id);
        $application->update(['is_read' => true]);

        return $application;
    }

    public function delete(int $id): void
    {
        $application = JobApplication::find($id);
        if (! $application) {
            return;
        }

        // Spatie Media Library — barcha fayllarni diskdan o'chirish
        foreach (self::FILE_COLLECTIONS as $collection) {
            try {
                $application->clearMediaCollection($collection);
            } catch (\Throwable $e) {
                \Log::warning("Failed to clear media collection [{$collection}] for job application #{$id}", ['error' => $e->getMessage()]);
            }
        }

        // Ma'lumotni bazadan butunlay o'chirish (SoftDelete emas)
        $application->forceDelete();
    }

    /**
     * O'qilmagan arizalar soni (admin badge uchun, cached 30s)
     */
    public function unreadCount(): int
    {
        $cacheKey = CacheService::key('job_applications', 'unread_count');

        return CacheService::remember($cacheKey, 30, function () {
            return JobApplication::where('is_read', false)->count();
        });
    }
}
