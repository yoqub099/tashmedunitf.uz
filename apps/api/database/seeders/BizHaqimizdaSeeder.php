<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Services\CacheService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ============================================================
 * BIZ HAQIMIZDA — "About Us" sahifa bo'limlari
 * ============================================================
 *
 * Kontent eski rasmiy saytdan (tashmedunitf.uz/filial-haqida-2)
 * olingan haqiqiy faktlar asosida, ISFT (isft.uz) uslubida —
 * qisqa, aniq, ixcham (har bo'lim ~40-80 so'z) — qayta yozilgan.
 *
 * Frontend (apps/web .../biz-haqimizda/page.tsx) shu slug'larni
 * `getPageBySlug()` orqali o'qiydi; topilmasa statik fallback'ga tushadi.
 * ============================================================
 */
class BizHaqimizdaSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            // ── HERO — Missiya / o'ziga taqdimot ──
            [
                'slug' => 'biz-haqimizda',
                'title' => json_encode([
                    'uz' => 'Biz haqimizda',
                    'ru' => 'О нас',
                    'en' => 'About Us',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Toshkent davlat tibbiyot universiteti Termiz filiali — Surxondaryo mintaqasida yuqori malakali tibbiyot kadrlarini tayyorlovchi yetakchi oliy ta\'lim maskani. Vazifamiz — talabalarda zamonaviy klinik bilim va amaliy ko\'nikmalarni shakllantirib, ularni kasbiy faoliyatga to\'liq tayyorlash va xalq salomatligi xizmatida bo\'lishga yo\'naltirish.</p>',
                    'ru' => '<p>Термезский филиал Ташкентского государственного медицинского университета — ведущее высшее учебное заведение Сурхандарьинского региона по подготовке высококвалифицированных медицинских кадров. Наша миссия — формировать у студентов современные клинические знания и практические навыки, полностью готовя их к профессиональной деятельности на благо здоровья народа.</p>',
                    'en' => '<p>The Termez branch of Tashkent State Medical University is a leading higher education institution in the Surkhandarya region, training highly qualified medical specialists. Our mission is to develop modern clinical knowledge and practical skills in students, fully preparing them for professional practice in service of public health.</p>',
                ]),
                'is_published' => true,
            ],

            // ── 1-bo'lim — Filial haqida (tashkil etilishi + raqamlar) ──
            [
                'slug' => 'biz-haqimizda-tdtutf',
                'title' => json_encode([
                    'uz' => 'TdTUTF — Termizdagi yetakchi tibbiyot ta\'lim maskani',
                    'ru' => 'ТдТУТФ — ведущее медицинское учебное заведение в Термезе',
                    'en' => 'TdTUTF — Leading Medical Education Institution in Termez',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Filial O\'zbekiston Respublikasi Vazirlar Mahkamasining 2018-yil 5-martdagi 172-sonli qarori asosida tashkil etilgan. Bugungi kunda 4 ta fakultet va 19 ta kafedra (shundan 11 tasi klinik) faoliyat yuritadi; 7 ta bakalavriat yo\'nalishi va 34 ta klinik ordinatura mutaxassisligi mavjud. Umumiy quvvati 3500 o\'rinli zamonaviy o\'quv binolari talabalarga keng imkoniyat yaratadi.</p>',
                    'ru' => '<p>Филиал создан на основании постановления Кабинета Министров Республики Узбекистан №172 от 5 марта 2018 года. Сегодня действуют 4 факультета и 19 кафедр (11 из них клинические); открыты 7 направлений бакалавриата и 34 специальности клинической ординатуры. Современные учебные корпуса общей вместимостью 3500 мест создают комфортные условия для студентов.</p>',
                    'en' => '<p>The branch was established by Resolution No. 172 of the Cabinet of Ministers of Uzbekistan dated 5 March 2018. Today it operates 4 faculties and 19 departments (11 of them clinical), with 7 bachelor\'s programs and 34 clinical residency specialties. Modern academic buildings with a total capacity of 3,500 seats provide comfortable conditions for students.</p>',
                ]),
                'is_published' => true,
            ],

            // ── 2-bo'lim — Ta'lim muhiti (laboratoriya, texnologiya, ARM) ──
            [
                'slug' => 'biz-haqimizda-talim-muhiti',
                'title' => json_encode([
                    'uz' => 'Ta\'lim muhiti',
                    'ru' => 'Образовательная среда',
                    'en' => 'Educational Environment',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Ta\'lim jarayoni fundamental fanlar laboratoriyalari — tibbiy kimyo, biokimyo, gistologiya, fiziologiya va mikrobiologiya bilan jihozlangan. Axborot-resurs markazida 20 000 dan ortiq nomdagi adabiyot, boy elektron fond va library.ttatf.uz portali talabalar ixtiyorida. 700 Mb/s internet, 50 ta elektron doska va 470 dan ortiq tarmoqlangan kompyuter zamonaviy o\'qish muhitini ta\'minlaydi.</p>',
                    'ru' => '<p>Учебный процесс оснащён лабораториями фундаментальных дисциплин — медицинская химия, биохимия, гистология, физиология и микробиология. В информационно-ресурсном центре доступны более 20 000 наименований литературы, богатый электронный фонд и портал library.ttatf.uz. Интернет 700 Мб/с, 50 электронных досок и более 470 подключённых к сети компьютеров обеспечивают современную образовательную среду.</p>',
                    'en' => '<p>The learning process is equipped with fundamental science laboratories — medical chemistry, biochemistry, histology, physiology and microbiology. The information resource center offers over 20,000 titles, a rich electronic collection and the library.ttatf.uz portal. 700 Mb/s internet, 50 electronic boards and more than 470 networked computers ensure a modern learning environment.</p>',
                ]),
                'is_published' => true,
            ],

            // ── 3-bo'lim — O'qitish usuli (professorlar, qo'shma dastur) ──
            [
                'slug' => 'biz-haqimizda-oqitish-usuli',
                'title' => json_encode([
                    'uz' => 'O\'ziga xos o\'qitish usuli',
                    'ru' => 'Уникальный метод обучения',
                    'en' => 'Unique Teaching Method',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Filial jahon amaliy tajribasini ta\'lim jarayoniga integratsiya qilgan holda xalqaro darajadagi mutaxassislarni tayyorlaydi. Talabalarga 671 nafar professor-o\'qituvchi, jumladan ilmiy darajaga ega 40 nafar olim saboq beradi. 2021-yildan Rossiyaning Privoljsk ilmiy-tadqiqot tibbiyot universiteti bilan «3+3» qo\'shma ta\'lim dasturi muvaffaqiyatli yo\'lga qo\'yilgan.</p>',
                    'ru' => '<p>Филиал готовит специалистов международного уровня, интегрируя мировой практический опыт в образовательный процесс. Студентов обучают 671 преподаватель, в том числе 40 учёных со степенью. С 2021 года успешно действует совместная программа «3+3» с Приволжским исследовательским медицинским университетом (Россия).</p>',
                    'en' => '<p>The branch trains international-level specialists by integrating global practical experience into the educational process. Students are taught by 671 faculty members, including 40 scholars with academic degrees. Since 2021, a joint "3+3" program with Privolzhsky Research Medical University (Russia) has been running successfully.</p>',
                ]),
                'is_published' => true,
            ],

            // ── 4-bo'lim — Kichik guruhlar ──
            [
                'slug' => 'biz-haqimizda-kichik-guruhlar',
                'title' => json_encode([
                    'uz' => 'Kichik guruhlar samaradorligi',
                    'ru' => 'Эффективность малых групп',
                    'en' => 'Small Group Effectiveness',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Talabalar tajribali o\'qituvchilar va akademiklar rahbarligida kichik guruhlarda hamda maxsus ishchi jamoalarda ta\'lim oladi. Bu yondashuv har bir talabaning ijodkorligi, tashabbuskorligi va amaliy ko\'nikmalarini rivojlantiradi, klinik mashg\'ulotlarda bilim olish samaradorligini sezilarli oshiradi.</p>',
                    'ru' => '<p>Студенты обучаются в малых группах и специальных рабочих командах под руководством опытных преподавателей и академиков. Такой подход развивает творческий потенциал, инициативность и практические навыки каждого студента, значительно повышая эффективность обучения на клинических занятиях.</p>',
                    'en' => '<p>Students study in small groups and specialized working teams under the guidance of experienced teachers and academics. This approach develops each student\'s creativity, initiative and practical skills, significantly increasing learning effectiveness in clinical sessions.</p>',
                ]),
                'is_published' => true,
            ],

            // ── 5-bo'lim — Bitiruvchilar afzalligi (prose, rasmli bo'lim) ──
            [
                'slug' => 'biz-haqimizda-afzalliklar-bolim',
                'title' => json_encode([
                    'uz' => 'Bitiruvchilarimizning afzalliklari',
                    'ru' => 'Преимущества наших выпускников',
                    'en' => 'Advantages of Our Graduates',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Filial bitiruvchilari nazariy bilim va amaliy tajribani uyg\'unlashtirgan, mustaqil qaror qabul qila oladigan malakali shifokorlar bo\'lib yetishadi. Ular zamonaviy tibbiyot talablariga javob beradigan klinik ko\'nikmalar, tanqidiy fikrlash va yuksak kasbiy mas\'uliyat bilan ajralib turadi.</p>',
                    'ru' => '<p>Выпускники филиала становятся квалифицированными врачами, сочетающими теоретические знания и практический опыт и способными принимать самостоятельные решения. Их отличают клинические навыки, соответствующие требованиям современной медицины, критическое мышление и высокая профессиональная ответственность.</p>',
                    'en' => '<p>Graduates of the branch become qualified doctors who combine theoretical knowledge with practical experience and are capable of independent decision-making. They are distinguished by clinical skills that meet the demands of modern medicine, critical thinking and high professional responsibility.</p>',
                ]),
                'is_published' => true,
            ],

            // ── Afzalliklar — 6 ta kartochka (ISFT card grid; <li> ajratiladi) ──
            [
                'slug' => 'biz-haqimizda-afzalliklar',
                'title' => json_encode([
                    'uz' => 'Bitiruvchilarimizdagi afzalliklar va o\'ziga xosliklar',
                    'ru' => 'Преимущества и особенности наших выпускников',
                    'en' => 'Advantages and Distinctive Features of Our Graduates',
                ]),
                'content' => json_encode([
                    'uz' => '<ul><li>O\'z sohasida mukammal kompleks bilimlarga egaligi</li><li>Tanqidiy fikrlash va muammolarni yechish ko\'nikmasi</li><li>Klinik amaliyot va zamonaviy diagnostika malakasi</li><li>Yetakchilik, jamoaviy ishlash va muloqot ko\'nikmalari</li><li>Ahloqiy kompetensiya va xalqaro bag\'rikenglik</li><li>Kasbiga sadoqat, sabr-toqat va mas\'uliyatlilik</li></ul>',
                    'ru' => '<ul><li>Глубокие комплексные знания в своей области</li><li>Критическое мышление и навыки решения задач</li><li>Навыки клинической практики и современной диагностики</li><li>Лидерство, командная работа и коммуникабельность</li><li>Этическая компетентность и международная толерантность</li><li>Преданность профессии, терпение и ответственность</li></ul>',
                    'en' => '<ul><li>Comprehensive expert knowledge in their field</li><li>Critical thinking and problem-solving skills</li><li>Clinical practice and modern diagnostics skills</li><li>Leadership, teamwork and communication skills</li><li>Ethical competence and international tolerance</li><li>Dedication to the profession, patience and responsibility</li></ul>',
                ]),
                'is_published' => true,
            ],

            // ── Litsenziya va sertifikatlar (rasm galereyasi) ──
            [
                'slug' => 'biz-haqimizda-litsenziyalar',
                'title' => json_encode([
                    'uz' => 'Litsenziya va sertifikatlar',
                    'ru' => 'Лицензии и сертификаты',
                    'en' => 'Licenses and Certificates',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Filialning faoliyati O\'zbekiston Respublikasi qonunchiligiga muvofiq rasmiy litsenziya va sertifikatlar asosida amalga oshiriladi.</p>',
                    'ru' => '<p>Деятельность филиала осуществляется на основании официальных лицензий и сертификатов в соответствии с законодательством Республики Узбекистан.</p>',
                    'en' => '<p>The branch operates on the basis of official licenses and certificates in accordance with the legislation of the Republic of Uzbekistan.</p>',
                ]),
                'is_published' => true,
            ],
        ];

        foreach ($pages as $pageData) {
            $existing = Page::where('slug', $pageData['slug'])->first();

            if (! $existing) {
                // DB::table — HasSlug trait'ni chetlab o'tadi (slug title'dan
                // qayta generatsiya bo'lib, bizning aniq slug'imizni almashtirmasin).
                DB::table('pages')->insert(array_merge($pageData, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $this->command->info("Created: {$pageData['slug']}");
            } else {
                // Mavjud sahifa — faqat title/content yangilanadi (slug, nav,
                // parent_id, rasm va boshqa sozlamalar tegilmaydi).
                // MUHIM: title/content JSONB to'g'ridan-to'g'ri yoziladi —
                // eski kodda setTranslations() save()'siz chaqirilib, o'zgarish
                // saqlanmay qolardi (bug). DB::table bilan ishonchli yoziladi.
                DB::table('pages')->where('id', $existing->id)->update([
                    'title' => $pageData['title'],
                    'content' => $pageData['content'],
                    'is_published' => $pageData['is_published'],
                    'updated_at' => now(),
                ]);
                $this->command->warn("Updated: {$pageData['slug']} (id: {$existing->id})");
            }
        }

        // Targeted cache clear — faqat Pages + Navigation taglari (Redis DB 1).
        // Cache::flush() (butun cache) o'rniga maqsadli — boshqa keshlarga tegmaydi.
        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);

        $this->command->info("\nBiz-haqimizda bo'limlari yangilandi. Pages + Nav cache tozalandi.");
    }
}
