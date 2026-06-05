<?php

namespace App\Services;

use App\Models\TalentedStudent;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class TalentedStudentService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_TALENTED_STUDENTS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(TalentedStudent::class)
                ->allowedSorts(['sort_order', 'created_at'])
                ->defaultSort('sort_order')
                ->with('media');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            if ($search = $request->get('search')) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'ilike', "%{$search}%")
                        ->orWhere('description', 'ilike', "%{$search}%");
                });
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 12), 100)));
        });
    }

    public function findById(int $id): TalentedStudent
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_TALENTED_STUDENTS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return TalentedStudent::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): TalentedStudent
    {
        $student = DB::transaction(function () use ($data) {
            $student = TalentedStudent::create(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $student->addMedia($this->convertToWebp($data['photo'], 400))->toMediaCollection('photo');
            }

            return $student->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_TALENTED_STUDENTS);

        return $student;
    }

    public function update(int $id, array $data): TalentedStudent
    {
        $student = DB::transaction(function () use ($id, $data) {
            $student = TalentedStudent::findOrFail($id);
            $student->update(\Illuminate\Support\Arr::except($data, ['photo', 'remove_photo']));

            if (isset($data['photo'])) {
                $student->clearMediaCollection('photo');
                $student->addMedia($this->convertToWebp($data['photo'], 400))->toMediaCollection('photo');
            } elseif (! empty($data['remove_photo'])) {
                $student->clearMediaCollection('photo');
            }

            return $student->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_TALENTED_STUDENTS);

        return $student;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $student = TalentedStudent::find($id);
            if (! $student) {
                return;
            }
            $student->clearMediaCollection('photo');
            $student->forceDelete();
        });

        CacheService::clearModel(CacheService::PREFIX_TALENTED_STUDENTS);
    }
}
