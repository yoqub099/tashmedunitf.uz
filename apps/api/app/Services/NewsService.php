<?php

namespace App\Services;

use App\Models\News;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class NewsService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyPublished = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_NEWS, array_merge($request->query(), ['only_published' => $onlyPublished]));

        return CacheService::remember($cacheKey, CacheService::TTL_SHORT, function () use ($request, $onlyPublished) {
            $query = QueryBuilder::for(News::class)
                ->allowedFilters([
                    AllowedFilter::exact('category'),
                    AllowedFilter::scope('published'),
                    AllowedFilter::callback('title', function ($query, $value) {
                        // JSONB ustunlarda ILIKE — PostgreSQL'da LOWER(jsonb) ishlamaydi
                        $query->where(function ($q) use ($value) {
                            $q->where('title->uz', 'ILIKE', "%{$value}%")
                                ->orWhere('title->ru', 'ILIKE', "%{$value}%")
                                ->orWhere('title->en', 'ILIKE', "%{$value}%");
                        });
                    }),
                ])
                ->allowedSorts(['published_at', 'created_at', 'title'])
                ->defaultSort('-published_at')
                // List uchun faqat kerakli ustunlar — content 5-50 KB bo'lishi mumkin
                ->select(['id', 'title', 'slug', 'excerpt', 'category', 'is_published', 'published_at', 'created_at', 'updated_at', 'deleted_at'])
                ->with('media');

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findBySlug(string $slug, bool $onlyPublished = true): News
    {
        return $this->findByIdentifier($slug, $onlyPublished);
    }

    public function findByIdentifier(string $identifier, bool $onlyPublished = true): News
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_NEWS, 'identifier', $identifier, $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_SHORT, function () use ($identifier, $onlyPublished) {
            // Avval slug bo'yicha qidirish, topilmasa ID bo'yicha
            $query = News::with('media');
            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            $news = (clone $query)->where('slug', $identifier)->first();

            if (! $news && is_numeric($identifier)) {
                $news = (clone $query)->where('id', (int) $identifier)->first();
            }

            if (! $news) {
                abort(404);
            }

            return $news;
        });
    }

    public function create(array $data): News
    {
        $news = DB::transaction(function () use ($data) {
            $news = News::create(Arr::except($data, ['cover', 'gallery']));

            if (isset($data['cover'])) {
                $news->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('thumbnail');
            }

            if (isset($data['gallery'])) {
                foreach ($data['gallery'] as $image) {
                    $news->addMedia($this->convertToWebp($image, 1920, 95))->toMediaCollection('gallery');
                }
            }

            return $news->load('media');
        });

        // Explicit cache clear
        CacheService::clearModel(CacheService::PREFIX_NEWS);
        CacheService::clearModel(CacheService::PREFIX_SEARCH);

        return $news;
    }

    public function update(int $id, array $data): News
    {
        $news = DB::transaction(function () use ($id, $data) {
            $news = News::findOrFail($id);
            $news->update(Arr::except($data, ['cover', 'remove_cover', 'gallery']));

            if (isset($data['cover'])) {
                $news->clearMediaCollection('thumbnail');
                $news->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('thumbnail');
            } elseif (! empty($data['remove_cover'])) {
                $news->clearMediaCollection('thumbnail');
            }

            if (isset($data['gallery'])) {
                $news->clearMediaCollection('gallery');
                foreach ($data['gallery'] as $image) {
                    $news->addMedia($this->convertToWebp($image, 1920, 95))->toMediaCollection('gallery');
                }
            }

            return $news->load('media');
        });

        // Cache tozalash — transaction commit bo'lgandan keyin
        CacheService::clearModel(CacheService::PREFIX_NEWS);
        CacheService::clearModel(CacheService::PREFIX_SEARCH);

        return $news;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $news = News::find($id);
            if (! $news) {
                // Allaqachon o'chirilgan — idempotent delete
                return;
            }
            // Barcha media kolleksiyalarni tozalash
            foreach ($news->getRegisteredMediaCollections() as $collection) {
                $news->clearMediaCollection($collection->name);
            }
            // forceDelete — bazadan butunlay o'chirish (SoftDeletes'dan emas)
            $news->forceDelete();
        });

        // Explicit cache clear
        CacheService::clearModel(CacheService::PREFIX_NEWS);
        CacheService::clearModel(CacheService::PREFIX_SEARCH);
    }
}
