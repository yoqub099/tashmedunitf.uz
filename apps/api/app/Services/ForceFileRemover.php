<?php

namespace App\Services;

use Exception;
use Illuminate\Contracts\Filesystem\Factory;
use Spatie\MediaLibrary\MediaCollections\Filesystem;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Spatie\MediaLibrary\Support\FileRemover\DefaultFileRemover;

/**
 * ForceFileRemover — Media papkasini to'liq o'chirish
 *
 * Spatie ning DefaultFileRemover faqat individual fayllarni o'chiradi,
 * lekin bo'sh papkalar va conversions qolib ketishi mumkin (ayniqsa Windows da).
 *
 * Bu class avval standart usulda o'chiradi, keyin butun papkani
 * force-delete qiladi — hech narsa qolmaydi.
 */
class ForceFileRemover extends DefaultFileRemover
{
    public function __construct(
        protected Filesystem $mediaFileSystem,
        protected Factory $filesystem,
    ) {
        parent::__construct($mediaFileSystem, $filesystem);
    }

    public function removeAllFiles(Media $media): void
    {
        // Avval standart usulda o'chirish (individual fayllar)
        parent::removeAllFiles($media);

        // Keyin butun papkani force-delete (qolganlarni tozalash)
        $this->forceDeleteMediaDirectory($media, $media->disk);

        if ($media->conversions_disk && $media->disk !== $media->conversions_disk) {
            $this->forceDeleteMediaDirectory($media, $media->conversions_disk);
        }
    }

    /**
     * Media papkasini to'liq o'chirish (original + conversions + responsive)
     */
    private function forceDeleteMediaDirectory(Media $media, string $disk): void
    {
        try {
            $mediaDirectory = $this->mediaFileSystem->getMediaDirectory($media);

            if ($this->filesystem->disk($disk)->exists($mediaDirectory)) {
                $this->filesystem->disk($disk)->deleteDirectory($mediaDirectory);
            }
        } catch (Exception $exception) {
            report($exception);
        }
    }
}
