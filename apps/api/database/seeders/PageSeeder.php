<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        // ⚡ XAVFSIZ: Faqat bo'sh bo'lsa yaratadi, mavjud ma'lumotlarni O'CHIRMAYDI
        if (Page::count() > 0) {
            $this->command->info('⏭️  Sahifalar mavjud ('.Page::count().' ta) — o\'tkazib yuborildi');

            return;
        }

        $pages = [
            [
                'title' => ['uz' => 'Umumiy ma\'lumot', 'ru' => 'Общая информация', 'en' => 'General Information'],
                'slug' => 'umumiy-malumot',
                'content' => [
                    'uz' => '<h2>TTATF haqida</h2><p><strong>Toshkent Davlat Tibbiyot Universiteti Termiz Filiali</strong> (TTATF) — Surxondaryo viloyatidagi yetakchi tibbiy oliy ta\'lim muassasasi bo\'lib, 2012-yilda tashkil etilgan.</p><h3>Missiya</h3><p>Filialimizning missiyasi — mintaqada yuqori malakali shifokorlar tayyorlash, tibbiy ilmiy tadqiqot ishlari olib borish va aholi salomatligini muhofaza qilishga hissa qo\'shishdir.</p><h3>Raqamlarda</h3><ul><li><strong>2500+</strong> talabalar</li><li><strong>150+</strong> professor-o\'qituvchilar va shifokorlar</li><li><strong>7</strong> kafedra</li><li><strong>7</strong> ta\'lim yo\'nalishi</li><li><strong>10+</strong> klinik bazalar</li><li><strong>1</strong> simulyatsion markaz</li></ul><h3>Manzil</h3><p>Surxondaryo viloyati, Termiz shahri<br>Telefon: +998 76 223-40-01<br>Email: info@ttatf.uz</p>',
                    'ru' => '<h2>О ТТАТФ</h2><p><strong>Термезский филиал Ташкентского государственного медицинского университета</strong> — ведущее медицинское высшее учебное заведение в Сурхандарьинской области, основанное в 2012 году.</p><h3>В цифрах</h3><ul><li><strong>2500+</strong> студентов</li><li><strong>150+</strong> преподавателей и врачей</li><li><strong>7</strong> кафедр</li><li><strong>10+</strong> клинических баз</li></ul>',
                    'en' => '<h2>About TTATF</h2><p><strong>Termez Branch of Tashkent State Medical University</strong> is a leading medical higher education institution in Surkhandarya region, established in 2012.</p><h3>In Numbers</h3><ul><li><strong>2500+</strong> students</li><li><strong>150+</strong> faculty members and doctors</li><li><strong>7</strong> departments</li></ul>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Sifat siyosati', 'ru' => 'Политика качества', 'en' => 'Quality Policy'],
                'slug' => 'sifat-siyosati',
                'content' => [
                    'uz' => '<h2>Sifat siyosati</h2><p>TTATF sifat siyosati quyidagi tamoyillarga asoslanadi:</p><ol><li><strong>Tibbiy ta\'lim sifati</strong> — xalqaro tibbiy ta\'lim standartlariga mos keluvchi dasturlar</li><li><strong>Klinik amaliyot</strong> — shifoxonalar bazasida real klinik tajriba</li><li><strong>Ilmiy tadqiqot</strong> — tibbiy innovatsiyalar va klinik sinovlar</li><li><strong>Simulyatsion ta\'lim</strong> — zamonaviy fantom va simulyatorlar</li><li><strong>Bemor xavfsizligi</strong> — tibbiy etika va deontologiya tamoyillari</li></ol><p>Biz tibbiy ta\'lim bo\'yicha xalqaro akkreditatsiya standartlarini joriy etganmiz.</p>',
                    'ru' => '<h2>Политика качества</h2><p>Политика качества основана на международных стандартах медицинского образования.</p>',
                    'en' => '<h2>Quality Policy</h2><p>Our quality policy is based on international medical education standards.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Antikorrupsiya', 'ru' => 'Антикоррупция', 'en' => 'Anti-corruption'],
                'slug' => 'antikorrupsiya',
                'content' => [
                    'uz' => '<h2>Korrupsiyaga qarshi siyosat</h2><p>TTATF korrupsiyaning har qanday ko\'rinishiga qarshi kurashadi. Barcha imtihonlar va baholash jarayonlari shaffof tarzda o\'tkaziladi.</p><h3>Murojaat usullari</h3><ul><li>Ishonch telefoni: +998 76 223-40-10</li><li>Email: antikorrupsiya@ttatf.uz</li><li>Virtual qabulxona orqali</li></ul><h3>Normativ hujjatlar</h3><p>O\'zbekiston Respublikasi "Korrupsiyaga qarshi kurashish to\'g\'risida"gi Qonuni asosida faoliyat yuritamiz.</p>',
                    'ru' => '<h2>Антикоррупционная политика</h2><p>Филиал борется с любыми проявлениями коррупции. Все экзамены проводятся прозрачно.</p>',
                    'en' => '<h2>Anti-corruption Policy</h2><p>The branch fights against all forms of corruption. All examinations are conducted transparently.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Murojaatlar tartibi', 'ru' => 'Порядок обращений', 'en' => 'Procedure for Appeals'],
                'slug' => 'murojaatlar-tartibi',
                'content' => [
                    'uz' => '<h2>Murojaatlar tartibi</h2><p>Fuqarolar, talabalar va bemorlar quyidagi usullarda murojaat qilishlari mumkin:</p><ol><li>Yozma murojaat — qabulxonaga topshirish</li><li>Elektron murojaat — info@ttatf.uz</li><li>Virtual qabulxona — veb-sayt orqali</li><li>Shaxsan qabul — filial direktori va o\'rinbosarlari tomonidan</li></ol><h3>Ko\'rib chiqish muddatlari</h3><p>Murojaatlar 15 ish kuni ichida ko\'rib chiqiladi.</p>',
                    'ru' => '<h2>Порядок обращений</h2><p>Граждане, студенты и пациенты могут обращаться различными способами.</p>',
                    'en' => '<h2>Procedure for Appeals</h2><p>Citizens, students and patients can contact through various channels.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Virtual qabulxona', 'ru' => 'Виртуальная приёмная', 'en' => 'Virtual Reception'],
                'slug' => 'virtual-qabulxona',
                'content' => [
                    'uz' => '<h2>Virtual qabulxona</h2><p>TTATF ning virtual qabulxonasiga xush kelibsiz! Bu yerda siz o\'z savol va takliflaringizni yozishingiz mumkin.</p><p>Murojaatlaringiz 3 ish kuni ichida ko\'rib chiqiladi va javob beriladi.</p><h3>Aloqa ma\'lumotlari</h3><ul><li>+998 76 223-40-01</li><li>info@ttatf.uz</li><li>Termiz shahri</li></ul>',
                    'ru' => '<h2>Виртуальная приёмная</h2><p>Добро пожаловать в виртуальную приёмную ТТАТФ.</p>',
                    'en' => '<h2>Virtual Reception</h2><p>Welcome to TTATF virtual reception.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Simulyatsion markaz', 'ru' => 'Симуляционный центр', 'en' => 'Simulation Center'],
                'slug' => 'simulyatsion-markaz',
                'content' => [
                    'uz' => '<h2>Simulyatsion markaz</h2><p>TTATF simulyatsion markazi 2024-yilda ochilgan bo\'lib, 1000 kv.m maydonda joylashgan.</p><h3>Imkoniyatlar</h3><ul><li>Anatomik fantomlar — auskultatsiya, palpatsiya</li><li>Laparoskopik simulyator — minimal invaziv xirurgiya</li><li>CPR simulyator — reanimatsiya mashqlari</li><li>Tug\'ruq simulyatori — normal va patologik tug\'ruq</li><li>In\'ektsiya trenajorlari</li><li>3D virtual reality — anatomiya</li></ul><p>Markaz talabalar va ordinatorlar uchun kuniga 12 soat ochiq.</p>',
                    'ru' => '<h2>Симуляционный центр</h2><p>Центр площадью 1000 кв.м открыт в 2024 году. Фантомы, лапароскопический симулятор, CPR-тренажёр.</p>',
                    'en' => '<h2>Simulation Center</h2><p>1000 sq.m center opened in 2024. Phantoms, laparoscopic simulator, CPR trainer, VR anatomy.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'O\'quv faoliyati', 'ru' => 'Учебная деятельность', 'en' => 'Academic Activity'],
                'slug' => 'oquv-faoliyati',
                'content' => [
                    'uz' => '<h2>O\'quv faoliyati</h2><p>TTATF da 4 ta bakalavriat va 3 ta klinik ordinatura yo\'nalishida ta\'lim beriladi.</p><h3>O\'quv jarayoni</h3><ul><li>1-2 kurs — bazaviy tibbiy fanlar (anatomiya, fiziologiya, bioximiya, farmakologiya)</li><li>3-4 kurs — klinik fanlar (ichki kasalliklar, xirurgiya, pediatriya)</li><li>5-6 kurs — klinik amaliyot va subordinatura</li></ul><p>Talabalar 4-kursdan boshlab shifoxonalarda klinik mashg\'ulotlar o\'taydilar.</p>',
                    'ru' => '<h2>Учебная деятельность</h2><p>В ТТАТФ обучение ведётся по 4 бакалаврским и 3 ординаторским направлениям.</p>',
                    'en' => '<h2>Academic Activity</h2><p>TTATF offers 4 bachelor and 3 clinical residency programs.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Xalqaro hamkorlik', 'ru' => 'Международное сотрудничество', 'en' => 'International Cooperation'],
                'slug' => 'xalqaro-hamkorlik',
                'content' => [
                    'uz' => '<h2>Xalqaro hamkorlik</h2><p>TTATF 10 dan ortiq xalqaro tibbiy tashkilot va universitetlar bilan hamkorlik qiladi.</p><h3>Hamkorlik yo\'nalishlari</h3><ul><li>Talabalar va ordinatorlar almashinuvi (Erasmus+)</li><li>Germaniya Charite shifoxonasida staj oshirish</li><li>Qo\'shma tibbiy tadqiqotlar</li><li>WHO bilan klinik loyihalar</li><li>UNICEF bilan bolalar salomatligi dasturlari</li></ul><h3>Hamkor tibbiyot universitetlari</h3><ul><li>Charite Universitätsmedizin Berlin (Germaniya)</li><li>Ankara Universiteti Tibbiyot Fakulteti (Turkiya)</li><li>Kazan Davlat Tibbiyot Universiteti (Rossiya)</li></ul>',
                    'ru' => '<h2>Международное сотрудничество</h2><p>ТТАТФ сотрудничает с более чем 10 международными медицинскими организациями.</p>',
                    'en' => '<h2>International Cooperation</h2><p>TTATF cooperates with over 10 international medical organizations.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Tadqiqot markazi', 'ru' => 'Исследовательский центр', 'en' => 'Research Center'],
                'slug' => 'tadqiqod-markazi',
                'content' => [
                    'uz' => '<h2>Ilmiy-tadqiqot markazi</h2><p>TTATF ilmiy-tadqiqot markazi quyidagi yo\'nalishlarda faoliyat olib boradi:</p><ul><li>Mintaqaviy epidemiologiya va infektsion kasalliklar</li><li>Kardiologiya va ichki kasalliklarning yangi davolash usullari</li><li>Perinatal tibbiyot va neonatologiya</li><li>Farmakologiya va dori vositalari tadqiqoti</li><li>Tibbiy ta\'limda simulyatsion texnologiyalar</li></ul><h3>Ilmiy ko\'rsatkichlar</h3><ul><li>Yillik 40+ ilmiy maqola</li><li>3 ta xalqaro grant loyihasi</li><li>PubMed va Scopus da to\'liq ko\'rsatilgan natijalar</li></ul>',
                    'ru' => '<h2>Научно-исследовательский центр</h2><p>Центр ведёт работу по региональной эпидемиологии, кардиологии, перинатальной медицине.</p>',
                    'en' => '<h2>Research Center</h2><p>The center works in regional epidemiology, cardiology, perinatal medicine and pharmacology.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Talaba ishlari', 'ru' => 'Студенческие дела', 'en' => 'Student Affairs'],
                'slug' => 'talaba-ishlari',
                'content' => [
                    'uz' => '<h2>Talaba ishlari bo\'limi</h2><p>Talaba ishlari bo\'limi talabalar hayotining barcha jabhalarini qamrab oladi.</p><h3>Faoliyat yo\'nalishlari</h3><ul><li>Talabalar turar joyi boshqaruvi</li><li>Stipendiya va moddiy yordam</li><li>Madaniy-ommaviy tadbirlar</li><li>Tibbiy volontyorlik dasturlari</li><li>Talabalar kasaba uyushmasi</li><li>Psixologik yordam xizmati</li><li>Sport va sog\'lom turmush tarzi tadbirlari</li></ul>',
                    'ru' => '<h2>Отдел по работе со студентами</h2><p>Охватывает все аспекты студенческой жизни: общежитие, стипендии, волонтёрство, спорт.</p>',
                    'en' => '<h2>Student Affairs</h2><p>Covers all aspects of student life: dormitory, scholarships, volunteering, sports.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'SDG — Barqaror rivojlanish maqsadlari', 'ru' => 'ЦУР — Цели устойчивого развития', 'en' => 'SDG — Sustainable Development Goals'],
                'slug' => 'sdg',
                'content' => [
                    'uz' => '<h2>Barqaror rivojlanish maqsadlari</h2><p>TTATF BMTning Barqaror rivojlanish maqsadlariga erishish yo\'lida faol ishtirok etadi.</p><h3>Asosiy yo\'nalishlar</h3><ul><li>SDG 3 — Sog\'lom hayot va farovonlik (asosiy maqsad)</li><li>SDG 4 — Sifatli ta\'lim</li><li>SDG 5 — Gender tenglik (onalik va bolalar salomatligi)</li><li>SDG 10 — Tengsizlikni kamaytirish (mintaqaviy tibbiy xizmat)</li><li>SDG 17 — Global tibbiy hamkorlik</li></ul>',
                    'ru' => '<h2>Цели устойчивого развития</h2><p>ТТАТФ активно участвует в достижении ЦУР ООН, особенно ЦУР 3 — Здоровье и благополучие.</p>',
                    'en' => '<h2>SDGs</h2><p>TTATF actively participates in UN SDGs, especially SDG 3 — Good Health and Well-being.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Ichki kutubxona', 'ru' => 'Внутренняя библиотека', 'en' => 'Internal Library'],
                'slug' => 'ichki-kutubxona',
                'content' => [
                    'uz' => '<h2>Filial kutubxonasi</h2><p>TTATF kutubxonasida 40 000 dan ortiq tibbiy kitob va 15 000+ elektron resurslar mavjud.</p><h3>Xizmatlar</h3><ul><li>Tibbiy kitoblar va darsliklar</li><li>Anatomik atlaslar va 3D modellar</li><li>PubMed, UpToDate, ClinicalKey kirish</li><li>Elektron katalog</li><li>Internetga ulangan kompyuterlar</li></ul><p>Ish vaqti: Dushanba–Shanba, 08:00–21:00</p>',
                    'ru' => '<h2>Библиотека</h2><p>В библиотеке более 40 000 медицинских книг и 15 000+ электронных ресурсов. Доступ к PubMed, UpToDate.</p>',
                    'en' => '<h2>Library</h2><p>40,000+ medical books and 15,000+ electronic resources. Access to PubMed, UpToDate, ClinicalKey.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Elektron kutubxona', 'ru' => 'Электронная библиотека', 'en' => 'E-Library'],
                'slug' => 'e-library',
                'content' => [
                    'uz' => '<h2>Elektron kutubxona</h2><p>Elektron kutubxona platformasi orqali talabalar va o\'qituvchilar quyidagi tibbiy resurslarga kirish imkoniga ega:</p><ul><li>25 000+ elektron tibbiy kitoblar</li><li>PubMed tibbiy maqolalar bazasi</li><li>UpToDate klinik ma\'lumotnomasi</li><li>ClinicalKey tibbiy ma\'lumot bazasi</li><li>Video operatsiyalar kutubxonasi</li></ul>',
                    'ru' => '<h2>Электронная библиотека</h2><p>25 000+ медицинских электронных книг, PubMed, UpToDate, ClinicalKey, видеоатлас операций.</p>',
                    'en' => '<h2>E-Library</h2><p>25,000+ medical e-books, PubMed, UpToDate, ClinicalKey, surgical video atlas.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Klinik bazalar', 'ru' => 'Клинические базы', 'en' => 'Clinical Bases'],
                'slug' => 'klinik-bazalar',
                'content' => [
                    'uz' => '<h2>Klinik bazalar</h2><p>TTATF talabalari va ordinatorlari quyidagi tibbiy muassasalarda klinik amaliyot o\'taydilar:</p><ul><li>Termiz shahar klinik shifoxonasi</li><li>Surxondaryo viloyat ko\'p tarmoqli tibbiyot markazi</li><li>Viloyat bolalar shifoxonasi</li><li>Viloyat perinatal markazi</li><li>Viloyat onkologiya dispenseri</li><li>Viloyat tez tibbiy yordam markazi</li><li>Shahar poliklinikasi №1</li></ul><p>Klinik mashg\'ulotlar 4-kursdan boshlab olib boriladi.</p>',
                    'ru' => '<h2>Клинические базы</h2><p>Студенты проходят практику в городской клинической больнице, областном многопрофильном центре, детской больнице, перинатальном центре.</p>',
                    'en' => '<h2>Clinical Bases</h2><p>Students practice at city clinical hospital, regional multidisciplinary center, children\'s hospital, perinatal center.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Fakultetlar', 'ru' => 'Факультеты', 'en' => 'Faculties'],
                'slug' => 'fakultetlar',
                'content' => [
                    'uz' => '<h2>Fakultetlar</h2><p>TTATF da ta\'lim 7 ta kafedra doirasida 2 ta fakultetda olib boriladi:</p><h3>1. Klinik tibbiyot fakulteti</h3><ul><li>Davolash ishi kafedrasi</li><li>Xirurgiya kafedrasi</li><li>Pediatriya kafedrasi</li><li>Akusherlik va ginekologiya kafedrasi</li></ul><h3>2. Fundamental tibbiyot va gumanitar fanlar fakulteti</h3><ul><li>Normal va patologik anatomiya kafedrasi</li><li>Tibbiy biologiya va farmakologiya kafedrasi</li><li>Ijtimoiy-gumanitar fanlar va tillar kafedrasi</li></ul>',
                    'ru' => '<h2>Факультеты</h2><p>Обучение ведётся на 2 факультетах: Клиническая медицина и Фундаментальная медицина.</p>',
                    'en' => '<h2>Faculties</h2><p>Education at 2 faculties: Clinical Medicine and Fundamental Medicine.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Nizom', 'ru' => 'Устав', 'en' => 'Charter'],
                'slug' => 'nizom',
                'content' => [
                    'uz' => '<h2>Filial nizomi</h2><p>TTATF O\'zbekiston Respublikasi "Ta\'lim to\'g\'risida"gi va "Sog\'liqni saqlash to\'g\'risida"gi qonunlariga muvofiq faoliyat yuritadi.</p><p>Filial nizomi Toshkent Davlat Tibbiyot Universiteti Kengashi tomonidan tasdiqlangan.</p>',
                    'ru' => '<h2>Устав</h2><p>ТТАТФ действует в соответствии с Законами «Об образовании» и «Об охране здоровья граждан».</p>',
                    'en' => '<h2>Charter</h2><p>TTATF operates under the Laws on Education and Healthcare.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Tadqiqot', 'ru' => 'Исследования', 'en' => 'Research'],
                'slug' => 'tadqiqot',
                'content' => [
                    'uz' => '<h2>Ilmiy tadqiqotlar</h2><p>Filialda olib borilayotgan tibbiy ilmiy-tadqiqot ishlari:</p><ul><li>Mintaqaviy epidemiologiya va infektsion kasalliklar</li><li>Kardiologiyaning yangi diagnostika va davolash usullari</li><li>Onkologik kasalliklarning erta diagnostikasi</li><li>Perinatal tibbiyot va ona-bola salomatligi</li><li>Farmakologik tadqiqotlar va dori vositalari</li></ul><p>2024-yilda jami 42 ta ilmiy maqola nashr etilgan, shundan 8 tasi PubMed va Scopus indeksli jurnallarda.</p>',
                    'ru' => '<h2>Научные исследования</h2><p>Научная деятельность: эпидемиология, кардиология, онкология, перинатальная медицина, фармакология.</p>',
                    'en' => '<h2>Research</h2><p>Research areas: epidemiology, cardiology, oncology, perinatal medicine, pharmacology.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Ilmiy jurnal', 'ru' => 'Научный журнал', 'en' => 'Scientific Journal'],
                'slug' => 'ilmiy-jurnal',
                'content' => [
                    'uz' => '<h2>Ilmiy jurnal</h2><p>"TTATF Tibbiy xabarlari" jurnali yilda 4 marta nashr etiladi. Jurnal klinik tibbiyot, fundamental tibbiyot va tibbiy ta\'lim sohasidagi ilmiy maqolalarni qabul qiladi.</p><h3>ISSN: 2181-XXXX</h3><p>Maqola topshirish: journal@ttatf.uz</p>',
                    'ru' => '<h2>Научный журнал</h2><p>«Медицинские вести ТТАТФ» издаётся 4 раза в год. Принимает статьи по клинической, фундаментальной медицине и медицинскому образованию.</p>',
                    'en' => '<h2>Scientific Journal</h2><p>"TTATF Medical News" published 4 times per year. Accepts articles on clinical medicine, fundamental medicine and medical education.</p>',
                ],
                'is_published' => true,
            ],
            [
                'title' => ['uz' => 'Ilmiy ishlar va innovatsiyalar', 'ru' => 'Научные работы и инновации', 'en' => 'Scientific Works and Innovations'],
                'slug' => 'ilmiy-ishlar-va-innovatsiyalar',
                'content' => [
                    'uz' => '<h2>Ilmiy ishlar va innovatsiyalar</h2><p>Filialda olib borilayotgan innovatsion tibbiy loyihalar haqida ma\'lumot.</p><ul><li>2 ta tibbiy patent olindi (minimal invaziv xirurgiya usullari)</li><li>3 ta xalqaro grant loyihasi amalga oshirilmoqda (WHO, UNICEF)</li><li>8 ta PubMed maqola nashr etildi</li><li>Telemediitsina loyihasi ishga tushirildi</li></ul>',
                    'ru' => '<h2>Научные работы и инновации</h2><p>2 патента, 3 международных гранта, 8 статей в PubMed, проект телемедицины.</p>',
                    'en' => '<h2>Scientific Works and Innovations</h2><p>2 medical patents, 3 international grants, 8 PubMed articles, telemedicine project.</p>',
                ],
                'is_published' => true,
            ],
        ];

        foreach ($pages as $data) {
            Page::create($data);
        }

        // ---- Tadqiqot markazi bola sahifalari ----
        $tadqiqodMarkazi = Page::where('slug', 'tadqiqod-markazi')->first();
        if ($tadqiqodMarkazi) {
            $childPages = [
                [
                    'title' => ['uz' => 'Mintaqaviy epidemiologiya tadqiqotlari', 'ru' => 'Региональные эпидемиологические исследования', 'en' => 'Regional Epidemiology Research'],
                    'slug' => 'mintaqaviy-epidemiologiya',
                    'content' => [
                        'uz' => '<h2>Mintaqaviy epidemiologiya tadqiqotlari</h2><p>Surxondaryo viloyatida tarqalgan infektsion va yuqumli kasalliklar bo\'yicha ilmiy tadqiqotlar olib borilmoqda.</p><h3>Asosiy yo\'nalishlar</h3><ul><li>Iqlim o\'zgarishi va tropik kasalliklar tarqalishi</li><li>Suv orqali yuqadigan kasalliklar monitoring</li><li>Mintaqaviy vaksinatsiya samaradorligi</li><li>Zoonoz infektsiyalar epidemiologiyasi</li></ul><h3>Natijalar</h3><p>2024-yilda 12 ta ilmiy maqola nashr etildi, 3 tasi Scopus indeksli jurnallarda.</p>',
                        'ru' => '<h2>Региональные эпидемиологические исследования</h2><p>Проводятся исследования инфекционных заболеваний, распространённых в Сурхандарьинской области.</p>',
                        'en' => '<h2>Regional Epidemiology Research</h2><p>Research on infectious diseases prevalent in Surkhandarya region.</p>',
                    ],
                    'is_published' => true,
                    'parent_id' => $tadqiqodMarkazi->id,
                    'sort_order' => 1,
                ],
                [
                    'title' => ['uz' => 'Kardiologiya va ichki kasalliklar', 'ru' => 'Кардиология и внутренние болезни', 'en' => 'Cardiology and Internal Medicine'],
                    'slug' => 'kardiologiya-tadqiqotlari',
                    'content' => [
                        'uz' => '<h2>Kardiologiya va ichki kasalliklar tadqiqotlari</h2><p>Yurak-qon tomir kasalliklarining yangi diagnostika va davolash usullari bo\'yicha ilmiy ishlar.</p><h3>Loyihalar</h3><ul><li>Arterial gipertoniya mintaqaviy xususiyatlari</li><li>Metabolik sindrom va diabet asoratlari</li><li>Koronar arteriya kasalligida erta diagnostika</li><li>Kardioreyabilitatsiya dasturlari samaradorligi</li></ul><h3>Hamkorlik</h3><p>Toshkent Tibbiyot Akademiyasi Kardiologiya markazi bilan qo\'shma tadqiqotlar olib borilmoqda.</p>',
                        'ru' => '<h2>Кардиология и внутренние болезни</h2><p>Научные работы по новым методам диагностики и лечения сердечно-сосудистых заболеваний.</p>',
                        'en' => '<h2>Cardiology and Internal Medicine</h2><p>Research on new diagnostic and treatment methods for cardiovascular diseases.</p>',
                    ],
                    'is_published' => true,
                    'parent_id' => $tadqiqodMarkazi->id,
                    'sort_order' => 2,
                ],
                [
                    'title' => ['uz' => 'Perinatal tibbiyot va neonatologiya', 'ru' => 'Перинатальная медицина и неонатология', 'en' => 'Perinatal Medicine and Neonatology'],
                    'slug' => 'perinatal-tibbiyot',
                    'content' => [
                        'uz' => '<h2>Perinatal tibbiyot va neonatologiya</h2><p>Ona va bola salomatligini muhofaza qilish bo\'yicha ilmiy tadqiqotlar.</p><h3>Tadqiqot yo\'nalishlari</h3><ul><li>Homiladorlik asoratlarining erta diagnostikasi</li><li>Chaqaloq reanimatsiyasida zamonaviy yondashuvlar</li><li>Erta tug\'ilgan bolalar parvarishi</li><li>Prenatal skrining dasturlari takomillashtirish</li></ul><h3>Klinik baza</h3><p>Surxondaryo viloyat perinatal markazi bazasida olib boriladi.</p>',
                        'ru' => '<h2>Перинатальная медицина</h2><p>Исследования по охране здоровья матери и ребёнка, неонатальная реанимация.</p>',
                        'en' => '<h2>Perinatal Medicine</h2><p>Research on maternal and child health, neonatal resuscitation.</p>',
                    ],
                    'is_published' => true,
                    'parent_id' => $tadqiqodMarkazi->id,
                    'sort_order' => 3,
                ],
                [
                    'title' => ['uz' => 'Farmakologiya va dori vositalari', 'ru' => 'Фармакология и лекарственные средства', 'en' => 'Pharmacology and Drugs'],
                    'slug' => 'farmakologiya-tadqiqotlari',
                    'content' => [
                        'uz' => '<h2>Farmakologiya va dori vositalari tadqiqoti</h2><p>Mahalliy dorivor o\'simliklar asosida yangi dori vositalarini ishlab chiqish bo\'yicha tadqiqotlar.</p><h3>Yo\'nalishlar</h3><ul><li>Fitoterapiya — mahalliy dorivor o\'simliklar tadqiqoti</li><li>Antimikrob preparatlar samaradorligi</li><li>Dori vositalarining farmakokinetikasi</li><li>Klinik farmakologiya va dori xavfsizligi</li></ul><h3>Natijalar</h3><p>2 ta dori vositasi bo\'yicha patent olindi. 5 ta klinik sinov o\'tkazildi.</p>',
                        'ru' => '<h2>Фармакология</h2><p>Разработка новых лекарственных средств на основе местных лекарственных растений.</p>',
                        'en' => '<h2>Pharmacology</h2><p>Development of new drugs based on local medicinal plants.</p>',
                    ],
                    'is_published' => true,
                    'parent_id' => $tadqiqodMarkazi->id,
                    'sort_order' => 4,
                ],
                [
                    'title' => ['uz' => 'Simulyatsion texnologiyalar tadqiqoti', 'ru' => 'Исследования симуляционных технологий', 'en' => 'Simulation Technology Research'],
                    'slug' => 'simulyatsion-tadqiqotlar',
                    'content' => [
                        'uz' => '<h2>Tibbiy ta\'limda simulyatsion texnologiyalar</h2><p>Simulyatsion ta\'lim samaradorligini oshirish bo\'yicha pedagogik va klinik tadqiqotlar.</p><h3>Yo\'nalishlar</h3><ul><li>Virtual reality (VR) anatomiya o\'qitishda</li><li>Fantom mashg\'ulotlari standartlashtirish</li><li>OSCE imtihon tizimi takomillashtirish</li><li>Talabalar klinik ko\'nikmalarini baholash</li></ul><h3>Innovatsiyalar</h3><p>3D bosib chiqarish texnologiyasi yordamida anatomik modellar yaratish loyihasi amalga oshirilmoqda.</p>',
                        'ru' => '<h2>Симуляционные технологии в медицинском образовании</h2><p>Педагогические и клинические исследования по повышению эффективности симуляционного обучения.</p>',
                        'en' => '<h2>Simulation Technology in Medical Education</h2><p>Pedagogical and clinical research on improving simulation-based training effectiveness.</p>',
                    ],
                    'is_published' => true,
                    'parent_id' => $tadqiqodMarkazi->id,
                    'sort_order' => 5,
                ],
            ];

            foreach ($childPages as $child) {
                Page::create($child);
            }

            $this->command->info('✅ '.count($childPages).' ta tadqiqot markazi maqolasi yaratildi');
        }

        $this->command->info('✅ '.count($pages).' ta tibbiy sahifa yaratildi');
    }
}
