<?php

namespace App\Services;

use App\Models\Testimonial;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class TestimonialService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_TESTIMONIALS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Testimonial::class)
                ->allowedSorts(['sort_order', 'created_at'])
                ->defaultSort('sort_order')
                ->with('media');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 10), 100)));
        });
    }

    public function findById(int $id): Testimonial
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_TESTIMONIALS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return Testimonial::with('media')->findOrFail($id);
        });
    }

    public function create(array $data): Testimonial
    {
        $testimonial = DB::transaction(function () use ($data) {
            $testimonial = Testimonial::create(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $testimonial->addMedia($this->convertToWebp($data['photo'], 150))->toMediaCollection('photo');
            }

            return $testimonial->load('media');
        });

        // Explicit cache clear
        CacheService::clearModel(CacheService::PREFIX_TESTIMONIALS);

        return $testimonial;
    }

    public function update(int $id, array $data): Testimonial
    {
        $testimonial = DB::transaction(function () use ($id, $data) {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->update(\Illuminate\Support\Arr::except($data, ['photo']));

            if (isset($data['photo'])) {
                $testimonial->clearMediaCollection('photo');
                $testimonial->addMedia($this->convertToWebp($data['photo'], 150))->toMediaCollection('photo');
            }

            return $testimonial->load('media');
        });

        // Explicit cache clear
        CacheService::clearModel(CacheService::PREFIX_TESTIMONIALS);

        return $testimonial;
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $testimonial = Testimonial::find($id);
            if (! $testimonial) {
                return;
            }
            $testimonial->clearMediaCollection('photo');
            $testimonial->delete();
        });

        // Explicit cache clear
        CacheService::clearModel(CacheService::PREFIX_TESTIMONIALS);
    }
}
