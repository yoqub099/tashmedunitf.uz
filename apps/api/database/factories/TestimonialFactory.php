<?php

namespace Database\Factories;

use App\Models\Testimonial;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestimonialFactory extends Factory
{
    protected $model = Testimonial::class;

    public function definition(): array
    {
        $roles = [
            'uz' => ['Talaba', 'Bitiruvchi', 'Professor', 'Hamkor', 'Rezident'],
            'ru' => ['Студент', 'Выпускник', 'Профессор', 'Партнёр', 'Резидент'],
            'en' => ['Student', 'Graduate', 'Professor', 'Partner', 'Resident'],
        ];
        $roleIndex = fake()->numberBetween(0, 4);

        return [
            'author_name' => [
                'uz' => fake('uz_UZ')->name(),
                'ru' => fake('ru_RU')->name(),
                'en' => fake()->name(),
            ],
            'author_role' => [
                'uz' => $roles['uz'][$roleIndex],
                'ru' => $roles['ru'][$roleIndex],
                'en' => $roles['en'][$roleIndex],
            ],
            'content' => [
                'uz' => fake('uz_UZ')->paragraphs(2, true),
                'ru' => fake('ru_RU')->paragraphs(2, true),
                'en' => fake()->paragraphs(2, true),
            ],
            'rating' => fake()->numberBetween(4, 5),
            'is_active' => fake()->boolean(85),
            'order' => fake()->numberBetween(1, 30),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function fiveStars(): static
    {
        return $this->state(fn () => ['rating' => 5]);
    }
}
