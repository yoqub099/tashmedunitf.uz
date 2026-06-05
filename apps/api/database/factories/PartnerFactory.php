<?php

namespace Database\Factories;

use App\Models\Partner;
use Illuminate\Database\Eloquent\Factories\Factory;

class PartnerFactory extends Factory
{
    protected $model = Partner::class;

    public function definition(): array
    {
        $partnerTypes = ['university', 'hospital', 'research', 'government', 'international', 'corporate'];

        return [
            'name' => [
                'uz' => fake('uz_UZ')->company(),
                'ru' => fake('ru_RU')->company(),
                'en' => fake()->company(),
            ],
            'description' => [
                'uz' => fake('uz_UZ')->paragraph(2),
                'ru' => fake('ru_RU')->paragraph(2),
                'en' => fake()->paragraph(2),
            ],
            'website' => fake()->optional(0.8)->url(),
            'type' => fake()->randomElement($partnerTypes),
            'is_active' => fake()->boolean(90),
            'order' => fake()->numberBetween(1, 30),
        ];
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function type(string $type): static
    {
        return $this->state(fn () => ['type' => $type]);
    }
}
