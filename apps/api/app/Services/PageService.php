<?php

namespace App\Services;

use App\Models\Page;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Spatie\QueryBuilder\QueryBuilder;

class PageService
{
    use ConvertsToWebp;

    public function getAll(Request $request, bool $onlyPublished = true): LengthAwarePaginator
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_PAGES, array_merge($request->query(), ['only_published' => $onlyPublished]));

        return CacheService::remember($cacheKey, CacheService::TTL_PAGE, function () use ($request, $onlyPublished) {
            $query = QueryBuilder::for(Page::class)
                ->allowedFilters(['is_published'])
                ->allowedSorts(['title', 'created_at'])
                ->defaultSort('-created_at')
                // List uchun content yuklaMAYMIZ (katta matn, 5-50 KB)
                ->select(['id', 'title', 'slug', 'is_published', 'created_at', 'updated_at', 'deleted_at'])
                ->with('media');

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->paginate(max(1, min((int) $request->get('per_page', 15), 100)));
        });
    }

    public function findById(int $id, bool $onlyPublished = true): Page
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_PAGES, 'id', (string) $id, $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_PAGE, function () use ($id, $onlyPublished) {
            $query = Page::where('id', $id)->with(['media', 'children' => function ($q) use ($onlyPublished) {
                if ($onlyPublished) {
                    $q->where('is_published', true);
                }
                $q->orderBy('sort_order')->with('media');
            }]);

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->firstOrFail();
        });
    }

    public function findBySlug(string $slug, bool $onlyPublished = true): Page
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_PAGES, 'slug', $slug, $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_PAGE, function () use ($slug, $onlyPublished) {
            $query = Page::where('slug', $slug)->with(['media', 'children' => function ($q) use ($onlyPublished) {
                if ($onlyPublished) {
                    $q->where('is_published', true);
                }
                $q->orderBy('sort_order')->with('media');
            }]);

            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            return $query->firstOrFail();
        });
    }

    /**
     * Navigation tree — faqat published nav items, content yuklamasdan
     * Frontend uchun — nested tree formatida
     */
    public function getNavigationTree(): array
    {
        $cacheKey = CacheService::key(CacheService::PREFIX_NAV, 'tree');

        return CacheService::remember($cacheKey, CacheService::TTL_LONG, function () {
            $items = Page::publishedNav()
                ->select(['id', 'title', 'slug', 'parent_id', 'sort_order', 'depth', 'path', 'page_type', 'external_url', 'nav_icon'])
                ->orderBy('sort_order')
                ->get();

            return $this->buildTree($items);
        }, CacheService::PREFIX_NAV);
    }

    /**
     * Admin uchun to'liq sahifalar daraxti (content bilan)
     */
    public function getTree(Request $request): array
    {
        $cacheKey = CacheService::requestKey(CacheService::PREFIX_PAGES, array_merge($request->query(), ['type' => 'tree']));

        return CacheService::remember($cacheKey, CacheService::TTL_PAGE, function () {
            $items = Page::with('media')
                ->orderBy('sort_order')
                ->get();

            return $this->buildTree($items);
        }, CacheService::PREFIX_PAGES);
    }

    /**
     * Sahifani to'liq slug yo'li bo'yicha topish
     * Masalan: "biz-haqimizda/rahbariyat" → slug=rahbariyat, parent slug=biz-haqimizda
     */
    public function findByPath(string $fullPath, bool $onlyPublished = true): Page
    {
        $segments = array_filter(explode('/', trim($fullPath, '/')));

        if (empty($segments)) {
            abort(404);
        }

        $cacheKey = CacheService::key(CacheService::PREFIX_PAGES, 'path', md5($fullPath), $onlyPublished ? 'published' : 'all');

        return CacheService::remember($cacheKey, CacheService::TTL_PAGE, function () use ($segments, $onlyPublished) {
            // Eng oxirgi segment — maqsadli sahifa slug
            $targetSlug = array_pop($segments);

            $query = Page::where('slug', $targetSlug)->with('media');
            if ($onlyPublished) {
                $query->where('is_published', true);
            }

            $page = $query->firstOrFail();

            // Agar parent segmentlari bor bo'lsa — ancestor zanjirni tekshirish
            if (! empty($segments)) {
                $current = $page;
                foreach (array_reverse($segments) as $ancestorSlug) {
                    $parent = $current->parent;
                    if (! $parent || $parent->slug !== $ancestorSlug) {
                        abort(404);
                    }
                    $current = $parent;
                }
                // Eng yuqori ancestor root bo'lishi kerak
                if ($current->parent_id !== null) {
                    abort(404);
                }
            }

            return $page;
        });
    }

    /**
     * Sahifalar tartibini o'zgartirish (drag & drop)
     * items: [{ id, parent_id, sort_order }, ...]
     */
    public function reorder(array $items): void
    {
        DB::transaction(function () use ($items) {
            foreach ($items as $item) {
                $page = Page::find($item['id']);
                if (! $page) {
                    continue;
                }

                $page->parent_id = $item['parent_id'] ?? null;
                $page->sort_order = $item['sort_order'] ?? 0;
                // depth va path model boot() da avtomatik hisoblanadi
                $page->save();
            }
        });

        // Cache tozalash
        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);
    }

    /**
     * Flat collection'dan nested tree qurish
     */
    private function buildTree(Collection $items, ?int $parentId = null, ?Collection $grouped = null): array
    {
        if ($grouped === null) {
            $grouped = $items->groupBy(fn ($item) => $item->parent_id);
        }

        $branch = [];
        $children = $grouped->get($parentId, collect());

        foreach ($children as $item) {
            $node = $item->toArray();
            $node['children'] = $this->buildTree($items, $item->id, $grouped);
            $branch[] = $node;
        }

        return $branch;
    }

    public function create(array $data): Page
    {
        $page = DB::transaction(function () use ($data) {
            // page_type=group bo'lsa content majburiy emas
            if (($data['page_type'] ?? 'content') === 'group' && ! isset($data['content'])) {
                $data['content'] = ['uz' => '', 'ru' => '', 'en' => ''];
            }

            $page = Page::create(\Illuminate\Support\Arr::except($data, ['images', 'documents', 'remove_images', 'remove_documents', 'remove_media_ids']));

            // Rasmlarni yuklash (ko'p rasm)
            $this->handleImages($page, $data);

            // Hujjatlarni yuklash (PDF, Word, Excel...)
            $this->handleDocuments($page, $data);

            return $page->load('media');
        });

        // Explicit cache clear (observer file-cache bug workaround)
        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);

        return $page;
    }

    public function update(int $id, array $data): Page
    {
        $page = DB::transaction(function () use ($id, $data) {
            $page = Page::findOrFail($id);

            // page_type=group bo'lsa content majburiy emas
            if (($data['page_type'] ?? $page->page_type) === 'group' && ! isset($data['content']) && empty($page->getTranslations('content'))) {
                $data['content'] = ['uz' => '', 'ru' => '', 'en' => ''];
            }

            $page->update(\Illuminate\Support\Arr::except($data, ['images', 'documents', 'remove_images', 'remove_documents', 'remove_media_ids']));

            // Rasmlarni yuklash/yangilash
            $this->handleImages($page, $data);

            // Hujjatlarni yuklash/yangilash
            $this->handleDocuments($page, $data);

            return $page->load('media');
        });

        // Explicit cache clear (observer file-cache bug workaround)
        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);

        return $page;
    }

    /**
     * Sahifa rasmlarini boshqarish (upload, remove)
     */
    private function handleImages(Page $page, array $data): void
    {
        // Barcha rasmlarni o'chirish so'rovi
        if (! empty($data['remove_images'])) {
            $page->clearMediaCollection('images');
        }

        // Alohida rasmlarni o'chirish (ID bo'yicha)
        if (! empty($data['remove_media_ids'])) {
            foreach ($data['remove_media_ids'] as $mediaId) {
                $media = $page->media()->where('id', $mediaId)->first();
                if ($media) {
                    $media->delete();
                }
            }
        }

        // Yangi rasm(lar) yuklash — mavjud rasmlarga QOSHISH (append)
        if (isset($data['images'])) {
            $images = is_array($data['images']) ? $data['images'] : [$data['images']];
            foreach ($images as $image) {
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $page->addMedia($this->convertToWebp($image, 1920))->toMediaCollection('images');
                }
            }
        }
    }

    /**
     * Sahifa hujjatlarini boshqarish (upload, remove)
     */
    private function handleDocuments(Page $page, array $data): void
    {
        if (! empty($data['remove_documents'])) {
            $page->clearMediaCollection('documents');
        }

        if (! empty($data['remove_media_ids'])) {
            foreach ($data['remove_media_ids'] as $mediaId) {
                $media = $page->media()->where('id', $mediaId)->first();
                if ($media) {
                    $media->delete();
                }
            }
        }

        if (isset($data['documents'])) {
            $documents = is_array($data['documents']) ? $data['documents'] : [$data['documents']];
            foreach ($documents as $document) {
                if ($document instanceof \Illuminate\Http\UploadedFile) {
                    $page->addMedia($document)->toMediaCollection('documents');
                }
            }
        }
    }

    public function delete(int $id): void
    {
        DB::transaction(function () use ($id) {
            $page = Page::find($id);
            if (! $page) {
                return;
            }
            // Barcha media kolleksiyalarni tozalash (images, documents, videos, audio, archives, books, private_docs)
            foreach ($page->getRegisteredMediaCollections() as $collection) {
                $page->clearMediaCollection($collection->name);
            }
            $page->delete();
        });

        // Explicit cache clear (observer file-cache bug workaround)
        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);
    }
}
