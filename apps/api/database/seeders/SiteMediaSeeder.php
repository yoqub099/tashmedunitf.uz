<?php

namespace Database\Seeders;

use App\Models\SiteMedia;
use Illuminate\Database\Seeder;

class SiteMediaSeeder extends Seeder
{
    public function run(): void
    {
        $item = SiteMedia::firstOrCreate(
            ['key' => 'talabalar_kengashi_video'],
            [
                'title' => 'Talabalar Kengashi Video',
                'description' => 'Talabalarga sahifasidagi Talabalar Kengashi bo\'limining asosiy videosi',
                'is_active' => true,
            ]
        );

        // Video faylni qo'shish (admin/public/images dan)
        $videoPath = base_path('../admin/public/images/IMG_3455.mp4');
        if (file_exists($videoPath) && $item->getFirstMedia('file') === null) {
            $item->addMedia($videoPath)
                ->preservingOriginal()
                ->toMediaCollection('file');
        }

        $this->command->info('SiteMedia seeder: talabalar_kengashi_video created');
    }
}
