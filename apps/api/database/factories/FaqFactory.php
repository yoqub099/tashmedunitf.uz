<?php

namespace Database\Factories;

use App\Models\Faq;
use Illuminate\Database\Eloquent\Factories\Factory;

class FaqFactory extends Factory
{
    protected $model = Faq::class;

    public function definition(): array
    {
        $categories = ['admission', 'education', 'dormitory', 'scholarship', 'transfer', 'documents', 'general'];

        return [
            'question' => [
                'uz' => fake('uz_UZ')->sentence(8).'?',
                'ru' => fake('ru_RU')->sentence(8).'?',
                'en' => fake()->sentence(8).'?',
            ],
            'answer' => [
                'uz' => fake('uz_UZ')->paragraphs(2, true),
                'ru' => fake('ru_RU')->paragraphs(2, true),
                'en' => fake()->paragraphs(2, true),
            ],
            'category' => fake()->randomElement($categories),
            'is_active' => fake()->boolean(90),
            'order' => fake()->numberBetween(1, 50),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function category(string $category): static
    {
        return $this->state(fn () => ['category' => $category]);
    }
}
