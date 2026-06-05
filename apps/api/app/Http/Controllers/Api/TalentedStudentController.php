<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\TalentedStudent\StoreTalentedStudentRequest;
use App\Http\Requests\TalentedStudent\UpdateTalentedStudentRequest;
use App\Http\Resources\TalentedStudentResource;
use App\Services\TalentedStudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TalentedStudentController extends BaseController
{
    public function __construct(
        private readonly TalentedStudentService $talentedStudentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $students = $this->talentedStudentService->getAll($request, ! $isAdmin);

        return $this->paginated($students, TalentedStudentResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $student = $this->talentedStudentService->findById($id);

        return $this->success(new TalentedStudentResource($student));
    }

    public function store(StoreTalentedStudentRequest $request): JsonResponse
    {
        $student = $this->talentedStudentService->create($request->validated());

        return $this->success(new TalentedStudentResource($student), __('messages.created', ['model' => 'Iqtidorli talaba']), 201);
    }

    public function update(UpdateTalentedStudentRequest $request, int $id): JsonResponse
    {
        $student = $this->talentedStudentService->update($id, $request->validated());

        return $this->success(new TalentedStudentResource($student), __('messages.updated', ['model' => 'Iqtidorli talaba']));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->talentedStudentService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Iqtidorli talaba']));
    }
}
