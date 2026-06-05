<?php

namespace App\Services;

use App\Models\JournalIssue;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class JournalIssueService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyPublished = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_JOURNAL_ISSUES, array_merge($request->query(), ['only_published' => $onlyPublished]));

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($request, $onlyPublished) {
            $query = QueryBuilder::for(JournalIssue::class)
                ->allowedFilters([
                    AllowedFilter::exact('is_current'),
                    AllowedFilter::exact('year'),
                    AllowedFilter::exact('is_published'),
                    AllowedFilter::callback('title', function ($query, $value) {
                        $query->where(function ($q) use ($value) {
                            $q->where('title->uz', 'ILIKE', "%{$value}%")
                                ->orWhere('title->ru', 'ILIKE', "%{$value}%")
                                ->orWhere('title->en', 'ILIKE', "%{$value}%");
                        });
                    }),
                ])
                ->allowedSorts(['date', 'created_at', 'title', 'sort_order', 'year', 'issue_number'])
                ->defaultSort('-date')
                ->with('media');

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findByIdentifier(string $identifier, bool $onlyPublished = true): JournalIssue
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_JOURNAL_ISSUES, 'identifier', $identifier, $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_MEDIUM, function () use ($identifier, $onlyPublished) {
            $query = JournalIssue::with('media');

            if (is_numeric($identifier)) {
                $query->where('id', (int) $identifier);
            } else {
                $query->where('slug', $identifier);
            }

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->firstOrFail();
        });
    }

    public function create(array $data): JournalIssue
    {
        $issue = DB::transaction(function () use ($data) {
            $issue = JournalIssue::create(Arr::except($data, ['cover', 'file']));

            if (isset($data['cover'])) {
                $issue->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('cover');
            }

            if (isset($data['file'])) {
                $issue->addMedia($data['file'])->toMediaCollection('file');
            }

            return $issue->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_JOURNAL_ISSUES);

        return $issue;
    }

    public function update(int $id, array $data): JournalIssue
    {
        $issue = DB::transaction(function () use ($id, $data) {
            $issue = JournalIssue::findOrFail($id);
            $issue->update(Arr::except($data, ['cover', 'remove_cover', 'file', 'remove_file']));

            if (isset($data['cover'])) {
                $issue->clearMediaCollection('cover');
                $issue->addMedia($this->convertToWebp($data['cover'], 1920, 95))->toMediaCollection('cover');
            } elseif (! empty($data['remove_cover'])) {
                $issue->clearMediaCollection('cover');
            }

            if (isset($data['file'])) {
                $issue->clearMediaCollection('file');
                $issue->addMedia($data['file'])->toMediaCollection('file');
            } elseif (! empty($data['remove_file'])) {
                $issue->clearMediaCollection('file');
            }

            return $issue->load('media');
        });

        CacheService::clearModel(CacheService::PREFIX_JOURNAL_ISSUES);

        return $issue;
    }

    public function delete(int $id): void
    {
        $issue = JournalIssue::findOrFail($id);
        $issue->delete();

        CacheService::clearModel(CacheService::PREFIX_JOURNAL_ISSUES);
    }
}
