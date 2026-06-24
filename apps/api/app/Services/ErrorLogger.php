<?php

namespace App\Services;

use App\Models\ErrorLog;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * ============================================================
 * ERROR LOGGER — Backend + Frontend xatoliklarini yozish (/look)
 * ============================================================
 *
 *  - captureException(): Laravel exception'lari (bootstrap/app.php report hook)
 *  - captureClient():     Next.js brauzer xatolari (POST /api/v1/client-errors)
 *
 * DEDUP: bir xil fingerprint oxirgi 5 daqiqada bo'lsa — yangi qator emas,
 * mavjudining count'i oshadi. Bu jadval bitta takrorlanuvchi xato bilan
 * to'lib ketishining oldini oladi.
 *
 * Yozish xatosi hech qachon ilovani buzmaydi (hammasi try/catch).
 * ============================================================
 */
class ErrorLogger
{
    /** Bir xil xatoni qayta yozmaslik oynasi (daqiqa). */
    private const DEDUP_WINDOW_MINUTES = 5;

    /**
     * Interaktiv CLI vositalarining xatolari — bular ilova xatosi EMAS, balki
     * SSH'da tinker/artisan buyrug'ini qo'lda noto'g'ri yozishdan kelib chiqadi.
     * Monitoring markazi (/look) signalini ifloslantirmaslik uchun o'tkazib yuboriladi.
     * Eslatma: rejalashtirilgan buyruq TANASIDAGI haqiqiy xatolar domain exception'lar
     * bo'lib, bu namespace'larga kirmaydi — ular baribir yoziladi.
     */
    private const IGNORED_TYPE_PREFIXES = [
        'Psy\\',                                  // tinker REPL (parse/runtime)
        'Symfony\\Component\\Console\\Exception\\', // artisan buyruq foydalanish xatolari
    ];

    /** Bitta so'rovda bir xil exception obyektini ikki marta yozmaslik uchun. */
    private static array $capturedObjectIds = [];

    /**
     * Backend exception'ni yozish.
     */
    public static function captureException(Throwable $e, string $level = 'error'): void
    {
        // Interaktiv CLI noise'ni o'tkazib yuborish (tinker/artisan qo'lda xatolari)
        $class = get_class($e);
        foreach (self::IGNORED_TYPE_PREFIXES as $prefix) {
            if (str_starts_with($class, $prefix)) {
                return;
            }
        }

        // Bir xil obyektni ikki marta yozmaslik (report() + manual report())
        $oid = spl_object_id($e);
        if (isset(self::$capturedObjectIds[$oid])) {
            return;
        }
        self::$capturedObjectIds[$oid] = true;
        // Xotira oshib ketmasligi uchun (queue worker — uzoq ishlaydi)
        if (count(self::$capturedObjectIds) > 200) {
            self::$capturedObjectIds = [];
        }

        try {
            $request = request();
            $inConsole = app()->runningInConsole();
            $user = self::resolveUser();

            self::store([
                'source' => 'backend',
                'level' => $level,
                'type' => get_class($e),
                'message' => mb_substr($e->getMessage(), 0, 2000),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'url' => $inConsole ? null : mb_substr($request->fullUrl(), 0, 2000),
                'method' => $inConsole ? null : $request->method(),
                'status_code' => method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500,
                'user_id' => $user['id'],
                'user_name' => $user['name'],
                'ip' => $inConsole ? null : $request->ip(),
                'user_agent' => $inConsole ? null : substr((string) $request->userAgent(), 0, 512),
                'context' => [
                    'trace' => collect($e->getTrace())->take(15)->map(fn ($t) => [
                        'file' => $t['file'] ?? null,
                        'line' => $t['line'] ?? null,
                        'function' => ($t['class'] ?? '').($t['type'] ?? '').$t['function'],
                    ])->all(),
                ],
                'fingerprint' => self::fingerprint(get_class($e), (string) $e->getFile(), (string) $e->getLine()),
            ]);
        } catch (\Throwable $inner) {
            Log::warning('ErrorLogger.captureException failed', ['error' => $inner->getMessage()]);
        }
    }

    /**
     * Frontend (brauzer) xatosini yozish.
     */
    public static function captureClient(array $data): void
    {
        try {
            $request = request();
            $user = self::resolveUser();

            $source = in_array($data['source'] ?? '', ['web', 'admin'], true) ? $data['source'] : 'web';

            self::store([
                'source' => $source,
                'level' => in_array($data['level'] ?? '', ['error', 'warning', 'critical', 'info'], true) ? $data['level'] : 'error',
                'type' => isset($data['type']) ? mb_substr((string) $data['type'], 0, 255) : 'ClientError',
                'message' => mb_substr((string) ($data['message'] ?? 'Unknown client error'), 0, 2000),
                'file' => isset($data['file']) ? mb_substr((string) $data['file'], 0, 1000) : null,
                'line' => isset($data['line']) ? (int) $data['line'] : null,
                'url' => isset($data['url']) ? mb_substr((string) $data['url'], 0, 2000) : null,
                'method' => null,
                'status_code' => isset($data['status_code']) ? (int) $data['status_code'] : null,
                'user_id' => $user['id'],
                'user_name' => $user['name'],
                'ip' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 512),
                'context' => [
                    'stack' => isset($data['stack']) ? mb_substr((string) $data['stack'], 0, 8000) : null,
                    'componentStack' => isset($data['componentStack']) ? mb_substr((string) $data['componentStack'], 0, 4000) : null,
                    'extra' => $data['extra'] ?? null,
                ],
                'fingerprint' => self::fingerprint(
                    $source,
                    mb_substr((string) ($data['message'] ?? ''), 0, 200),
                    (string) ($data['line'] ?? ''),
                ),
            ]);
        } catch (\Throwable $inner) {
            Log::warning('ErrorLogger.captureClient failed', ['error' => $inner->getMessage()]);
        }
    }

    /**
     * Dedup bilan saqlash.
     */
    private static function store(array $attributes): void
    {
        $fingerprint = $attributes['fingerprint'] ?? null;

        if ($fingerprint) {
            $existing = ErrorLog::where('fingerprint', $fingerprint)
                ->where('updated_at', '>=', now()->subMinutes(self::DEDUP_WINDOW_MINUTES))
                ->latest('updated_at')
                ->first();

            if ($existing) {
                $existing->increment('count');
                $existing->forceFill(['updated_at' => now()])->saveQuietly();

                return;
            }
        }

        ErrorLog::create($attributes);
    }

    /**
     * @return array{id: int|null, name: string|null}
     */
    private static function resolveUser(): array
    {
        try {
            $user = auth('sanctum')->user();
            if ($user) {
                return ['id' => $user->id, 'name' => $user->name];
            }
        } catch (\Throwable) {
        }

        return ['id' => null, 'name' => null];
    }

    private static function fingerprint(string ...$parts): string
    {
        return hash('xxh3', implode('|', $parts));
    }
}
