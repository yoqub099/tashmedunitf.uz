<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\MediaUploadRequest;
use App\Models\Banner;
use App\Models\ContactMessage;
use App\Models\Department;
use App\Models\Direction;
use App\Models\Faculty;
use App\Models\JobApplication;
use App\Models\JournalIssue;
use App\Models\LibraryResource;
use App\Models\News;
use App\Models\Page;
use App\Models\Partner;
use App\Models\SiteMedia;
use App\Models\Staff;
use App\Models\StudentLifePhoto;
use App\Models\TalentedStudent;
use App\Models\Testimonial;
use App\Services\CacheService;
use App\Services\MediaUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * ============================================================
 * MEDIA CONTROLLER — Enterprise Level
 * ============================================================
 *
 * 8 ta fayl turi qo'llab-quvvatlanadi:
 *   Image, Video, Audio, Document, Book, Archive, Presentation, Spreadsheet
 *
 * 2 xil saqlash:
 *   PUBLIC  → Nginx to'g'ridan-to'g'ri beradi (ultra tez)
 *   PRIVATE → PHP orqali auth tekshirib beradi (xavfsiz)
 *
 * ENDPOINTLAR:
 *   POST   /api/v1/media/upload              — Fayl yuklash
 *   DELETE /api/v1/media/{id}                 — O'chirish
 *   GET    /api/v1/media/{model}/{id}         — Modelning medialari
 *   GET    /api/v1/media/stats                — Statistika
 *   GET    /api/v1/media/download/{id}        — Private fayl yuklash (auth)
 *   GET    /api/v1/media/stream/{id}          — Video/Audio streaming
 *
 * ============================================================
 */
class MediaController extends BaseController
{
    public function __construct(
        private readonly MediaUploadService $mediaService
    ) {}

    /**
     * Model turidan Model classni aniqlash
     */
    private function resolveModel(string $type): string
    {
        return match ($type) {
            'news' => News::class,
            'department' => Department::class,
            'staff' => Staff::class,
            'direction' => Direction::class,
            'banner' => Banner::class,
            'partner' => Partner::class,
            'page' => Page::class,
            'journal-issue' => JournalIssue::class,
            'faculty' => Faculty::class,
            'testimonial' => Testimonial::class,
            'talented-student' => TalentedStudent::class,
            'student-life-photo' => StudentLifePhoto::class,
            'library-resource' => LibraryResource::class,
            'contact-message' => ContactMessage::class,
            'site-media' => SiteMedia::class,
            'job-application' => JobApplication::class,
            default => throw new \InvalidArgumentException("Noma'lum model turi: {$type}"),
        };
    }

    // ========================================
    // YUKLASH — POST /api/v1/media/upload
    // ========================================

    /**
     * Fayl(lar)ni modelga yuklash
     *
     * Request body (multipart/form-data):
     * - model_type: "news" | "department" | "staff" | ...
     * - model_id: 5
     * - collection: "thumbnail" | "gallery" | "documents" | "audio" | "archives" | ...
     * - type: "image" | "video" | "document" | "book" | "audio" | "archive" | "presentation" | "spreadsheet"
     * - visibility: "public" | "private" (default: public)
     * - file: (bitta fayl) YOKI files[]: (ko'p fayl)
     */
    public function upload(MediaUploadRequest $request): JsonResponse
    {
        try {
            $modelClass = $this->resolveModel($request->model_type);
            $model = $modelClass::findOrFail($request->model_id);

            // Ko'p fayl yuklash
            if ($request->hasFile('files')) {
                $result = $this->mediaService->uploadMultiple(
                    $model,
                    $request->file('files'),
                    $request->collection
                );

                $data = collect($result['uploaded'])->map(fn (Media $media) => $this->formatMedia($media));

                $response = ['files' => $data];
                if (! empty($result['errors'])) {
                    $response['errors'] = $result['errors'];
                }

                $this->clearModelCache($request->model_type);

                return $this->success($response, 'Fayllar muvaffaqiyatli yuklandi', 201);
            }

            // Bitta fayl yuklash
            $media = $this->mediaService->uploadFile(
                $model,
                $request->file('file'),
                $request->collection
            );

            // Media yuklanganda tegishli model keshini tozalash
            $this->clearModelCache($request->model_type);

            return $this->success($this->formatMedia($media), 'Fayl muvaffaqiyatli yuklandi', 201);

        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Model topilmadi', 404);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Media upload error', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return $this->error('Fayl yuklashda xatolik yuz berdi', 500);
        }
    }

    // ========================================
    // O'CHIRISH — DELETE /api/v1/media/{id}
    // ========================================

    public function destroy(int $id): JsonResponse
    {
        try {
            Media::findOrFail($id);
            $this->mediaService->deleteMedia($id);

            return $this->success(null, 'Fayl o\'chirildi');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Media topilmadi', 404);
        }
    }

