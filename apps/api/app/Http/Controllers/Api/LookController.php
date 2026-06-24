<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ClientError\StoreClientErrorRequest;
use App\Http\Resources\ActivityLogResource;
use App\Http\Resources\ErrorLogResource;
use App\Services\LookService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * ============================================================
 * LOOK CONTROLLER — Kuzatuv markazi (/look)
 * ============================================================
 *
 * O'qish endpointlari faqat SUPER-ADMIN uchun:
 *   GET  /api/v1/look/activities   — faollik oqimi (kim nimani o'zgartirdi)
 *   GET  /api/v1/look/errors        — backend + frontend xatoliklari
 *   GET  /api/v1/look/sessions      — login/logout/failed
 *   GET  /api/v1/look/users         — foydalanuvchi statistikasi + onlayn
 *   GET  /api/v1/look/stats         — dashboard ko'rsatkichlari
 *
 * Yozish endpointi PUBLIC (throttled):
 *   POST /api/v1/client-errors      — Next.js brauzer xatosini qabul qiladi
 * ============================================================
 */
class LookController extends BaseController
{
    public function __construct(
        private readonly LookService $lookService
    ) {}

    public function activities(Request $request): JsonResponse
    {
        return $this->paginated($this->lookService->activities($request), ActivityLogResource::class);
    }

    public function errors(Request $request): JsonResponse
    {
        return $this->paginated($this->lookService->errors($request), ErrorLogResource::class);
    }

    public function sessions(Request $request): JsonResponse
    {
        return $this->paginated($this->lookService->sessions($request), ActivityLogResource::class);
    }

    public function users(): JsonResponse
    {
        return $this->success($this->lookService->users());
    }

    public function stats(): JsonResponse
    {
        return $this->success($this->lookService->stats());
    }

    /**
     * Public — frontend (web/admin) xatosini qabul qilish.
     */
    public function clientError(StoreClientErrorRequest $request): JsonResponse
    {
        $this->lookService->recordClientError($request->validated());

        return $this->success(null, 'Logged', 201);
    }
}
