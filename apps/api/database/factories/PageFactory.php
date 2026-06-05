<?php

namespace Database\Factories;

use App\Models\Page;
use Illuminate\Database\Eloquent\Factories\Factory;

class PageFactory extends Factory
{
    protected $model = Page::class;

    public function definition(): array
    {
        $pages = [
            ['slug' => 'about', 'uz' => 'Biz haqimizda', 'ru' => 'О нас', 'en' => 'About Us'],
            ['slug' => 'history', 'uz' => 'Tarix', 'ru' => 'История', 'en' => 'History'],
            ['slug' => 'mission', 'uz' => 'Missiya', 'ru' => 'Миссия', 'en' => 'Mission'],
            ['slug' => 'admission', 'uz' => 'Qabul', 'ru' => 'Приём', 'en' => 'Admission'],
            ['slug' => 'campus', 'uz' => 'Kampus', 'ru' => 'Кампус', 'en' => 'Campus'],
            ['slug' => 'library', 'uz' => 'Kutubxona', 'ru' => 'Библиотека', 'en' => 'Library'],
        ];
        $page = fake()->randomElement($pages);

        return [
            'title' => [
                'uz' => $page['uz'],
                'ru' => $page['ru'],
                'en' => $page['en'],
            ],
            'slug' => $page['slug'].'-'.fake()->unique()->numerify('###'),
            'content' => [
                'uz' => fake('uz_UZ')->paragraphs(6, true),
                'ru' => fake('ru_RU')->paragraphs(6, true),
                'en' => fake()->paragraphs(6, true),
            ],
            'meta_title' => [
                'uz' => $page['uz'].' — TDTUTF',
                'ru' => $page['ru'].' — ТГМУТФ',
                'en' => $page['en'].' — TSMU TF',
            ],
            'meta_description' => [
                'uz' => fake('uz_UZ')->sentence(12),
                'ru' => fake('ru_RU')->sentence(12),
                'en' => fake()->sentence(12),
            ],
            'is_active' => fake()->boolean(90),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function withSlug(string $slug): static
    {
        return $this->state(fn () => ['slug' => $slug]);
    }
}
