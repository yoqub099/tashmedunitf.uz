<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Department\StoreDepartmentRequest;
use App\Http\Requests\Department\UpdateDepartmentRequest;
use App\Http\Resources\DepartmentResource;
use App\Services\DepartmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DepartmentController extends BaseController
{
    public function __construct(
        private readonly DepartmentService $departmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $departments = $this->departmentService->getAll($request, ! $isAdmin);

        return $this->paginated($departments, DepartmentResource::class);
    }

    public function show(string $slug): JsonResponse
    {
        $department = $this->departmentService->findBySlug($slug);

        return $this->success(new DepartmentResource($department));
    }

    public function store(StoreDepartmentRequest $request): JsonResponse
    {
        $department = $this->departmentService->create($request->validated());

        return $this->success(new DepartmentResource($department), __('messages.created', ['model' => __('messages.models.department')]), 201);
    }

    public function update(UpdateDepartmentRequest $request, int $id): JsonResponse
    {
        $department = $this->departmentService->update($id, $request->validated());

        return $this->success(new DepartmentResource($department), __('messages.updated', ['model' => __('messages.models.department')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->departmentService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.department')]));
    }
}
