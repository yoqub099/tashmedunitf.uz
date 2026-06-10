<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Staff\StoreStaffRequest;
use App\Http\Requests\Staff\UpdateStaffRequest;
use App\Http\Resources\StaffResource;
use App\Services\StaffService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StaffController extends BaseController
{
    public function __construct(
        private readonly StaffService $staffService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $staff = $this->staffService->getAll($request, ! $isAdmin);

        return $this->paginated($staff, StaffResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $staff = $this->staffService->findById($id);

        // Nofaol yozuv faqat adminga ko'rinadi
        if (! $staff->is_active && ! $this->isAdminRequest()) {
            return $this->error(__('messages.not_found', ['model' => __('messages.models.staff')]), 404);
        }

        return $this->success(new StaffResource($staff));
    }

    public function store(StoreStaffRequest $request): JsonResponse
    {
        $staff = $this->staffService->create($request->validated());

        return $this->success(new StaffResource($staff), __('messages.created', ['model' => __('messages.models.staff')]), 201);
    }

    public function update(UpdateStaffRequest $request, int $id): JsonResponse
    {
        $staff = $this->staffService->update($id, $request->validated());

        return $this->success(new StaffResource($staff), __('messages.updated', ['model' => __('messages.models.staff')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->staffService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.staff')]));
    }
}
