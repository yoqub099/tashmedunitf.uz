<?php

namespace Database\Seeders;

use App\Models\LibraryResource;
use Illuminate\Database\Seeder;

class LibraryResourceSeeder extends Seeder
{
    public function run(): void
    {
        $books = [
            [
                'title' => [
                    'uz' => 'Moliyaviy hisobot tahlili',
                    'ru' => 'Анализ финансовой отчётности',
                    'en' => 'Financial Statement Analysis',
                ],
                'description' => [
                    'uz' => 'Dr. A.Sh. Xolmurodov, T.R. Jalolov',
                    'ru' => 'Д-р А.Ш. Холмуродов, Т.Р. Жалолов',
                    'en' => 'Dr. A.Sh. Kholmurodov, T.R. Jalolov',
                ],
                'category' => 'badiiy-adabiyotlar',
                'sort_order' => 1,
                'is_published' => true,
            ],
            [
                'title' => [
                    'uz' => 'Buxgalteriya hisobi asoslari',
                    'ru' => 'Основы бухгалтерского учёта',
                    'en' => 'Fundamentals of Accounting',
                ],
                'description' => [
                    'uz' => 'M.Q. Pardayev, B.I. Isroilov',
                    'ru' => 'М.К. Пардаев, Б.И. Исроилов',
                    'en' => 'M.Q. Pardayev, B.I. Isroilov',
                ],
                'category' => 'ilmiy-adabiyotlar',
                'sort_order' => 2,
                'is_published' => true,
            ],
            [
                'title' => [
                    'uz' => 'Makroiqtisodiyot nazariyasi',
                    'ru' => 'Теория макроэкономики',
                    'en' => 'Macroeconomics Theory',
                ],
                'description' => [
                    'uz' => 'N.G. Mankyu (N. Gregory Mankiw)',
                    'ru' => 'Н.Г. Мэнкью (N. Gregory Mankiw)',
                    'en' => 'N. Gregory Mankiw',
                ],
                'category' => 'ilmiy-adabiyotlar',
                'sort_order' => 3,
                'is_published' => true,
            ],
            [
                'title' => [
                    'uz' => 'Soliq va soliqqa tortish',
                    'ru' => 'Налоги и налогообложение',
                    'en' => 'Taxes and Taxation',
                ],
                'description' => [
                    'uz' => 'Sh.Sh. Shodmonov, T.S. Malikov',
                    'ru' => 'Ш.Ш. Шодмонов, Т.С. Маликов',
                    'en' => 'Sh.Sh. Shodmonov, T.S. Malikov',
                ],
                'category' => 'oquv-resurslari',
                'sort_order' => 4,
                'is_published' => true,
            ],
            [
                'title' => [
                    'uz' => 'Bank ishi va kredit nazariyasi',
                    'ru' => 'Банковское дело и кредитная теория',
                    'en' => 'Banking and Credit Theory',
                ],
                'description' => [
                    'uz' => 'O.Sh. Olimjonov, D.A. Xoshimova',
                    'ru' => 'О.Ш. Олимжонов, Д.А. Хошимова',
                    'en' => 'O.Sh. Olimjonov, D.A. Xoshimova',
                ],
                'category' => 'badiiy-adabiyotlar',
                'sort_order' => 5,
                'is_published' => true,
            ],
        ];

        foreach ($books as $data) {
            LibraryResource::updateOrCreate(
                ['title->uz' => $data['title']['uz']],
                [
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'category' => $data['category'],
                    'sort_order' => $data['sort_order'],
                    'is_published' => $data['is_published'],
                    'published_at' => now(),
                ]
            );
        }

        $this->command->info('✅ 5 ta kutubxona kitobi yaratildi!');
    }
}
