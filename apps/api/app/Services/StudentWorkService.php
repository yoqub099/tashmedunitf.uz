<?php

namespace App\Services;

use App\Models\StudentWork;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class StudentWorkService
{
    public function create(array $data, ?UploadedFile $file = null): StudentWork
    {
        if ($file) {
            // MAXFIY disk ('local') — fayllar shaxsiy hujjat bo'lishi mumkin.
            // Yuklab olish faqat imzolangan (signed, 30 daqiqalik) URL orqali:
            // StudentWorkResource -> route('student-works.download').
            // (Avval 'public' diskda edi — URLni bilgan har kim ochib ko'rardi.)
            $path = $file->store('student-works', 'local');
            $data['file_path'] = $path;
            $data['file_name'] = $file->getClientOriginalName();
        }

        unset($data['file']);

        return StudentWork::create($data);
    }

    public function getAll(Request $request)
    {
        $query = StudentWork::query()->orderByDesc('created_at');

        if ($request->has('is_read')) {
            $query->where('is_read', (bool) $request->input('is_read'));
        }

        // Server-side search (fullname / email / organization / phone)
        $search = $request->input('filter.search') ?? $request->input('search');
        if ($search) {
            $q = '%'.$search.'%';
            $query->where(function ($sub) use ($q) {
                $sub->where('fullname', 'ILIKE', $q)
                    ->orWhere('email', 'ILIKE', $q)
                    ->orWhere('organization', 'ILIKE', $q)
                    ->orWhere('phone', 'ILIKE', $q);
            });
        }

        return $query->paginate(max(1, min((int) $request->input('per_page', 15), 100)));
    }

    public function markAsRead(int $id): StudentWork
    {
        $work = StudentWork::findOrFail($id);
        $work->update(['is_read' => true]);

        return $work;
    }

    public function delete(int $id): void
    {
        $work = StudentWork::findOrFail($id);

        // Faylni diskdan o'chirish (yangi fayllar 'local'da; eski davr
        // 'public' bo'lgan — har ikkalasini ham tozalaymiz)
        if ($work->file_path) {
            foreach (['local', 'public'] as $disk) {
                try {
                    if (Storage::disk($disk)->exists($work->file_path)) {
                        Storage::disk($disk)->delete($work->file_path);
                    }
                } catch (\Throwable $e) {
                    Log::warning('Failed to delete student work file', ['id' => $id, 'disk' => $disk, 'path' => $work->file_path, 'error' => $e->getMessage()]);
                }
            }
        }

        $work->delete();
    }

    /**
     * O'qilmagan ishlar soni (admin badge uchun, cached 30s)
     */
    public function unreadCount(): int
    {
        $cacheKey = CacheService::key('student_works', 'unread_count');

        return CacheService::remember($cacheKey, 30, function () {
            return StudentWork::where('is_read', false)->count();
        });
    }
}
