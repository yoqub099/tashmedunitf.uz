<?php

namespace App\Services;

use App\Models\SiteMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SiteMediaService
{
    public function getAll(Request $request): \Illuminate\Database\Eloquent\Collection
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_SITE_MEDIA, $request->query());

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () {
            return SiteMedia::with('media')
                ->orderBy('created_at', 'desc')
                ->get();
        });
    }

    public function findByKey(string $key): ?SiteMedia
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_SITE_MEDIA, 'key', $key);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($key) {
            return SiteMedia::with('media')->where('key', $key)->first();
        });
    }

    public function findById(int $id): SiteMedia
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_SITE_MEDIA, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return SiteMedia::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): SiteMedia
    {
        $item = DB::transaction(function () use ($data) {
            $item = SiteMedia::create(\Illuminate\Support\Arr::except($data, ['file']));

            if (isset($data['file'])) {
                $item->addMedia($data['file'])->toMediaCollection('file');
            }

            return $item->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_SITE_MEDIA);

        return $item;
    }

    public function update(int $id, array $data): SiteMedia
    {
        $item = DB::transaction(function () use ($id, $data) {
            $item = SiteMedia::findOrFail($id);
            $item->update(\Illuminate\Support\Arr::except($data, ['file']));

            if (isset($data['file'])) {
                $item->clearMediaCollection('file');
                $item->addMedia($data['file'])->toMediaCollection('file');
            }

            return $item->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_SITE_MEDIA);

        return $item;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $item = SiteMedia::find($id);
            if (! $item) {
                return;
            }
            $item->clearMediaCollection('file');
            $item->forceDelete();
        });

        CacheService::clearModel(CacheService::PREFIX_SITE_MEDIA);
    }
}
