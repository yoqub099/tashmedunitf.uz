<?php

namespace App\Observers;

use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * MediaObserver — Media o'chirilganda diskdagi papkani ham tozalash
 *
 * Spatie ba'zan (Windows da) DB record o'chiradi lekin
 * fizik papkani o'chira olmaydi. Bu observer buni kafolatlaydi.
 *
 * ShouldHandleEventsAfterCommit — Transaction commit bo'lgandan keyin
 * ishlaydi, shunda file lock muammosi kamayadi.
 */
class MediaObserver implements ShouldHandleEventsAfterCommit
{
    public function deleted(Media $media): void
    {
        $this->cleanupDirectory($media);
    }

    /**
     * Media papkasini diskdan to'liq o'chirish
     * (original + conversions + bo'sh papka)
     */
    private function cleanupDirectory(Media $media): void
    {
        $disk = Storage::disk($media->disk);
        $prefix = ltrim(config('media-library.prefix', 'media'), '/');
        $mediaPath = "{$prefix}/{$media->id}";

        if ($disk->exists($mediaPath)) {
            try {
                $disk->deleteDirectory($mediaPath);
                Log::info('MediaObserver: Cleaned media directory', [
                    'media_id' => $media->id,
                    'path' => $mediaPath,
                ]);
            } catch (\Throwable $e) {
                Log::warning('MediaObserver: Failed to delete directory', [
                    'media_id' => $media->id,
                    'path' => $mediaPath,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
