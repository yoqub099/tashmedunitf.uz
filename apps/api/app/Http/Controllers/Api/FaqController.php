<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Faq\StoreFaqRequest;
use App\Http\Requests\Faq\UpdateFaqRequest;
use App\Http\Resources\FaqResource;
use App\Services\FaqService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FaqController extends BaseController
{
    public function __construct(
        private readonly FaqService $faqService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $faqs = $this->faqService->getAll($request, ! $isAdmin);

        return $this->paginated($faqs, FaqResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $faq = $this->faqService->findById($id);

        // Nofaol yozuv faqat adminga ko'rinadi
        if (! $faq->is_active && ! $this->isAdminRequest()) {
            return $this->error(__('messages.not_found', ['model' => __('messages.models.faq')]), 404);
        }

        return $this->success(new FaqResource($faq));
    }

    public function store(StoreFaqRequest $request): JsonResponse
    {
        $faq = $this->faqService->create($request->validated());

        return $this->success(new FaqResource($faq), __('messages.created', ['model' => __('messages.models.faq')]), 201);
    }

    public function update(UpdateFaqRequest $request, int $id): JsonResponse
    {
        $faq = $this->faqService->update($id, $request->validated());

        return $this->success(new FaqResource($faq), __('messages.updated', ['model' => __('messages.models.faq')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->faqService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.faq')]));
    }
}
