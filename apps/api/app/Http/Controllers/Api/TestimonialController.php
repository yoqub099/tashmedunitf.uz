<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Testimonial\StoreTestimonialRequest;
use App\Http\Requests\Testimonial\UpdateTestimonialRequest;
use App\Http\Resources\TestimonialResource;
use App\Services\TestimonialService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends BaseController
{
    public function __construct(
        private readonly TestimonialService $testimonialService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $isAdmin = $this->isAdminRequest();
        $testimonials = $this->testimonialService->getAll($request, ! $isAdmin);

        return $this->paginated($testimonials, TestimonialResource::class);
    }

    public function show(int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->findById($id);

        return $this->success(new TestimonialResource($testimonial));
    }

    public function store(StoreTestimonialRequest $request): JsonResponse
    {
        $testimonial = $this->testimonialService->create($request->validated());

        return $this->success(new TestimonialResource($testimonial), __('messages.created', ['model' => __('messages.models.testimonial')]), 201);
    }

    public function update(UpdateTestimonialRequest $request, int $id): JsonResponse
    {
        $testimonial = $this->testimonialService->update($id, $request->validated());

        return $this->success(new TestimonialResource($testimonial), __('messages.updated', ['model' => __('messages.models.testimonial')]));
    }

    public function destroy(int $id): JsonResponse
    {
        $this->testimonialService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => __('messages.models.testimonial')]));
    }
}
