<?php

namespace Database\Seeders;

use App\Models\Direction;
use App\Models\Faculty;
use Illuminate\Database\Seeder;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        // Bakalavriat faculties
        $f1 = Faculty::updateOrCreate(
            ['name->uz' => 'Tibbiyot fakulteti'],
            [
                'name' => ['uz' => 'Tibbiyot fakulteti', 'ru' => 'Медицинский факультет', 'en' => 'Faculty of Medicine'],
                'description' => [
                    'uz' => "Tibbiyot fakulteti talabalarga davolash ishi, pediatriya va tibbiy profilaktika sohalari bo'yicha chuqur ta'lim beradi. Bitiruvchilar amaliy shifokor sifatida faoliyat yuritishlari mumkin.",
                    'ru' => 'Медицинский факультет предоставляет углубленное образование в области лечебного дела, педиатрии и медицинской профилактики.',
                    'en' => 'The Faculty of Medicine provides in-depth education in general medicine, pediatrics, and medical prevention.',
                ],
                'level' => 'bakalavriat',
                'sort_order' => 1,
            ]
        );

        $f2 = Faculty::updateOrCreate(
            ['name->uz' => 'Farmatsiya fakulteti'],
            [
                'name' => ['uz' => 'Farmatsiya fakulteti', 'ru' => 'Фармацевтический факультет', 'en' => 'Faculty of Pharmacy'],
                'description' => [
                    'uz' => "Farmatsiya fakulteti dori vositalarini ishlab chiqish, sifatini nazorat qilish va dorixona faoliyatini boshqarish bo'yicha mutaxassislar tayyorlaydi.",
                    'ru' => 'Фармацевтический факультет готовит специалистов в области разработки, контроля качества лекарственных средств и управления аптечной деятельностью.',
                    'en' => 'The Faculty of Pharmacy trains specialists in drug development, quality control, and pharmacy management.',
                ],
                'level' => 'bakalavriat',
                'sort_order' => 2,
            ]
        );

        // Ordinatura faculty
        $f3 = Faculty::updateOrCreate(
            ['name->uz' => 'Klinik tibbiyot fakulteti'],
            [
                'name' => ['uz' => 'Klinik tibbiyot fakulteti', 'ru' => 'Факультет клинической медицины', 'en' => 'Faculty of Clinical Medicine'],
                'description' => [
                    'uz' => "Klinik tibbiyot fakulteti tibbiyot bakalavrlari uchun tor mutaxassisliklar bo'yicha chuqurlashtirilgan amaliy tayyorgarlikni ta'minlaydi.",
                    'ru' => 'Факультет клинической медицины обеспечивает углубленную практическую подготовку по узким специальностям для бакалавров медицины.',
                    'en' => 'The Faculty of Clinical Medicine provides advanced practical training in specialized medical fields.',
                ],
                'level' => 'ordinatura',
                'sort_order' => 1,
            ]
        );

        // Magistratura faculty
        $f4 = Faculty::updateOrCreate(
            ['name->uz' => 'Ilmiy-tadqiqot fakulteti'],
            [
                'name' => ['uz' => 'Ilmiy-tadqiqot fakulteti', 'ru' => 'Научно-исследовательский факультет', 'en' => 'Faculty of Research'],
                'description' => [
                    'uz' => "Ilmiy-tadqiqot fakulteti magistratura dasturlari orqali ilmiy izlanishlar va chuqurlashtirilgan nazariy bilim olishga yo'naltirilgan ta'lim beradi.",
                    'ru' => 'Научно-исследовательский факультет предоставляет образование, направленное на научные исследования и углубленные теоретические знания.',
                    'en' => 'The Faculty of Research provides education focused on scientific research and advanced theoretical knowledge.',
                ],
                'level' => 'magistratura',
                'sort_order' => 1,
            ]
        );

        // Link directions to faculties
        Direction::where('name->uz', 'Davolash ishi')->update(['faculty_id' => $f1->id]);
        Direction::where('name->uz', 'Pediatriya')->update(['faculty_id' => $f1->id]);
        Direction::where('name->uz', 'Tibbiy profilaktika ishi')->update(['faculty_id' => $f1->id]);
        Direction::where('name->uz', 'Farmatsiya')->update(['faculty_id' => $f2->id]);
        Direction::where('name->uz', 'Ichki kasalliklar (Terapiya)')->update(['faculty_id' => $f3->id]);
        Direction::where('name->uz', 'Xirurgiya')->update(['faculty_id' => $f3->id]);
        Direction::where('name->uz', 'Akusherlik va ginekologiya')->update(['faculty_id' => $f3->id]);
        Direction::where('name->uz', 'Jamoat salomatligi')->update(['faculty_id' => $f4->id]);
        Direction::where('name->uz', 'Tibbiy biologiya va genetika')->update(['faculty_id' => $f4->id]);
        Direction::where('name->uz', 'Farmatsevtik fanlar')->update(['faculty_id' => $f4->id]);

        $this->command->info('✅ '.Faculty::count().' ta fakultet yaratildi, '.Direction::whereNotNull('faculty_id')->count()." ta yo'nalish bog'landi");
    }
}
