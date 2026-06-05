<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Direction\StoreDirectionRequest;
use App\Http\Requests\Direction\UpdateDirectionRequest;
use App\Http\Resources\DirectionResource;
use App\Services\DirectionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DirectionController extends BaseController
{
    public function __construct(
        private readonly DirectionService $directionService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $directions = $this->directionService->getAll($request, ! $isAdmin);

        return $this->paginated($directions, DirectionResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $direction = $this->directionService->findById($id);

        return $this->success(new DirectionResource($direction));
    }

    public function store(StoreDirectionRequest $request): JsonResponse
    {
        $direction = $this->directionService->create($request->validated());

        return $this->success(new DirectionResource($direction), __('messages.created', ['model' => __('messages.models.direction')]), 201);
    }

    public function update(UpdateDirectionRequest $request, int $id): JsonResponse
    {
        $direction = $this->directionService->update($id, $request->validated());

        return $this->success(new DirectionResource($direction), __('messages.updated', ['model' => __('messages.models.direction')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->directionService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.direction')]));
    }
}
