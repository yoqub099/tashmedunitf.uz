<?php

namespace App\Services;

use App\Models\Banner;
use App\Traits\ConvertsToWebp;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class BannerService
{
    use ConvertsToWebp;

    public function getActive(): Collection
    {
        return CacheService::remember(
            CacheService::key(CacheService::PREFIX_BANNERS, 'active'),
            CacheService::TTL_LONG,
            function () {
                return Banner::where('is_active', true)
                    ->orderBy('sort_order')
                    ->with('media')
                    ->get();
            }
        );
    }

    public function getAll(Request $request): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_BANNERS, $request->query());

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request) {
            return QueryBuilder::for(Banner::class)
                ->allowedFilters(['is_active'])
                ->allowedSorts(['sort_order', 'created_at', 'title'])
                ->defaultSort('sort_order')
                ->with('media')
                ->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findById(int $id): Banner
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_BANNERS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return Banner::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): Banner
    {
        $banner = DB::transaction(function () use ($data) {
            $banner = Banner::create(\Illuminate\Support\Arr::except($data, ['image', 'mobile_image']));

            if (isset($data['image'])) {
                $banner->addMedia($this->convertToWebp($data['image'], 1920))->toMediaCollection('image');
            }

            if (isset($data['mobile_image'])) {
                $banner->addMedia($this->convertToWebp($data['mobile_image'], 768))->toMediaCollection('mobile_image');
            }

            return $banner->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_BANNERS);

        return $banner;
    }

    public function update(int $id, array $data): Banner
    {
        $banner = DB::transaction(function () use ($id, $data) {
            $banner = Banner::findOrFail($id);
            $banner->update(\Illuminate\Support\Arr::except($data, ['image', 'mobile_image']));

            if (isset($data['image'])) {
                $banner->clearMediaCollection('image');
                $banner->addMedia($this->convertToWebp($data['image'], 1920))->toMediaCollection('image');
            }

            if (isset($data['mobile_image'])) {
                $banner->clearMediaCollection('mobile_image');
                $banner->addMedia($this->convertToWebp($data['mobile_image'], 768))->toMediaCollection('mobile_image');
            }

            return $banner->load('media');
        });

        // Cache tozalash — transaction commit bo'lgandan keyin
        CacheService::clearModel(CacheService::PREFIX_BANNERS);

        return $banner;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $banner = Banner::find($id);
            if (! $banner) {
                return;
            }
            $banner->clearMediaCollection('image');
            $banner->clearMediaCollection('mobile_image');
            $banner->clearMediaCollection('video');
            $banner->delete();
        });

        CacheService::clearModel(CacheService::PREFIX_BANNERS);
    }
}
