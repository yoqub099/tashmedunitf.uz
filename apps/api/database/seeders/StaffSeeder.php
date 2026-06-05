<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Staff;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (Staff::count() > 0) {
            $this->command->info('⏭️  Xodimlar mavjud ('.Staff::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $departments = Department::all()->keyBy('sort_order');
        $rektorat = $departments->first();

        $staffData = [
            // === REKTORAT ===
            [
                'full_name' => ['uz' => 'Murodov Sherzod Dilshodovich', 'ru' => 'Муродов Шерзод Дилшодович', 'en' => 'Murodov Sherzod Dilshodovich'],
                'position' => ['uz' => 'Filial direktori', 'ru' => 'Директор филиала', 'en' => 'Branch Director'],
                'department_id' => $rektorat->id,
                'bio' => ['uz' => 'Tibbiyot fanlari doktori, professor. 20 yildan ortiq klinik va ilmiy-pedagogik tajribaga ega. Ichki kasalliklar bo\'yicha mutaxassis. 150 dan ortiq ilmiy maqola va 5 ta monografiya muallifi.', 'ru' => 'Доктор медицинских наук, профессор. Более 20 лет клинического и научно-педагогического опыта. Специалист по внутренним болезням. Автор более 150 научных статей и 5 монографий.', 'en' => 'Doctor of Medical Sciences, Professor. Over 20 years of clinical and scientific-pedagogical experience. Specialist in internal medicine. Author of more than 150 scientific articles and 5 monographs.'],
                'phone' => '+998 76 223-40-01',
                'email' => 'direktor@ttatf.uz',
                'sort_order' => 1,
            ],
            [
                'full_name' => ['uz' => 'Tojiboyev Anvar Karimovich', 'ru' => 'Тожибоев Анвар Каримович', 'en' => 'Tojiboyev Anvar Karimovich'],
                'position' => ['uz' => 'O\'quv ishlari bo\'yicha direktor o\'rinbosari', 'ru' => 'Заместитель директора по учебной работе', 'en' => 'Deputy Director for Academic Affairs'],
                'department_id' => $rektorat->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi, dotsent. Tibbiy ta\'lim sifatini oshirish va o\'quv jarayonini takomillashtirish bo\'yicha mutaxassis. Simulyatsion ta\'lim metodologiyasi bo\'yicha xalqaro sertifikatga ega.', 'ru' => 'Кандидат медицинских наук, доцент. Специалист по повышению качества медицинского образования. Имеет международный сертификат по симуляционному обучению.', 'en' => 'Ph.D. in Medical Sciences, Associate Professor. Specialist in improving medical education quality. Holds international certificate in simulation-based education.'],
                'phone' => '+998 76 223-40-02',
                'email' => 'oquv@ttatf.uz',
                'sort_order' => 2,
            ],
            [
                'full_name' => ['uz' => 'Haydarova Nilufar Toxirovna', 'ru' => 'Хайдарова Нилуфар Тохировна', 'en' => 'Haydarova Nilufar Tokhirovna'],
                'position' => ['uz' => 'Ilmiy ishlar va innovatsiyalar bo\'yicha direktor o\'rinbosari', 'ru' => 'Заместитель директора по науке и инновациям', 'en' => 'Deputy Director for Science and Innovation'],
                'department_id' => $rektorat->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi, dotsent. Tibbiy tadqiqotlar va klinik sinovlar tashkil etish bo\'yicha katta tajribaga ega. Xalqaro grant loyihalarni boshqarish bo\'yicha mutaxassis.', 'ru' => 'Кандидат медицинских наук, доцент. Богатый опыт в организации медицинских исследований и клинических испытаний.', 'en' => 'Ph.D. in Medical Sciences, Associate Professor. Extensive experience in organizing medical research and clinical trials.'],
                'phone' => '+998 76 223-40-03',
                'email' => 'ilmiy@ttatf.uz',
                'sort_order' => 3,
            ],
            [
                'full_name' => ['uz' => 'Yusupov Botir Aliyevich', 'ru' => 'Юсупов Ботир Алиевич', 'en' => 'Yusupov Botir Aliyevich'],
                'position' => ['uz' => 'Yoshlar masalalari va ma\'naviy-ma\'rifiy ishlar bo\'yicha direktor o\'rinbosari', 'ru' => 'Заместитель директора по делам молодёжи и духовно-просветительской работе', 'en' => 'Deputy Director for Youth Affairs'],
                'department_id' => $rektorat->id,
                'bio' => ['uz' => 'Pedagogika fanlari nomzodi. Yoshlar siyosati, tibbiy etika va deontologiya bo\'yicha faol ishlab kelmoqda. Volontyorlik harakatlarini tashkil etish bo\'yicha tajribali.', 'ru' => 'Кандидат педагогических наук. Активно работает в области молодёжной политики, медицинской этики и деонтологии.', 'en' => 'Ph.D. in Pedagogy. Actively works in youth policy, medical ethics and deontology.'],
                'phone' => '+998 76 223-40-04',
                'email' => 'yoshlar@ttatf.uz',
                'sort_order' => 4,
            ],

            // === DAVOLASH ISHI KAFEDRASI ===
            [
                'full_name' => ['uz' => 'Tursunov Bobur Kamoliddinovich', 'ru' => 'Турсунов Бобур Камолиддинович', 'en' => 'Tursunov Bobur Kamoliddinovich'],
                'position' => ['uz' => 'Kafedra mudiri, professor', 'ru' => 'Заведующий кафедрой, профессор', 'en' => 'Head of Department, Professor'],
                'department_id' => $departments[1]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari doktori, professor. Kardiologiya va ichki kasalliklar bo\'yicha 25 yillik klinik tajriba. Surxondaryo viloyat kardiologiya markazi maslahatchisi.', 'ru' => 'Доктор медицинских наук, профессор. 25 лет клинического опыта в кардиологии и внутренних болезнях. Консультант областного кардиологического центра.', 'en' => 'Doctor of Medical Sciences, Professor. 25 years of clinical experience in cardiology and internal medicine. Consultant at regional cardiology center.'],
                'phone' => '+998 76 223-45-01',
                'email' => 'b.tursunov@ttatf.uz',
                'sort_order' => 5,
            ],
            [
                'full_name' => ['uz' => 'Sultonova Madina Zafar qizi', 'ru' => 'Султонова Мадина Зафар кизи', 'en' => 'Sultonova Madina Zafar qizi'],
                'position' => ['uz' => 'Dotsent', 'ru' => 'Доцент', 'en' => 'Associate Professor'],
                'department_id' => $departments[1]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi. Endokrinologiya va gastroenterologiya sohasida tadqiqot olib boradi. Qandli diabet bo\'yicha viloyat bo\'yicha yetakchi mutaxassis.', 'ru' => 'Кандидат медицинских наук. Исследования в области эндокринологии и гастроэнтерологии. Ведущий специалист по сахарному диабету.', 'en' => 'Ph.D. in Medical Sciences. Research in endocrinology and gastroenterology. Leading specialist in diabetes.'],
                'phone' => '+998 76 223-45-11',
                'email' => 'm.sultonova@ttatf.uz',
                'sort_order' => 6,
            ],
            [
                'full_name' => ['uz' => 'Normatov Ulugbek Shavkatovich', 'ru' => 'Норматов Улугбек Шавкатович', 'en' => 'Normatov Ulugbek Shavkatovich'],
                'position' => ['uz' => 'Katta o\'qituvchi', 'ru' => 'Старший преподаватель', 'en' => 'Senior Lecturer'],
                'department_id' => $departments[1]->id,
                'bio' => ['uz' => 'Nevrologiya va psixiatriya sohasida o\'qituvchi. Klinik psixologiya bo\'yicha qo\'shimcha malakaga ega. Yosh tadqiqotchi sifatida faol.', 'ru' => 'Преподаватель в области неврологии и психиатрии. Имеет дополнительную квалификацию по клинической психологии.', 'en' => 'Lecturer in neurology and psychiatry. Has additional qualification in clinical psychology.'],
                'phone' => '+998 76 223-45-12',
                'email' => 'u.normatov@ttatf.uz',
                'sort_order' => 7,
            ],

            // === XIRURGIYA KAFEDRASI ===
            [
                'full_name' => ['uz' => 'Rahimov Jasur Toshpulatovich', 'ru' => 'Рахимов Жасур Тошпулатович', 'en' => 'Rakhimov Jasur Toshpulatovich'],
                'position' => ['uz' => 'Kafedra mudiri, professor', 'ru' => 'Заведующий кафедрой, профессор', 'en' => 'Head of Department, Professor'],
                'department_id' => $departments[2]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari doktori, professor. Laparoskopik xirurgiya, travmatologiya va ortopediya sohasida 20 yillik tajriba. 3000 dan ortiq operatsiya o\'tkazgan. 4 ta xalqaro patent egasi.', 'ru' => 'Доктор медицинских наук, профессор. 20-летний опыт в лапароскопической хирургии, травматологии и ортопедии. Провёл более 3000 операций. Обладатель 4 международных патентов.', 'en' => 'Doctor of Medical Sciences, Professor. 20 years of experience in laparoscopic surgery, traumatology and orthopedics. Performed over 3000 operations. Holder of 4 international patents.'],
                'phone' => '+998 76 223-45-02',
                'email' => 'j.rahimov@ttatf.uz',
                'sort_order' => 8,
            ],
            [
                'full_name' => ['uz' => 'Mirzayev Dostonbek Farrux o\'g\'li', 'ru' => 'Мирзаев Достонбек Фаррух угли', 'en' => 'Mirzayev Dostonbek Farrukh o\'gli'],
                'position' => ['uz' => 'Dotsent', 'ru' => 'Доцент', 'en' => 'Associate Professor'],
                'department_id' => $departments[2]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi, anesteziologiya va reanimatologiya mutaxassisi. Shoshilinch tibbiy yordam va intensiv terapiya bo\'yicha tajribali.', 'ru' => 'Кандидат медицинских наук, специалист по анестезиологии и реаниматологии. Опыт в экстренной медицинской помощи.', 'en' => 'Ph.D. in Medical Sciences, specialist in anesthesiology and resuscitation. Experienced in emergency medicine and intensive care.'],
                'phone' => '+998 76 223-45-21',
                'email' => 'd.mirzayev@ttatf.uz',
                'sort_order' => 9,
            ],
            [
                'full_name' => ['uz' => 'Azimova Gavhar Rustamovna', 'ru' => 'Азимова Гавхар Рустамовна', 'en' => 'Azimova Gavkhar Rustamovna'],
                'position' => ['uz' => 'Katta o\'qituvchi', 'ru' => 'Старший преподаватель', 'en' => 'Senior Lecturer'],
                'department_id' => $departments[2]->id,
                'bio' => ['uz' => 'Otorinolaringologiya (quloq-burun-tomoq) va oftalmologiya (ko\'z kasalliklari) bo\'yicha mutaxassis. Endoskopik diagnostika bo\'yicha malakali.', 'ru' => 'Специалист по оториноларингологии и офтальмологии. Квалификация по эндоскопической диагностике.', 'en' => 'Specialist in otorhinolaryngology and ophthalmology. Qualified in endoscopic diagnostics.'],
                'phone' => '+998 76 223-45-22',
                'email' => 'g.azimova@ttatf.uz',
                'sort_order' => 10,
            ],

            // === PEDIATRIYA KAFEDRASI ===
            [
                'full_name' => ['uz' => 'Karimov Sardor Bahodirovich', 'ru' => 'Каримов Сардор Баходирович', 'en' => 'Karimov Sardor Bakhodirovich'],
                'position' => ['uz' => 'Dotsent', 'ru' => 'Доцент', 'en' => 'Associate Professor'],
                'department_id' => $departments[3]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi. Bolalar gastroenterologiyasi va allergologiyasi sohasida tadqiqot olib boradi. Bolalar ovqatlanishi bo\'yicha seminarlar tashkil etadi.', 'ru' => 'Кандидат медицинских наук. Исследования в области детской гастроэнтерологии и аллергологии.', 'en' => 'Ph.D. in Medical Sciences. Research in pediatric gastroenterology and allergology.'],
                'phone' => '+998 76 223-45-31',
                'email' => 's.karimov@ttatf.uz',
                'sort_order' => 11,
            ],

            // === AKUSHERLIK VA GINEKOLOGIYA ===
            [
                'full_name' => ['uz' => 'Toshmatova Dilnoza Baxtiyorovna', 'ru' => 'Тошматова Дилноза Бахтиёровна', 'en' => 'Toshmatova Dilnoza Bakhtiyorovna'],
                'position' => ['uz' => 'Kafedra mudiri, professor', 'ru' => 'Заведующая кафедрой, профессор', 'en' => 'Head of Department, Professor'],
                'department_id' => $departments[4]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari doktori, professor. Perinatal tibbiyot va reproduktiv salomatlik sohasida 200 dan ortiq ilmiy ish muallifi. Viloyat perinatal markazi ilmiy maslahatchisi.', 'ru' => 'Доктор медицинских наук, профессор. Автор более 200 научных работ в области перинатальной медицины и репродуктивного здоровья.', 'en' => 'Doctor of Medical Sciences, Professor. Author of over 200 scientific works in perinatal medicine and reproductive health.'],
                'phone' => '+998 76 223-45-04',
                'email' => 'd.toshmatova@ttatf.uz',
                'sort_order' => 12,
            ],
            [
                'full_name' => ['uz' => 'Qodirov Javlon Muxammadovich', 'ru' => 'Кодиров Жавлон Мухаммадович', 'en' => 'Qodirov Javlon Mukhammadovich'],
                'position' => ['uz' => 'Dotsent', 'ru' => 'Доцент', 'en' => 'Associate Professor'],
                'department_id' => $departments[4]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi. Ginekologik endokrinologiya va ultratovush diagnostikasi sohasida tajribali. Onkologik ginekologiya bo\'yicha qo\'shimcha malaka.', 'ru' => 'Кандидат медицинских наук. Опыт в гинекологической эндокринологии и УЗ-диагностике.', 'en' => 'Ph.D. in Medical Sciences. Experienced in gynecological endocrinology and ultrasound diagnostics.'],
                'phone' => '+998 76 223-45-41',
                'email' => 'j.qodirov@ttatf.uz',
                'sort_order' => 13,
            ],

            // === ANATOMIYA KAFEDRASI ===
            [
                'full_name' => ['uz' => 'Abdullayev Nodir Komiljonovich', 'ru' => 'Абдуллаев Нодир Комилжонович', 'en' => 'Abdullayev Nodir Komiljonovich'],
                'position' => ['uz' => 'Kafedra mudiri, professor', 'ru' => 'Заведующий кафедрой, профессор', 'en' => 'Head of Department, Professor'],
                'department_id' => $departments[5]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari doktori, professor. Klinik anatomiya va topografik anatomiya sohasida tadqiqot olib boradi. Anatomik preparatlar tayyorlash bo\'yicha patentlarga ega.', 'ru' => 'Доктор медицинских наук, профессор. Исследования в области клинической и топографической анатомии. Патенты на анатомические препараты.', 'en' => 'Doctor of Medical Sciences, Professor. Research in clinical and topographic anatomy. Patents on anatomical preparations.'],
                'phone' => '+998 76 223-45-05',
                'email' => 'n.abdullayev@ttatf.uz',
                'sort_order' => 14,
            ],

            // === TIBBIY BIOLOGIYA VA FARMAKOLOGIYA ===
            [
                'full_name' => ['uz' => 'Nurullayeva Shahlo Anvarovna', 'ru' => 'Нуруллаева Шахло Анваровна', 'en' => 'Nurullayeva Shakhlo Anvarovna'],
                'position' => ['uz' => 'Kafedra mudiri, dotsent', 'ru' => 'Заведующая кафедрой, доцент', 'en' => 'Head of Department, Associate Professor'],
                'department_id' => $departments[6]->id,
                'bio' => ['uz' => 'Tibbiyot fanlari nomzodi, dotsent. Mikrobiologiya va virusologiya sohasida xalqaro sertifikatga ega. O\'simlik alkaloidlarining farmakologik xossalari bo\'yicha tadqiqotchi.', 'ru' => 'Кандидат медицинских наук, доцент. Международный сертификат по микробиологии и вирусологии. Исследователь фармакологических свойств растительных алкалоидов.', 'en' => 'Ph.D. in Medical Sciences, Associate Professor. International certificate in microbiology and virology. Researcher of pharmacological properties of plant alkaloids.'],
                'phone' => '+998 76 223-45-06',
                'email' => 'sh.nurullayeva@ttatf.uz',
                'sort_order' => 15,
            ],
            [
                'full_name' => ['uz' => 'Asanova Kamola Baxtiyor qizi', 'ru' => 'Асанова Камола Бахтиёр кизи', 'en' => 'Asanova Kamola Bakhtiyor qizi'],
                'position' => ['uz' => 'O\'qituvchi', 'ru' => 'Преподаватель', 'en' => 'Lecturer'],
                'department_id' => $departments[6]->id,
                'bio' => ['uz' => 'Bioximiya va klinik laboratoriya diagnostikasi bo\'yicha o\'qituvchi. Laboratoriya mashg\'ulotlarini tashkil etish bo\'yicha faol.', 'ru' => 'Преподаватель биохимии и клинической лабораторной диагностики.', 'en' => 'Lecturer in biochemistry and clinical laboratory diagnostics.'],
                'phone' => '+998 76 223-45-61',
                'email' => 'k.asanova@ttatf.uz',
                'sort_order' => 16,
            ],

            // === GUMANITAR FANLAR ===
            [
                'full_name' => ['uz' => 'Xolmatov Behzod Rustamovich', 'ru' => 'Холматов Бехзод Рустамович', 'en' => 'Kholmatov Bekhzod Rustamovich'],
                'position' => ['uz' => 'Kafedra mudiri, dotsent', 'ru' => 'Заведующий кафедрой, доцент', 'en' => 'Head of Department, Associate Professor'],
                'department_id' => $departments[7]->id,
                'bio' => ['uz' => 'Filologiya fanlari nomzodi, dotsent. Tibbiy terminologiya, tibbiy lotincha va tibbiyot tarixi bo\'yicha mutaxassis. Tibbiy atamalar lug\'ati muallifi.', 'ru' => 'Кандидат филологических наук, доцент. Специалист по медицинской терминологии, медицинской латыни и истории медицины. Автор словаря медицинских терминов.', 'en' => 'Ph.D. in Philology, Associate Professor. Specialist in medical terminology, medical Latin and history of medicine. Author of medical terms dictionary.'],
                'phone' => '+998 76 223-45-07',
                'email' => 'b.xolmatov@ttatf.uz',
                'sort_order' => 17,
            ],
        ];

        foreach ($staffData as $data) {
            Staff::create(array_merge($data, ['is_active' => true]));
        }

        $this->command->info('✅ 17 ta xodim yaratildi (4 rektorat + 13 kafedra)');
    }
}
