<?php

namespace Database\Seeders;

use App\Models\Page;
use App\Services\CacheService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * ============================================================
 * FAOLIYAT — ilmiy faoliyat sahifalari (doktorantura bloki)
 * ============================================================
 * Kontent eski saytdan (tashmedunitf.uz/ilmiy-tadqiqot-faoliyati-2)
 * olingan haqiqiy faktlar (6 DSc + 13 PhD, yo'nalishlar) asosida,
 * ISFT uslubida qisqa-lo'nda qayta yozilgan. Frontend bu slug'larni
 * getPageBySlug() bilan o'qiydi; topilmasa i18n fallback ishlaydi.
 * ============================================================
 */
class FaoliyatSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'slug' => 'doktorantura',
                'title' => json_encode([
                    'uz' => 'Doktorantura',
                    'ru' => 'Докторантура',
                    'en' => 'Doctoral Studies',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Toshkent davlat tibbiyot universiteti Termiz filialida yuqori malakali ilmiy-pedagog kadrlar <strong>doktorantura (PhD)</strong> va <strong>katta ilmiy xodim-izlanuvchilik (DSc)</strong> shakllari orqali tayyorlanadi. Bugungi kunda filialda <strong>6 nafar fan doktori (DSc)</strong> va <strong>13 nafar fan nomzodi (PhD)</strong> faoliyat yuritadi.</p><p>Tadqiqotlar bolalar jarrohligi, nevrologiya, pediatriya, onkologiya, anatomiya, patologik fiziologiya va epidemiologiya yo\'nalishlarini qamrab oladi. Ilmiy natijalar Scopus va ScienceDirect bazalaridagi nufuzli jurnallarda nashr etilishi rag\'batlantiriladi.</p>',
                    'ru' => '<p>В Термезском филиале Ташкентского государственного медицинского университета высококвалифицированные научно-педагогические кадры готовятся через <strong>докторантуру (PhD)</strong> и <strong>самостоятельное соискательство (DSc)</strong>. Сегодня в филиале работают <strong>6 докторов наук (DSc)</strong> и <strong>13 кандидатов наук (PhD)</strong>.</p><p>Исследования охватывают детскую хирургию, неврологию, педиатрию, онкологию, анатомию, патологическую физиологию и эпидемиологию. Поощряется публикация научных результатов в авторитетных журналах баз Scopus и ScienceDirect.</p>',
                    'en' => '<p>At the Termez branch of Tashkent State Medical University, highly qualified academic staff are trained through <strong>doctoral studies (PhD)</strong> and <strong>senior research fellowship (DSc)</strong> programs. The branch currently has <strong>6 Doctors of Science (DSc)</strong> and <strong>13 Candidates of Science (PhD)</strong>.</p><p>Research covers pediatric surgery, neurology, pediatrics, oncology, anatomy, pathophysiology and epidemiology. Publishing results in reputable Scopus and ScienceDirect indexed journals is actively encouraged.</p>',
                ]),
                'is_published' => true,
            ],
            [
                'slug' => 'tadqiqotchilar',
                'title' => json_encode([
                    'uz' => 'Tadqiqotchilar',
                    'ru' => 'Исследователи',
                    'en' => 'Researchers',
                ]),
                'content' => json_encode([
                    'uz' => '<p>Filialning ilmiy salohiyati <strong>6 nafar fan doktori (DSc)</strong> va <strong>13 nafar fan nomzodi (PhD)</strong>dan iborat.</p><p><strong>Fan doktorlari</strong> bolalar jarrohligi, nevrologiya, pediatriya, allergologiya-immunologiya va neyroxirurgiya sohalarida; <strong>fan nomzodlari</strong> esa patologik fiziologiya, jarrohlik, onkologiya, patologik anatomiya, odam anatomiyasi va epidemiologiya yo\'nalishlarida ilmiy-tadqiqot ishlarini olib boradi.</p>',
                    'ru' => '<p>Научный потенциал филиала составляют <strong>6 докторов наук (DSc)</strong> и <strong>13 кандидатов наук (PhD)</strong>.</p><p><strong>Доктора наук</strong> работают в области детской хирургии, неврологии, педиатрии, аллергологии-иммунологии и нейрохирургии; <strong>кандидаты наук</strong> — в области патологической физиологии, хирургии, онкологии, патологической анатомии, анатомии человека и эпидемиологии.</p>',
                    'en' => '<p>The branch\'s research capacity comprises <strong>6 Doctors of Science (DSc)</strong> and <strong>13 Candidates of Science (PhD)</strong>.</p><p><strong>Doctors of Science</strong> work in pediatric surgery, neurology, pediatrics, allergology-immunology and neurosurgery; <strong>Candidates of Science</strong> work in pathophysiology, surgery, oncology, pathological anatomy, human anatomy and epidemiology.</p>',
                ]),
                'is_published' => true,
            ],
        ];

        foreach ($pages as $pageData) {
            $existing = Page::where('slug', $pageData['slug'])->first();
            if (! $existing) {
                DB::table('pages')->insert(array_merge($pageData, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ]));
                $this->command->info("Created: {$pageData['slug']}");
            } else {
                DB::table('pages')->where('id', $existing->id)->update([
                    'title' => $pageData['title'],
                    'content' => $pageData['content'],
                    'is_published' => $pageData['is_published'],
                    'updated_at' => now(),
                ]);
                $this->command->warn("Updated: {$pageData['slug']} (id: {$existing->id})");
            }
        }

        CacheService::clearModel(CacheService::PREFIX_PAGES);
        CacheService::clearModel(CacheService::PREFIX_NAV);
        $this->command->info("\nFaoliyat (doktorantura/tadqiqotchilar) yangilandi.");
    }
}
