<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Faculty\StoreFacultyRequest;
use App\Http\Requests\Faculty\UpdateFacultyRequest;
use App\Http\Resources\FacultyResource;
use App\Services\FacultyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacultyController extends BaseController
{
    public function __construct(
        private readonly FacultyService $facultyService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $faculties = $this->facultyService->getAll($request, ! $isAdmin);

        return $this->paginated($faculties, FacultyResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $faculty = $this->facultyService->findById($id);

        return $this->success(new FacultyResource($faculty));
    }

    public function store(StoreFacultyRequest $request): JsonResponse
    {
        $faculty = $this->facultyService->create($request->validated());

        return $this->success(new FacultyResource($faculty), __('messages.created', ['model' => 'Fakultet']), 201);
    }

    public function update(UpdateFacultyRequest $request, int $id): JsonResponse
    {
        $faculty = $this->facultyService->update($id, $request->validated());

        return $this->success(new FacultyResource($faculty), __('messages.updated', ['model' => 'Fakultet']));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->facultyService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Fakultet']));
    }
}
