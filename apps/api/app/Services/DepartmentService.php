<?php

namespace App\Services;

use App\Models\Department;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class DepartmentService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_DEPARTMENTS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Department::class)
                ->allowedFilters(['name'])
                ->allowedSorts(['name', 'sort_order', 'created_at'])
                ->defaultSort('sort_order')
                // List uchun staff yuklaMAYMIZ — faqat department ma'lumotlari kerak
                // Staff faqat show (findBySlug) da yuklanadi
                ->with(['media'])
                ->withCount('staff');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findBySlug(string $slug): Department
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_DEPARTMENTS, 'slug', $slug);

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($slug) {
            return Department::where('slug', $slug)
                ->with(['media', 'staff' => fn ($q) => $q->where('is_active', true)->orderBy('sort_order')->with('media')])
                ->firstOrFail();
        });
    }

    public function create(array $data): Department
    {
        $department = DB::transaction(function () use ($data) {
            $department = Department::create(\Illuminate\Support\Arr::except($data, ['image', 'head_photo']));

            if (isset($data['image'])) {
                $department->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            }

            if (isset($data['head_photo'])) {
                $department->addMedia($this->convertToWebp($data['head_photo'], 400))->toMediaCollection('head_photo');
            }

            return $department->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);

        return $department;
    }

    public function update(int $id, array $data): Department
    {
        $department = DB::transaction(function () use ($id, $data) {
            $department = Department::findOrFail($id);
            $department->update(\Illuminate\Support\Arr::except($data, ['image', 'head_photo']));

            if (isset($data['image'])) {
                $department->clearMediaCollection('image');
                $department->addMedia($this->convertToWebp($data['image'], 800))->toMediaCollection('image');
            }

            if (isset($data['head_photo'])) {
                $department->clearMediaCollection('head_photo');
                $department->addMedia($this->convertToWebp($data['head_photo'], 400))->toMediaCollection('head_photo');
            }

            return $department->load('media');
        });

        // Cache tozalash — transaction commit bo'lgandan keyin
        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);

        return $department;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $department = Department::find($id);
            if (! $department) {
                return;
            }
            // Barcha media kolleksiyalarni tozalash
            foreach ($department->getRegisteredMediaCollections() as $collection) {
                $department->clearMediaCollection($collection->name);
            }
            $department->delete();
        });

        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);
    }
}
