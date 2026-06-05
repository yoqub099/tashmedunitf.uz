<?php

namespace App\Services;

use App\Models\StudentLifePhoto;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class StudentLifePhotoService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_STUDENT_LIFE_PHOTOS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(StudentLifePhoto::class)
                ->allowedSorts(['sort_order', 'created_at'])
                ->defaultSort('sort_order')
                ->with('media');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'ilike', "%{$search}%");
                });
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 50), 100)));
        });
    }

    public function findById(int $id): StudentLifePhoto
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_STUDENT_LIFE_PHOTOS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return StudentLifePhoto::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): StudentLifePhoto
    {
        $photo = DB::transaction(function () use ($data) {
            $photo = StudentLifePhoto::create(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $photo->addMedia($this->convertToWebp($data['photo'], 800))->toMediaCollection('photo');
            }

            return $photo->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_STUDENT_LIFE_PHOTOS);

        return $photo;
    }

    public function update(int $id, array $data): StudentLifePhoto
    {
        $photo = DB::transaction(function () use ($id, $data) {
            $photo = StudentLifePhoto::findOrFail($id);
            $photo->update(\Illuminate\Support\Arr::except($data, ['photo', 'remove_photo']));

            if (isset($data['photo'])) {
                $photo->clearMediaCollection('photo');
                $photo->addMedia($this->convertToWebp($data['photo'], 800))->toMediaCollection('photo');
            } elseif (! empty($data['remove_photo'])) {
                $photo->clearMediaCollection('photo');
            }

            return $photo->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_STUDENT_LIFE_PHOTOS);

        return $photo;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $photo = StudentLifePhoto::find($id);
            if (! $photo) {
                return;
            }
            $photo->clearMediaCollection('photo');
            $photo->forceDelete();
        });

        CacheService::clearModel(CacheService::PREFIX_STUDENT_LIFE_PHOTOS);
    }
}
