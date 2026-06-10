<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\News\StoreNewsRequest;
use App\Http\Requests\News\UpdateNewsRequest;
use App\Http\Resources\NewsResource;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NewsController extends BaseController
{
    public function __construct(
        private readonly NewsService $newsService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $news = $this->newsService->getAll($request, ! $isAdmin);

        return $this->paginated($news, NewsResource::class);
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $news = $this->newsService->findByIdentifier($identifier, ! $isAdmin);

        return $this->success(new NewsResource($news));
    }

    public function store(StoreNewsRequest $request): JsonResponse
    {
        $news = $this->newsService->create($request->validated());

        return $this->success(new NewsResource($news), __('messages.created', ['model' => __('messages.models.news')]), 201);
    }

    public function update(UpdateNewsRequest $request, int $id): JsonResponse
    {
        $news = $this->newsService->update($id, $request->validated());

        return $this->success(new NewsResource($news), __('messages.updated', ['model' => __('messages.models.news')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->newsService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.news')]));
    }
}
