<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LibraryResource\StoreLibraryResourceRequest;
use App\Http\Requests\LibraryResource\UpdateLibraryResourceRequest;
use App\Http\Resources\LibraryResourceResource;
use App\Services\LibraryResourceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LibraryResourceController extends BaseController
{
    public function __construct(
        private readonly LibraryResourceService $libraryResourceService
    ) {}

    public function categories(): JsonResponse
    {
        $categories = $this->libraryResourceService->getCategories();

        return $this->success($categories);
    }

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $resources = $this->libraryResourceService->getAll($request, ! $isAdmin);

        return $this->paginated($resources, LibraryResourceResource::class);
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $resource = $this->libraryResourceService->findByIdentifier($identifier, ! $isAdmin);

        return $this->success(new LibraryResourceResource($resource));
    }

    public function store(StoreLibraryResourceRequest $request): JsonResponse
    {
        $resource = $this->libraryResourceService->create($request->validated());

        return $this->success(
            new LibraryResourceResource($resource),
            __('messages.created', ['model' => 'Kutubxona resursi']),
            201
        );
    }

    public function update(UpdateLibraryResourceRequest $request, int $id): JsonResponse
    {
        $resource = $this->libraryResourceService->update($id, $request->validated());

        return $this->success(
            new LibraryResourceResource($resource),
            __('messages.updated', ['model' => 'Kutubxona resursi'])
        );
    }

    public function destroy(int $id): JsonResponse
    {
        $this->libraryResourceService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Kutubxona resursi']));
    }
}