    // ========================================
    // KO'RISH — GET /api/v1/media/{model}/{id}
    // ========================================

    /**
     * Modelning barcha media fayllarini ko'rish
     *
     * GET /api/v1/media/news/5
     * GET /api/v1/media/department/3?collection=gallery
     *
     * Response:
     * {
     *   "thumbnail": [{id, url, thumbnail_url, ...}],
     *   "gallery": [{id, url, ...}],
     *   "documents": [{id, url, ...}],
     *   "videos": [{id, url, ...}],
     *   "audio": [{id, url, ...}],
     *   "archives": [{id, url, ...}],
     *   "books": [{id, url, ...}]
     * }
     */
    public function show(string $modelType, int $modelId, Request $request): JsonResponse
    {
        try {
            $modelClass = $this->resolveModel($modelType);
            $model = $modelClass::findOrFail($modelId);

            if ($request->has('collection')) {
                $data = $this->mediaService->getMediaUrls(
                    $model,
                    $request->collection,
                    $request->input('conversion')
                );

                return $this->success($data);
            }

            // Barcha collectionlar
            $collections = $model->getRegisteredMediaCollections();
            $data = [];

            foreach ($collections as $collection) {
                $collectionName = $collection->name;
                $medias = $this->mediaService->getMediaUrls($model, $collectionName);
                if (! empty($medias)) {
                    $data[$collectionName] = $medias;
                }
            }

            return $this->success($data);
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Model topilmadi', 404);
        }
    }

    // ========================================
    // 🔐 PRIVATE DOWNLOAD — GET /api/v1/media/download/{id}
    // ========================================

