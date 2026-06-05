<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\Translation\StoreTranslationRequest;
use App\Http\Requests\Translation\UpdateTranslationRequest;
use App\Http\Resources\TranslationResource;
use App\Services\TranslationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TranslationController extends BaseController
{
    public function __construct(
        private readonly TranslationService $translationService
    ) {}

    /**
     * Public — barcha tarjimalarni flat map formatda olish (auth kerak emas)
     * Frontend uchun: {key: {uz, ru, en}}
     */
    public function publicIndex(): JsonResponse
    {
        $translations = $this->translationService->getAllFlat();

        return $this->success($translations);
    }

    /**
     * Admin — sahifalangan ro'yxat, filter va qidiruv bilan
     */
    public function index(Request $request): JsonResponse
    {
        $translations = $this->translationService->getAll($request);

        return $this->paginated($translations, TranslationResource::class);
    }

    /**
     * Admin — bitta tarjimani ko'rish
     */
    public function show(int $id): JsonResponse
    {
        $translation = $this->translationService->findById($id);

        return $this->success(new TranslationResource($translation));
    }

    /**
     * Admin — yangi tarjima yaratish
     */
    public function store(StoreTranslationRequest $request): JsonResponse
    {
        $translation = $this->translationService->create($request->validated());

        return $this->success(
            new TranslationResource($translation),
            __('messages.created', ['model' => 'Tarjima']),
            201
        );
    }

    /**
     * Admin — tarjimani yangilash
     */
    public function update(UpdateTranslationRequest $request, int $id): JsonResponse
    {
        $translation = $this->translationService->update($id, $request->validated());

        return $this->success(
            new TranslationResource($translation),
            __('messages.updated', ['model' => 'Tarjima'])
        );
    }

    /**
     * Admin — tarjimani o'chirish
     */
    public function destroy(int $id): JsonResponse
    {
        $this->translationService->delete($id);

        return $this->success(null, __('messages.deleted', ['model' => 'Tarjima']));
    }

    /**
     * Admin — ommaviy import (batch upsert)
     */
    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.key' => 'required|string|max:255',
            'items.*.group' => 'nullable|string|max:100',
            'items.*.value' => 'required|array',
            'items.*.value.uz' => 'required|string',
            'items.*.value.ru' => 'nullable|string',
            'items.*.value.en' => 'nullable|string',
        ]);

        $translations = $this->translationService->bulkImport($request->input('items'));

        return $this->success(
            TranslationResource::collection($translations),
            __('messages.updated', ['model' => 'Tarjimalar'])
        );
    }
}
