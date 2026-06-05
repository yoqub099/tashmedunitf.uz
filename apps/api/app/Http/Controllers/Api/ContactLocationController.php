<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ContactLocation\StoreContactLocationRequest;
use App\Http\Requests\ContactLocation\UpdateContactLocationRequest;
use App\Http\Resources\ContactLocationResource;
use App\Models\User;
use App\Services\ContactLocationService;
use Illuminate\Http\JsonResponse;

class ContactLocationController extends BaseController
{
    public function __construct(
        private readonly ContactLocationService $locationService
    ) {}

    /**
     * Public + Admin: Optional auth — admin bo'lsa barcha, aks holda faqat aktiv
     */
    public function index(): JsonResponse
    {
        /** @var User|null $user */
        $user = null;
        try {
            $user = auth('sanctum')->user();
        } catch (\Throwable) {
        }

        if ($user instanceof User && $user->hasAnyRole(['super-admin', 'admin'])) {
            $locations = $this->locationService->getAll();
        } else {
            $locations = $this->locationService->getActive();
        }

        return $this->success(ContactLocationResource::collection($locations));
    }

    /**
     * Admin: Bitta joylashuv
     */
    public function show(int $id): JsonResponse
    {
        $location = $this->locationService->findById($id);

        return $this->success(new ContactLocationResource($location));
    }

    /**
     * Admin: Yangi joylashuv yaratish
     */
    public function store(StoreContactLocationRequest $request): JsonResponse
    {
        $location = $this->locationService->create($request->validated());

        return $this->success(
            new ContactLocationResource($location),
            __('messages.created', ['model' => 'Joylashuv']),
            201
        );
    }

    /**
     * Admin: Joylashuvni yangilash
     */
    public function update(UpdateContactLocationRequest $request, int $id): JsonResponse
    {
        $location = $this->locationService->update($id, $request->validated());

        return $this->success(
            new ContactLocationResource($location),
            __('messages.updated', ['model' => 'Joylashuv'])
        );
    }

    /**
     * Admin: Joylashuvni o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->locationService->delete($id);

        return $this->success(
            null,
            __('messages.deleted', ['model' => 'Joylashuv'])
        );
    }
}
