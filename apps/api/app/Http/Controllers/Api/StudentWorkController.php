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
}
