<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\JobApplication\StoreJobApplicationRequest;
use App\Http\Resources\JobApplicationResource;
use App\Services\JobApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class JobApplicationController extends BaseController
{
    public function __construct(
        private readonly JobApplicationService $service
    ) {}

    /**
     * Public — ishga ariza yuborish
     */
    public function store(StoreJobApplicationRequest $request): JsonResponse
    {
        $this->service->create($request->validated(), $request);

        return $this->success(null, 'Arizangiz muvaffaqiyatli yuborildi!', 201);
    }

    /**
     * Admin — barcha arizalar
     */
    public function index(Request $request): JsonResponse
    {
        $applications = $this->service->getAll($request);

        return $this->paginated($applications, JobApplicationResource::class);
    }

    /**
     * Admin — bitta ariza (o'qilgan deb belgilaydi)
     */
    public function show(int $id): JsonResponse
    {
        $app = $this->service->markAsRead($id);

        return $this->success(new JobApplicationResource($app));
    }

    /**
     * Admin — o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return $this->success(null, "Ariza o'chirildi");
    }

    /**
     * Admin — o'qilmagan soni
     */
    public function unreadCount(): JsonResponse
    {
        $count = $this->service->unreadCount();

        return $this->success(['count' => $count]);
    }
}
