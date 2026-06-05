<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (Department::count() > 0) {
            $this->command->info('⏭️  Kafedralar mavjud ('.Department::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $departments = [
            [
                'name' => ['uz' => 'Davolash ishi kafedrasi', 'ru' => 'Кафедра лечебного дела', 'en' => 'Department of General Medicine'],
                'description' => [
                    'uz' => 'Davolash ishi kafedrasi — ichki kasalliklar, terapiya, klinik farmakologiya va diagnostika bo\'yicha keng qamrovli ta\'lim beruvchi yetakchi kafedra. Kafedra zamonaviy simulyatsion markazga ega bo\'lib, talabalar amaliy ko\'nikmalarni fantom va simulyatorlarda o\'rganadilar.',
                    'ru' => 'Кафедра лечебного дела — ведущая кафедра по подготовке специалистов в области внутренних болезней, терапии, клинической фармакологии и диагностики. Кафедра оснащена современным симуляционным центром.',
                    'en' => 'The Department of General Medicine is a leading department training specialists in internal medicine, therapy, clinical pharmacology and diagnostics. Equipped with a modern simulation center.',
                ],
                'head_name' => ['uz' => 'Tursunov Bobur Kamoliddinovich', 'ru' => 'Турсунов Бобур Камолиддинович', 'en' => 'Tursunov Bobur Kamoliddinovich'],
                'head_title' => ['uz' => 't.f.d., professor', 'ru' => 'д.м.н., профессор', 'en' => 'Doctor of Medical Sciences, Professor'],
                'phone' => '+998 76 223-45-01',
                'email' => 'davolash@ttatf.uz',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['uz' => 'Xirurgiya kafedrasi', 'ru' => 'Кафедра хирургии', 'en' => 'Department of Surgery'],
                'description' => [
                    'uz' => 'Xirurgiya kafedrasi umumiy xirurgiya, travmatologiya, ortopediya va anesteziologiya fanlarini o\'qitadi. Kafedra Termiz shahar klinik shifoxonasi bazasida joylashgan bo\'lib, talabalar to\'g\'ridan-to\'g\'ri klinik amaliyot o\'taydilar.',
                    'ru' => 'Кафедра хирургии преподаёт общую хирургию, травматологию, ортопедию и анестезиологию. Базируется на Термезской городской клинической больнице.',
                    'en' => 'The Department of Surgery teaches general surgery, traumatology, orthopedics and anesthesiology. Based at Termez City Clinical Hospital.',
                ],
                'head_name' => ['uz' => 'Rahimov Jasur Toshpulatovich', 'ru' => 'Рахимов Жасур Тошпулатович', 'en' => 'Rakhimov Jasur Toshpulatovich'],
                'head_title' => ['uz' => 't.f.d., professor', 'ru' => 'д.м.н., профессор', 'en' => 'Doctor of Medical Sciences, Professor'],
                'phone' => '+998 76 223-45-02',
                'email' => 'xirurgiya@ttatf.uz',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['uz' => 'Pediatriya kafedrasi', 'ru' => 'Кафедра педиатрии', 'en' => 'Department of Pediatrics'],
                'description' => [
                    'uz' => 'Pediatriya kafedrasi bolalar kasalliklari, neonatologiya, bolalar infektsion kasalliklari va bolalar xirurgiyasi bo\'yicha ta\'lim beradi. Kafedra viloyat bolalar shifoxonasi bilan yaqin hamkorlikda ishlaydi.',
                    'ru' => 'Кафедра педиатрии обучает детским болезням, неонатологии, детским инфекционным заболеваниям и детской хирургии. Тесно сотрудничает с областной детской больницей.',
                    'en' => 'The Department of Pediatrics teaches pediatric diseases, neonatology, pediatric infectious diseases and pediatric surgery. Works closely with the regional children\'s hospital.',
                ],
                'head_name' => ['uz' => 'Haydarova Nilufar Toxirovna', 'ru' => 'Хайдарова Нилуфар Тохировна', 'en' => 'Haydarova Nilufar Tokhirovna'],
                'head_title' => ['uz' => 't.f.n., dotsent', 'ru' => 'к.м.н., доцент', 'en' => 'Ph.D. in Medical Sciences, Associate Professor'],
                'phone' => '+998 76 223-45-03',
                'email' => 'pediatriya@ttatf.uz',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['uz' => 'Akusherlik va ginekologiya kafedrasi', 'ru' => 'Кафедра акушерства и гинекологии', 'en' => 'Department of Obstetrics and Gynecology'],
                'description' => [
                    'uz' => 'Akusherlik va ginekologiya kafedrasi homiladorlik, tug\'ruq, ayollar kasalliklari va reproduktiv salomatlik bo\'yicha mutaxassislar tayyorlaydi. Kafedra perinatal markaz bazasida klinik amaliyot o\'tkazadi.',
                    'ru' => 'Кафедра акушерства и гинекологии готовит специалистов по ведению беременности, родовспоможению, гинекологическим заболеваниям и репродуктивному здоровью.',
                    'en' => 'The Department of Obstetrics and Gynecology trains specialists in pregnancy management, childbirth, gynecological diseases and reproductive health.',
                ],
                'head_name' => ['uz' => 'Toshmatova Dilnoza Baxtiyorovna', 'ru' => 'Тошматова Дилноза Бахтиёровна', 'en' => 'Toshmatova Dilnoza Bakhtiyorovna'],
                'head_title' => ['uz' => 't.f.d., professor', 'ru' => 'д.м.н., профессор', 'en' => 'Doctor of Medical Sciences, Professor'],
                'phone' => '+998 76 223-45-04',
                'email' => 'akusherlik@ttatf.uz',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => ['uz' => 'Normal va patologik anatomiya kafedrasi', 'ru' => 'Кафедра нормальной и патологической анатомии', 'en' => 'Department of Normal and Pathological Anatomy'],
                'description' => [
                    'uz' => 'Normal va patologik anatomiya kafedrasi inson anatomiyasi, gistologiya, patologik anatomiya va topografik anatomiya fanlarini o\'qitadi. Kafedra zamonaviy anatomik muzey va gistologik laboratoriyaga ega.',
                    'ru' => 'Кафедра нормальной и патологической анатомии преподаёт анатомию человека, гистологию, патологическую и топографическую анатомию. Оснащена анатомическим музеем и гистологической лабораторией.',
                    'en' => 'The Department teaches human anatomy, histology, pathological and topographic anatomy. Equipped with an anatomical museum and histological laboratory.',
                ],
                'head_name' => ['uz' => 'Abdullayev Nodir Komiljonovich', 'ru' => 'Абдуллаев Нодир Комилжонович', 'en' => 'Abdullayev Nodir Komiljonovich'],
                'head_title' => ['uz' => 't.f.d., professor', 'ru' => 'д.м.н., профессор', 'en' => 'Doctor of Medical Sciences, Professor'],
                'phone' => '+998 76 223-45-05',
                'email' => 'anatomiya@ttatf.uz',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => ['uz' => 'Tibbiy biologiya va farmakologiya kafedrasi', 'ru' => 'Кафедра медицинской биологии и фармакологии', 'en' => 'Department of Medical Biology and Pharmacology'],
                'description' => [
                    'uz' => 'Tibbiy biologiya va farmakologiya kafedrasi biologiya, genetika, mikrobiologiya, farmakologiya va bioximiya fanlarini o\'qitadi. Kafedra PCR laboratoriyasi va farmakologik tadqiqot markazi bilan jihozlangan.',
                    'ru' => 'Кафедра медицинской биологии и фармакологии преподаёт биологию, генетику, микробиологию, фармакологию и биохимию. Оснащена ПЦР-лабораторией.',
                    'en' => 'The Department of Medical Biology and Pharmacology teaches biology, genetics, microbiology, pharmacology and biochemistry. Equipped with PCR laboratory.',
                ],
                'head_name' => ['uz' => 'Nurullayeva Shahlo Anvarovna', 'ru' => 'Нуруллаева Шахло Анваровна', 'en' => 'Nurullayeva Shakhlo Anvarovna'],
                'head_title' => ['uz' => 't.f.n., dotsent', 'ru' => 'к.м.н., доцент', 'en' => 'Ph.D. in Medical Sciences, Associate Professor'],
                'phone' => '+998 76 223-45-06',
                'email' => 'biologiya@ttatf.uz',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => ['uz' => 'Ijtimoiy-gumanitar fanlar va tillar kafedrasi', 'ru' => 'Кафедра социально-гуманитарных наук и языков', 'en' => 'Department of Social Sciences, Humanities and Languages'],
                'description' => [
                    'uz' => 'Ijtimoiy-gumanitar fanlar va tillar kafedrasi o\'zbek tili, rus tili, ingliz tili, tarix, falsafa, tibbiyot tarixi va tibbiy lotincha fanlarini o\'qitadi. Kafedra tibbiyot talabalari uchun maxsus til dasturlari ishlab chiqadi.',
                    'ru' => 'Кафедра социально-гуманитарных наук и языков преподаёт узбекский, русский, английский языки, историю, философию, историю медицины и медицинскую латынь.',
                    'en' => 'The Department teaches Uzbek, Russian, English languages, history, philosophy, history of medicine and medical Latin.',
                ],
                'head_name' => ['uz' => 'Xolmatov Behzod Rustamovich', 'ru' => 'Холматов Бехзод Рустамович', 'en' => 'Kholmatov Bekhzod Rustamovich'],
                'head_title' => ['uz' => 'f.f.d., dotsent', 'ru' => 'к.ф.н., доцент', 'en' => 'Ph.D. in Philology, Associate Professor'],
                'phone' => '+998 76 223-45-07',
                'email' => 'gumanitar@ttatf.uz',
                'is_active' => true,
                'sort_order' => 7,
            ],
        ];

        foreach ($departments as $data) {
            Department::create($data);
        }

        $this->command->info('✅ 7 ta tibbiyot kafedrasi yaratildi');
    }
}
