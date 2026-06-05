<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\SiteContent\BatchUpsertSiteContentRequest;
use App\Http\Requests\SiteContent\UpsertSiteContentRequest;
use App\Http\Resources\SiteContentResource;
use App\Models\SiteContent;
use App\Services\SiteContentService;
use App\Traits\ConvertsToWebp;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class SiteContentController extends BaseController
{
    use ConvertsToWebp;

    public function __construct(
        private readonly SiteContentService $siteContentService
    ) {}

    /**
     * Public — bo'lim bo'yicha sayt kontentini olish
     */
    public function index(string $section): JsonResponse
    {
        $contents = $this->siteContentService->getBySection($section);

        return $this->success(SiteContentResource::collection($contents));
    }

    /**
     * Admin — barcha sayt kontentlarini olish (ixtiyoriy section filter)
     */
    public function adminIndex(): JsonResponse
    {
        $section = request()->query('section');
        $contents = $this->siteContentService->getAll($section);

        return $this->success(SiteContentResource::collection($contents));
    }

    /**
     * Admin — bitta kontentni yaratish/yangilash (upsert)
     */
    public function upsert(UpsertSiteContentRequest $request): JsonResponse
    {
        $data = $request->validated();

        $content = $this->siteContentService->upsert(
            key: $data['key'],
            section: $data['section'],
            value: $data['value'],
            type: $data['type'] ?? 'text'
        );

        return $this->success(
            new SiteContentResource($content),
            __('messages.updated', ['model' => 'Sayt kontent'])
        );
    }

    /**
     * Admin — bir nechta kontentni birdaniga yaratish/yangilash
     */
    public function batchUpsert(BatchUpsertSiteContentRequest $request): JsonResponse
    {
        $data = $request->validated();

        $contents = $this->siteContentService->batchUpsert($data['items']);

        return $this->success(
            SiteContentResource::collection($contents),
            __('messages.updated', ['model' => 'Sayt kontentlar'])
        );
    }

    /**
     * Admin — kontentni o'chirish (rasm bo'lsa faylni ham o'chiradi)
     */
    public function destroy(string $key): JsonResponse
    {
        // Agar rasm bo'lsa — storage dan ham o'chirish
        $existing = SiteContent::where('key', $key)->first();
        if ($existing) {
            $value = $existing->getTranslation('value', 'uz', false);
            if ($value && str_starts_with($value, '/storage/')) {
                $path = str_replace('/storage/', '', $value);
                if (Storage::disk('public')->exists($path)) {
                    Storage::disk('public')->delete($path);
                }
            }
        }

        $this->siteContentService->delete($key);

        return $this->success(null, 'Kontent muvaffaqiyatli o\'chirildi');
    }

    /**
     * Admin — rasm yuklash va SiteContent ga saqlash
     * Eski rasmni o'chiradi va yangi rasmni WebP formatga convert qiladi
     */
    public function uploadImage(): JsonResponse
    {
        $request = request();

        $request->validate([
            'file' => 'required|image|max:10240',
            'key' => 'required|string|max:100',
            'section' => 'required|string|max:100',
        ]);

        // 1. Eski rasmni o'chirish (agar mavjud bo'lsa)
        $existing = SiteContent::where('key', $request->input('key'))->first();
        if ($existing) {
            $oldUrl = $existing->getTranslation('value', 'uz', false);
            if ($oldUrl && str_starts_with($oldUrl, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $oldUrl);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }
        }

        // 2. WebP formatga convert qilish (max 1920px kenglik, 90% sifat)
        $file = $this->convertToWebp($request->file('file'), 1920, 90);

        // 3. Yangi rasmni saqlash
        $path = $file->store('site-contents', 'public');
        $url = '/storage/'.$path;

        $content = $this->siteContentService->upsert(
            key: $request->input('key'),
            section: $request->input('section'),
            value: ['uz' => $url, 'ru' => $url, 'en' => $url],
            type: 'text'
        );

        return $this->success(
            new SiteContentResource($content),
            'Rasm muvaffaqiyatli yuklandi'
        );
    }
}
