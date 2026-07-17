<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StudentWork\StoreStudentWorkRequest;
use App\Http\Resources\StudentWorkResource;
use App\Services\StudentWorkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentWorkController extends BaseController
{
    public function __construct(
        private readonly StudentWorkService $studentWorkService
    ) {}

    /**
     * Public: Talaba ishi yuborish
     */
    public function store(StoreStudentWorkRequest $request): JsonResponse
    {
        $work = $this->studentWorkService->create(
            $request->validated(),
            $request->file('file')
        );

        return $this->success(new StudentWorkResource($work), 'Talaba ishi muvaffaqiyatli yuborildi!', 201);
    }

    /**
     * Admin: Barcha talaba ishlarini ko'rish
     */
    public function index(Request $request): JsonResponse
    {
        $works = $this->studentWorkService->getAll($request);

        return $this->paginated($works, StudentWorkResource::class);
    }

    /**
     * Admin: Bitta ishni ko'rish + o'qilgan deb belgilash
     */
    public function show(int $id): JsonResponse
    {
        $work = $this->studentWorkService->markAsRead($id);

        return $this->success(new StudentWorkResource($work));
    }

    /**
     * Admin: Ishni o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->studentWorkService->delete($id);

        return $this->success(null, 'Talaba ishi o\'chirildi.');
    }

    /**
     * Admin: O'qilmagan ishlar soni
     */
    public function unreadCount(): JsonResponse
    {
        $count = $this->studentWorkService->unreadCount();

        return $this->success(['count' => $count]);
    }

    /**
     * Faylni yuklab olish — faqat imzolangan URL orqali ('signed' middleware).
     * URL StudentWorkResource'da 30 daqiqaga imzolanadi (admin API javoblarida
     * va yuborilgan zahoti muallifning o'z javobida beriladi).
     */
    public function download(int $id): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $work = \App\Models\StudentWork::findOrFail($id);

        if (! $work->file_path || ! \Illuminate\Support\Facades\Storage::disk('local')->exists($work->file_path)) {
            abort(404, 'Fayl topilmadi.');
        }

        return \Illuminate\Support\Facades\Storage::disk('local')->download(
            $work->file_path,
            $work->file_name ?: basename($work->file_path)
        );
    }
}
