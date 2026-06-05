<?php

namespace App\Services;

use App\Models\Direction;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class DirectionService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_DIRECTIONS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Direction::class)
                ->allowedFilters([
                    AllowedFilter::exact('level'),
                    AllowedFilter::exact('faculty_id'),
                    'name',
                    'code',
                ])
                ->allowedSorts(['name', 'code', 'sort_order'])
                ->defaultSort('sort_order')
                ->with('media');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findById(int $id): Direction
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_DIRECTIONS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($id) {
            return Direction::with(['media', 'faculty'])->findOrFail($id);
        });
    }

    public function create(array $data): Direction
    {
        if (isset($data['description']) && is_array($data['description'])) {
            $data['description'] = HtmlSanitizer::cleanTranslations($data['description']);
        }
        $direction = DB::transaction(function () use ($data) {
            $direction = Direction::create(\Illuminate\Support\Arr::except($data, ['image']));

            if (isset($data['image'])) {
                $direction->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            }

            return $direction->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_DIRECTIONS);
        CacheService::clearModel(CacheService::PREFIX_FACULTIES);

        return $direction;
    }

    public function update(int $id, array $data): Direction
    {
        if (isset($data['description']) && is_array($data['description'])) {
            $data['description'] = HtmlSanitizer::cleanTranslations($data['description']);
        }
        $direction = DB::transaction(function () use ($id, $data) {
            $direction = Direction::findOrFail($id);
            $direction->update(\Illuminate\Support\Arr::except($data, ['image', 'remove_image']));

            if (isset($data['image'])) {
                $direction->clearMediaCollection('image');
                $direction->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            } elseif (! empty($data['remove_image'])) {
                $direction->clearMediaCollection('image');
            }

            return $direction->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_DIRECTIONS);
        CacheService::clearModel(CacheService::PREFIX_FACULTIES);

        return $direction;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $direction = Direction::find($id);
            if (! $direction) {
                return;
            }
            foreach (['image', 'curriculum', 'documents', 'videos', 'audio', 'books', 'archives'] as $collection) {
                $direction->clearMediaCollection($collection);
            }
            $direction->delete();

            $mediaDir = storage_path("app/public/directions/{$id}");
            if (is_dir($mediaDir)) {
                \Illuminate\Support\Facades\File::deleteDirectory($mediaDir);
            }
        });

        CacheService::clearModel(CacheService::PREFIX_DIRECTIONS);
        CacheService::clearModel(CacheService::PREFIX_FACULTIES);
    }
}
