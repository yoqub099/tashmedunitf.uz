<?php

use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // API — Token-based auth (Bearer token)
        // CSRF kerak emas, chunki har bir request'da token yuboriladi

        // API so'rovlarda login sahifasiga redirect qilmaslik
        // AuthenticationException → JSON 401 qaytadi
        $middleware->redirectGuestsTo(fn (Request $request) => $request->is('api/*') || $request->expectsJson() ? null : '/login'
        );

        $middleware->alias([
            'role' => \Spatie\Permission\Middleware\RoleMiddleware::class,
            'permission' => \Spatie\Permission\Middleware\PermissionMiddleware::class,
            'role_or_permission' => \Spatie\Permission\Middleware\RoleOrPermissionMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {

        // ============================================
        // ERROR LOGGING — /look kuzatuv markazi
        // Barcha report qilinadigan (kutilmagan) exception DB ga yoziladi.
        // Laravel "ignored" exceptions (validation/404/401/403/429) bu yerga tushmaydi.
        // ============================================
        $exceptions->report(function (\Throwable $e) {
            \App\Services\ErrorLogger::captureException($e);
        });

        // ============================================
        // API uchun JSON formatda xatolik qaytarish
        // ============================================

        // 404 — Sahifa/Model topilmadi
        $exceptions->render(function (NotFoundHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sahifa topilmadi',
                    'errors' => null,
                ], 404);
            }
        });

        // Model topilmadi
        $exceptions->render(function (ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                $model = class_basename($e->getModel());

                return response()->json([
                    'success' => false,
                    'message' => "{$model} topilmadi",
                    'errors' => null,
                ], 404);
            }
        });

        // 405 — Noto'g'ri HTTP metod
        $exceptions->render(function (MethodNotAllowedHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => "Bu HTTP metod qo'llab-quvvatlanmaydi",
                    'errors' => null,
                ], 405);
            }
        });

        // 401 — Autentifikatsiya xatolik
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Autentifikatsiya talab qilinadi',
                    'errors' => null,
                ], 401);
            }
        });

        // 422 — Validatsiya xatolik
        $exceptions->render(function (ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validatsiya xatolik',
                    'errors' => $e->errors(),
                ], 422);
            }
        });

        // 403 — Ruxsat yo'q
        $exceptions->render(function (\Spatie\Permission\Exceptions\UnauthorizedException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Sizda bu amalni bajarish huquqi yo\'q',
                    'errors' => null,
                ], 403);
            }
        });

        // 400 — Invalid filter/sort/include (Spatie QueryBuilder)
        $exceptions->render(function (\Spatie\QueryBuilder\Exceptions\InvalidQuery $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage(),
                    'errors' => null,
                ], 400);
            }
        });

        // 429 — Too Many Requests (Rate Limit)
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => "Juda ko'p so'rov — biroz kuting",
                    'errors' => null,
                ], 429);
            }
        });

        // 403 — Gate/Policy rad etdi ($this->authorize(), Gate::authorize())
        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'Sizda bu amalni bajarish huquqi yo\'q',
                    'errors' => null,
                ], 403);
            }
        });

        // Boshqa barcha HTTP exceptionlar (abort(403/404/...), imzolangan URL
        // xatosi InvalidSignatureException=403, va h.k.) — o'z status kodi
        // bilan qaytadi. Busiz ular pastdagi \Throwable ushlagichiga tushib,
        // hammasi noto'g'ri 500 bo'lib ketardi.
        $exceptions->render(function (\Symfony\Component\HttpKernel\Exception\HttpExceptionInterface $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage() ?: 'So\'rovni bajarib bo\'lmadi',
                    'errors' => null,
                ], $e->getStatusCode());
            }
        });

        // 500 — Server xatolik (API so'rovlarda har doim JSON qaytaradi)
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->is('api/*')) {
                report($e); // Log'ga yozish

                return response()->json([
                    'success' => false,
                    'message' => app()->hasDebugModeEnabled() && ! app()->environment('production')
                        ? $e->getMessage()
                        : 'Server xatolik yuz berdi',
                    'errors' => app()->hasDebugModeEnabled() && ! app()->environment('production')
                        ? ['exception' => get_class($e), 'file' => $e->getFile(), 'line' => $e->getLine()]
                        : null,
                ], 500);
            }
        });
    })
    ->create();
