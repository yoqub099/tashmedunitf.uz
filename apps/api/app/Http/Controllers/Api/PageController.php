<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Page\StorePageRequest;
use App\Http\Requests\Page\UpdatePageRequest;
use App\Http\Resources\PageResource;
use App\Services\PageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PageController extends BaseController
{
    public function __construct(
        private readonly PageService $pageService
    ) {}

    /**
     * Public — Navigation tree (published nav items only, no content)
     */
    public function navigation(): JsonResponse
    {
        $tree = $this->pageService->getNavigationTree();

        return $this->success($tree);
    }

    /**
     * Admin — Full page tree with content
     */
    public function tree(Request $request): JsonResponse
    {
        $tree = $this->pageService->getTree($request);

        return $this->success($tree);
    }

    /**
     * Public — Find page by full slug path (e.g. "biz-haqimizda/rahbariyat")
     */
    public function findByPath(Request $request, string $path): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $page = $this->pageService->findByPath($path, ! $isAdmin);

        return $this->success(new PageResource($page));
    }

    /**
     * Admin — Reorder pages (drag & drop)
     */
    public function reorder(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|integer|exists:pages,id',
            'items.*.parent_id' => 'nullable|integer|exists:pages,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ]);

        $this->pageService->reorder($request->input('items'));

        return $this->success(null, __('messages.updated', ['model' => __('messages.models.page')]));
    }

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);
        $pages = $this->pageService->getAll($request, ! $isAdmin);

        return $this->paginated($pages, PageResource::class);
    }

    public function show(Request $request, string $identifier): JsonResponse
    {
        $isAdmin = $request->user()?->hasAnyRole(['super-admin', 'admin']);

        // ID (raqam) yoki slug bilan qidirish
        if (ctype_digit($identifier)) {
            $page = $this->pageService->findById((int) $identifier, ! $isAdmin);
        } else {
            $page = $this->pageService->findBySlug($identifier, ! $isAdmin);
        }

        return $this->success(new PageResource($page));
    }

    public function store(StorePageRequest $request): JsonResponse
    {
        $page = $this->pageService->create($request->validated());

        return $this->success(new PageResource($page), __('messages.created', ['model' => __('messages.models.page')]), 201);
    }

    public function update(UpdatePageRequest $request, int $id): JsonResponse
    {
        $page = $this->pageService->update($id, $request->validated());

        return $this->success(new PageResource($page), __('messages.updated', ['model' => __('messages.models.page')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->pageService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.page')]));
    }
}
