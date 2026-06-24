<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

/**
 * ============================================================
 * AUDIT LOGGER — Admin faoliyatini yozish (/look)
 * ============================================================
 *
 * Markazlashgan joy: kim nimani qachon yaratdi/o'zgartirdi/o'chirdi.
 *  - content: model o'zgarishlari (Observer'dan)
 *  - auth:    login / logout / login_failed (AuthController'dan)
 *  - media:   yuklash / o'chirish (MediaController'dan)
 *
 * XAVFSIZLIK: audit yozish HECH QACHON asosiy amalni to'xtatmaydi —
 * har qanday xato yutiladi va shunchaki log'ga yoziladi.
 * Maxfiy maydonlar (password, token) hech qachon saqlanmaydi.
 * ============================================================
 */
class AuditLogger
{
    /** Hech qachon jurnalga yozilmaydigan maxfiy maydonlar. */
    private const HIDDEN_FIELDS = ['password', 'remember_token', 'api_token', 'token', 'secret'];

    /** Diff'da e'tiborga olinmaydigan "shovqin" maydonlar. */
    private const IGNORED_FIELDS = ['updated_at', 'created_at', 'deleted_at'];

    /**
     * Umumiy yozuv metodi — so'rov konteksti avtomatik qo'shiladi.
     */
    public static function log(string $event, array $attributes = []): void
    {
        try {
            $causer = self::resolveCauser();

            ActivityLog::create(array_merge([
                'log_name' => 'content',
                'event' => $event,
                'causer_id' => $causer['id'],
                'causer_name' => $causer['name'],
                'causer_role' => $causer['role'],
                'created_at' => now(),
            ], self::requestContext(), $attributes));
        } catch (\Throwable $e) {
            Log::warning('AuditLogger failed', ['event' => $event, 'error' => $e->getMessage()]);
        }
    }

    /**
     * Model o'zgarishini yozish (AuditObserver'dan chaqiriladi).
     */
    public static function logModel(string $event, Model $model, ?array $old = null, ?array $new = null): void
    {
        self::log($event, [
            'log_name' => 'content',
            'subject_type' => class_basename($model),
            'subject_id' => $model->getKey(),
            'subject_label' => self::labelFor($model),
            'old_values' => $old !== null ? self::sanitize($old) : null,
            'new_values' => $new !== null ? self::sanitize($new) : null,
        ]);
    }

    /**
     * Auth hodisasi (login / logout / login_failed).
     */
    public static function logAuth(string $event, ?int $userId, ?string $userName, ?string $role = null, array $properties = []): void
    {
        self::log($event, [
            'log_name' => 'auth',
            'causer_id' => $userId,
            'causer_name' => $userName,
            'causer_role' => $role,
            'properties' => $properties ?: null,
        ]);
    }

    /**
     * Media hodisasi (yuklash / o'chirish).
     */
    public static function logMedia(string $event, string $subjectType, ?int $subjectId, ?string $label = null, array $properties = []): void
    {
        self::log($event, [
            'log_name' => 'media',
            'subject_type' => $subjectType,
            'subject_id' => $subjectId,
            'subject_label' => $label,
            'properties' => $properties ?: null,
        ]);
    }

    // ========================================
    // YORDAMCHI
    // ========================================

    /**
     * Joriy autentifikatsiyalangan adminni aniqlash (sanctum guard).
     *
     * @return array{id: int|null, name: string|null, role: string|null}
     */
    private static function resolveCauser(): array
    {
        try {
            $user = auth('sanctum')->user();
            if ($user) {
                return ['id' => $user->id, 'name' => $user->name, 'role' => $user->getRoleNames()->first()];
            }
        } catch (\Throwable) {
            // anonim / token yo'q
        }

        return ['id' => null, 'name' => null, 'role' => null];
    }

    /**
     * So'rov konteksti — HTTP'da to'ldiriladi, konsol/queue'da null bo'ladi.
     *
     * `request()` har doim non-null (hatto konsolda ham bo'sh Request),
     * shuning uchun kontekstni runningInConsole() bilan ajratamiz.
     *
     * @return array{ip: string|null, user_agent: string|null, url: string|null, method: string|null}
     */
    private static function requestContext(): array
    {
        if (app()->runningInConsole()) {
            return ['ip' => null, 'user_agent' => null, 'url' => null, 'method' => null];
        }

        $request = request();

        return [
            'ip' => $request->ip(),
            'user_agent' => substr((string) $request->userAgent(), 0, 512),
            'url' => mb_substr($request->fullUrl(), 0, 1024),
            'method' => $request->method(),
        ];
    }

    /**
     * Inson o'qishi uchun yorliq — translatable ({uz,ru,en}) bo'lsa uz olinadi.
     */
    private static function labelFor(Model $model): string
    {
        foreach (['title', 'name', 'full_name', 'question', 'key', 'subject'] as $field) {
            if (! array_key_exists($field, $model->getAttributes())) {
                continue;
            }
            $value = $model->getAttributes()[$field];

            // JSON-string translatable → uz
            if (is_string($value) && isset($value[0]) && $value[0] === '{') {
                $decoded = json_decode($value, true);
                if (is_array($decoded)) {
                    $value = $decoded['uz'] ?? (reset($decoded) ?: null);
                }
            } elseif (is_array($value)) {
                $value = $value['uz'] ?? (reset($value) ?: null);
            }

            if (is_string($value) && trim($value) !== '') {
                return mb_substr(strip_tags($value), 0, 120);
            }
        }

        return '#'.$model->getKey();
    }

    /**
     * Maxfiy/shovqin maydonlarni tozalash + translatable JSON'ni array'ga ochish.
     */
    private static function sanitize(array $attributes): array
    {
        foreach (self::HIDDEN_FIELDS as $hidden) {
            unset($attributes[$hidden]);
        }
        foreach (self::IGNORED_FIELDS as $ignored) {
            unset($attributes[$ignored]);
        }

        foreach ($attributes as $key => $value) {
            // Translatable JSON-string → array ({uz,ru,en})
            if (is_string($value) && isset($value[0]) && ($value[0] === '{' || $value[0] === '[')) {
                $decoded = json_decode($value, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $value = $decoded;
                    $attributes[$key] = $value;
                }
            }
            // Juda katta matnni qisqartirish (content 50KB bo'lishi mumkin)
            if (is_string($value) && mb_strlen($value) > 5000) {
                $attributes[$key] = mb_substr($value, 0, 5000).'…';
            }
        }

        return $attributes;
    }
}
