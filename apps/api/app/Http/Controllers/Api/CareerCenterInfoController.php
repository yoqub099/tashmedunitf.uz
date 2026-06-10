<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\CareerCenterInfo\StoreCareerCenterInfoRequest;
use App\Http\Requests\CareerCenterInfo\UpdateCareerCenterInfoRequest;
use App\Http\Resources\CareerCenterInfoResource;
use App\Services\CareerCenterInfoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CareerCenterInfoController extends BaseController
{
    public function __construct(
        private readonly CareerCenterInfoService $careerCenterInfoService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $infos = $this->careerCenterInfoService->getAll($request, ! $isAdmin);

        return $this->paginated($infos, CareerCenterInfoResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $info = $this->careerCenterInfoService->findById($id);

        return $this->success(new CareerCenterInfoResource($info));
    }

    public function store(StoreCareerCenterInfoRequest $request): JsonResponse
    {
        $info = $this->careerCenterInfoService->create($request->validated());

        return $this->success(new CareerCenterInfoResource($info), __('messages.created', ['model' => 'Karyera markazi']), 201);
    }

    public function update(UpdateCareerCenterInfoRequest $request, int $id): JsonResponse
    {
        $info = $this->careerCenterInfoService->update($id, $request->validated());

        return $this->success(new CareerCenterInfoResource($info), __('messages.updated', ['model' => 'Karyera markazi']));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->careerCenterInfoService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Karyera markazi']));
    }
}
