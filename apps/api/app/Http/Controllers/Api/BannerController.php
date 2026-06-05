<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Banner\StoreBannerRequest;
use App\Http\Requests\Banner\UpdateBannerRequest;
use App\Http\Resources\BannerResource;
use App\Models\User;
use App\Services\BannerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BannerController extends BaseController
{
    public function __construct(
        private readonly BannerService $bannerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        // Token bo'lsa — user ni aniqlash (xatolik bermaydi)
        /** @var User|null $user */
        $user = null;
        try {
            $user = auth('sanctum')->user();
        } catch (\Throwable) {
        }

        // Admin — paginated ro'yxat (faol + nofaol), Public — faqat aktiv bannerlar
        if ($user instanceof User && $user->hasAnyRole(['super-admin', 'admin'])) {
            $banners = $this->bannerService->getAll($request);

            return $this->paginated($banners, BannerResource::class);
        }

        $banners = $this->bannerService->getActive();

        return $this->success(BannerResource::collection($banners));
    }

    public function show(int $id): JsonResponse
    {
        $banner = $this->bannerService->findById($id);

        return $this->success(new BannerResource($banner));
    }

    public function store(StoreBannerRequest $request): JsonResponse
    {
        $banner = $this->bannerService->create($request->validated());

        return $this->success(new BannerResource($banner), __('messages.created', ['model' => __('messages.models.banner')]), 201);
    }

    public function update(UpdateBannerRequest $request, int $id): JsonResponse
    {
        $banner = $this->bannerService->update($id, $request->validated());

        return $this->success(new BannerResource($banner), __('messages.updated', ['model' => __('messages.models.banner')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->bannerService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.banner')]));
    }
}
