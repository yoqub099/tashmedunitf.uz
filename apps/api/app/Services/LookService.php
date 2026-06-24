<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\ErrorLog;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

/**
 * ============================================================
 * LOOK SERVICE — Kuzatuv markazi ma'lumotlari (faqat super-admin)
 * ============================================================
 *
 * Faollik oqimi, xatoliklar, sessiyalar, foydalanuvchi statistikasi
 * va umumiy dashboard ko'rsatkichlarini beradi.
 * ============================================================
 */
class LookService
{
    /** "Onlayn" deb hisoblash oynasi (daqiqa). */
    private const ONLINE_WINDOW_MINUTES = 5;

    /**
     * Faollik oqimi (content + media + auth) — filtrlangan, sahifalangan.
     */
    public function activities(Request $request): LengthAwarePaginator
    {
        $query = ActivityLog::query()->recent();

        if ($logName = $request->query('log_name')) {
            $query->where('log_name', $logName);
        }
        if ($event = $request->query('event')) {
            $query->where('event', $event);
        }
        if ($causerId = $request->query('causer_id')) {
            $query->where('causer_id', (int) $causerId);
        }
        if ($subjectType = $request->query('subject_type')) {
            $query->where('subject_type', $subjectType);
        }
        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('subject_label', 'ILIKE', "%{$search}%")
                    ->orWhere('causer_name', 'ILIKE', "%{$search}%")
                    ->orWhere('description', 'ILIKE', "%{$search}%");
            });
        }
        if ($from = $request->query('from')) {
            $query->where('created_at', '>=', $from);
        }
        if ($to = $request->query('to')) {
            $query->where('created_at', '<=', $to);
        }

        return $query->paginate($this->perPage($request));
    }

    /**
     * Xatoliklar jurnali (backend + web + admin) — filtrlangan.
     */
    public function errors(Request $request): LengthAwarePaginator
    {
        $query = ErrorLog::query()->recent();

        if ($source = $request->query('source')) {
            $query->where('source', $source);
        }
        if ($level = $request->query('level')) {
            $query->where('level', $level);
        }
        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('message', 'ILIKE', "%{$search}%")
                    ->orWhere('type', 'ILIKE', "%{$search}%")
                    ->orWhere('url', 'ILIKE', "%{$search}%");
            });
        }

        return $query->paginate($this->perPage($request));
    }

    /**
     * Sessiyalar — login / logout / login_failed hodisalari.
     */
    public function sessions(Request $request): LengthAwarePaginator
    {
        $query = ActivityLog::query()->where('log_name', 'auth')->recent();

        if ($event = $request->query('event')) {
            $query->where('event', $event);
        }
        if ($causerId = $request->query('causer_id')) {
            $query->where('causer_id', (int) $causerId);
        }

        return $query->paginate($this->perPage($request));
    }

    /**
     * Foydalanuvchilar statistikasi — kim qancha ishladi + onlayn holati.
     */
    public function users(): array
    {
        $now = now();
        $todayStart = $now->copy()->startOfDay()->toDateTimeString();
        $weekStart = $now->copy()->subDays(7)->toDateTimeString();
        $onlineThreshold = $now->copy()->subMinutes(self::ONLINE_WINDOW_MINUTES);

        $users = User::query()->with('roles:id,name')->get(['id', 'name', 'email', 'created_at']);

        // Faollik agregatsiyasi (content + media) — bitta so'rov.
        // DB::table → stdClass qatorlar (selectRaw aliaslari model property emas).
        $activityAgg = DB::table('activity_logs')
            ->whereIn('log_name', ['content', 'media'])
            ->whereNotNull('causer_id')
            ->selectRaw(
                'causer_id,
                 COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE created_at >= ?) AS today,
                 COUNT(*) FILTER (WHERE created_at >= ?) AS week,
                 MAX(created_at) AS last_activity',
                [$todayStart, $weekStart]
            )
            ->groupBy('causer_id')
            ->get()
            ->keyBy('causer_id')
            ->all();

        // Oxirgi muvaffaqiyatli login
        $lastLogin = DB::table('activity_logs')
            ->where('log_name', 'auth')->where('event', 'login')
            ->whereNotNull('causer_id')
            ->selectRaw('causer_id, MAX(created_at) AS last_login')
            ->groupBy('causer_id')
            ->get()->keyBy('causer_id')->all();

        // Oxirgi faollik vaqti (sanctum token — onlayn aniqlash)
        $lastSeen = DB::table('personal_access_tokens')
            ->where('tokenable_type', User::class)
            ->selectRaw('tokenable_id, MAX(last_used_at) AS last_seen')
            ->groupBy('tokenable_id')
            ->get()->keyBy('tokenable_id')->all();

        return $users->map(function (User $user) use ($activityAgg, $lastLogin, $lastSeen, $onlineThreshold) {
            // ?? null bilan kalit-bo'yicha kirish → aniq stdClass|null (faolligi yo'q user bo'lishi mumkin)
            $agg = $activityAgg[$user->id] ?? null;
            $login = $lastLogin[$user->id] ?? null;
            $seenRaw = ($lastSeen[$user->id] ?? null)?->last_seen;
            $seenAt = $seenRaw ? Carbon::parse($seenRaw) : null;

            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles->pluck('name')->first(),
                'is_online' => $seenAt ? $seenAt->gte($onlineThreshold) : false,
                'last_seen' => $seenAt?->toISOString(),
                'last_login' => $login?->last_login ? Carbon::parse($login->last_login)->toISOString() : null,
                'last_activity' => $agg?->last_activity ? Carbon::parse($agg->last_activity)->toISOString() : null,
                'actions_today' => (int) data_get($agg, 'today', 0),
                'actions_week' => (int) data_get($agg, 'week', 0),
                'actions_total' => (int) data_get($agg, 'total', 0),
            ];
        })->sortByDesc('last_activity')->values()->all();
    }

    /**
     * Dashboard umumiy statistika (kartochkalar uchun).
     */
    public function stats(): array
    {
        $now = now();
        $todayStart = $now->copy()->startOfDay();
        $weekStart = $now->copy()->subDays(7);
        $onlineThreshold = $now->copy()->subMinutes(self::ONLINE_WINDOW_MINUTES);

        $onlineCount = DB::table('personal_access_tokens')
            ->where('tokenable_type', User::class)
            ->where('last_used_at', '>=', $onlineThreshold)
            ->distinct()
            ->count('tokenable_id');

        $content = fn () => ActivityLog::query()->whereIn('log_name', ['content', 'media']);
        $auth = fn () => ActivityLog::query()->where('log_name', 'auth');

        return [
            'activities' => [
                'today' => $content()->where('created_at', '>=', $todayStart)->count(),
                'week' => $content()->where('created_at', '>=', $weekStart)->count(),
                'total' => $content()->count(),
            ],
            'errors' => [
                'today' => ErrorLog::where('created_at', '>=', $todayStart)->count(),
                'week' => ErrorLog::where('created_at', '>=', $weekStart)->count(),
                'total' => ErrorLog::count(),
                'by_source' => [
                    'backend' => ErrorLog::where('source', 'backend')->where('created_at', '>=', $weekStart)->count(),
                    'web' => ErrorLog::where('source', 'web')->where('created_at', '>=', $weekStart)->count(),
                    'admin' => ErrorLog::where('source', 'admin')->where('created_at', '>=', $weekStart)->count(),
                ],
            ],
            'sessions' => [
                'logins_today' => $auth()->where('event', 'login')->where('created_at', '>=', $todayStart)->count(),
                'failed_today' => $auth()->where('event', 'login_failed')->where('created_at', '>=', $todayStart)->count(),
            ],
            'online_now' => $onlineCount,
            'generated_at' => $now->toISOString(),
        ];
    }

    /**
     * Frontend (brauzer) xatosini yozish.
     */
    public function recordClientError(array $data): void
    {
        ErrorLogger::captureClient($data);
    }

    private function perPage(Request $request): int
    {
        return max(1, min((int) $request->query('per_page', 30), 100));
    }
}
