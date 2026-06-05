<?php

namespace App\Http\Controllers\Api;

use App\Services\SearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends BaseController
{
    public function __construct(
        private SearchService $searchService
    ) {}

    /**
     * GET /api/v1/search?q=tibbiyot&locale=uz&limit=10
     *
     * GIN INDEX ishlatadi — barcha jadvallarda tezkor JSONB qidiruv
     */
    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:2|max:100',
            'locale' => 'sometimes|string|in:uz,ru,en',
            'limit' => 'sometimes|integer|min:1|max:50',
        ]);

        $results = $this->searchService->search(
            query: $request->get('q'),
            locale: $request->get('locale', app()->getLocale()),
            limit: $request->get('limit', 10),
        );

        return $this->success($results, 'Search results');
    }
}
