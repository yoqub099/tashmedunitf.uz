<?php

namespace App\Services;

use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class FaqService
{
    public function getAll(Request $request, bool $onlyActive = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_FAQS, array_merge($request->query(), ['only_active' => $onlyActive]));

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request, $onlyActive) {
            $query = QueryBuilder::for(Faq::class)
                ->allowedFilters([
                    AllowedFilter::exact('category'),
                    AllowedFilter::exact('faculty_id'),
                    AllowedFilter::callback('general', function ($q, $value) {
                        if ($value) {
                            $q->whereNull('faculty_id');
                        }
                    }),
                ])
                ->allowedSorts(['sort_order', 'created_at'])
                ->defaultSort('sort_order');

            if ($onlyActive) {
                $query->where('is_active', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 50), 100)));
        });
    }

    public function create(array $data): Faq
    {
        $faq = Faq::create($data);

        CacheService::clearModel(CacheService::PREFIX_FAQS);

        return $faq;
    }

    public function findById(int $id): Faq
    {
        $cacheKey = CacheService::PREFIX_FAQS.':detail:'.$id;

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            // Faq model does not have media relation — don't eager-load it
            return Faq::findOrFail($id);
        });
    }

    public function update(int $id, array $data): Faq
    {
        $faq = Faq::findOrFail($id);
        $faq->update($data);

        CacheService::clearModel(CacheService::PREFIX_FAQS);

        return $faq;
    }

    public function delete(int $id): void
    {
        // findOrFail throws ModelNotFoundException → controller returns 404
        Faq::findOrFail($id)->delete();

        CacheService::clearModel(CacheService::PREFIX_FAQS);
    }
}
