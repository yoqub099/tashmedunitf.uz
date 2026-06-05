<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class NavigationSeeder extends Seeder
{
    /**
     * Seed the navigation tree matching frontend/src/config/navigation.ts
     *
     * Creates the entire navigation hierarchy in the pages table.
     * Uses firstOrCreate to avoid duplicates. Wrapped in a transaction.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->command->info('Starting navigation tree seeding...');

            $created = 0;
            $skipped = 0;

            // ================================================================
            // 1. Biz haqimizda (group)
            // ================================================================
            [$bizHaqimizda, $wasCreated] = $this->createNavPage(
                slug: 'biz-haqimizda',
                title: ['uz' => 'Biz haqimizda', 'ru' => 'О нас', 'en' => 'About Us'],
                pageType: 'group',
                sortOrder: 1,
                parentId: null,
            );
            $wasCreated ? $created++ : $skipped++;

            // 1.1 Umumiy ma'lumot
            $this->track($this->createNavPage(
                slug: 'umumiy-malumot',
                title: ['uz' => "Umumiy ma'lumot", 'ru' => 'Общая информация', 'en' => 'General Info'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // 1.2 ACCA haqida
            $this->track($this->createNavPage(
                slug: 'acca-haqida',
                title: ['uz' => 'ACCA haqida', 'ru' => 'Об ACCA', 'en' => 'About ACCA'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // 1.3 Tuzilma (group)
            [$tuzilma] = $this->createNavPage(
                slug: 'tuzilma',
                title: ['uz' => 'Tuzilma', 'ru' => 'Структура', 'en' => 'Structure'],
                pageType: 'group',
                sortOrder: 3,
                parentId: $bizHaqimizda->id,
            );

            $tuzilmaChildren = [
                ['konsultativ-organlar', ['uz' => 'Konsultativ organlar', 'ru' => 'Консультативные органы', 'en' => 'Advisory Bodies']],
                ['rektorat',             ['uz' => 'Rektorat', 'ru' => 'Ректорат', 'en' => 'Rectorate']],
                ['fakultetlar',          ['uz' => 'Fakultetlar', 'ru' => 'Факультеты', 'en' => 'Faculties']],
                ['kafedralar',           ['uz' => 'Kafedralar', 'ru' => 'Кафедры', 'en' => 'Departments']],
                ['xodimlar',             ['uz' => 'Xodimlar', 'ru' => 'Сотрудники', 'en' => 'Staff']],
                ['filiallar',            ['uz' => 'Filiallar', 'ru' => 'Филиалы', 'en' => 'Branches']],
            ];
            foreach ($tuzilmaChildren as $i => [$slug, $title]) {
                $this->track($this->createNavPage(
                    slug: $slug,
                    title: $title,
                    pageType: 'content',
                    sortOrder: $i + 1,
                    parentId: $tuzilma->id,
                ), $created, $skipped);
            }

            // 1.4 Virtual qabulxona
            $this->track($this->createNavPage(
                slug: 'virtual-qabulxona',
                title: ['uz' => 'Virtual qabulxona', 'ru' => 'Виртуальная приёмная', 'en' => 'Virtual Reception'],
                pageType: 'content',
                sortOrder: 4,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // 1.5 Murojaatlar tartibi
            $this->track($this->createNavPage(
                slug: 'murojaatlar-tartibi',
                title: ['uz' => 'Murojaatlar tartibi', 'ru' => 'Порядок обращений', 'en' => 'Appeal Procedure'],
                pageType: 'content',
                sortOrder: 5,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // 1.6 Me'yoriy hujjatlar (group)
            [$meyoriyHujjatlar] = $this->createNavPage(
                slug: 'meyoriy-hujjatlar',
                title: ['uz' => "Me'yoriy hujjatlar", 'ru' => 'Нормативные документы', 'en' => 'Regulatory Documents'],
                pageType: 'group',
                sortOrder: 6,
                parentId: $bizHaqimizda->id,
            );

            $meyoriyChildren = [
                ['qonunlar',            ['uz' => 'Qonunlar', 'ru' => 'Законы', 'en' => 'Laws']],
                ['prezident-qarorlari',  ['uz' => 'Prezident qarorlari', 'ru' => 'Указы Президента', 'en' => 'Presidential Decrees']],
                ['vazirlar-mahkamasi',   ['uz' => 'Vazirlar mahkamasi', 'ru' => 'Кабинет Министров', 'en' => 'Cabinet of Ministers']],
                ['nizom',               ['uz' => 'Nizom', 'ru' => 'Устав', 'en' => 'Charter']],
                ['ichki-hujjatlar',     ['uz' => 'Ichki hujjatlar', 'ru' => 'Внутренние документы', 'en' => 'Internal Documents']],
                ['ishga-qabul',         ['uz' => 'Ishga qabul', 'ru' => 'Приём на работу', 'en' => 'Employment']],
                ['elonlar',             ['uz' => "E'lonlar", 'ru' => 'Объявления', 'en' => 'Announcements']],
                ['akademik-hujjatlar',  ['uz' => 'Akademik hujjatlar', 'ru' => 'Академические документы', 'en' => 'Academic Documents']],
                ['vazirlik-hujjatlari', ['uz' => 'Vazirlik hujjatlari', 'ru' => 'Документы министерства', 'en' => 'Ministry Documents']],
            ];
            foreach ($meyoriyChildren as $i => [$slug, $title]) {
                $this->track($this->createNavPage(
                    slug: $slug,
                    title: $title,
                    pageType: 'content',
                    sortOrder: $i + 1,
                    parentId: $meyoriyHujjatlar->id,
                ), $created, $skipped);
            }

            // 1.7 Sifat siyosati
            $this->track($this->createNavPage(
                slug: 'sifat-siyosati',
                title: ['uz' => 'Sifat siyosati', 'ru' => 'Политика качества', 'en' => 'Quality Policy'],
                pageType: 'content',
                sortOrder: 7,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // 1.8 Antikorrupsiya
            $this->track($this->createNavPage(
                slug: 'antikorrupsiya',
                title: ['uz' => 'Antikorrupsiya', 'ru' => 'Антикоррупция', 'en' => 'Anti-corruption'],
                pageType: 'content',
                sortOrder: 8,
                parentId: $bizHaqimizda->id,
            ), $created, $skipped);

            // ================================================================
            // 2. Faoliyat (group)
            // ================================================================
            [$faoliyat] = $this->createNavPage(
                slug: 'faoliyat',
                title: ['uz' => 'Faoliyat', 'ru' => 'Деятельность', 'en' => 'Activities'],
                pageType: 'group',
                sortOrder: 2,
                parentId: null,
            );

            // 2.1 Ilmiy faoliyat (group)
            [$ilmiyFaoliyat] = $this->createNavPage(
                slug: 'ilmiy-faoliyat',
                title: ['uz' => 'Ilmiy faoliyat', 'ru' => 'Научная деятельность', 'en' => 'Scientific Activities'],
                pageType: 'group',
                sortOrder: 1,
                parentId: $faoliyat->id,
            );

            // 2.1.1 Ilmiy jurnal
            $this->track($this->createNavPage(
                slug: 'ilmiy-jurnal',
                title: ['uz' => 'Ilmiy jurnal', 'ru' => 'Научный журнал', 'en' => 'Scientific Journal'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.1.2 Tadqiqot
            $this->track($this->createNavPage(
                slug: 'tadqiqot',
                title: ['uz' => 'Tadqiqot', 'ru' => 'Исследования', 'en' => 'Research'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.1.3 Konferensiyalar (under ilmiy faoliyat)
            $this->track($this->createNavPage(
                slug: 'ilmiy-konferensiyalar',
                title: ['uz' => 'Konferensiyalar', 'ru' => 'Конференции', 'en' => 'Conferences'],
                pageType: 'content',
                sortOrder: 3,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.1.4 Ilmiy ishlar va innovatsiyalar
            $this->track($this->createNavPage(
                slug: 'ilmiy-ishlar-va-innovatsiyalar',
                title: ['uz' => 'Ilmiy ishlar va innovatsiyalar', 'ru' => 'Научные работы и инновации', 'en' => 'Scientific Works & Innovations'],
                pageType: 'content',
                sortOrder: 4,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.1.5 Doktorantura (group)
            [$doktorantura] = $this->createNavPage(
                slug: 'doktorantura',
                title: ['uz' => 'Doktorantura', 'ru' => 'Докторантура', 'en' => 'Doctoral Studies'],
                pageType: 'group',
                sortOrder: 5,
                parentId: $ilmiyFaoliyat->id,
            );

            $doktoranturaChildren = [
                ['tadqiqotchilar',      ['uz' => 'Tadqiqotchilar', 'ru' => 'Исследователи', 'en' => 'Researchers']],
                ['imtihon-dasturlari',  ['uz' => 'Imtihon dasturlari', 'ru' => 'Программы экзаменов', 'en' => 'Exam Programs']],
                ['imtihon-savollari',   ['uz' => 'Imtihon savollari', 'ru' => 'Экзаменационные вопросы', 'en' => 'Exam Questions']],
            ];
            foreach ($doktoranturaChildren as $i => [$slug, $title]) {
                $this->track($this->createNavPage(
                    slug: $slug,
                    title: $title,
                    pageType: 'content',
                    sortOrder: $i + 1,
                    parentId: $doktorantura->id,
                ), $created, $skipped);
            }

            // 2.1.6 Iqtidorli talabalar
            $this->track($this->createNavPage(
                slug: 'iqtidorli-talabalar',
                title: ['uz' => 'Iqtidorli talabalar', 'ru' => 'Одарённые студенты', 'en' => 'Talented Students'],
                pageType: 'content',
                sortOrder: 6,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.1.7 OAQ tavsiya nashrlar
            $this->track($this->createNavPage(
                slug: 'oaq-tavsiya-nashrlar',
                title: ['uz' => 'OAQ tavsiya nashrlari', 'ru' => 'Рекомендуемые издания ВАК', 'en' => 'HAC Recommended Publications'],
                pageType: 'content',
                sortOrder: 7,
                parentId: $ilmiyFaoliyat->id,
            ), $created, $skipped);

            // 2.2 O'quv faoliyati
            $this->track($this->createNavPage(
                slug: 'oquv-faoliyati',
                title: ['uz' => "O'quv faoliyati", 'ru' => 'Учебная деятельность', 'en' => 'Educational Activities'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $faoliyat->id,
            ), $created, $skipped);

            // 2.3 Xalqaro hamkorlik
            $this->track($this->createNavPage(
                slug: 'xalqaro-hamkorlik',
                title: ['uz' => 'Xalqaro hamkorlik', 'ru' => 'Международное сотрудничество', 'en' => 'International Cooperation'],
                pageType: 'content',
                sortOrder: 3,
                parentId: $faoliyat->id,
            ), $created, $skipped);

            // 2.4 Tadqiqod markazi
            $this->track($this->createNavPage(
                slug: 'tadqiqod-markazi',
                title: ['uz' => 'Tadqiqod markazi', 'ru' => 'Исследовательский центр', 'en' => 'Research Center'],
                pageType: 'content',
                sortOrder: 4,
                parentId: $faoliyat->id,
            ), $created, $skipped);

            // ================================================================
            // 3. Abiturientlarga (group)
            // ================================================================
            [$abiturientlarga] = $this->createNavPage(
                slug: 'abiturientlarga',
                title: ['uz' => 'Abiturientlarga', 'ru' => 'Абитуриентам', 'en' => 'For Applicants'],
                pageType: 'group',
                sortOrder: 3,
                parentId: null,
            );

            // 3.1 Qabul komissiyasi
            $this->track($this->createNavPage(
                slug: 'qabul-komissiyasi',
                title: ['uz' => 'Qabul komissiyasi', 'ru' => 'Приёмная комиссия', 'en' => 'Admission Commission'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $abiturientlarga->id,
            ), $created, $skipped);

            // 3.2 Bakalavriat (group)
            [$bakalavriat] = $this->createNavPage(
                slug: 'bakalavriat',
                title: ['uz' => 'Bakalavriat', 'ru' => 'Бакалавриат', 'en' => "Bachelor's"],
                pageType: 'group',
                sortOrder: 2,
                parentId: $abiturientlarga->id,
            );

            $this->track($this->createNavPage(
                slug: 'tibbiyot-fakulteti',
                title: ['uz' => 'Tibbiyot fakulteti', 'ru' => 'Медицинский факультет', 'en' => 'Faculty of Medicine'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $bakalavriat->id,
            ), $created, $skipped);

            $this->track($this->createNavPage(
                slug: 'farmatsiya-fakulteti',
                title: ['uz' => 'Farmatsiya fakulteti', 'ru' => 'Фармацевтический факультет', 'en' => 'Faculty of Pharmacy'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $bakalavriat->id,
            ), $created, $skipped);

            // 3.3 Klinik ordinatura (group)
            [$ordinatura] = $this->createNavPage(
                slug: 'ordinatura',
                title: ['uz' => 'Klinik ordinatura', 'ru' => 'Клиническая ординатура', 'en' => 'Clinical Residency'],
                pageType: 'group',
                sortOrder: 3,
                parentId: $abiturientlarga->id,
            );

            $this->track($this->createNavPage(
                slug: 'klinik-tibbiyot-fakulteti',
                title: ['uz' => 'Klinik tibbiyot fakulteti', 'ru' => 'Клинико-медицинский факультет', 'en' => 'Faculty of Clinical Medicine'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $ordinatura->id,
            ), $created, $skipped);

            // 3.4 Magistratura (group)
            [$magistratura] = $this->createNavPage(
                slug: 'magistratura',
                title: ['uz' => 'Magistratura', 'ru' => 'Магистратура', 'en' => "Master's"],
                pageType: 'group',
                sortOrder: 4,
                parentId: $abiturientlarga->id,
            );

            $this->track($this->createNavPage(
                slug: 'ilmiy-tadqiqot-fakulteti',
                title: ['uz' => 'Ilmiy-tadqiqot fakulteti', 'ru' => 'Научно-исследовательский факультет', 'en' => 'Faculty of Scientific Research'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $magistratura->id,
            ), $created, $skipped);

            // 3.5 O'qishni ko'chirish va tiklash
            $this->track($this->createNavPage(
                slug: 'oqishni-kochirish-va-tiklash',
                title: ['uz' => "O'qishni ko'chirish va tiklash", 'ru' => 'Перевод и восстановление', 'en' => 'Transfer & Restoration'],
                pageType: 'content',
                sortOrder: 5,
                parentId: $abiturientlarga->id,
            ), $created, $skipped);

            // 3.6 Test fanlar majmuasi
            $this->track($this->createNavPage(
                slug: 'test-topshiriladigan-fanlar',
                title: ['uz' => 'Test fanlar majmuasi', 'ru' => 'Тестовые предметы', 'en' => 'Test Subjects'],
                pageType: 'content',
                sortOrder: 6,
                parentId: $abiturientlarga->id,
            ), $created, $skipped);

            // ================================================================
            // 4. Talabalarga (group)
            // ================================================================
            [$talabalarga] = $this->createNavPage(
                slug: 'talabalarga',
                title: ['uz' => 'Talabalarga', 'ru' => 'Студентам', 'en' => 'For Students'],
                pageType: 'group',
                sortOrder: 4,
                parentId: null,
            );

            // 4.1 Karyera markazi (group)
            [$karyeraMarkazi] = $this->createNavPage(
                slug: 'karyera-markazi',
                title: ['uz' => 'TdTUTF Karyera Markazi', 'ru' => 'Центр карьеры ТдТУТФ', 'en' => 'TdTUTF Career Center'],
                pageType: 'group',
                sortOrder: 1,
                parentId: $talabalarga->id,
            );

            $this->track($this->createNavPage(
                slug: 'karyera-markazi-sahifa',
                title: ['uz' => 'TdTUTF Karyera Markazi', 'ru' => 'Центр карьеры ТдТУТФ', 'en' => 'TdTUTF Career Center'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $karyeraMarkazi->id,
            ), $created, $skipped);

            $this->track($this->createNavPage(
                slug: 'bosh-ish-orinlari',
                title: ['uz' => "Bo'sh ish o'rinlari", 'ru' => 'Вакансии', 'en' => 'Job Openings'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $karyeraMarkazi->id,
            ), $created, $skipped);

            // 4.2 Kutubxona (group)
            [$kutubxona] = $this->createNavPage(
                slug: 'kutubxona',
                title: ['uz' => 'Kutubxona', 'ru' => 'Библиотека', 'en' => 'Library'],
                pageType: 'group',
                sortOrder: 2,
                parentId: $talabalarga->id,
            );

            // E-Library (external link)
            $this->track($this->createNavPage(
                slug: 'e-library',
                title: ['uz' => 'E-Library', 'ru' => 'E-Library', 'en' => 'E-Library'],
                pageType: 'link',
                sortOrder: 1,
                parentId: $kutubxona->id,
                externalUrl: 'https://unilibrary.uz/',
            ), $created, $skipped);

            // Emerald (external link)
            $this->track($this->createNavPage(
                slug: 'emerald',
                title: ['uz' => 'Emerald', 'ru' => 'Emerald', 'en' => 'Emerald'],
                pageType: 'link',
                sortOrder: 2,
                parentId: $kutubxona->id,
                externalUrl: 'https://www.emerald.com/',
            ), $created, $skipped);

            // Ichki kutubxona
            $this->track($this->createNavPage(
                slug: 'ichki-kutubxona',
                title: ['uz' => 'Ichki kutubxona', 'ru' => 'Внутренняя библиотека', 'en' => 'Internal Library'],
                pageType: 'content',
                sortOrder: 3,
                parentId: $kutubxona->id,
            ), $created, $skipped);

            // 4.3 Talaba ishlari
            $this->track($this->createNavPage(
                slug: 'talaba-ishlari',
                title: ['uz' => 'Talaba ishlari', 'ru' => 'Студенческие дела', 'en' => 'Student Affairs'],
                pageType: 'content',
                sortOrder: 3,
                parentId: $talabalarga->id,
            ), $created, $skipped);

            // ================================================================
            // 5. Yangiliklar (group)
            // ================================================================
            [$yangiliklar] = $this->createNavPage(
                slug: 'yangiliklar',
                title: ['uz' => 'Yangiliklar', 'ru' => 'Новости', 'en' => 'News'],
                pageType: 'group',
                sortOrder: 5,
                parentId: null,
            );

            $this->track($this->createNavPage(
                slug: 'yangiliklar-sahifa',
                title: ['uz' => 'Yangiliklar', 'ru' => 'Новости', 'en' => 'News'],
                pageType: 'content',
                sortOrder: 1,
                parentId: $yangiliklar->id,
            ), $created, $skipped);

            $this->track($this->createNavPage(
                slug: 'tadbirlar',
                title: ['uz' => 'Tadbirlar', 'ru' => 'Мероприятия', 'en' => 'Events'],
                pageType: 'content',
                sortOrder: 2,
                parentId: $yangiliklar->id,
            ), $created, $skipped);

            $this->track($this->createNavPage(
                slug: 'yangiliklar-konferensiyalar',
                title: ['uz' => 'Konferensiyalar', 'ru' => 'Конференции', 'en' => 'Conferences'],
                pageType: 'content',
                sortOrder: 3,
                parentId: $yangiliklar->id,
            ), $created, $skipped);

            // ================================================================
            // 6. FAQ (content, root)
            // ================================================================
            $this->track($this->createNavPage(
                slug: 'faq',
                title: ['uz' => 'FAQ', 'ru' => 'FAQ', 'en' => 'FAQ'],
                pageType: 'content',
                sortOrder: 6,
                parentId: null,
            ), $created, $skipped);

            // ================================================================
            // 7. Aloqa (content, root)
            // ================================================================
            $this->track($this->createNavPage(
                slug: 'aloqa',
                title: ['uz' => 'Aloqa', 'ru' => 'Контакты', 'en' => 'Contact'],
                pageType: 'content',
                sortOrder: 7,
                parentId: null,
            ), $created, $skipped);

            $this->command->info("Navigation seeding complete: {$created} created, {$skipped} updated (already existed).");
        });
    }

    /**
     * Create a navigation page or update existing one with nav fields.
     *
     * If the page already exists (by slug), update its navigation-related
     * fields (is_nav_item, parent_id, sort_order, page_type, external_url)
     * without overwriting existing content.
     *
     * @return array{0: Page, 1: bool} [page, wasCreated]
     */
    private function createNavPage(
        string $slug,
        array $title,
        string $pageType,
        int $sortOrder,
        ?int $parentId,
        ?string $externalUrl = null,
    ): array {
        $existing = Page::where('slug', $slug)->first();

        if ($existing) {
            // Update navigation fields on the existing page
            $existing->update([
                'is_nav_item' => true,
                'parent_id' => $parentId,
                'sort_order' => $sortOrder,
                'page_type' => $pageType,
                'is_published' => true,
                'external_url' => $externalUrl,
            ]);

            return [$existing->fresh(), false];
        }

        $page = Page::create([
            'slug' => $slug,
            'title' => $title,
            'content' => ['uz' => '', 'ru' => '', 'en' => ''],
            'is_published' => true,
            'parent_id' => $parentId,
            'sort_order' => $sortOrder,
            'is_nav_item' => true,
            'page_type' => $pageType,
            'path' => '',
            'external_url' => $externalUrl,
        ]);

        return [$page, true];
    }

    /**
     * Track created/skipped counts by reference.
     */
    private function track(array $result, int &$created, int &$skipped): void
    {
        $result[1] ? $created++ : $skipped++;
    }
}
