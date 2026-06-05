<?php

namespace Database\Seeders;

use App\Models\TalentedStudent;
use Illuminate\Database\Seeder;

class TalentedStudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'name' => ['uz' => 'Nurjahon Xolmirzayeva', 'ru' => 'Нуржахон Холмирзаева', 'en' => 'Nurjahon Xolmirzayeva'],
                'description' => [
                    'uz' => 'Nurjahon Xolmirzayeva ilmiy izlanishdagi erishgan natijalar bilan ham talaba-yoshlarga oʻrnak boʻlib kelmoqda. Bugungi kunda uning koʻplab ilmiy maqola va tezislari respublika va xalqaro konferensiyalar hamda ilmiy jurnallarda chop etilgan.',
                    'ru' => 'Нуржахон Холмирзаева является примером для студентов и молодёжи своими достижениями в научных исследованиях. Её многочисленные научные статьи и тезисы опубликованы в республиканских и международных конференциях.',
                    'en' => 'Nurjahon Xolmirzayeva is an example for students and young people with her achievements in scientific research. Today, many of her scientific articles and theses have been published in national and international conferences and scientific journals.',
                ],
                'sort_order' => 1,
                'is_active' => true,
                'photo' => 'nurjahon.png',
            ],
            [
                'name' => ['uz' => 'Abdulaziz Abdurazzaqov', 'ru' => 'Абдулазиз Абдураззаков', 'en' => 'Abdulaziz Abdurazzaqov'],
                'description' => [
                    'uz' => 'Bugungi kunda TTATF institutining Magistratura boʻlimida "Bank hisobi va audit" mutaxassisligi boʻyicha tahsil olib kelmoqda. U institutda oʻzining namunali xulqi, bilimga chanqoqligi bilan keng jamoatchilik orasida hurmat qozondi.',
                    'ru' => 'В настоящее время обучается в магистратуре ТТАТФ по специальности «Банковский учёт и аудит». Он завоевал уважение широкой общественности своим примерным поведением и стремлением к знаниям.',
                    'en' => 'Currently studying at the Master\'s Department of TTATF, majoring in "Banking and Auditing". He gained respect among the general public with his exemplary behavior and thirst for knowledge.',
                ],
                'sort_order' => 2,
                'is_active' => true,
                'photo' => 'abdulaziz.png',
            ],
            [
                'name' => ['uz' => 'Komila Xannarova', 'ru' => 'Комила Ханнарова', 'en' => 'Komila Xannarova'],
                'description' => [
                    'uz' => 'Oʻtgan davr mobaynida Komila Xannarova qator yutuqlarga erishishga muvaffaq boʻldi. U 2023 yil "Matematika" fani boʻyicha oʻtkazilgan fan olimpiadasining Toshkent shaxar bosqichida gʻolib boʻldi.',
                    'ru' => 'За прошедший период Комила Ханнарова добилась ряда достижений. Она стала победителем городского этапа олимпиады по математике 2023 года.',
                    'en' => 'During the past period, Komila Xannarova managed to achieve a number of achievements. She won the 2023 city stage of the Science Olympiad in "Mathematics".',
                ],
                'sort_order' => 3,
                'is_active' => true,
                'photo' => 'komila.png',
            ],
            [
                'name' => ['uz' => 'Olimjon Obidjonov', 'ru' => 'Олимжон Обиджонов', 'en' => 'Olimjon Obidjonov'],
                'description' => [
                    'uz' => 'Olimjon Obidjonov 2023 yil "Soliq bilimdonlari" koʻrik tanlovining mintaqaviy bosqichida faol ishtirok etganligi uchun munosib taqdirlandi. Olimjon Obidjonov 2023-2024 oʻquv yili uchun magistraturaning "Biznes va boshqaruv" yoʻnalishi boʻyicha Oʻzbekiston Respublikasi Prezidenti davlat stipendiyasi sovrindori boʻldi.',
                    'ru' => 'Олимжон Обиджонов был награждён за активное участие в региональном этапе конкурса «Налоговые знатоки» 2023 года. Он стал обладателем Президентской стипендии по направлению «Бизнес и управление» на 2023-2024 учебный год.',
                    'en' => 'Olimjon Obidjonov was duly awarded for his active participation in the regional stage of the 2023 "Tax Experts" competition. He won the State Scholarship of the President of the Republic of Uzbekistan for the 2023-2024 academic year in the field of "Business and Management".',
                ],
                'sort_order' => 4,
                'is_active' => true,
                'photo' => 'olimjon.png',
            ],
        ];

        foreach ($students as $data) {
            $photoFile = $data['photo'] ?? null;
            unset($data['photo']);

            $student = TalentedStudent::create($data);

            if ($photoFile) {
                $filePath = storage_path('app/seeders/'.$photoFile);
                if (file_exists($filePath)) {
                    $student->addMedia($filePath)
                        ->preservingOriginal()
                        ->toMediaCollection('photo');
                }
            }
        }
    }
}