    /**
     * Private faylni yuklab olish (auth:sanctum kerak!)
     *
     * Private fayllar 'local' diskda (storage/app/private/)
     * Nginx BERMAYDI — faqat PHP auth tekshirib beradi
     *
     * Misol: Imtihon savollari, shaxsiy hujjatlar, kontrakt skanerlari
     */
    public function download(int $id): StreamedResponse|JsonResponse
    {
        try {
            $media = Media::findOrFail($id);

            // Private faylni stream qilish (auth middleware tekshiradi)
            return response()->streamDownload(function () use ($media) {
                $stream = fopen($media->getPath(), 'rb');
                while (! feof($stream)) {
                    echo fread($stream, 8192);
                    flush();
                }
                fclose($stream);
            }, $media->file_name, [
                'Content-Type' => $media->mime_type,
                'Content-Length' => $media->size,
                'Content-Disposition' => 'attachment; filename="'.$media->file_name.'"',
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Media topilmadi', 404);
        }
    }

    // ========================================
    // 🎥 VIDEO/AUDIO STREAM — GET /api/v1/media/stream/{id}
    // ========================================

    /**
     * Video yoki audio faylni stream qilish
     *
     * Range request qo'llab-quvvatlanadi — video seeking ishlaydi
     * Brauzerda to'g'ridan-to'g'ri play qiladi
     */
    public function stream(int $id): StreamedResponse|JsonResponse
    {
        try {
            $media = Media::findOrFail($id);

            // Faqat video va audio stream qilish mumkin
            if (! str_starts_with($media->mime_type, 'video/') && ! str_starts_with($media->mime_type, 'audio/')) {
                return $this->error('Faqat video va audio stream qilish mumkin', 422);
            }

            $path = $media->getPath();
            $size = $media->size;

            $start = 0;
            $end = $size - 1;
            $statusCode = 200;
            $headers = [
                'Content-Type' => $media->mime_type,
                'Accept-Ranges' => 'bytes',
                'Cache-Control' => 'public, max-age=604800',
            ];

            // Range header mavjud bo'lsa — partial content (video seeking)
            $range = request()->header('Range');
            if ($range) {
                if (preg_match('/bytes=(\d+)-(\d*)/', $range, $matches)) {
                    $start = (int) $matches[1];
                    $end = ! empty($matches[2]) ? (int) $matches[2] : $size - 1;

                    if ($start > $end || $start >= $size) {
                        return response()->json(['message' => 'Range Not Satisfiable'], 416)
                            ->withHeaders(['Content-Range' => "bytes */{$size}"]);
                    }

                    $statusCode = 206;
                    $headers['Content-Range'] = "bytes {$start}-{$end}/{$size}";
                }
            }

            $length = $end - $start + 1;
            $headers['Content-Length'] = $length;

            return response()->stream(function () use ($path, $start, $length) {
                $stream = fopen($path, 'rb');
                fseek($stream, $start);

                $remaining = $length;
                $bufferSize = 8192;

                while ($remaining > 0 && ! feof($stream)) {
                    $read = min($bufferSize, $remaining);
                    echo fread($stream, $read);
                    $remaining -= $read;
                    flush();
                }

                fclose($stream);
            }, $statusCode, $headers);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return $this->error('Media topilmadi', 404);
        }
    }

    // ========================================
    // STATISTIKA — GET /api/v1/media/stats
    // ========================================

    /**
     * To'liq media statistikasi — 8 ta kategoriya
     *
     * {
     *   "total": {"count": 5000, "size": "150 GB"},
     *   "images": {"count": 2000, "size": "10 GB"},
     *   "videos": {"count": 300, "size": "80 GB"},
     *   "audio": {"count": 500, "size": "15 GB"},
     *   "pdfs": {"count": 800, "size": "20 GB"},
     *   "documents": {"count": 600, "size": "5 GB"},
     *   "books": {"count": 200, "size": "10 GB"},
     *   "archives": {"count": 100, "size": "10 GB"},
     *   "disk": {"total": "10 TB", "free": "9.85 TB", "percent_used": 1.5}
     * }
     */
    public function stats(): JsonResponse
    {
        $stats = $this->mediaService->getMediaStats();

        return $this->success($stats, 'Media statistikasi');
    }

    // ========================================
    // YORDAMCHI
    // ========================================

    /**
     * Model turiga qarab keshni tozalash
     */
    private function clearModelCache(string $modelType): void
    {
        $prefixMap = [
            'page' => [CacheService::PREFIX_PAGES, CacheService::PREFIX_NAV],
            'news' => [CacheService::PREFIX_NEWS],
            'department' => [CacheService::PREFIX_DEPARTMENTS],
            'staff' => [CacheService::PREFIX_STAFF],
            'direction' => [CacheService::PREFIX_DIRECTIONS],
            'banner' => [CacheService::PREFIX_BANNERS],
            'partner' => [CacheService::PREFIX_PARTNERS],
            'faculty' => [CacheService::PREFIX_DIRECTIONS],
            'testimonial' => [CacheService::PREFIX_TESTIMONIALS],
            'library-resource' => [CacheService::PREFIX_PAGES],
            'journal-issue' => [CacheService::PREFIX_PAGES],
        ];

        foreach ($prefixMap[$modelType] ?? [] as $prefix) {
            CacheService::clearModel($prefix);
        }
    }

    private function formatMedia(Media $media): array
    {
        $data = [
            'id' => $media->id,
            'uuid' => $media->uuid,
            'name' => $media->name,
            'file_name' => $media->file_name,
            'mime_type' => $media->mime_type,
            'size' => $media->size,
            'human_size' => $this->mediaService->humanFileSize($media->size),
            'collection' => $media->collection_name,
            'disk' => $media->disk,
            'url' => $media->disk === 'local' ? null : $media->getUrl(),
            'is_private' => $media->disk === 'local',
            'created_at' => $media->created_at->toISOString(),
        ];

        // Fayl turi aniqlash
        $data['file_type'] = match (true) {
            str_starts_with($media->mime_type, 'image/') => 'image',
            str_starts_with($media->mime_type, 'video/') => 'video',
            str_starts_with($media->mime_type, 'audio/') => 'audio',
            $media->mime_type === 'application/pdf' => 'pdf',
            in_array($media->mime_type, [
                'application/epub+zip', 'application/x-mobipocket-ebook',
            ]) => 'book',
            in_array($media->mime_type, [
                'application/zip', 'application/x-rar-compressed',
                'application/x-7z-compressed', 'application/vnd.rar',
            ]) => 'archive',
            default => 'document',
        };

        // Konversiya URL lari (faqat rasmlar uchun)
        if (str_starts_with($media->mime_type, 'image/') && $media->disk !== 'local') {
            if ($media->hasGeneratedConversion('thumbnail')) {
                $data['thumbnail_url'] = $media->getUrl('thumbnail');
            }
            if ($media->hasGeneratedConversion('medium')) {
                $data['medium_url'] = $media->getUrl('medium');
            }
            if ($media->hasGeneratedConversion('large')) {
                $data['large_url'] = $media->getUrl('large');
            }
            if ($media->hasGeneratedConversion('desktop')) {
                $data['desktop_url'] = $media->getUrl('desktop');
            }
            if ($media->hasGeneratedConversion('mobile')) {
                $data['mobile_url'] = $media->getUrl('mobile');
            }
        }

        // Private fayl uchun download URL
        if ($media->disk === 'local') {
            $data['download_url'] = url("/api/v1/media/download/{$media->id}");
        }

        // Video/Audio uchun stream URL
        if (str_starts_with($media->mime_type, 'video/') || str_starts_with($media->mime_type, 'audio/')) {
            $data['stream_url'] = url("/api/v1/media/stream/{$media->id}");
        }

        return $data;
    }
}
