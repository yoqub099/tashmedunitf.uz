<?php

namespace Database\Factories;

use App\Enums\DirectionLevel;
use App\Models\Direction;
use Illuminate\Database\Eloquent\Factories\Factory;

class DirectionFactory extends Factory
{
    protected $model = Direction::class;

    public function definition(): array
    {
        $levels = array_column(DirectionLevel::cases(), 'value');
        $level = fake()->randomElement($levels);
        $levelEnum = DirectionLevel::from($level);

        $directions = [
            'uz' => ['Umumiy tibbiyot', 'Pediatriya', 'Stomatologiya', 'Farmatsiya', 'Tibbiy pedagogika', 'Davolash ishi'],
            'ru' => ['Общая медицина', 'Педиатрия', 'Стоматология', 'Фармация', 'Медицинская педагогика', 'Лечебное дело'],
            'en' => ['General Medicine', 'Pediatrics', 'Dentistry', 'Pharmacy', 'Medical Pedagogy', 'Medical Practice'],
        ];
        $dirIndex = fake()->numberBetween(0, 5);

        return [
            'name' => [
                'uz' => $directions['uz'][$dirIndex],
                'ru' => $directions['ru'][$dirIndex],
                'en' => $directions['en'][$dirIndex],
            ],
            'code' => fake()->unique()->numerify('#######'),
            'description' => [
                'uz' => fake('uz_UZ')->paragraphs(3, true),
                'ru' => fake('ru_RU')->paragraphs(3, true),
                'en' => fake()->paragraphs(3, true),
            ],
            'level' => $level,
            'duration' => $levelEnum->duration(),
            'is_active' => fake()->boolean(85),
            'order' => fake()->numberBetween(1, 30),
        ];
    }

    public function bachelor(): static
    {
        return $this->state(fn () => [
            'level' => DirectionLevel::BACHELOR->value,
            'duration' => DirectionLevel::BACHELOR->duration(),
        ]);
    }

    public function master(): static
    {
        return $this->state(fn () => [
            'level' => DirectionLevel::MASTER->value,
            'duration' => DirectionLevel::MASTER->duration(),
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }
}
