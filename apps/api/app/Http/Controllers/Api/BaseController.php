<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

abstract class BaseController extends Controller
{
    /**
     * Public route'da ixtiyoriy (optional) auth: Bearer token bo'lsa admin'ni taniydi.
     *
     * `$request->user()` BU YERDA ISHLAMAYDI — public routelarda default guard
     * `web` (session) bo'lgani uchun token kelganda ham null qaytadi. Sanctum
     * guard'idan aniq so'rash shart.
     */
    protected function isAdminRequest(): bool
    {
        try {
            $user = auth('sanctum')->user();

            return $user !== null && $user->hasAnyRole(['super-admin', 'admin']);
        } catch (\Throwable) {
            return false;
        }
    }

    protected function success($data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error(string $message = 'Error', int $code = 400, $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    protected function paginated($paginator, ?string $resourceClass = null, string $message = 'Success'): JsonResponse
    {
        $items = $resourceClass
            ? $resourceClass::collection($paginator->items())
            : $paginator->items();

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
            'links' => [
                'first' => $paginator->url(1),
                'last' => $paginator->url($paginator->lastPage()),
                'prev' => $paginator->previousPageUrl(),
                'next' => $paginator->nextPageUrl(),
            ],
        ]);
    }
}
