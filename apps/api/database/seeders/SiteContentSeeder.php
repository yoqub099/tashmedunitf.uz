<?php

namespace Database\Seeders;

use App\Models\SiteContent;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $heroContents = [
            [
                'key' => 'hero_heading',
                'section' => 'hero',
                'value' => [
                    'uz' => "Ta'lim berish va tahsil olishda o'zgacha yondashuv",
                    'ru' => 'Уникальный подход к преподаванию и обучению',
                    'en' => 'A unique approach to teaching and learning',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_mission_title',
                'section' => 'hero',
                'value' => [
                    'uz' => 'TTATF ning missiyasi va falsafasi',
                    'ru' => 'Миссия и философия ТТАТФ',
                    'en' => 'Mission and philosophy of TSAFT',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_mission_text',
                'section' => 'hero',
                'value' => [
                    'uz' => "Bizning missiyamiz — zamonaviy ta'lim standartlari asosida malakali mutaxassislar tayyorlash, ilmiy salohiyatni oshirish va jamiyat taraqqiyotiga hissa qo'shishdir.",
                    'ru' => 'Наша миссия — подготовка квалифицированных специалистов на основе современных образовательных стандартов, повышение научного потенциала и вклад в развитие общества.',
                    'en' => 'Our mission is to train qualified specialists based on modern educational standards, enhance scientific potential, and contribute to the development of society.',
                ],
                'type' => 'textarea',
            ],
            [
                'key' => 'hero_contact_title',
                'section' => 'hero',
                'value' => [
                    'uz' => "Hoziroq biz bilan bog'laning",
                    'ru' => 'Свяжитесь с нами прямо сейчас',
                    'en' => 'Contact us right now',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_contact_text',
                'section' => 'hero',
                'value' => [
                    'uz' => "O'zingiz istagan savollarga javob oling yoki hujjatlaringizni topshirish jarayonida yordam so'rang.",
                    'ru' => 'Получите ответы на ваши вопросы или запросите помощь в процессе подачи документов.',
                    'en' => 'Get answers to your questions or request help with the application process.',
                ],
                'type' => 'textarea',
            ],
            [
                'key' => 'hero_stats_number',
                'section' => 'hero',
                'value' => [
                    'uz' => '25 000+',
                    'ru' => '25 000+',
                    'en' => '25,000+',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_stats_title',
                'section' => 'hero',
                'value' => [
                    'uz' => 'Talabalar',
                    'ru' => 'Студенты',
                    'en' => 'Students',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_stats_text',
                'section' => 'hero',
                'value' => [
                    'uz' => '25 000 ko\'p inson aynan bizni tanladi!',
                    'ru' => 'Более 25 000 человек выбрали именно нас!',
                    'en' => 'More than 25,000 people chose us!',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_cta_title',
                'section' => 'hero',
                'value' => [
                    'uz' => 'Hoziroq TTATF talabasi bo\'ling',
                    'ru' => 'Станьте студентом ТТАТФ прямо сейчас',
                    'en' => 'Become a TSAFT student right now',
                ],
                'type' => 'text',
            ],
            [
                'key' => 'hero_cta_text',
                'section' => 'hero',
                'value' => [
                    'uz' => 'va bizning filialimizda BEPUL o\'qish imkoniyatini qo\'lga kiriting',
                    'ru' => 'и получите возможность БЕСПЛАТНОГО обучения в нашем филиале',
                    'en' => 'and get the opportunity to study for FREE at our branch',
                ],
                'type' => 'text',
            ],
        ];

        foreach ($heroContents as $content) {
            SiteContent::updateOrCreate(
                ['key' => $content['key']],
                [
                    'section' => $content['section'],
                    'value' => $content['value'],
                    'type' => $content['type'],
                ]
            );
        }

        // ---- Ijtimoiy tarmoq linklari ----
        $socialLinks = [
            ['key' => 'social_telegram',  'section' => 'social', 'value' => ['uz' => 'https://t.me/tdtutf',                'ru' => 'https://t.me/tdtutf',                'en' => 'https://t.me/tdtutf'],                'type' => 'text'],
            ['key' => 'social_instagram', 'section' => 'social', 'value' => ['uz' => 'https://instagram.com/tdtutf',        'ru' => 'https://instagram.com/tdtutf',        'en' => 'https://instagram.com/tdtutf'],        'type' => 'text'],
            ['key' => 'social_facebook',  'section' => 'social', 'value' => ['uz' => 'https://facebook.com/tdtutf',         'ru' => 'https://facebook.com/tdtutf',         'en' => 'https://facebook.com/tdtutf'],         'type' => 'text'],
            ['key' => 'social_youtube',   'section' => 'social', 'value' => ['uz' => 'https://youtube.com/@tdtutf',         'ru' => 'https://youtube.com/@tdtutf',         'en' => 'https://youtube.com/@tdtutf'],         'type' => 'text'],
            ['key' => 'social_linkedin',  'section' => 'social', 'value' => ['uz' => 'https://linkedin.com/company/tdtutf', 'ru' => 'https://linkedin.com/company/tdtutf', 'en' => 'https://linkedin.com/company/tdtutf'], 'type' => 'text'],
        ];

        foreach ($socialLinks as $link) {
            SiteContent::updateOrCreate(
                ['key' => $link['key']],
                ['section' => $link['section'], 'value' => $link['value'], 'type' => $link['type']]
            );
        }
    }
}
