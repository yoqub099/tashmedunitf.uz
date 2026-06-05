<?php

namespace App\Services;

use App\Models\Translation;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class TranslationService
{
    /**
     * Public — barcha tarjimalarni flat map formatda olish
     * Frontend uchun: {key: {uz, ru, en}} formatda
     *
     * @return array<string, array{uz: string, ru: string|null, en: string|null}>
     */
    public function getAllFlat(): array
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_TRANSLATIONS, 'flat', 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () {
            return Translation::getAllAsMap();
        });
    }

    /**
     * Admin — sahifalangan ro'yxat, filter va qidiruv bilan
     */
    public function getAll(Request $request): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_TRANSLATIONS, $request->query());

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($request) {
            return QueryBuilder::for(Translation::class)
                ->allowedFilters([
                    AllowedFilter::exact('group'),
                    AllowedFilter::scope('search'),
                ])
                ->allowedSorts(['key', 'group', 'created_at', 'updated_at'])
                ->defaultSort('key')
                ->paginate(max(1, min((int) $request->get('per_page', 25), 100)));
        });
    }

    /**
     * ID bo'yicha bitta tarjimani olish
     */
    public function findById(int $id): Translation
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_TRANSLATIONS, 'id', (string) $id);

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () use ($id) {
            return Translation::findOrFail($id);
        });
    }

    /**
     * Yangi tarjima yaratish
     * Guruh kalitdan avtomatik aniqlanadi (birinchi nuqtadan oldingi qism)
     */
    public function create(array $data): Translation
    {
        // Guruhni kalitdan avtomatik aniqlash: "nav.home" -> "nav"
        if (empty($data['group']) && ! empty($data['key'])) {
            $data['group'] = str_contains($data['key'], '.')
                ? explode('.', $data['key'])[0]
                : 'common';
        }

        $translation = DB::transaction(function () use ($data) {
            return Translation::create($data);
        });

        CacheService::clearModel(CacheService::PREFIX_TRANSLATIONS);

        return $translation;
    }

    /**
     * Tarjimani yangilash
     */
    public function update(int $id, array $data): Translation
    {
        $translation = DB::transaction(function () use ($id, $data) {
            $translation = Translation::findOrFail($id);
            $translation->update($data);

            return $translation;
        });

        CacheService::clearModel(CacheService::PREFIX_TRANSLATIONS);

        return $translation;
    }

    /**
     * Tarjimani o'chirish
     */
    public function delete(int $id): void
    {
        $translation = Translation::findOrFail($id);
        $translation->delete();

        CacheService::clearModel(CacheService::PREFIX_TRANSLATIONS);
    }

    /**
     * Ommaviy import — batch upsert (tranzaksiya ichida)
     * Har bir element: {key, group?, value: {uz, ru?, en?}}
     */
    public function bulkImport(array $items): array
    {
        $results = DB::transaction(function () use ($items) {
            $imported = [];

            foreach ($items as $item) {
                // Guruhni avtomatik aniqlash
                if (empty($item['group']) && ! empty($item['key'])) {
                    $item['group'] = str_contains($item['key'], '.')
                        ? explode('.', $item['key'])[0]
                        : 'common';
                }

                $imported[] = Translation::updateOrCreate(
                    ['key' => $item['key']],
                    [
                        'group' => $item['group'],
                        'value' => $item['value'],
                    ]
                );
            }

            return $imported;
        });

        CacheService::clearModel(CacheService::PREFIX_TRANSLATIONS);

        return $results;
    }
}
