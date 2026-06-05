<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BizHaqimizdaSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'biz-haqimizda',
                'title' => json_encode([
                    'uz' => 'Biz haqimizda',
                    'ru' => 'О нас',
                    'en' => 'About Us',
                ]),
                'content' => json_encode([
                    'uz' => '<p><strong>Bizning vazifamiz</strong> - talabalarda kelajakdagi karyera o\'sishi uchun asosiy ko\'nikmalarni shakllantirish, ularning kasbiy muhitda amalga oshirishga tayyorligini ta\'minlash. Biz bunga erishayotgan bo\'lsak, ilg\'or ta\'lim dasturlari va tadqiqot loyihalarini joriy etish, jamiyatning kadrlarga bo\'lgan ehtiyoji va ish beruvchilarning talablarini o\'rganish asosida talabalarga ijtimoiy taraqqiyotning muvaffaqiyatli ishtirokchilari bo\'lish imkoniyatini beramiz.</p>',
                    'ru' => '<p><strong>Наша миссия</strong> — формировать у студентов ключевые навыки для будущего карьерного роста, обеспечивать их готовность к профессиональной деятельности.</p>',
                    'en' => '<p><strong>Our mission</strong> is to develop core skills in students for future career growth, ensuring their readiness for professional practice.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-tdtutf',
                'title' => json_encode([
                    'uz' => 'TdTUTF: Termiz shahridagi yetakchi tibbiyot ta\'lim maskani',
                    'ru' => 'ТдТУТФ: Ведущее медицинское учебное заведение в Термезе',
                    'en' => 'TdTUTF: Leading Medical Education Institution in Termez',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Toshkent davlat tibbiyot universiteti Termiz filiali (TdTUTF) — zamonaviy ta\'lim muassasasi bo\'lib, mintaqada yuqori malakali tibbiyot mutaxassislarini tayyorlash bo\'yicha yetakchi o\'quv yurtlaridan biridir. Filial talabalarga sifatli tibbiy ta\'lim berish, ilmiy-tadqiqot ishlarini rivojlantirish va innovatsion loyihalarni amalga oshirish yo\'nalishida faol ish olib boradi.</p>',
                    'ru' => '<p>Термезский филиал Ташкентского государственного медицинского университета (ТдТУТФ) — современное образовательное учреждение, одно из ведущих в регионе по подготовке высококвалифицированных медицинских специалистов.</p>',
                    'en' => '<p>Termez branch of Tashkent State Medical University (TdTUTF) is a modern educational institution, one of the leading in the region for training highly qualified medical specialists.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-talim-muhiti',
                'title' => json_encode([
                    'uz' => 'Ta\'lim muhiti',
                    'ru' => 'Образовательная среда',
                    'en' => 'Educational Environment',
                ]),
                'content' => json_encode([
                    'uz' => '<p>O\'quv dasturining asosiy fanlari milliy va global miqyosdagi tadqiqotlarning ustuvor yo\'nalishlarini aks ettiradi. TdTUTF talabalari zamonaviy ma\'ruza auditoriyalari, kutubxonalar va elektron resurslarga keng imkoniyatlar yaratilgan kompyuter xonalarida o\'qish jarayonida maxsus kooperativ ishchi muhitida bo\'ladilar. Bizning talabalarimiz samarali ta\'lim muhitida o\'qituvchilar tomonidan taqdim etilayotgan o\'zlari tanlagan yo\'nalishlari bo\'yicha dolzarb va amaliy ahamiyatga ega bo\'lgan yangi ma\'lumotlarga ega bo\'ladilar.</p>',
                    'ru' => '<p>Основные дисциплины учебной программы отражают приоритетные направления исследований на национальном и глобальном уровне.</p>',
                    'en' => '<p>The core disciplines of the curriculum reflect the priority research directions at national and global levels.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-oqitish-usuli',
                'title' => json_encode([
                    'uz' => 'O\'ziga xos o\'qitish usuli',
                    'ru' => 'Уникальный метод обучения',
                    'en' => 'Unique Teaching Method',
                ]),
                'content' => json_encode([
                    'uz' => '<p>TdTUTF jahon amaliy tajribasini ta\'lim sohasiga singdirgan holda xalqaro darajadagi mutaxassislarni tayyorlashga intiladi. Bizning talabalarimiz yetakchi mutaxassislar rahbarligida o\'qish imkoniyatlariga egadirlar. Talabalar keng ta\'lim olishlarida va ishga joylashishida tengi yo\'q bo\'lgan turli masalalarni yechish ko\'nikmalarini va malakalarini yaxshilash qobiliyatlarini rivojlantiradilar.</p>',
                    'ru' => '<p>ТдТУТФ стремится к подготовке специалистов международного уровня, внедряя мировой практический опыт в сферу образования.</p>',
                    'en' => '<p>TdTUTF strives to train international-level specialists by integrating global practical experience into education.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-kichik-guruhlar',
                'title' => json_encode([
                    'uz' => 'Kichik guruhlar samaradorligi',
                    'ru' => 'Эффективность малых групп',
                    'en' => 'Small Group Effectiveness',
                ]),
                'content' => json_encode([
                    'uz' => '<p>TdTUTF barcha talabalariga kichik guruhlarda, maxsus ishchi jamoalarida, tajribali o\'qituvchilar va akademiklar qo\'l ostida ta\'lim olish imkoniyatini taqdim qilish samaradorligi g\'oyasi tarafdoridir. Bu uslub talabalarning ijodkorligi va tashabbuskorligini rivojlantiradi va faol-tadqiqotlar olib boriladigan o\'quv muhitida bilim olishning foydaliligini oshiradi.</p>',
                    'ru' => '<p>ТдТУТФ является сторонником идеи эффективности предоставления всем студентам возможности обучения в малых группах.</p>',
                    'en' => '<p>TdTUTF advocates for small group learning effectiveness, providing all students the opportunity to study in specialized working teams.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-afzalliklar-bolim',
                'title' => json_encode([
                    'uz' => 'Bizning bitiruvchilarimizdagi afzalliklar va o\'ziga xosliklar',
                    'ru' => 'Преимущества и особенности наших выпускников',
                    'en' => 'Advantages and Characteristics of Our Graduates',
                ]),
                'content' => json_encode([
                    'uz' => '<ul><li>O\'z sohasida mukammal kompleks bilimlarga egaligi</li><li>Tanqidiy fikrlash va qo\'yilgan masalalarni yechish ko\'nikmasiga egaligi</li><li>Biznes savodxonligi va kirishuvchanligi</li><li>Yetakchilik sifatlari, jamoaviy ishlash va rivojlanish ko\'nikmalari</li><li>Ahloqiy kompetensiyaga egaligi va xalqaro bag\'rikengligi</li><li>O\'z ishiga sadoqat, hissiyotni jilovlay olish va sabr-toqatli bo\'lish</li></ul>',
                    'ru' => '<ul><li>Глубокие комплексные знания в своей области</li><li>Критическое мышление и навыки решения задач</li><li>Деловая грамотность и коммуникабельность</li><li>Лидерские качества, навыки командной работы</li><li>Этическая компетентность и международная толерантность</li><li>Преданность делу, эмоциональный контроль и терпение</li></ul>',
                    'en' => '<ul><li>Comprehensive knowledge in their field</li><li>Critical thinking and problem-solving skills</li><li>Business literacy and communication skills</li><li>Leadership qualities and teamwork skills</li><li>Ethical competence and international tolerance</li><li>Dedication, emotional control and patience</li></ul>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-afzalliklar',
                'title' => json_encode([
                    'uz' => 'Bizning bitiruvchilarimizdagi afzalliklar va o\'ziga xosliklar',
                    'ru' => 'Преимущества и особенности наших выпускников',
                    'en' => 'Advantages and Characteristics of Our Graduates',
                ]),
                'content' => json_encode([
                    'uz' => '<ul><li>O\'z sohasida mukammal kompleks bilimlarga egaligi</li><li>Tanqidiy fikrlash va qo\'yilgan masalalarni yechish ko\'nikmasiga egaligi</li><li>Biznes savodxonligi va kirishuvchanligi</li><li>Yetakchilik sifatlari, jamoaviy ishlash va rivojlanish ko\'nikmalari</li><li>Ahloqiy kompetensiyaga egaligi va xalqaro bag\'rikengligi</li><li>O\'z ishiga sadoqat, hissiyotni jilovlay olish va sabr-toqatli bo\'lish</li></ul>',
                    'ru' => '<ul><li>Глубокие комплексные знания в своей области</li><li>Критическое мышление и навыки решения задач</li><li>Деловая грамотность и коммуникабельность</li><li>Лидерские качества, навыки командной работы</li><li>Этическая компетентность и международная толерантность</li><li>Преданность делу, эмоциональный контроль и терпение</li></ul>',
                    'en' => '<ul><li>Comprehensive knowledge in their field</li><li>Critical thinking and problem-solving skills</li><li>Business literacy and communication skills</li><li>Leadership qualities and teamwork skills</li><li>Ethical competence and international tolerance</li><li>Dedication, emotional control and patience</li></ul>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'biz-haqimizda-litsenziyalar',
                'title' => json_encode([
                    'uz' => 'Litsenziya va sertifikatlar',
                    'ru' => 'Лицензии и сертификаты',
                    'en' => 'Licenses and Certificates',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Universitetning rasmiy litsenziya va sertifikatlari.</p>',
                    'ru' => '<p>Официальные лицензии и сертификаты университета.</p>',
                    'en' => '<p>Official licenses and certificates of the university.</p>',
                ]),
                'is_published' => true,
            ],
        ];

        foreach ($pages as $pageData) {
            $existing = Page::where('slug', $pageData['slug'])->first();
            if (! $existing) {
                // IMPORTANT: DB::table bypasses Eloquent HasSlug trait
                // which would auto-generate slug from title, overriding our explicit slug.
                DB::table('pages')->insert(array_merge($pageData, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $this->command->info("Created: {$pageData['slug']}");
            } else {
                // Update content if page exists but ensure slug stays correct
                $existing->setTranslations('title', json_decode($pageData['title'], true));
                $existing->setTranslations('content', json_decode($pageData['content'], true));
                // Force slug to stay as intended (HasSlug might try to regenerate)
                DB::table('pages')->where('id', $existing->id)->update([
                    'slug' => $pageData['slug'],
                    'updated_at' => now(),
                ]);
                $this->command->warn("Updated: {$pageData['slug']}");
            }
        }

        // Verify all slugs are correct
        $this->command->info("\n--- Verification ---");
        foreach ($pages as $pageData) {
            $page = Page::where('slug', $pageData['slug'])->first();
            $status = $page ? 'OK' : 'MISSING';
            $this->command->info("[$status] {$pageData['slug']}".($page ? " (id: {$page->id})" : ''));
        }

        // Clear page cache
        try {
            \Illuminate\Support\Facades\Cache::flush();
            $this->command->info("\nCache cleared.");
        } catch (\Exception $e) {
            $this->command->warn('Cache clear skipped: '.$e->getMessage());
        }
    }
}
