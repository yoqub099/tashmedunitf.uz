<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Department;
use App\Models\Direction;
use App\Models\Faculty;
use App\Models\News;
use App\Models\Page;
use App\Models\Partner;
use App\Models\Staff;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

/**
 * Media Seeder — Barcha modellar uchun placeholder rasmlarni generatsiya qiladi
 *
 * GD kutubxonasi yordamida placeholder rasmlar yaratib,
 * Spatie Media Library orqali modellarga bog'laydi.
 *
 * Ishlatish:
 *   php artisan db:seed --class=MediaSeeder
 */
class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🖼️  Media seeder boshlandi...');

        $this->seedIfEmpty(Banner::class, 'image', fn () => $this->seedBanners());
        $this->seedIfEmpty(News::class, 'thumbnail', fn () => $this->seedNews());
        $this->seedIfEmpty(Department::class, 'image', fn () => $this->seedDepartments());
        $this->seedIfEmpty(Staff::class, 'photo', fn () => $this->seedStaff());
        $this->seedIfEmpty(Faculty::class, 'image', fn () => $this->seedFaculties());
        $this->seedIfEmpty(Direction::class, 'image', fn () => $this->seedDirections());
        $this->seedIfEmpty(Partner::class, 'logo', fn () => $this->seedPartners());
        $this->seedIfEmpty(Testimonial::class, 'photo', fn () => $this->seedTestimonials());
        $this->seedIfEmpty(Page::class, 'images', fn () => $this->seedPages());

        $this->command->info('✅ Media seeder tugadi! Jami: '.Media::count().' ta media yaratildi.');
    }

    private function seedIfEmpty(string $modelClass, string $collection, callable $seeder): void
    {
        $hasMedia = Media::where('model_type', $modelClass)
            ->where('collection_name', $collection)
            ->exists();

        if ($hasMedia) {
            $this->command->info("  ⏭️  {$modelClass} ({$collection}) — allaqachon mavjud");

            return;
        }

        $seeder();
    }

    private function seedBanners(): void
    {
        $banners = Banner::all();
        $colors = ['#1E40AF', '#047857', '#B91C1C'];

        foreach ($banners as $i => $banner) {
            $color = $colors[$i % count($colors)];
            $title = $banner->getTranslation('title', 'uz');
            $img = $this->createPlaceholder(1920, 600, $color, $title);
            $banner->addMedia($img)->usingFileName('banner-'.$banner->id.'.webp')->toMediaCollection('image');
        }
        $this->command->info("  ✅ Banner — {$banners->count()} ta rasm qo'shildi");
    }

    private function seedNews(): void
    {
        $news = News::all();
        $colors = ['#7C3AED', '#2563EB', '#059669', '#DC2626', '#D97706', '#0891B2', '#4F46E5', '#BE185D'];

        foreach ($news as $i => $item) {
            $color = $colors[$i % count($colors)];
            $title = $item->getTranslation('title', 'uz');
            $img = $this->createPlaceholder(800, 500, $color, $title);
            $item->addMedia($img)->usingFileName('news-'.$item->id.'.webp')->toMediaCollection('thumbnail');
        }
        $this->command->info("  ✅ News — {$news->count()} ta rasm qo'shildi");
    }

    private function seedDepartments(): void
    {
        $departments = Department::all();
        $colors = ['#1E3A5F', '#0E4429', '#4A1942', '#2D3748', '#1A365D', '#234E52', '#44337A'];

        foreach ($departments as $i => $dept) {
            $color = $colors[$i % count($colors)];
            $name = $dept->getTranslation('name', 'uz');

            $img = $this->createPlaceholder(800, 500, $color, $name);
            $dept->addMedia($img)->usingFileName('dept-'.$dept->id.'.webp')->toMediaCollection('image');

            $headName = $dept->getTranslation('head_name', 'uz');
            if ($headName) {
                $photo = $this->createPlaceholder(400, 500, '#374151', $headName);
                $dept->addMedia($photo)->usingFileName('dept-head-'.$dept->id.'.webp')->toMediaCollection('head_photo');
            }
        }
        $this->command->info("  ✅ Departments — {$departments->count()} ta rasm qo'shildi");
    }

    private function seedStaff(): void
    {
        $staff = Staff::all();

        foreach ($staff as $person) {
            $name = $person->getTranslation('full_name', 'uz');
            $photo = $this->createPlaceholder(400, 500, '#1F2937', $name);
            $person->addMedia($photo)->usingFileName('staff-'.$person->id.'.webp')->toMediaCollection('photo');
        }
        $this->command->info("  ✅ Staff — {$staff->count()} ta rasm qo'shildi");
    }

    private function seedFaculties(): void
    {
        $faculties = Faculty::all();
        $colors = ['#1E40AF', '#047857', '#7C3AED', '#B91C1C'];

        foreach ($faculties as $i => $faculty) {
            $color = $colors[$i % count($colors)];
            $name = $faculty->getTranslation('name', 'uz');
            $img = $this->createPlaceholder(800, 500, $color, $name);
            $faculty->addMedia($img)->usingFileName('faculty-'.$faculty->id.'.webp')->toMediaCollection('image');
        }
        $this->command->info("  ✅ Faculties — {$faculties->count()} ta rasm qo'shildi");
    }

    private function seedDirections(): void
    {
        $directions = Direction::all();
        $colors = ['#0E7490', '#4338CA', '#065F46', '#92400E'];

        foreach ($directions as $i => $direction) {
            $color = $colors[$i % count($colors)];
            $name = $direction->getTranslation('name', 'uz');
            $img = $this->createPlaceholder(800, 500, $color, $name);
            $direction->addMedia($img)->usingFileName('direction-'.$direction->id.'.webp')->toMediaCollection('image');
        }
        $this->command->info("  ✅ Directions — {$directions->count()} ta rasm qo'shildi");
    }

    private function seedPartners(): void
    {
        $partners = Partner::all();

        foreach ($partners as $partner) {
            // Partner model HasTranslations ishlatmaydi — name oddiy string
            $name = $partner->name ?? 'Partner';
            $img = $this->createPlaceholder(300, 200, '#F3F4F6', $name, '#111827');
            $partner->addMedia($img)->usingFileName('partner-'.$partner->id.'.webp')->toMediaCollection('logo');
        }
        $this->command->info("  ✅ Partners — {$partners->count()} ta rasm qo'shildi");
    }

    private function seedTestimonials(): void
    {
        $testimonials = Testimonial::all();
        $colors = ['#E91E63', '#3F51B5', '#009688', '#FF5722', '#795548', '#673AB7'];

        foreach ($testimonials as $i => $testimonial) {
            $color = $colors[$i % count($colors)];
            // Testimonial model field: 'name' (not 'author_name')
            $name = $testimonial->getTranslation('name', 'uz');
            $photo = $this->createPlaceholder(300, 300, $color, $name);
            // Testimonial collection: 'photo' (not 'avatar')
            $testimonial->addMedia($photo)->usingFileName('testimonial-'.$testimonial->id.'.webp')->toMediaCollection('photo');
        }
        $this->command->info("  ✅ Testimonials — {$testimonials->count()} ta rasm qo'shildi");
    }

    private function seedPages(): void
    {
        $pages = Page::where('is_published', true)->take(5)->get();
        $colors = ['#1E40AF', '#047857', '#7C3AED', '#B91C1C', '#D97706'];

        foreach ($pages as $i => $page) {
            $color = $colors[$i % count($colors)];
            $title = $page->getTranslation('title', 'uz');
            $img = $this->createPlaceholder(800, 500, $color, $title);
            // Page collection: 'images' (PLURAL, not 'image')
            $page->addMedia($img)->usingFileName('page-'.$page->id.'.webp')->toMediaCollection('images');
        }
        $this->command->info("  ✅ Pages — {$pages->count()} ta rasm qo'shildi");
    }

    /**
     * GD bilan placeholder rasm yaratish
     */
    private function createPlaceholder(
        int $width,
        int $height,
        string $bgHex,
        string $text,
        string $textHex = '#FFFFFF'
    ): string {
        $img = imagecreatetruecolor($width, $height);

        $bgRgb = $this->hexToRgb($bgHex);
        $bg = imagecolorallocate($img, $bgRgb[0], $bgRgb[1], $bgRgb[2]);
        imagefill($img, 0, 0, $bg);

        $textRgb = $this->hexToRgb($textHex);
        $textColor = imagecolorallocate($img, $textRgb[0], $textRgb[1], $textRgb[2]);

        $displayText = mb_strlen($text) > 30 ? mb_substr($text, 0, 27).'...' : $text;
        $sizeText = "{$width}x{$height}";

        $fontSize = 4;
        $charWidth = imagefontwidth($fontSize);
        $charHeight = imagefontheight($fontSize);

        $textWidth = $charWidth * strlen($displayText);
        $textX = max(($width - $textWidth) / 2, 10);
        $textY = ($height / 2) - $charHeight;

        $sizeWidth = $charWidth * strlen($sizeText);
        $sizeX = ($width - $sizeWidth) / 2;
        $sizeY = $textY + $charHeight + 10;

        imagestring($img, $fontSize, (int) $textX, (int) $textY, $displayText, $textColor);
        imagestring($img, 3, (int) $sizeX, (int) $sizeY, $sizeText, $textColor);

        $tmpPath = tempnam(sys_get_temp_dir(), 'media_').'.webp';
        imagewebp($img, $tmpPath, 85);
        imagedestroy($img);

        return $tmpPath;
    }

    private function hexToRgb(string $hex): array
    {
        $hex = ltrim($hex, '#');

        return [
            hexdec(substr($hex, 0, 2)),
            hexdec(substr($hex, 2, 2)),
            hexdec(substr($hex, 4, 2)),
        ];
    }
}
