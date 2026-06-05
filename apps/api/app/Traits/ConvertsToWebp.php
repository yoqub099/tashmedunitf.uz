<?php

namespace App\Traits;

use Illuminate\Http\UploadedFile;

/**
 * Yuklangan rasmni avtomatik WebP formatga o'giradi.
 * Original (jpg/png/bmp/tiff/gif/avif...) saqlanmaydi — faqat 1 ta WebP qoladi.
 *
 * Qo'llab-quvvatlanadigan formatlar:
 *   JPEG, PNG, GIF, WebP, AVIF, BMP, TIFF, WBMP, XBM, XPM
 *
 * O'zgarmaydigan formatlar:
 *   SVG (vektor — convert qilib bo'lmaydi)
 *   Video, PDF, hujjatlar (rasm emas)
 *
 * Foydalanish:
 *   $webpFile = $this->convertToWebp($request->file('image'), 1920, 90);
 *   $model->addMedia($webpFile)->toMediaCollection('image');
 */
trait ConvertsToWebp
{
    /**
     * Rasmni WebP ga convert qiladi va UploadedFile qaytaradi.
     *
     * @param  UploadedFile  $file  — yuklangan rasm (har qanday format)
     * @param  int|null  $maxWidth  — max kenglik (null = o'zgartirmaslik)
     * @param  int  $quality  — WebP sifati (0-100)
     * @return UploadedFile — WebP formatdagi yangi fayl
     */
    protected function convertToWebp(UploadedFile $file, ?int $maxWidth = null, int $quality = 90): UploadedFile
    {
        $mime = $file->getMimeType();

        // Rasm emas bo'lsa (video, pdf, doc...) — o'zgartirmasdan qaytarsin
        if (! str_starts_with($mime ?? '', 'image/')) {
            return $file;
        }

        // SVG — vektor format, WebP ga convert qilib bo'lmaydi
        if ($mime === 'image/svg+xml') {
            return $file;
        }

        // Allaqachon WebP bo'lsa va resize kerak bo'lmasa — qaytarsin
        if ($mime === 'image/webp' && $maxWidth === null) {
            return $file;
        }

        // DoS himoyasi: katta rasmlar (masalan 100000x100000) xotirani tugatmasin
        // Max: 10000×10000 (100 megapixel) — real foydalanuvchi rasmlari uchun yetarli
        $sizes = @getimagesize($file->getPathname());
        if ($sizes && (($sizes[0] ?? 0) > 10000 || ($sizes[1] ?? 0) > 10000)) {
            \Log::warning('Image dimensions too large', ['width' => $sizes[0], 'height' => $sizes[1], 'file' => $file->getClientOriginalName()]);

            return $file; // Original faylni qaytaradi, GD processing o'tkazib yuboriladi
        }

        // GD kutubxonasi orqali rasmni o'qish
        $image = $this->createImageFromFile($file->getPathname(), $mime);

        if (! $image) {
            return $file;
        }

        // Transparentlik (PNG/GIF) saqlash
        imagepalettetotruecolor($image);
        imagealphablending($image, true);
        imagesavealpha($image, true);

        // Resize (agar kenglik cheklovdan katta bo'lsa)
        $origWidth = imagesx($image);
        $origHeight = imagesy($image);

        if ($maxWidth !== null && $origWidth > $maxWidth) {
            $ratio = $maxWidth / $origWidth;
            $newHeight = (int) round($origHeight * $ratio);
            $resized = imagecreatetruecolor($maxWidth, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            $transparent = imagecolorallocatealpha($resized, 0, 0, 0, 127);
            imagefilledrectangle($resized, 0, 0, $maxWidth, $newHeight, $transparent);
            imagecopyresampled($resized, $image, 0, 0, 0, 0, $maxWidth, $newHeight, $origWidth, $origHeight);
            // Note: imagedestroy() not called — PHP 8.5+ GC's GdImage automatically, and Laravel 12 requires PHP 8.3+
            $image = $resized;
        }

        // WebP ga saqlash — Windows-compatible temp file
        $tempDir = sys_get_temp_dir();
        $tempPath = $tempDir.DIRECTORY_SEPARATOR.'webp_'.uniqid().'_'.mt_rand(1000, 9999).'.webp';

        $webpResult = @imagewebp($image, $tempPath, $quality);

        // Agar imagewebp muvaffaqiyatsiz bo'lsa yoki fayl yaratilmagan bo'lsa
        if (! $webpResult || ! file_exists($tempPath)) {
            @unlink($tempPath);

            return $file;
        }

        // Original nom + .webp (URL-encoded va maxsus belgilarni tozalash)
        $baseName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        // URL-decode qilish (%29 → ), %2F → / va h.k.)
        $baseName = urldecode($baseName);
        // Faqat harf, raqam, tire, pastki chiziq qoldirish
        $baseName = preg_replace('/[^\p{L}\p{N}\-_]/u', '', $baseName) ?: 'image';
        $originalName = $baseName.'.webp';

        return new UploadedFile($tempPath, $originalName, 'image/webp', null, true);
    }

    /**
     * Har qanday rasm formatidan GD resource yaratadi.
     *
     * @param  string  $path  — fayl yo'li
     * @param  string  $mime  — MIME type
     */
    private function createImageFromFile(string $path, string $mime): \GdImage|false
    {
        return match ($mime) {
            // Asosiy formatlar
            'image/jpeg', 'image/pjpeg' => @imagecreatefromjpeg($path),
            'image/png' => @imagecreatefrompng($path),
            'image/gif' => @imagecreatefromgif($path),
            'image/webp' => @imagecreatefromwebp($path),

            // Zamonaviy formatlar
            'image/avif' => function_exists('imagecreatefromavif')
                                                    ? @imagecreatefromavif($path)
                                                    : false,

            // Eski/kam ishlatiladigan formatlar
            'image/bmp', 'image/x-ms-bmp',
            'image/x-bmp' => @imagecreatefrombmp($path),

            'image/tiff', 'image/x-tiff' => $this->createFromTiff($path),

            'image/vnd.wap.wbmp', 'image/wbmp' => @imagecreatefromwbmp($path),
            'image/xbm', 'image/x-xbitmap' => @imagecreatefromxbm($path),
            'image/x-xpixmap' => function_exists('imagecreatefromxpm')
                                                    ? @imagecreatefromxpm($path)
                                                    : false,

            // Noma'lum format — GD universal o'qish
            default => $this->createFromUnknown($path),
        };
    }

    /**
     * TIFF formatni o'qish (Imagick kerak, bo'lmasa GD fallback)
     */
    private function createFromTiff(string $path): \GdImage|false
    {
        // Imagick bor bo'lsa — TIFF ni PNG ga convert qilib, GD ga berish
        if (extension_loaded('imagick') && class_exists('\Imagick')) {
            try {
                $imagickClass = '\Imagick';
                $imagick = new $imagickClass($path);
                $imagick->setImageFormat('png');
                $tempPng = tempnam(sys_get_temp_dir(), 'tiff_').'.png';
                $imagick->writeImage($tempPng);
                $imagick->destroy();
                $image = @imagecreatefrompng($tempPng);
                @unlink($tempPng);

                return $image;
            } catch (\Exception $e) {
                return false;
            }
        }

        return false;
    }

    /**
     * Noma'lum formatni o'qishga urinish (imagecreatefromstring)
     */
    private function createFromUnknown(string $path): \GdImage|false
    {
        $data = @file_get_contents($path);
        if ($data === false) {
            return false;
        }

        return @imagecreatefromstring($data);
    }
}
