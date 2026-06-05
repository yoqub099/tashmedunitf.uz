<?php

namespace Database\Seeders;

use App\Models\News;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (News::count() > 0) {
            $this->command->info('⏭️  Yangiliklar mavjud ('.News::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $news = [
            // =============================================
            // YANGILIKLAR — 10 ta
            // =============================================
            [
                'title' => ['uz' => '2025-2026 o\'quv yili uchun qabul e\'lon qilindi', 'ru' => 'Объявлен набор на 2025-2026 учебный год', 'en' => 'Admission for 2025-2026 academic year announced'],
                'excerpt' => ['uz' => 'TTATF ga davolash ishi, pediatriya, tibbiy profilaktika va farmatsiya yo\'nalishlariga hujjat qabul qilish boshlandi.', 'ru' => 'Начат приём документов на направления лечебного дела, педиатрии, медико-профилактического дела и фармации в ТТАТФ.', 'en' => 'Document acceptance for general medicine, pediatrics, preventive medicine and pharmacy programs at TTATF has begun.'],
                'content' => ['uz' => '<h2>Qabul jarayoni</h2><p>Hurmatli abiturientlar! 2025-2026 o\'quv yili uchun Toshkent Davlat Tibbiyot Universiteti Termiz Filialiga hujjat qabul qilish boshlandi.</p><h3>Bakalavriat yo\'nalishlari:</h3><ul><li>Davolash ishi (6 yil)</li><li>Pediatriya (6 yil)</li><li>Tibbiy profilaktika ishi (5 yil)</li><li>Farmatsiya (5 yil)</li></ul><h3>Klinik ordinatura:</h3><ul><li>Ichki kasalliklar</li><li>Xirurgiya</li><li>Akusherlik va ginekologiya</li></ul><p>Hujjat topshirish muddati: 2025-yil 1-iyundan 31-iyulgacha.</p>', 'ru' => '<h2>Процесс приёма</h2><p>Уважаемые абитуриенты! Начат приём документов на 2025-2026 учебный год в Термезский филиал ТашГосМедУниверситета.</p>', 'en' => '<h2>Admission Process</h2><p>Dear applicants! Document acceptance for the 2025-2026 academic year at TTATF has begun.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => ['uz' => 'Talabalarimiz tibbiy olimpiadada g\'olib bo\'ldi', 'ru' => 'Наши студенты победили на медицинской олимпиаде', 'en' => 'Our students won at the medical olympiad'],
                'excerpt' => ['uz' => 'Davolash ishi yo\'nalishi talabalari xalqaro tibbiy olimpiadada oltin va kumush medallarni qo\'lga kiritdi.', 'ru' => 'Студенты направления лечебного дела завоевали золотую и серебряную медали на международной медицинской олимпиаде.', 'en' => 'General medicine students won gold and silver medals at international medical olympiad.'],
                'content' => ['uz' => '<h2>Muvaffaqiyat</h2><p>Bizning talabalarimiz Turkiyadagi Anqara shaharda bo\'lib o\'tgan xalqaro tibbiy olimpiadada ajoyib natijalarni ko\'rsatdi.</p><p><strong>Natijalar:</strong></p><ul><li>Oltin medal — Mirzayev Dostonbek (4-kurs, Davolash ishi) — Anatomiya</li><li>Kumush medal — Azimova Gavhar (3-kurs, Pediatriya) — Fiziologiya</li></ul><p>Talabalarimizni chin dildan tabriklaymiz!</p>', 'ru' => '<h2>Успех</h2><p>Наши студенты показали отличные результаты на международной медицинской олимпиаде в Анкаре.</p>', 'en' => '<h2>Success</h2><p>Our students showed excellent results at the international medical olympiad in Ankara.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => ['uz' => 'Yangi simulyatsion markaz ochildi', 'ru' => 'Открыт новый симуляционный центр', 'en' => 'New simulation center opened'],
                'excerpt' => ['uz' => 'Filialda zamonaviy tibbiy simulyatsion markaz ochildi. 50 dan ortiq fantom va simulyator o\'rnatildi.', 'ru' => 'В филиале открыт современный медицинский симуляционный центр. Установлено более 50 фантомов и симуляторов.', 'en' => 'Modern medical simulation center opened at the branch. Over 50 phantoms and simulators installed.'],
                'content' => ['uz' => '<h2>Simulyatsion markaz</h2><p>TTATF da eng zamonaviy tibbiy simulyatsion markaz ochildi. Markaz 1000 kv.m maydonga ega bo\'lib, 50 dan ortiq fantom va simulyatorlar bilan jihozlangan.</p><h3>Imkoniyatlar:</h3><ul><li>Anatomik fantomlar — auskultatsiya, palpatsiya mashqlari</li><li>Xirurgik simulyatorlar — laparoskopik operatsiyalar</li><li>Reanimatsion simulyator — CPR va shoshilinch yordam</li><li>Tug\'ruq simulyatori — normal va patologik tug\'ruq</li><li>Virtual reality — 3D anatomiya</li></ul><p>Markaz talabalar va ordinatorlar uchun kuniga 12 soat ochiq.</p>', 'ru' => '<h2>Симуляционный центр</h2><p>В ТТАТФ открыт современный симуляционный центр площадью 1000 кв.м.</p>', 'en' => '<h2>Simulation Center</h2><p>Modern simulation center with 1000 sq.m area opened at TTATF.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => ['uz' => 'Germaniya shifoxonalari bilan hamkorlik shartnomasi imzolandi', 'ru' => 'Подписан договор о сотрудничестве с больницами Германии', 'en' => 'Cooperation agreement signed with German hospitals'],
                'excerpt' => ['uz' => 'TTATF Germaniyaning Charite universiteti shifoxonasi bilan hamkorlik shartnomasi imzoladi.', 'ru' => 'ТТАТФ подписал договор о сотрудничестве с университетской клиникой Charité в Германии.', 'en' => 'TTATF signed cooperation agreement with Charité University Hospital in Germany.'],
                'content' => ['uz' => '<h2>Xalqaro hamkorlik</h2><p>Toshkent Davlat Tibbiyot Universiteti Termiz Filiali Germaniyaning mashhur Charite universiteti shifoxonasi bilan hamkorlik shartnomasi imzoladi.</p><h3>Hamkorlik yo\'nalishlari:</h3><ul><li>Talabalar va ordinatorlar almashinuvi</li><li>Professor-o\'qituvchilar staj oshirishi</li><li>Qo\'shma ilmiy tadqiqotlar</li><li>Telemediitsina loyihalari</li></ul>', 'ru' => '<h2>Международное сотрудничество</h2><p>ТТАТФ подписал договор с клиникой Charité в Берлине.</p>', 'en' => '<h2>International Cooperation</h2><p>TTATF signed agreement with Charité Hospital in Berlin.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => ['uz' => 'Professor Rahimov xalqaro jurnalda maqola chop etdi', 'ru' => 'Профессор Рахимов опубликовал статью в международном журнале', 'en' => 'Professor Rakhimov published article in international journal'],
                'excerpt' => ['uz' => 'Xirurgiya kafedrasi mudiri prof. Rahimov J.T.ning maqolasi The Lancet jurnalida chop etildi.', 'ru' => 'Статья зав. кафедрой хирургии проф. Рахимова Ж.Т. опубликована в журнале The Lancet.', 'en' => 'Article by Surgery Department head Prof. Rakhimov published in The Lancet journal.'],
                'content' => ['uz' => '<h2>Ilmiy muvaffaqiyat</h2><p>Xirurgiya kafedrasi mudiri, professor Rahimov Jasur Toshpulatovich ning "Minimal Invasive Surgical Approaches in Central Asian Clinical Practice" nomli maqolasi The Lancet Regional Health jurnalida chop etildi.</p><p>Maqola Markaziy Osiyo mamlakatlarida minimal invaziv xirurgiyaning joriy etilishi tajribasini tahlil qiladi.</p>', 'ru' => '<h2>Научный успех</h2><p>Статья профессора Рахимова опубликована в The Lancet Regional Health.</p>', 'en' => '<h2>Scientific Achievement</h2><p>Professor Rakhimov\'s article published in The Lancet Regional Health.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(10),
            ],
            [
                'title' => ['uz' => 'Yangi o\'quv yili boshlanishi munosabati bilan tantanali yig\'ilish', 'ru' => 'Торжественное собрание по случаю начала нового учебного года', 'en' => 'Ceremonial gathering for the new academic year'],
                'excerpt' => ['uz' => '2025-2026 o\'quv yili boshlanishi munosabati bilan filialda tantanali yig\'ilish o\'tkazildi.', 'ru' => 'В филиале состоялось торжественное собрание по случаю начала 2025-2026 учебного года.', 'en' => 'Ceremonial gathering held at the branch for the 2025-2026 academic year.'],
                'content' => ['uz' => '<h2>Tantanali yig\'ilish</h2><p>2025-2026 o\'quv yili boshlanishi munosabati bilan TTATF da tantanali yig\'ilish o\'tkazildi. Tadbirda filial direktori Murodov Sh.D., professor-o\'qituvchilar va talabalar ishtirok etdi.</p><p>Yangi o\'quv yilida 350 nafar birinchi kurs talabasi qabul qilindi.</p>', 'ru' => '<h2>Торжественное собрание</h2><p>Состоялось торжественное собрание по случаю начала нового учебного года. Принято 350 первокурсников.</p>', 'en' => '<h2>Ceremonial Gathering</h2><p>Ceremonial gathering was held for the new academic year. 350 freshmen admitted.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(14),
            ],
            [
                'title' => ['uz' => 'Farmatsiya fakulteti akkreditatsiyadan muvaffaqiyatli o\'tdi', 'ru' => 'Фармацевтический факультет успешно прошёл аккредитацию', 'en' => 'Pharmacy faculty successfully passed accreditation'],
                'excerpt' => ['uz' => 'Farmatsiya yo\'nalishi xalqaro akkreditatsiya komissiyasi tomonidan yuqori baho oldi.', 'ru' => 'Направление фармации получило высокую оценку международной аккредитационной комиссии.', 'en' => 'Pharmacy program received high marks from international accreditation commission.'],
                'content' => ['uz' => '<h2>Akkreditatsiya natijalari</h2><p>TTATF ning Farmatsiya yo\'nalishi xalqaro akkreditatsiya komissiyasi tomonidan tekshirildi va yuqori baho oldi.</p><h3>Baholangan sohalar:</h3><ul><li>O\'quv dasturi va o\'quv rejasi</li><li>Professor-o\'qituvchilar tarkibi</li><li>Laboratoriya jihozlari</li><li>Ilmiy-tadqiqot faoliyati</li><li>Bitiruvchilar bandligi</li></ul><p>Akkreditatsiya 5 yil muddatga berildi.</p>', 'ru' => '<h2>Результаты аккредитации</h2><p>Направление фармации ТТАТФ получило высокую оценку и 5-летнюю аккредитацию.</p>', 'en' => '<h2>Accreditation Results</h2><p>TTATF Pharmacy program received 5-year accreditation with high marks.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(18),
            ],
            [
                'title' => ['uz' => 'Tibbiyot tarixi muzeyiga yangi eksponatlar qo\'shildi', 'ru' => 'В музей истории медицины добавлены новые экспонаты', 'en' => 'New exhibits added to medical history museum'],
                'excerpt' => ['uz' => 'TTATF tibbiyot tarixi muzeyiga XVIII-XIX asrlarga oid noyob tibbiy asboblar qo\'shildi.', 'ru' => 'В музей истории медицины ТТАТФ добавлены уникальные медицинские инструменты XVIII-XIX веков.', 'en' => 'Unique medical instruments from 18th-19th centuries added to TTATF medical history museum.'],
                'content' => ['uz' => '<h2>Muzey yangiliklari</h2><p>TTATF tibbiyot tarixi muzeyiga Surxondaryo viloyatidan topilgan XVIII-XIX asrlarga oid noyob tibbiy asboblar va qo\'lyozmalar qo\'shildi.</p><h3>Yangi eksponatlar:</h3><ul><li>Ibn Sino davriga oid tibbiy asboblar nusxalari</li><li>XIX asr jarrohlik asboblari</li><li>Qadimiy dorivor o\'simliklar atlasi</li><li>Termiz shahridan topilgan tibbiy yozuvlar</li></ul><p>Muzey har kuni soat 9:00 dan 17:00 gacha ochiq. Kirish bepul.</p>', 'ru' => '<h2>Новости музея</h2><p>В музей добавлены уникальные экспонаты XVIII-XIX веков из Сурхандарьинской области.</p>', 'en' => '<h2>Museum News</h2><p>Unique 18th-19th century exhibits from Surkhandarya region added to the museum.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(22),
            ],
            [
                'title' => ['uz' => 'TTATF rektorati yangi strategik reja qabul qildi', 'ru' => 'Ректорат ТТАТФ принял новый стратегический план', 'en' => 'TTATF administration adopted new strategic plan'],
                'excerpt' => ['uz' => '2026-2030 yillar uchun filialning yangi strategik rivojlanish rejasi tasdiqlandi.', 'ru' => 'Утверждён новый стратегический план развития филиала на 2026-2030 годы.', 'en' => 'New strategic development plan for the branch for 2026-2030 approved.'],
                'content' => ['uz' => '<h2>Strategik reja</h2><p>TTATF rahbariyati 2026-2030 yillar uchun yangi strategik rivojlanish rejasini tasdiqladi.</p><h3>Asosiy yo\'nalishlar:</h3><ul><li>Yangi fakultetlar ochish (Stomatologiya, Tibbiy biologiya)</li><li>Xalqaro hamkorlikni kengaytirish</li><li>Ilmiy-tadqiqot markazlari tashkil etish</li><li>Raqamli tibbiyot texnologiyalarini joriy etish</li><li>Talabalar turar joyini kengaytirish</li></ul>', 'ru' => '<h2>Стратегический план</h2><p>Утверждён стратегический план развития ТТАТФ на 2026-2030 годы.</p>', 'en' => '<h2>Strategic Plan</h2><p>Strategic development plan for TTATF for 2026-2030 approved.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(26),
            ],
            [
                'title' => ['uz' => 'Talabalar sport musobaqalarida muvaffaqiyat qozondi', 'ru' => 'Студенты добились успехов на спортивных соревнованиях', 'en' => 'Students achieved success at sports competitions'],
                'excerpt' => ['uz' => 'TTATF talabalari respublika tibbiyot universitetlari o\'rtasidagi sport musobaqasida 3 ta oltin medal qo\'lga kiritdi.', 'ru' => 'Студенты ТТАТФ завоевали 3 золотые медали на спортивных соревнованиях среди медицинских вузов республики.', 'en' => 'TTATF students won 3 gold medals at sports competition among medical universities.'],
                'content' => ['uz' => '<h2>Sport muvaffaqiyatlari</h2><p>Toshkent shahrida bo\'lib o\'tgan respublika tibbiyot universitetlari o\'rtasidagi sport musobaqasida TTATF talabalari ajoyib natijalar ko\'rsatdi.</p><h3>Natijalar:</h3><ul><li>Oltin — Futbol jamoasi</li><li>Oltin — Boks (Xasanov Bobur, 75 kg)</li><li>Oltin — Yengil atletika (Toshmatova Dilnoza, 100m)</li><li>Kumush — Voleybol jamoasi</li><li>Bronza — Kurash (Normatov Sardor, 90 kg)</li></ul>', 'ru' => '<h2>Спортивные достижения</h2><p>Студенты ТТАТФ показали отличные результаты на республиканских соревнованиях.</p>', 'en' => '<h2>Sports Achievements</h2><p>TTATF students showed excellent results at national competitions.</p>'],
                'category' => 'yangiliklar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(30),
            ],

            // =============================================
            // KONFERENSIYALAR — 10 ta
            // =============================================
            [
                'title' => ['uz' => 'Xalqaro tibbiy konferensiya muvaffaqiyatli o\'tkazildi', 'ru' => 'Международная медицинская конференция успешно проведена', 'en' => 'International medical conference successfully held'],
                'excerpt' => ['uz' => '12 ta mamlakatdan 180 dan ortiq shifokor va olim ishtirok etgan xalqaro tibbiy konferensiya o\'tkazildi.', 'ru' => 'Проведена международная медицинская конференция с участием более 180 врачей и учёных из 12 стран.', 'en' => 'International medical conference held with over 180 doctors and scientists from 12 countries.'],
                'content' => ['uz' => '<h2>Konferensiya natijalari</h2><p>TTATF da "Zamonaviy tibbiyot: diagnostika va davolashning yangi usullari" mavzusidagi xalqaro ilmiy-amaliy konferensiya muvaffaqiyatli yakunlandi.</p><p>Konferensiyada 12 ta mamlakatdan 180 dan ortiq shifokor va olim ishtirok etdi. 70 ta ilmiy ma\'ruza eshitildi.</p><h3>Asosiy yo\'nalishlar:</h3><ul><li>Zamonaviy kardiologiya va kardioxirurgiya</li><li>Minimal invaziv xirurgiya</li><li>Neyroilmlar va psixiatriya</li><li>Onkologiyaning yangi usullari</li></ul>', 'ru' => '<h2>Итоги конференции</h2><p>В ТТАТФ успешно завершилась международная медицинская конференция.</p>', 'en' => '<h2>Conference Results</h2><p>International medical conference successfully concluded at TTATF.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => ['uz' => '«Pediatriyada zamonaviy yondashuvlar» ilmiy konferensiyasi', 'ru' => 'Научная конференция «Современные подходы в педиатрии»', 'en' => '"Modern Approaches in Pediatrics" scientific conference'],
                'excerpt' => ['uz' => 'Pediatriya kafedrasi tashabbusi bilan respublika miqyosidagi ilmiy konferensiya o\'tkazildi.', 'ru' => 'По инициативе кафедры педиатрии проведена республиканская научная конференция.', 'en' => 'Republican scientific conference held on initiative of Pediatrics Department.'],
                'content' => ['uz' => '<h2>Konferensiya</h2><p>TTATF Pediatriya kafedrasi tashabbusi bilan "Pediatriyada zamonaviy yondashuvlar" mavzusida respublika miqyosidagi ilmiy-amaliy konferensiya o\'tkazildi.</p><h3>Muhokama qilingan mavzular:</h3><ul><li>Yangi tug\'ilgan chaqaloqlar reanimatsiyasi</li><li>Bolalar allergologiyasi</li><li>Pediatrik endokrinologiya</li><li>Bolalarda immunoprofilaktika</li></ul><p>Konferensiyada 45 ta ilmiy ma\'ruza eshitildi. 8 ta viloyatdan 120 dan ortiq shifokor ishtirok etdi.</p>', 'ru' => '<h2>Конференция</h2><p>Проведена республиканская конференция по современным подходам в педиатрии.</p>', 'en' => '<h2>Conference</h2><p>Republican conference on modern approaches in pediatrics was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => ['uz' => 'Farmakologiya va dori vositalari bo\'yicha xalqaro simpozium', 'ru' => 'Международный симпозиум по фармакологии и лекарственным средствам', 'en' => 'International symposium on pharmacology and medications'],
                'excerpt' => ['uz' => 'Farmatsiya yo\'nalishi tomonidan dori vositalari xavfsizligi bo\'yicha xalqaro simpozium tashkil etildi.', 'ru' => 'Направлением фармации организован международный симпозиум по безопасности лекарственных средств.', 'en' => 'International symposium on drug safety organized by Pharmacy Department.'],
                'content' => ['uz' => '<h2>Xalqaro simpozium</h2><p>TTATF Farmatsiya yo\'nalishi tomonidan "Dori vositalari xavfsizligi va farmakonazorат" mavzusidagi xalqaro simpozium o\'tkazildi.</p><h3>Ishtirokchilar:</h3><ul><li>O\'zbekiston — 50 ta delegat</li><li>Rossiya — 15 ta delegat</li><li>Qozog\'iston — 10 ta delegat</li><li>Turkiya — 8 ta delegat</li><li>Hindiston — 5 ta delegat</li></ul><p>Simpoziumda 30 ta ilmiy ma\'ruza va 15 ta poster taqdimoti bo\'ldi.</p>', 'ru' => '<h2>Международный симпозиум</h2><p>Проведён международный симпозиум по безопасности лекарственных средств.</p>', 'en' => '<h2>International Symposium</h2><p>International symposium on drug safety and pharmacovigilance was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(9),
            ],
            [
                'title' => ['uz' => 'Xirurgiya sohasida innovatsion texnologiyalar konferensiyasi', 'ru' => 'Конференция по инновационным технологиям в хирургии', 'en' => 'Conference on innovative technologies in surgery'],
                'excerpt' => ['uz' => 'Xirurgiya kafedrasi tomonidan robototexnika va minimal invaziv jarrohlik bo\'yicha konferensiya o\'tkazildi.', 'ru' => 'Кафедрой хирургии проведена конференция по робототехнике и минимально инвазивной хирургии.', 'en' => 'Conference on robotics and minimally invasive surgery held by Surgery Department.'],
                'content' => ['uz' => '<h2>Xirurgik innovatsiyalar</h2><p>TTATF Xirurgiya kafedrasi "Xirurgiyada innovatsion texnologiyalar: robototexnika va AI" mavzusida konferensiya o\'tkazdi.</p><h3>Dastur:</h3><ul><li>Robototexnikali xirurgiya — Prof. Schmidt (Germaniya)</li><li>AI diagnostikada — Dr. Tanaka (Yaponiya)</li><li>3D bioprinting — Prof. Karimov (Toshkent)</li><li>Laparoskopik texnikalar — Dr. Nazarov (TTATF)</li></ul><p>Jonli translatsiya orqali 500 dan ortiq shifokor kuzatdi.</p>', 'ru' => '<h2>Хирургические инновации</h2><p>Проведена конференция по инновационным технологиям в хирургии.</p>', 'en' => '<h2>Surgical Innovations</h2><p>Conference on innovative technologies in surgery was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(13),
            ],
            [
                'title' => ['uz' => 'Ichki kasalliklar bo\'yicha respublika ilmiy anjumani', 'ru' => 'Республиканский научный форум по внутренним болезням', 'en' => 'Republican scientific forum on internal medicine'],
                'excerpt' => ['uz' => 'Ichki kasalliklar kafedrasi "Surunkali kasalliklarni boshqarish" mavzusida respublika anjumani o\'tkazdi.', 'ru' => 'Кафедра внутренних болезней провела республиканский форум на тему «Управление хроническими заболеваниями».', 'en' => 'Internal Medicine Department held republican forum on chronic disease management.'],
                'content' => ['uz' => '<h2>Ilmiy anjuman</h2><p>TTATF Ichki kasalliklar kafedrasi "Surunkali kasalliklarni boshqarish: zamonaviy protokollar" mavzusida respublika ilmiy anjumani o\'tkazdi.</p><h3>Asosiy mavzular:</h3><ul><li>Qandli diabet 2-tur — yangi davolash protokollari</li><li>Arterial gipertoniya — maqsadli davolash</li><li>Surunkali yurak yetishmovchiligi</li><li>Metabolik sindrom va semirish</li></ul><p>14 ta viloyatdan 200 dan ortiq shifokor ishtirok etdi.</p>', 'ru' => '<h2>Научный форум</h2><p>Проведён республиканский форум по управлению хроническими заболеваниями.</p>', 'en' => '<h2>Scientific Forum</h2><p>Republican forum on chronic disease management was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(16),
            ],
            [
                'title' => ['uz' => 'Tibbiy ta\'limda raqamlashtirish konferensiyasi', 'ru' => 'Конференция по цифровизации медицинского образования', 'en' => 'Conference on digitalization of medical education'],
                'excerpt' => ['uz' => 'Tibbiy ta\'limda sun\'iy intellekt va raqamli texnologiyalar qo\'llanilishi bo\'yicha konferensiya bo\'lib o\'tdi.', 'ru' => 'Состоялась конференция по применению ИИ и цифровых технологий в медицинском образовании.', 'en' => 'Conference on AI and digital technology application in medical education held.'],
                'content' => ['uz' => '<h2>Raqamlashtirish</h2><p>TTATF da "Tibbiy ta\'limda raqamlashtirish: AI, VR va telemediitsina" mavzusida xalqaro konferensiya o\'tkazildi.</p><h3>Taqdimotlar:</h3><ul><li>AI anatomiya darslarida — virtual preparat</li><li>VR simulyatsiya — virtual operatsiya xonasi</li><li>Telemediitsina — masofaviy konsultatsiya</li><li>Elektron darsliklar va LMS tizimlari</li></ul><p>6 ta mamlakatdan 90 ta ishtirokchi qatnashdi.</p>', 'ru' => '<h2>Цифровизация</h2><p>Проведена международная конференция по цифровизации медицинского образования.</p>', 'en' => '<h2>Digitalization</h2><p>International conference on digitalization of medical education was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(20),
            ],
            [
                'title' => ['uz' => 'Akusherlik va ginekologiya bo\'yicha mintaqaviy konferensiya', 'ru' => 'Региональная конференция по акушерству и гинекологии', 'en' => 'Regional conference on obstetrics and gynecology'],
                'excerpt' => ['uz' => 'Surxondaryo viloyati shifokorlari uchun akusherlik va ginekologiya bo\'yicha mintaqaviy konferensiya tashkil etildi.', 'ru' => 'Для врачей Сурхандарьинской области организована региональная конференция по акушерству и гинекологии.', 'en' => 'Regional conference on obstetrics and gynecology organized for Surkhandarya doctors.'],
                'content' => ['uz' => '<h2>Mintaqaviy konferensiya</h2><p>TTATF Akusherlik va ginekologiya kafedrasi Surxondaryo viloyati amaliy shifokorlari uchun mintaqaviy konferensiya tashkil etdi.</p><h3>Mavzular:</h3><ul><li>Xavfli homiladorlikni boshqarish</li><li>Perinatal diagnostika</li><li>Ginekologik laparoskopiya</li><li>Reproduktiv texnologiyalar</li></ul><p>Viloyatning 13 ta tumanidan 150 ta shifokor ishtirok etdi.</p>', 'ru' => '<h2>Региональная конференция</h2><p>Проведена региональная конференция по акушерству и гинекологии для практических врачей.</p>', 'en' => '<h2>Regional Conference</h2><p>Regional conference on obstetrics and gynecology for practicing doctors was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(24),
            ],
            [
                'title' => ['uz' => 'Epidemiologiya va infektsion kasalliklar bo\'yicha forum', 'ru' => 'Форум по эпидемиологии и инфекционным заболеваниям', 'en' => 'Forum on epidemiology and infectious diseases'],
                'excerpt' => ['uz' => 'Epidemiologiya va pandemiyaga tayyorgarlik bo\'yicha mintaqaviy forum o\'tkazildi.', 'ru' => 'Проведён региональный форум по эпидемиологии и готовности к пандемии.', 'en' => 'Regional forum on epidemiology and pandemic preparedness held.'],
                'content' => ['uz' => '<h2>Epidemiologiya forumi</h2><p>TTATF da "Epidemiologiya va pandemiyaga tayyorgarlik: o\'tmish saboqlari va kelajak strategiyalari" mavzusida mintaqaviy forum o\'tkazildi.</p><h3>Muhokama qilingan masalalar:</h3><ul><li>COVID-19 pandemiyasi saboqlari</li><li>Yangi infektsiyalarga javob strategiyasi</li><li>Vaksinatsiya dasturlari samaradorligi</li><li>Mintaqaviy epidemiologik monitoring</li></ul>', 'ru' => '<h2>Форум по эпидемиологии</h2><p>Проведён региональный форум по эпидемиологии и подготовке к пандемиям.</p>', 'en' => '<h2>Epidemiology Forum</h2><p>Regional forum on epidemiology and pandemic preparedness was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(27),
            ],
            [
                'title' => ['uz' => 'Stomatologiya va jag\'-yuz xirurgiyasi bo\'yicha simpozium', 'ru' => 'Симпозиум по стоматологии и челюстно-лицевой хирургии', 'en' => 'Symposium on dentistry and maxillofacial surgery'],
                'excerpt' => ['uz' => 'Stomatologiya va jag\'-yuz xirurgiyasi bo\'yicha birinchi mintaqaviy simpozium o\'tkazildi.', 'ru' => 'Проведён первый региональный симпозиум по стоматологии и челюстно-лицевой хирургии.', 'en' => 'First regional symposium on dentistry and maxillofacial surgery held.'],
                'content' => ['uz' => '<h2>Stomatologiya simpozium</h2><p>TTATF da stomatologiya va jag\'-yuz xirurgiyasi bo\'yicha birinchi mintaqaviy simpozium muvaffaqiyatli o\'tkazildi.</p><h3>Sessiyalar:</h3><ul><li>Implantologiya — zamonaviy usullar</li><li>Ortodontiya — raqamli rejalashtirish</li><li>Jag\'-yuz xirurgiyasi — rekonstruktiv operatsiyalar</li><li>Bolalar stomatologiyasi</li></ul><p>Simpoziumda 5 ta mamlakatdan 70 ta mutaxassis ishtirok etdi.</p>', 'ru' => '<h2>Симпозиум по стоматологии</h2><p>Проведён первый региональный симпозиум по стоматологии и ЧЛХ.</p>', 'en' => '<h2>Dentistry Symposium</h2><p>First regional symposium on dentistry and maxillofacial surgery was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(32),
            ],
            [
                'title' => ['uz' => 'Onkologiya sohasida ilmiy-amaliy konferensiya', 'ru' => 'Научно-практическая конференция в области онкологии', 'en' => 'Scientific-practical conference in oncology'],
                'excerpt' => ['uz' => 'Onkologiya sohasidagi so\'nggi yutuqlar va davolash usullari muhokama qilindi.', 'ru' => 'Обсуждены последние достижения и методы лечения в области онкологии.', 'en' => 'Latest achievements and treatment methods in oncology discussed.'],
                'content' => ['uz' => '<h2>Onkologiya konferensiyasi</h2><p>TTATF da "Onkologiya: erta diagnostika va maqsadli terapiya" mavzusida ilmiy-amaliy konferensiya o\'tkazildi.</p><h3>Ma\'ruzalar:</h3><ul><li>Saraton kasalliklarining erta diagnostikasi</li><li>Immunoterapiya — yangi dorilar</li><li>Maqsadli (targeted) terapiya</li><li>Palliativ yordam tashkil etish</li><li>Onkologik skrining dasturlari</li></ul><p>Konferensiyada 100 dan ortiq onkolog shifokor ishtirok etdi.</p>', 'ru' => '<h2>Конференция по онкологии</h2><p>Проведена научно-практическая конференция по ранней диагностике и таргетной терапии в онкологии.</p>', 'en' => '<h2>Oncology Conference</h2><p>Scientific-practical conference on early diagnostics and targeted therapy in oncology was held.</p>'],
                'category' => 'konferensiyalar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(35),
            ],

            // =============================================
            // TADBIRLAR — 10 ta
            // =============================================
            [
                'title' => ['uz' => 'Ochiq eshiklar kuni — 2026-yil 15-mart', 'ru' => 'День открытых дверей — 15 марта 2026 года', 'en' => 'Open Day — March 15, 2026'],
                'excerpt' => ['uz' => 'Hurmatli abiturientlar va ota-onalar! Sizlarni TTATF ning ochiq eshiklar kuniga taklif etamiz.', 'ru' => 'Уважаемые абитуриенты и родители! Приглашаем вас на день открытых дверей ТТАТФ.', 'en' => 'Dear applicants and parents! We invite you to TTATF Open Day.'],
                'content' => ['uz' => '<h2>Ochiq eshiklar kuni</h2><p>2026-yil 15-mart kuni soat 10:00 da TTATF da ochiq eshiklar kuni o\'tkaziladi.</p><h3>Dastur:</h3><ul><li>Filial haqida taqdimot</li><li>Kafedralar va laboratoriyalar bilan tanishish</li><li>Simulyatsion markaz ekskursiyasi</li><li>Anatomik muzey ziyorati</li><li>Tibbiy ko\'rik (bepul)</li><li>Talabalar turar joyi</li><li>Savollar va javoblar sessiyasi</li></ul><p>Manzil: Termiz shahri</p>', 'ru' => '<h2>День открытых дверей</h2><p>15 марта 2026 года в 10:00 состоится день открытых дверей ТТАТФ.</p>', 'en' => '<h2>Open Day</h2><p>Open Day will be held on March 15, 2026 at 10:00 AM.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => ['uz' => 'Bepul tibbiy ko\'rik aksiyasi o\'tkazildi', 'ru' => 'Проведена акция бесплатного медосмотра', 'en' => 'Free medical screening campaign conducted'],
                'excerpt' => ['uz' => 'TTATF talabalari va professor-o\'qituvchilari Termiz shahri aholisi uchun bepul tibbiy ko\'rik o\'tkazdi.', 'ru' => 'Студенты и преподаватели ТТАТФ провели бесплатный медосмотр для жителей города Термез.', 'en' => 'TTATF students and faculty conducted free medical screening for Termez residents.'],
                'content' => ['uz' => '<h2>Bepul tibbiy ko\'rik</h2><p>TTATF jamoasi Surxondaryo viloyati aholisi uchun keng ko\'lamli bepul tibbiy ko\'rik aksiyasi o\'tkazdi. Aksiyada 500 dan ortiq kishi tekshiruvdan o\'tdi.</p><h3>Ko\'rik turlari:</h3><ul><li>Umumiy terapevtik ko\'rik</li><li>Qon bosimi o\'lchash</li><li>Qandli diabet skriningi</li><li>Elektrokardiografiya (EKG)</li><li>Ko\'z tekshiruvi</li></ul>', 'ru' => '<h2>Бесплатный медосмотр</h2><p>Коллектив ТТАТФ провёл масштабную акцию бесплатного медосмотра.</p>', 'en' => '<h2>Free Medical Screening</h2><p>TTATF team conducted large-scale free medical screening campaign.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(4),
            ],
            [
                'title' => ['uz' => 'Talabalar orasida «Eng yaxshi shifokor» tanlovi', 'ru' => 'Конкурс «Лучший врач» среди студентов', 'en' => '"Best Doctor" competition among students'],
                'excerpt' => ['uz' => 'TTATF da an\'anaviy «Eng yaxshi shifokor» ko\'rik-tanlovi bo\'lib o\'tdi.', 'ru' => 'В ТТАТФ прошёл традиционный конкурс-смотр «Лучший врач».', 'en' => 'Traditional "Best Doctor" competition was held at TTATF.'],
                'content' => ['uz' => '<h2>Tanlov natijalari</h2><p>TTATF da har yili o\'tkaziladigan «Eng yaxshi shifokor» ko\'rik-tanlovi bo\'lib o\'tdi. Talabalar klinik vaziyatlar, simulyatsion imtihon va nazariy bilimlar bo\'yicha sinovdan o\'tdilar.</p><h3>G\'oliblar:</h3><ul><li>1-o\'rin — Abdullayev Sardor (5-kurs, Davolash ishi)</li><li>2-o\'rin — Karimova Malika (4-kurs, Pediatriya)</li><li>3-o\'rin — Toshmatova Zulayho (5-kurs, Davolash ishi)</li></ul>', 'ru' => '<h2>Итоги конкурса</h2><p>Состоялся ежегодный конкурс «Лучший врач» среди студентов.</p>', 'en' => '<h2>Competition Results</h2><p>Annual "Best Doctor" competition was held among students.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(8),
            ],
            [
                'title' => ['uz' => 'Tibbiyot xodimlari kuni tantanali nishonlandi', 'ru' => 'Торжественно отмечен День медицинского работника', 'en' => 'Medical Workers Day ceremonially celebrated'],
                'excerpt' => ['uz' => 'Tibbiyot xodimlari kuni munosabati bilan filialda tantanali tadbir o\'tkazildi.', 'ru' => 'В честь Дня медицинского работника в филиале проведено торжественное мероприятие.', 'en' => 'Ceremonial event held at the branch in honor of Medical Workers Day.'],
                'content' => ['uz' => '<h2>Tibbiyot xodimlari kuni</h2><p>Har yili dekabr oyida nishonlanadigan Tibbiyot xodimlari kuni munosabati bilan TTATF da tantanali tadbir bo\'lib o\'tdi.</p><h3>Tadbir dasturi:</h3><ul><li>Filial direktori tabrigi</li><li>Faxriy yorliqlar topshirish</li><li>Eng yaxshi professor va o\'qituvchilarni taqdirlash</li><li>Madaniy konsert dasturi</li><li>Bayram ziyofati</li></ul><p>25 nafar professor-o\'qituvchi faxriy yorliq bilan taqdirlandi.</p>', 'ru' => '<h2>День медработника</h2><p>Проведено торжественное мероприятие в честь Дня медицинского работника.</p>', 'en' => '<h2>Medical Workers Day</h2><p>Ceremonial event held in honor of Medical Workers Day.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(11),
            ],
            [
                'title' => ['uz' => 'Qon topshirish aksiyasi — «Hayot uchun bir tomchi»', 'ru' => 'Акция сдачи крови — «Капля ради жизни»', 'en' => 'Blood donation campaign — "A Drop for Life"'],
                'excerpt' => ['uz' => 'TTATF talabalari va xodimlari «Hayot uchun bir tomchi» shiori ostida qon topshirish aksiyasida ishtirok etdi.', 'ru' => 'Студенты и сотрудники ТТАТФ приняли участие в акции сдачи крови под лозунгом «Капля ради жизни».', 'en' => 'TTATF students and staff participated in blood donation campaign "A Drop for Life".'],
                'content' => ['uz' => '<h2>Qon topshirish aksiyasi</h2><p>TTATF da «Hayot uchun bir tomchi» shiori ostida qon topshirish aksiyasi o\'tkazildi.</p><h3>Natijalar:</h3><ul><li>Jami 200 dan ortiq talaba va xodim ishtirok etdi</li><li>85 litr qon yig\'ildi</li><li>Barcha donorlar sog\'liq tekshiruvidan o\'tdi</li><li>Har bir donorga esdalik sovg\'a berildi</li></ul><p>Aksiya Surxondaryo viloyat qon quyish markazi bilan hamkorlikda tashkil etildi.</p>', 'ru' => '<h2>Акция сдачи крови</h2><p>Проведена акция сдачи крови. Собрано 85 литров крови от 200+ доноров.</p>', 'en' => '<h2>Blood Donation Campaign</h2><p>85 liters of blood collected from 200+ donors.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(15),
            ],
            [
                'title' => ['uz' => 'Bitiruvchilar tantanali kechasi — 2025-yil', 'ru' => 'Торжественный выпускной вечер — 2025 год', 'en' => 'Graduation ceremony — 2025'],
                'excerpt' => ['uz' => '2025-yil bitiruvchilari uchun tantanali kecha o\'tkazildi. 120 nafar bitiruvchi diplom oldi.', 'ru' => 'Проведён торжественный выпускной вечер для выпускников 2025 года. 120 выпускников получили дипломы.', 'en' => 'Graduation ceremony held for 2025 graduates. 120 graduates received diplomas.'],
                'content' => ['uz' => '<h2>Bitiruvchilar kechasi</h2><p>TTATF da 2025-yil bitiruvchilari uchun tantanali kecha bo\'lib o\'tdi.</p><h3>Statistika:</h3><ul><li>Davolash ishi — 60 nafar bitiruvchi</li><li>Pediatriya — 30 nafar bitiruvchi</li><li>Tibbiy profilaktika — 15 nafar bitiruvchi</li><li>Farmatsiya — 15 nafar bitiruvchi</li></ul><p>5 nafar bitiruvchi imtiyozli diplom bilan tamomladi. Eng yaxshi bitiruvchilarga O\'zbekiston Respublikasi Sog\'liqni saqlash vazirligi faxriy yorlig\'i berildi.</p>', 'ru' => '<h2>Выпускной вечер</h2><p>Проведён выпускной вечер для 120 выпускников 2025 года.</p>', 'en' => '<h2>Graduation Ceremony</h2><p>Graduation ceremony held for 120 graduates of 2025.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(19),
            ],
            [
                'title' => ['uz' => 'Ekologiya va sog\'lom turmush tarzi festivali', 'ru' => 'Фестиваль экологии и здорового образа жизни', 'en' => 'Ecology and healthy lifestyle festival'],
                'excerpt' => ['uz' => 'TTATF da ekologiya va sog\'lom turmush tarziga bag\'ishlangan festival o\'tkazildi.', 'ru' => 'В ТТАТФ проведён фестиваль, посвящённый экологии и здоровому образу жизни.', 'en' => 'Festival dedicated to ecology and healthy lifestyle held at TTATF.'],
                'content' => ['uz' => '<h2>Ekologiya festivali</h2><p>TTATF da "Sog\'lom muhit — sog\'lom inson" shiori ostida ekologiya va sog\'lom turmush tarzi festivali o\'tkazildi.</p><h3>Tadbirlar:</h3><ul><li>Daraxt ekish aksiyasi — 500 ta ko\'chat</li><li>Sog\'lom ovqatlanish master-klassi</li><li>Yoga va meditatsiya mashg\'ulotlari</li><li>Ekologik rasm tanlovi</li><li>Sport estafetasi</li></ul><p>Tadbirda 800 dan ortiq talaba ishtirok etdi.</p>', 'ru' => '<h2>Фестиваль экологии</h2><p>Проведён фестиваль экологии и здорового образа жизни с участием 800+ студентов.</p>', 'en' => '<h2>Ecology Festival</h2><p>Ecology and healthy lifestyle festival held with 800+ students participating.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(23),
            ],
            [
                'title' => ['uz' => 'Ilmiy to\'garak talabalari maqola taqdimoti', 'ru' => 'Презентация статей студентов научного кружка', 'en' => 'Scientific circle students article presentation'],
                'excerpt' => ['uz' => 'Ilmiy to\'garak talabalari o\'z tadqiqot natijalari bo\'yicha maqola taqdimotini o\'tkazdi.', 'ru' => 'Студенты научного кружка провели презентацию своих исследовательских статей.', 'en' => 'Scientific circle students presented their research articles.'],
                'content' => ['uz' => '<h2>Ilmiy to\'garak taqdimoti</h2><p>TTATF ilmiy to\'garak talabalari o\'zlarining tadqiqot ishlarini taqdim etdilar.</p><h3>Eng yaxshi maqolalar:</h3><ul><li>"Surxondaryoda qandli diabet tarqalishi" — Xolmatov B.</li><li>"Pediatrik bronxial astmani davolashda yangi yondashuvlar" — Rahimova D.</li><li>"Antibiotiklarga chidamlilik: mintaqaviy tahlil" — Tursunov S.</li></ul><p>Jami 25 ta maqola taqdim etildi. Eng yaxshi 3 ta maqola respublika ilmiy jurnalida chop etishga tavsiya qilindi.</p>', 'ru' => '<h2>Презентация научного кружка</h2><p>Студенты представили 25 исследовательских статей. Лучшие 3 рекомендованы к публикации.</p>', 'en' => '<h2>Scientific Circle Presentation</h2><p>Students presented 25 research articles. Top 3 recommended for publication.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(25),
            ],
            [
                'title' => ['uz' => 'Yoshlar forumi — «Kelajak shifokorlari»', 'ru' => 'Молодёжный форум — «Врачи будущего»', 'en' => 'Youth forum — "Doctors of the Future"'],
                'excerpt' => ['uz' => 'TTATF da yoshlar forumi o\'tkazildi. 300 dan ortiq talaba ishtirok etdi.', 'ru' => 'В ТТАТФ проведён молодёжный форум с участием более 300 студентов.', 'en' => 'Youth forum held at TTATF with over 300 students participating.'],
                'content' => ['uz' => '<h2>Yoshlar forumi</h2><p>TTATF da «Kelajak shifokorlari» nomli yoshlar forumi muvaffaqiyatli o\'tkazildi.</p><h3>Sessiyalar:</h3><ul><li>Tibbiyot mutaxassisligi tanlash — karyera yo\'llari</li><li>Chet elda stajirovka imkoniyatlari</li><li>Ilmiy tadqiqotga birinchi qadamlar</li><li>Tibbiy startaplar va innovatsiyalar</li><li>Mental salomatlik va burnout oldini olish</li></ul><p>Forum davomida 10 ta master-klass va 5 ta panel munozara o\'tkazildi.</p>', 'ru' => '<h2>Молодёжный форум</h2><p>Проведён молодёжный форум «Врачи будущего» с 10 мастер-классами.</p>', 'en' => '<h2>Youth Forum</h2><p>"Doctors of the Future" youth forum held with 10 master classes.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(28),
            ],
            [
                'title' => ['uz' => 'Mustaqillik kuni tantanali tadbiri', 'ru' => 'Торжественное мероприятие ко Дню независимости', 'en' => 'Independence Day celebration event'],
                'excerpt' => ['uz' => 'O\'zbekiston Respublikasi Mustaqillik kuni munosabati bilan filialda tantanali tadbir o\'tkazildi.', 'ru' => 'В честь Дня независимости Республики Узбекистан в филиале проведено торжественное мероприятие.', 'en' => 'Ceremonial event held at the branch in honor of Independence Day.'],
                'content' => ['uz' => '<h2>Mustaqillik kuni</h2><p>O\'zbekiston Respublikasi Mustaqillik kuni munosabati bilan TTATF da tantanali tadbir bo\'lib o\'tdi.</p><h3>Dastur:</h3><ul><li>Tantanali yig\'ilish va filial direktori nutqi</li><li>Eng yaxshi talabalar va xodimlarni taqdirlash</li><li>Milliy musiqa va raqs dasturi</li><li>Sport musobaqalari</li><li>Bayram oshi</li></ul><p>Tadbirda barcha fakultet va kafedra vakillari ishtirok etdi.</p>', 'ru' => '<h2>День независимости</h2><p>Проведено торжественное мероприятие в честь Дня независимости.</p>', 'en' => '<h2>Independence Day</h2><p>Ceremonial event held in honor of Independence Day.</p>'],
                'category' => 'tadbirlar',
                'is_published' => true,
                'published_at' => Carbon::now()->subDays(33),
            ],
        ];

        foreach ($news as $data) {
            News::create($data);
        }

        $this->command->info('✅ 30 ta asosiy yangilik yaratildi (10 yangiliklar + 10 konferensiyalar + 10 tadbirlar)');

        // =============================================
        // FACTORY orqali katta hajmda ma'lumot generatsiya qilish
        // Har bir kategoriya uchun sonni o'zgartiring
        // =============================================
        $factoryCounts = [
            'yangiliklar' => 100,   // Masalan: 10000
            'konferensiyalar' => 100,   // Masalan: 1000
            'tadbirlar' => 100,   // Masalan: 1000
        ];

        $totalFactory = array_sum($factoryCounts);

        if ($totalFactory > 0) {
            $this->command->info("⏳ Factory orqali {$totalFactory} ta yangilik generatsiya qilinmoqda...");

            foreach ($factoryCounts as $category => $count) {
                if ($count <= 0) {
                    continue;
                }

                // 500 tadan chunk qilib yaratamiz — xotira tejash uchun
                $chunks = array_fill(0, intdiv($count, 500), 500);
                $remainder = $count % 500;
                if ($remainder > 0) {
                    $chunks[] = $remainder;
                }

                foreach ($chunks as $chunkSize) {
                    News::factory()
                        ->count($chunkSize)
                        ->state([
                            'category' => $category,
                            'is_published' => true,
                        ])
                        ->create();
                }

                $this->command->info("   ✅ {$category}: {$count} ta yaratildi");
            }
        }

        $total = News::count();
        $this->command->info("🎉 Jami PostgreSQL da: {$total} ta yangilik");
    }
}
