<?php

namespace App\Services;

use App\Models\Faculty;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class FacultyService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_FACULTIES, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Faculty::class)
                ->allowedFilters([
                    AllowedFilter::exact('level'),
                    'name',
                ])
                ->allowedSorts(['name', 'sort_order'])
                ->defaultSort('sort_order')
                // List uchun directions.media yuklaMAYMIZ — lekin exam_subjects kerak
                ->with(['media', 'activeDirections' => fn ($q) => $q->select(['id', 'faculty_id', 'name', 'level', 'is_active', 'sort_order', 'exam_subjects'])])
                ->withCount('directions');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findById(int $id): Faculty
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_FACULTIES, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($id) {
            return Faculty::with(['media', 'activeDirections.media'])->withCount('directions')->findOrFail($id);
        });
    }

    public function create(array $data): Faculty
    {
        if (isset($data['description']) && is_array($data['description'])) {
            $data['description'] = HtmlSanitizer::cleanTranslations($data['description']);
        }
        $faculty = DB::transaction(function () use ($data) {
            $faculty = Faculty::create(\Illuminate\Support\Arr::except($data, ['image']));

            if (isset($data['image'])) {
                $faculty->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            }

            return $faculty->load(['media', 'activeDirections.media'])->loadCount('directions');
        });

        CacheService::clearModel(CacheService::PREFIX_FACULTIES);

        return $faculty;
    }

    public function update(int $id, array $data): Faculty
    {
        if (isset($data['description']) && is_array($data['description'])) {
            $data['description'] = HtmlSanitizer::cleanTranslations($data['description']);
        }
        $faculty = DB::transaction(function () use ($id, $data) {
            $faculty = Faculty::findOrFail($id);
            $faculty->update(\Illuminate\Support\Arr::except($data, ['image', 'remove_image']));

            if (isset($data['image'])) {
                $faculty->clearMediaCollection('image');
                $faculty->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            } elseif (! empty($data['remove_image'])) {
                $faculty->clearMediaCollection('image');
            }

            return $faculty->load(['media', 'activeDirections.media'])->loadCount('directions');
        });

        CacheService::clearModel(CacheService::PREFIX_FACULTIES);

        return $faculty;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $faculty = Faculty::find($id);
            if (! $faculty) {
                return;
            }
            $faculty->clearMediaCollection('image');
            $faculty->delete();
        });

        CacheService::clearModel(CacheService::PREFIX_FACULTIES);
    }
}
