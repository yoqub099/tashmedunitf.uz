<?php

namespace App\Services;

use App\Models\CareerCenterInfo;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class CareerCenterInfoService
{
    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_CAREER_CENTER_INFOS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(CareerCenterInfo::class)
                ->allowedSorts(['sort_order', 'created_at'])
                ->defaultSort('sort_order');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%")
                        ->orWhere('content', 'ilike', "%{$search}%");
                });
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 12), 100)));
        });
    }

    public function findById(int $id): CareerCenterInfo
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_CAREER_CENTER_INFOS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return CareerCenterInfo::findOrFail($id);
        });
    }

    public function create(array $data): CareerCenterInfo
    {
        $info = DB::transaction(function () use ($data) {
            return CareerCenterInfo::create($data);
        });

        CacheService::clearModel(CacheService::PREFIX_CAREER_CENTER_INFOS);

        return $info;
    }

    public function update(int $id, array $data): CareerCenterInfo
    {
        $info = DB::transaction(function () use ($id, $data) {
            $info = CareerCenterInfo::findOrFail($id);
            $info->update($data);

            return $info;
        });

        CacheService::clearModel(CacheService::PREFIX_CAREER_CENTER_INFOS);

        return $info;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $info = CareerCenterInfo::find($id);
            if (! $info) {
                return;
            }
            $info->forceDelete();
        });

        CacheService::clearModel(CacheService::PREFIX_CAREER_CENTER_INFOS);
    }
}
