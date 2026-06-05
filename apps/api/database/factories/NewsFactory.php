<?php

namespace Database\Factories;

use App\Enums\NewsCategory;
use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;

class NewsFactory extends Factory
{
    protected $model = News::class;

    public function definition(): array
    {
        $categories = array_column(NewsCategory::cases(), 'value');

        return [
            'title' => [
                'uz' => fake('uz_UZ')->sentence(6),
                'ru' => fake('ru_RU')->sentence(6),
                'en' => fake()->sentence(6),
            ],
            'excerpt' => [
                'uz' => fake('uz_UZ')->paragraph(1),
                'ru' => fake('ru_RU')->paragraph(1),
                'en' => fake()->paragraph(1),
            ],
            'content' => [
                'uz' => fake('uz_UZ')->paragraphs(5, true),
                'ru' => fake('ru_RU')->paragraphs(5, true),
                'en' => fake()->paragraphs(5, true),
            ],
            'category' => fake()->randomElement($categories),
            'is_published' => fake()->boolean(80),
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'is_published' => true,
            'published_at' => now(),
        ]);
    }

    public function draft(): static
    {
        return $this->state(fn () => [
            'is_published' => false,
            'published_at' => null,
        ]);
    }
}
