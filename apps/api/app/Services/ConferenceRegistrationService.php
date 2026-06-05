<?php

namespace App\Services;

use App\Models\ConferenceRegistration;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ConferenceRegistrationService
{
    private const UNREAD_CACHE_KEY = 'conf_reg:unread_count';

    private const UNREAD_CACHE_TTL = 60; // 1 minute

    public function getAll(Request $request): LengthAwarePaginator
    {
        // per_page edge case himoyasi: 1..100 oralig'ida
        $perPage = max(1, min((int) $request->get('per_page', 20), 100));

        return QueryBuilder::for(ConferenceRegistration::class)
            ->with('news:id,title,slug')
            ->allowedFilters([
                AllowedFilter::exact('is_read'),
                AllowedFilter::exact('news_id'),
            ])
            ->allowedSorts(['created_at', 'is_read'])
            ->defaultSort('-created_at')
            ->paginate($perPage);
    }

    public function findById(int $id): ConferenceRegistration
    {
        return ConferenceRegistration::with('news:id,title,slug')->findOrFail($id);
    }

    public function create(array $data): ConferenceRegistration
    {
        $reg = ConferenceRegistration::create($data);
        Cache::forget(self::UNREAD_CACHE_KEY);

        return $reg;
    }

    public function markAsRead(int $id): ConferenceRegistration
    {
        $reg = ConferenceRegistration::with('news:id,title,slug')->findOrFail($id);
        if (! $reg->is_read) {
            $reg->update(['is_read' => true]);
            Cache::forget(self::UNREAD_CACHE_KEY);
        }

        return $reg;
    }

    public function delete(int $id): void
    {
        // findOrFail → 404 qaytaradi (silent fail o'rniga)
        $reg = ConferenceRegistration::findOrFail($id);
        $reg->delete();
        Cache::forget(self::UNREAD_CACHE_KEY);
    }

    public function unreadCount(): int
    {
        return Cache::remember(self::UNREAD_CACHE_KEY, self::UNREAD_CACHE_TTL, function () {
            return ConferenceRegistration::where('is_read', false)->count();
        });
    }
}
