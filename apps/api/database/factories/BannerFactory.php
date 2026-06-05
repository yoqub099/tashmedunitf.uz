<?php

namespace Database\Factories;

use App\Models\Banner;
use Illuminate\Database\Eloquent\Factories\Factory;

class BannerFactory extends Factory
{
    protected $model = Banner::class;

    public function definition(): array
    {
        return [
            'title' => [
                'uz' => fake('uz_UZ')->sentence(4),
                'ru' => fake('ru_RU')->sentence(4),
                'en' => fake()->sentence(4),
            ],
            'description' => [
                'uz' => fake('uz_UZ')->sentence(10),
                'ru' => fake('ru_RU')->sentence(10),
                'en' => fake()->sentence(10),
            ],
            'link' => fake()->optional(0.7)->url(),
            'is_active' => fake()->boolean(80),
            'order' => fake()->numberBetween(1, 20),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function withLink(): static
    {
        return $this->state(fn () => ['link' => fake()->url()]);
    }
}
