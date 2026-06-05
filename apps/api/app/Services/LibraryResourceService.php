<?php

namespace App\Services;

use App\Models\LibraryResource;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class LibraryResourceService
{
    use ConvertsToWebp;

    /**
     * Barcha noyob kategoriyalarni olish (DB dan distinct)
     */
    public function getCategories(): array
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_LIBRARY_RESOURCES, 'categories');

        return CacheService::remember($cacheKey, CacheService::TTL_SHORT, function () {
            return LibraryResource::query()
                ->whereNotNull('category')
                ->where('category', '!=', '')
                ->distinct()
                ->orderBy('category')
                ->pluck('category')
                ->toArray();
        });
    }

    public function getAll(Request $request, bool $onlyPublished = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_LIBRARY_RESOURCES, array_merge($request->query(), ['only_published' => $onlyPublished]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyPublished) {
            $query = QueryBuilder::for(LibraryResource::class)
                ->allowedFilters([
                    AllowedFilter::exact('category'),
                    AllowedFilter::exact('type'),
                    AllowedFilter::scope('published'),
                    AllowedFilter::callback('title', function ($query, $value) {
                        $query->where(function ($q) use ($value) {
                            $q->where('title->uz', 'ILIKE', "%{$value}%")
                                ->orWhere('title->ru', 'ILIKE', "%{$value}%")
                                ->orWhere('title->en', 'ILIKE', "%{$value}%");
                        });
                    }),
                ])
                ->allowedSorts(['published_at', 'created_at', 'title', 'sort_order'])
                ->defaultSort('sort_order')
                ->select(['id', 'title', 'slug', 'description', 'category', 'type', 'url', 'is_published', 'published_at', 'sort_order', 'created_at', 'updated_at'])
                ->with('media');

            if ($onlyPublished) {
                $query->where('is_published', true)
                    ->where(function ($q) {
                        $q->whereNull('published_at')
                            ->orWhere('published_at', '<=', now());
                    });
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findByIdentifier(string $identifier, bool $onlyPublished = true): LibraryResource
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_LIBRARY_RESOURCES, 'identifier', $identifier, $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($identifier, $onlyPublished) {
            $query = LibraryResource::with('media');

            if (is_numeric($identifier)) {
                $query->where('id', (int) $identifier);
            } else {
                $query->where('slug', $identifier);
            }

            if ($onlyPublished) {
                $query->where('is_published', true)
                    ->where(function ($q) {
                        $q->whereNull('published_at')
                            ->orWhere('published_at', '<=', now());
                    });
            }

            return $query->firstOrFail();
        });
    }

    public function create(array $data): LibraryResource
    {
        $resource = DB::transaction(function () use ($data) {
            $resource = LibraryResource::create(Arr::except($data, ['cover', 'document', 'gallery']));

            if (isset($data['cover'])) {
                $resource->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('cover');
            }

            if (isset($data['document'])) {
                $resource->addMedia($data['document'])->toMediaCollection('document');
            }

            if (isset($data['gallery'])) {
                foreach ($data['gallery'] as $image) {
                    $resource->addMedia($this->convertToWebp($image, 1920, 95))->toMediaCollection('gallery');
                }
            }

            return $resource->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_LIBRARY_RESOURCES);

        return $resource;
    }

    public function update(int $id, array $data): LibraryResource
    {
        $resource = DB::transaction(function () use ($id, $data) {
            $resource = LibraryResource::findOrFail($id);
            $resource->update(Arr::except($data, ['cover', 'remove_cover', 'document', 'remove_document', 'gallery']));

            if (isset($data['cover'])) {
                $resource->clearMediaCollection('cover');
                $resource->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('cover');
            } elseif (! empty($data['remove_cover'])) {
                $resource->clearMediaCollection('cover');
            }

            if (isset($data['document'])) {
                $resource->clearMediaCollection('document');
                $resource->addMedia($data['document'])->toMediaCollection('document');
            } elseif (! empty($data['remove_document'])) {
                $resource->clearMediaCollection('document');
            }

            if (isset($data['gallery'])) {
                foreach ($data['gallery'] as $image) {
                    $resource->addMedia($this->convertToWebp($image, 1920, 95))->toMediaCollection('gallery');
                }
            }

            return $resource->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_LIBRARY_RESOURCES);

        return $resource;
    }

    public function delete(int $id): void
    {
        $resource = LibraryResource::findOrFail($id);

        // Media fayllarni qo'lda tozalash (SoftDelete ishlatilmaydi — to'liq o'chirish)
        foreach (['cover', 'document', 'gallery'] as $collection) {
            try {
                $resource->clearMediaCollection($collection);
            } catch (\Throwable $e) {
                \Log::warning("Failed to clear library media [{$collection}]", ['id' => $id, 'error' => $e->getMessage()]);
            }
        }

        $resource->forceDelete();

        CacheService::clearModel(CacheService::PREFIX_LIBRARY_RESOURCES);
    }
}
