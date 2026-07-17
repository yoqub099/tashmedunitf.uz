<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

class StaffFactory extends Factory
{
    protected $model = Staff::class;

    public function definition(): array
    {
        $positions = [
            'uz' => ['Professor', 'Dotsent', 'Katta o\'qituvchi', 'Assistent', 'Laborant', 'Dekan'],
            'ru' => ['Профессор', 'Доцент', 'Старший преподаватель', 'Ассистент', 'Лаборант', 'Декан'],
            'en' => ['Professor', 'Associate Professor', 'Senior Lecturer', 'Assistant', 'Lab Technician', 'Dean'],
        ];
        $index = fake()->numberBetween(0, 5);

        return [
            'department_id' => Department::factory(),
            'full_name' => [
                'uz' => fake('uz_UZ')->name(),
                'ru' => fake('ru_RU')->name(),
                'en' => fake()->name(),
            ],
            'position' => [
                'uz' => $positions['uz'][$index],
                'ru' => $positions['ru'][$index],
                'en' => $positions['en'][$index],
            ],
            'bio' => [
                'uz' => fake('uz_UZ')->paragraphs(2, true),
                'ru' => fake('ru_RU')->paragraphs(2, true),
                'en' => fake()->paragraphs(2, true),
            ],
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'is_active' => fake()->boolean(90),
            'sort_order' => fake()->numberBetween(1, 100),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function forDepartment(Department $department): static
    {
        return $this->state(fn () => ['department_id' => $department->id]);
    }
}
