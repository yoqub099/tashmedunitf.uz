<?php

namespace Database\Seeders;

use App\Models\Direction;
use Illuminate\Database\Seeder;

class DirectionSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (Direction::count() > 0) {
            $this->command->info('⏭️  Yo\'nalishlar mavjud ('.Direction::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $directions = [
            // === BAKALAVRIAT (Tibbiyot yo'nalishlari) ===
            [
                'name' => ['uz' => 'Davolash ishi', 'ru' => 'Лечебное дело', 'en' => 'General Medicine'],
                'code' => '60510100',
                'level' => 'bakalavriat',
                'price_daytime' => 18000000,
                'price_remote' => 10000000,
                'exam_subjects' => ['Biologiya', 'Kimyo', "O'zbek tili"],
                'description' => ['uz' => '<p>Davolash ishi yo\'nalishi talabalarga ichki kasalliklar, xirurgiya, nevrologiya, kardiologiya va boshqa klinik fanlar bo\'yicha chuqur bilim beradi. Bitiruvchilar umumiy amaliyot shifokori sifatida faoliyat olib borishlari mumkin.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Ichki kasalliklar (terapiya)</li><li>Xirurgiya</li><li>Farmakologiya</li><li>Patologik anatomiya</li><li>Klinik diagnostika</li><li>Nevrologiya va psixiatriya</li></ul><h3>Karyera imkoniyatlari:</h3><p>Poliklinikalar, shifoxonalar, klinik markazlar, tibbiy tadqiqot institutlari, shoshilinch tibbiy yordam xizmati.</p>', 'ru' => '<p>Направление «Лечебное дело» готовит специалистов по внутренним болезням, хирургии, неврологии, кардиологии и другим клиническим дисциплинам.</p>', 'en' => '<p>The General Medicine program trains specialists in internal medicine, surgery, neurology, cardiology and other clinical disciplines.</p>'],
                'duration' => '6 yil',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['uz' => 'Pediatriya', 'ru' => 'Педиатрия', 'en' => 'Pediatrics'],
                'code' => '60510200',
                'level' => 'bakalavriat',
                'price_daytime' => 18000000,
                'price_remote' => 10000000,
                'exam_subjects' => ['Biologiya', 'Kimyo', "O'zbek tili"],
                'description' => ['uz' => '<p>Pediatriya yo\'nalishi bolalar kasalliklarini diagnostika qilish, davolash va profilaktika qilish bo\'yicha mutaxassislar tayyorlaydi. Talabalar neonatologiya, bolalar infektsion kasalliklari va bolalar xirurgiyasi bo\'yicha bilim oladilar.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Bolalar kasalliklari</li><li>Neonatologiya</li><li>Bolalar infektsion kasalliklari</li><li>Bolalar xirurgiyasi</li><li>Bolalar nevrologiyasi</li></ul><h3>Karyera imkoniyatlari:</h3><p>Bolalar poliklinikalari va shifoxonalari, perinatal markazlar, maktab va bog\'cha tibbiy xizmati.</p>', 'ru' => '<p>Направление «Педиатрия» готовит специалистов по диагностике, лечению и профилактике детских заболеваний.</p>', 'en' => '<p>The Pediatrics program trains specialists in diagnosing, treating and preventing childhood diseases.</p>'],
                'duration' => '6 yil',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['uz' => 'Tibbiy profilaktika ishi', 'ru' => 'Медико-профилактическое дело', 'en' => 'Preventive Medicine'],
                'code' => '60510300',
                'level' => 'bakalavriat',
                'price_daytime' => 16000000,
                'price_remote' => 9000000,
                'exam_subjects' => ['Biologiya', 'Kimyo', "O'zbek tili"],
                'description' => ['uz' => '<p>Tibbiy profilaktika ishi yo\'nalishi aholining salomatligini muhofaza qilish, epidemiologiya, gigiena va sanitariya sohasida mutaxassislar tayyorlaydi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Epidemiologiya</li><li>Umumiy gigiena</li><li>Kommunal gigiena</li><li>Bolalar va o\'smirlar gigienasi</li><li>Sanitariya nazorati</li></ul><h3>Karyera imkoniyatlari:</h3><p>Sanitariya-epidemiologiya markazlari, sog\'liqni saqlash boshqarmalari, ekologik tashkilotlar.</p>', 'ru' => '<p>Направление готовит специалистов в области охраны здоровья населения, эпидемиологии, гигиены и санитарии.</p>', 'en' => '<p>The program trains specialists in public health protection, epidemiology, hygiene and sanitation.</p>'],
                'duration' => '5 yil',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['uz' => 'Farmatsiya', 'ru' => 'Фармация', 'en' => 'Pharmacy'],
                'code' => '60520100',
                'level' => 'bakalavriat',
                'price_daytime' => 17000000,
                'price_remote' => 9500000,
                'exam_subjects' => ['Kimyo', 'Biologiya', "O'zbek tili"],
                'description' => ['uz' => '<p>Farmatsiya yo\'nalishi dori vositalarini ishlab chiqish, sifatini nazorat qilish va dorixona faoliyatini boshqarish bo\'yicha mutaxassislar tayyorlaydi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Farmatsevtik kimyo</li><li>Farmakognoziya</li><li>Dori texnologiyasi</li><li>Farmakologiya</li><li>Dorixona boshqaruvi</li></ul><h3>Karyera imkoniyatlari:</h3><p>Dorixonalar, farmatsevtik zavodlar, klinik farmakologiya xizmati, ilmiy-tadqiqot laboratoriyalari.</p>', 'ru' => '<p>Направление готовит специалистов в области разработки лекарств, контроля качества и управления аптечной деятельностью.</p>', 'en' => '<p>The program trains specialists in drug development, quality control and pharmacy management.</p>'],
                'duration' => '5 yil',
                'is_active' => true,
                'sort_order' => 4,
            ],

            // === KLINIK ORDINATURA ===
            [
                'name' => ['uz' => 'Ichki kasalliklar (Terapiya)', 'ru' => 'Внутренние болезни (Терапия)', 'en' => 'Internal Medicine (Therapy)'],
                'code' => '70510101',
                'level' => 'ordinatura',
                'price_daytime' => 20000000,
                'exam_subjects' => ['Ichki kasalliklar', 'Klinik diagnostika'],
                'description' => ['uz' => '<p>Klinik ordinatura dasturi ichki kasalliklar bo\'yicha yuqori malakali mutaxassislar — terapevtlar tayyorlaydi. Ordinatorlar shifoxonalarda to\'g\'ridan-to\'g\'ri klinik amaliyot o\'taydilar.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Ichki kasalliklar propedevtikasi</li><li>Kardiologiya</li><li>Pulmonologiya</li><li>Gastroenterologiya</li><li>Endokrinologiya</li></ul><h3>Karyera imkoniyatlari:</h3><p>Klinik shifoxonalar, tibbiy markazlar, ilmiy-amaliy laboratoriyalar.</p>', 'ru' => '<p>Программа клинической ординатуры по внутренним болезням готовит высококвалифицированных терапевтов.</p>', 'en' => '<p>Clinical residency program in internal medicine trains highly qualified therapists.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'name' => ['uz' => 'Xirurgiya', 'ru' => 'Хирургия', 'en' => 'Surgery'],
                'code' => '70510102',
                'level' => 'ordinatura',
                'price_daytime' => 22000000,
                'exam_subjects' => ['Xirurgiya', 'Anesteziologiya'],
                'description' => ['uz' => '<p>Xirurgiya bo\'yicha klinik ordinatura dasturi umumiy va ixtisoslashgan xirurgiya sohasida chuqur bilim va amaliy ko\'nikmalar beradi. Ordinatorlar operatsiyalarda bevosita qatnashadilar.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Umumiy xirurgiya</li><li>Qorin xirurgiyasi</li><li>Ko\'krak xirurgiyasi</li><li>Travmatologiya</li><li>Anesteziologiya</li></ul><h3>Karyera imkoniyatlari:</h3><p>Jarrohlik bo\'limlari, shoshilinch yordam markazlari, ixtisoslashgan klinikalar.</p>', 'ru' => '<p>Клиническая ординатура по хирургии даёт углублённые знания и практические навыки в общей и специализированной хирургии.</p>', 'en' => '<p>Surgery residency program provides in-depth knowledge and practical skills in general and specialized surgery.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'name' => ['uz' => 'Akusherlik va ginekologiya', 'ru' => 'Акушерство и гинекология', 'en' => 'Obstetrics and Gynecology'],
                'code' => '70510201',
                'level' => 'ordinatura',
                'price_daytime' => 21000000,
                'exam_subjects' => ['Akusherlik', 'Ginekologiya'],
                'description' => ['uz' => '<p>Akusherlik va ginekologiya bo\'yicha klinik ordinatura dasturi homiladorlik boshqaruvi, tug\'ruq yordami va ginekologik kasalliklarni davolash bo\'yicha mutaxassislar tayyorlaydi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Akusherlik</li><li>Ginekologiya</li><li>Perinatal tibbiyot</li><li>Reproduktiv salomatlik</li><li>Ultrasonografiya</li></ul><h3>Karyera imkoniyatlari:</h3><p>Tug\'ruqxonalar, perinatal markazlar, ayollar konsultatsiyasi, reproduktiv markazlar.</p>', 'ru' => '<p>Программа ординатуры по акушерству и гинекологии готовит специалистов по ведению беременности и родовспоможению.</p>', 'en' => '<p>Residency program in obstetrics and gynecology trains specialists in pregnancy management and childbirth assistance.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 7,
            ],

            // === MAGISTRATURA ===
            [
                'name' => ['uz' => 'Jamoat salomatligi', 'ru' => 'Общественное здоровье', 'en' => 'Public Health'],
                'code' => '70510301',
                'level' => 'magistratura',
                'price_daytime' => 15000000,
                'price_remote' => 8500000,
                'exam_subjects' => ['Jamoat salomatligi', 'Statistika'],
                'description' => ['uz' => '<p>Magistratura dasturi sog\'liqni saqlash tizimini boshqarish, epidemiologik tahlil va tibbiy statistika bo\'yicha ilmiy-amaliy bilimlar beradi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Sog\'liqni saqlash menejmenti</li><li>Tibbiy statistika</li><li>Epidemiologik tadqiqotlar</li><li>Tibbiy huquq</li><li>Sog\'liqni saqlash iqtisodiyoti</li></ul><h3>Karyera imkoniyatlari:</h3><p>Sog\'liqni saqlash boshqarmalari, xalqaro tashkilotlar, ilmiy-tadqiqot institutlari.</p>', 'ru' => '<p>Магистратура по общественному здоровью готовит специалистов в области управления здравоохранением и эпидемиологического анализа.</p>', 'en' => '<p>The Public Health master\'s program trains specialists in healthcare management and epidemiological analysis.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'name' => ['uz' => 'Tibbiy biologiya va genetika', 'ru' => 'Медицинская биология и генетика', 'en' => 'Medical Biology and Genetics'],
                'code' => '70510302',
                'level' => 'magistratura',
                'price_daytime' => 16000000,
                'price_remote' => 9000000,
                'exam_subjects' => ['Molekulyar biologiya', 'Genetika'],
                'description' => ['uz' => '<p>Tibbiy biologiya va genetika yo\'nalishi irsiy kasalliklarni tadqiq qilish, genetik diagnostika va molekulyar biologiya sohasida ilmiy kadrlar tayyorlaydi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Molekulyar biologiya</li><li>Tibbiy genetika</li><li>Sitologiya</li><li>Immunogenetika</li><li>Bioinformatika</li></ul><h3>Karyera imkoniyatlari:</h3><p>Genetik laboratotiyalar, ilmiy-tadqiqot markazlari, diagnostik klinikalar.</p>', 'ru' => '<p>Направление готовит научных специалистов в области генетической диагностики и молекулярной биологии.</p>', 'en' => '<p>The program trains researchers in genetic diagnostics and molecular biology.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 9,
            ],
            [
                'name' => ['uz' => 'Farmatsevtik fanlar', 'ru' => 'Фармацевтические науки', 'en' => 'Pharmaceutical Sciences'],
                'code' => '70520101',
                'level' => 'magistratura',
                'price_daytime' => 15500000,
                'price_remote' => 8800000,
                'exam_subjects' => ['Farmakologiya', 'Farmatsevtik kimyo'],
                'description' => ['uz' => '<p>Farmatsevtik fanlar magistraturasi dori vositalarini ilmiy asosda tadqiq qilish, yangi dori shakllarini yaratish va klinik sinovlar bo\'yicha mutaxassislar tayyorlaydi.</p><h3>O\'qitiladigan fanlar:</h3><ul><li>Farmatsevtik kimyo</li><li>Farmakologiya</li><li>Dori texnologiyasi</li><li>Klinik farmatsiya</li><li>Farmatsevtik marketing</li></ul><h3>Karyera imkoniyatlari:</h3><p>Farmatsevtik kompaniyalar, ilmiy-tadqiqot laboratoriyalari, universitetlar, sog\'liqni saqlash vazirligi.</p>', 'ru' => '<p>Магистратура по фармацевтическим наукам готовит специалистов по разработке и исследованию лекарственных средств.</p>', 'en' => '<p>The Pharmaceutical Sciences master\'s program trains specialists in drug research and development.</p>'],
                'duration' => '2 yil',
                'is_active' => true,
                'sort_order' => 10,
            ],
        ];

        foreach ($directions as $data) {
            Direction::create($data);
        }

        $this->command->info('✅ 10 ta tibbiyot yo\'nalishi yaratildi (4 bakalavriat + 3 klinik ordinatura + 3 magistratura)');
    }
}
