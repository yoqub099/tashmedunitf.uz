<?php

namespace Database\Factories;

use App\Models\Department;
use Illuminate\Database\Eloquent\Factories\Factory;

class DepartmentFactory extends Factory
{
    protected $model = Department::class;

    public function definition(): array
    {
        return [
            'name' => [
                'uz' => fake('uz_UZ')->company().' kafedrasi',
                'ru' => 'Кафедра '.fake('ru_RU')->company(),
                'en' => fake()->company().' Department',
            ],
            'description' => [
                'uz' => fake('uz_UZ')->paragraphs(3, true),
                'ru' => fake('ru_RU')->paragraphs(3, true),
                'en' => fake()->paragraphs(3, true),
            ],
            'head_name' => [
                'uz' => fake('uz_UZ')->name(),
                'ru' => fake('ru_RU')->name(),
                'en' => fake()->name(),
            ],
            'head_title' => [
                'uz' => 'Kafedra mudiri',
                'ru' => 'Заведующий кафедрой',
                'en' => 'Head of Department',
            ],
            'email' => fake()->unique()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'is_active' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(1, 50),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => [
            'is_active' => true,
        ]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => [
            'is_active' => false,
        ]);
    }
}
