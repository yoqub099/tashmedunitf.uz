<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ConferenceRegistration\StoreConferenceRegistrationRequest;
use App\Http\Resources\ConferenceRegistrationResource;
use App\Services\ConferenceRegistrationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConferenceRegistrationController extends BaseController
{
    public function __construct(
        private readonly ConferenceRegistrationService $service
    ) {}

    /**
     * Public — konferensiyaga ro'yxatdan o'tish
     */
    public function store(StoreConferenceRegistrationRequest $request): JsonResponse
    {
        $this->service->create($request->validated());

        return $this->success(null, "Muvaffaqiyatli ro'yxatdan o'tdingiz!", 201);
    }

    /**
     * Admin — barcha ro'yxatdan o'tganlar
     */
    public function index(Request $request): JsonResponse
    {
        $registrations = $this->service->getAll($request);

        return $this->paginated($registrations, ConferenceRegistrationResource::class);
    }

    /**
     * Admin — bitta ro'yxat (o'qilgan deb belgilaydi)
     */
    public function show(int $id): JsonResponse
    {
        $reg = $this->service->markAsRead($id);

        return $this->success(new ConferenceRegistrationResource($reg));
    }

    /**
     * Admin — o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->service->delete($id);

        return $this->success(null, "Ro'yxat o'chirildi");
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
