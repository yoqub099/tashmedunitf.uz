<?php

namespace Database\Seeders;

use App\Models\StudentLifePhoto;
use Illuminate\Database\Seeder;

class StudentLifePhotoSeeder extends Seeder
{
    public function run(): void
    {
        $photos = [
            [
                'title' => ['uz' => 'Talabalar tadbirlari', 'ru' => 'Студенческие мероприятия', 'en' => 'Student events'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_14-50-17_1725270627.webp'),
                'sort_order' => 1,
            ],
            [
                'title' => ['uz' => 'Sport mashg\'ulotlari', 'ru' => 'Спортивные занятия', 'en' => 'Sports activities'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_14-52-16_1725270772.webp'),
                'sort_order' => 2,
            ],
            [
                'title' => ['uz' => 'Ilmiy anjumanlar', 'ru' => 'Научные конференции', 'en' => 'Scientific conferences'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_14-56-15_1725271046.webp'),
                'sort_order' => 3,
            ],
            [
                'title' => ['uz' => 'Madaniy hayot', 'ru' => 'Культурная жизнь', 'en' => 'Cultural life'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_14-59-00_1725271170.webp'),
                'sort_order' => 4,
            ],
            [
                'title' => ['uz' => 'Volontyorlik faoliyati', 'ru' => 'Волонтёрская деятельность', 'en' => 'Volunteering'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_15-03-07_1725271402.webp'),
                'sort_order' => 5,
            ],
            [
                'title' => ['uz' => 'Talabalar uchrashuvlari', 'ru' => 'Встречи студентов', 'en' => 'Student meetings'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_15-05-23_1725271540.webp'),
                'sort_order' => 6,
            ],
            [
                'title' => ['uz' => 'Laboratoriya mashg\'ulotlari', 'ru' => 'Лабораторные занятия', 'en' => 'Lab sessions'],
                'file' => base_path('../rasim/2Fphoto_2024-09-02_15-07-04_1725271640.webp'),
                'sort_order' => 7,
            ],
            [
                'title' => ['uz' => 'Universitet hayoti', 'ru' => 'Университетская жизнь', 'en' => 'University life'],
                'file' => base_path('../rasim/2FTestimonial_1725029652.webp'),
                'sort_order' => 8,
            ],
        ];

        foreach ($photos as $photoData) {
            $photo = StudentLifePhoto::create([
                'title' => $photoData['title'],
                'is_active' => true,
                'sort_order' => $photoData['sort_order'],
            ]);

            if (file_exists($photoData['file'])) {
                $photo->addMedia($photoData['file'])
                    ->preservingOriginal()
                    ->toMediaCollection('photo');
                $this->command->info("Added photo: {$photoData['title']['uz']}");
            } else {
                $this->command->warn("File not found: {$photoData['file']}");
            }
        }
    }
}
