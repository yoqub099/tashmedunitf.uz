<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\StudentLifePhoto\StoreStudentLifePhotoRequest;
use App\Http\Requests\StudentLifePhoto\UpdateStudentLifePhotoRequest;
use App\Http\Resources\StudentLifePhotoResource;
use App\Services\StudentLifePhotoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentLifePhotoController extends BaseController
{
    public function __construct(
        private readonly StudentLifePhotoService $studentLifePhotoService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $photos = $this->studentLifePhotoService->getAll($request, ! $isAdmin);

        return $this->paginated($photos, StudentLifePhotoResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $photo = $this->studentLifePhotoService->findById($id);

        return $this->success(new StudentLifePhotoResource($photo));
    }

    public function store(StoreStudentLifePhotoRequest $request): JsonResponse
    {
        $photo = $this->studentLifePhotoService->create($request->validated());

        return $this->success(new StudentLifePhotoResource($photo), __('messages.created', ['model' => 'Foto']), 201);
    }

    public function update(UpdateStudentLifePhotoRequest $request, int $id): JsonResponse
    {
        $photo = $this->studentLifePhotoService->update($id, $request->validated());

        return $this->success(new StudentLifePhotoResource($photo), __('messages.updated', ['model' => 'Foto']));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->studentLifePhotoService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Foto']));
    }
}
