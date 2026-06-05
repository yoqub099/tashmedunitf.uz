<?php

namespace App\Services;

use App\Models\Staff;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class StaffService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_STAFF, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Staff::class)
                ->allowedFilters([
                    AllowedFilter::exact('department_id'),
                    'full_name',
                ])
                ->allowedSorts(['full_name', 'sort_order', 'created_at'])
                ->defaultSort('sort_order')
                // List uchun bio yuklaMAYMIZ (katta matn, 5-50KB)
                // department faqat id + name kerak
                ->select(['id', 'full_name', 'position', 'phone', 'email', 'is_active', 'sort_order', 'department_id', 'created_at', 'updated_at', 'deleted_at'])
                ->with([
                    'media',
                    'department' => fn ($q) => $q->select(['id', 'name', 'slug']),
                ]);

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findById(int $id): Staff
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_STAFF, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($id) {
            return Staff::with(['media', 'department'])->findOrFail($id);
        });
    }

    public function create(array $data): Staff
    {
        $staff = DB::transaction(function () use ($data) {
            $staff = Staff::create(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $staff->addMedia($this->convertToWebp($data['photo'], 400))->toMediaCollection('photo');
            }

            return $staff->load(['media', 'department']);
        });

        CacheService::clearModel(CacheService::PREFIX_STAFF);
        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);

        return $staff;
    }

    public function update(int $id, array $data): Staff
    {
        $staff = DB::transaction(function () use ($id, $data) {
            $staff = Staff::findOrFail($id);
            $staff->update(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $staff->clearMediaCollection('photo');
                $staff->addMedia($this->convertToWebp($data['photo'], 400))->toMediaCollection('photo');
            }

            return $staff->load(['media', 'department']);
        });

        CacheService::clearModel(CacheService::PREFIX_STAFF);
        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);

        return $staff;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $staff = Staff::find($id);
            if (! $staff) {
                return;
            }
            foreach ($staff->getRegisteredMediaCollections() as $collection) {
                $staff->clearMediaCollection($collection->name);
            }
            $staff->delete();
        });

        CacheService::clearModel(CacheService::PREFIX_STAFF);
        CacheService::clearModel(CacheService::PREFIX_DEPARTMENTS);
    }
}
