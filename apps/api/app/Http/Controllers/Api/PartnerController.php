<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Partner\StorePartnerRequest;
use App\Http\Requests\Partner\UpdatePartnerRequest;
use App\Http\Resources\PartnerResource;
use App\Services\PartnerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartnerController extends BaseController
{
    public function __construct(
        private readonly PartnerService $partnerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $partners = $this->partnerService->getAll($request, ! $isAdmin);

        return $this->paginated($partners, PartnerResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $partner = $this->partnerService->findById($id);

        return $this->success(new PartnerResource($partner));
    }

    public function store(StorePartnerRequest $request): JsonResponse
    {
        $partner = $this->partnerService->create($request->validated());

        return $this->success(new PartnerResource($partner), __('messages.created', ['model' => __('messages.models.partner')]), 201);
    }

    public function update(UpdatePartnerRequest $request, int $id): JsonResponse
    {
        $partner = $this->partnerService->update($id, $request->validated());

        return $this->success(new PartnerResource($partner), __('messages.updated', ['model' => __('messages.models.partner')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->partnerService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.partner')]));
    }
}
