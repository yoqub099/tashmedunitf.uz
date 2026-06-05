<?php

namespace App\Services;

use App\Models\Partner;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class PartnerService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_PARTNERS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Partner::class)
                ->allowedSorts(['sort_order', 'name'])
                ->defaultSort('sort_order')
                ->with('media');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 50), 100)));
        });
    }

    public function findById(int $id): Partner
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_PARTNERS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return Partner::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): Partner
    {
        $partner = DB::transaction(function () use ($data) {
            $partner = Partner::create(\Illuminate\Support\Arr::except($data, ['logo']));

            if (isset($data['logo'])) {
                $partner->addMedia($this->convertToWebp($data['logo'], 300))->toMediaCollection('logo');
            }

            return $partner->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_PARTNERS);

        return $partner;
    }

    public function update(int $id, array $data): Partner
    {
        $partner = DB::transaction(function () use ($id, $data) {
            $partner = Partner::findOrFail($id);
            $partner->update(\Illuminate\Support\Arr::except($data, ['logo']));

            if (isset($data['logo'])) {
                $partner->clearMediaCollection('logo');
                $partner->addMedia($this->convertToWebp($data['logo'], 300))->toMediaCollection('logo');
            }

            return $partner->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_PARTNERS);

        return $partner;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $partner = Partner::find($id);
            if (! $partner) {
                return;
            }
            $partner->clearMediaCollection('logo');
            $partner->delete();
        });

        CacheService::clearModel(CacheService::PREFIX_PARTNERS);
    }
}
