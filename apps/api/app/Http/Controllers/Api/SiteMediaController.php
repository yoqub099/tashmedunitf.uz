<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SiteMedia\StoreSiteMediaRequest;
use App\Http\Requests\SiteMedia\UpdateSiteMediaRequest;
use App\Http\Resources\SiteMediaResource;
use App\Services\SiteMediaService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteMediaController extends BaseController
{
    public function __construct(
        private readonly SiteMediaService $siteMediaService
    ) {}

    /**
     * GET /v1/site-media — barcha site media
     */
    public function index(Request $request): JsonResponse
    {
        $items = $this->siteMediaService->getAll($request);

        return $this->success(SiteMediaResource::collection($items));
    }

    /**
     * GET /v1/site-media/{key} — key bo'yicha bitta media
     */
    public function showByKey(string $key): JsonResponse
    {
        $item = $this->siteMediaService->findByKey($key);

        if (! $item) {
            return $this->error(__('messages.not_found'), 404);
        }

        return $this->success(new SiteMediaResource($item));
    }

    /**
     * GET /v1/admin/site-media/{id} — ID bo'yicha bitta (admin)
     */
    public function show(int $id): JsonResponse
    {
        $item = $this->siteMediaService->findById($id);

        return $this->success(new SiteMediaResource($item));
    }

    /**
     * POST /v1/admin/site-media — yangi yaratish
     */
    public function store(StoreSiteMediaRequest $request): JsonResponse
    {
        $item = $this->siteMediaService->create($request->validated());

        return $this->success(new SiteMediaResource($item), __('messages.created', ['model' => 'Site media']), 201);
    }

    /**
     * PUT /v1/admin/site-media/{id} — yangilash
     */
    public function update(UpdateSiteMediaRequest $request, int $id): JsonResponse
    {
        $item = $this->siteMediaService->update($id, $request->validated());

        return $this->success(new SiteMediaResource($item), __('messages.updated', ['model' => 'Site media']));
    }

    /**
     * DELETE /v1/admin/site-media/{id} — o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->siteMediaService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Site media']));
    }
}
