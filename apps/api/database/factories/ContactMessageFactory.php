<?php

namespace Database\Factories;

use App\Enums\ContactStatus;
use App\Models\ContactMessage;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContactMessageFactory extends Factory
{
    protected $model = ContactMessage::class;

    public function definition(): array
    {
        $subjects = [
            'Qabul haqida ma\'lumot',
            'Stipendiya savoli',
            'Yotoqxona haqida',
            'Transfer savoli',
            'Hamkorlik taklifi',
            'Umumiy savol',
        ];

        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->optional(0.6)->phoneNumber(),
            'subject' => fake()->randomElement($subjects),
            'message' => fake()->paragraphs(2, true),
            'is_read' => fake()->boolean(30),
            'status' => fake()->randomElement(array_column(ContactStatus::cases(), 'value')),
        ];
    }

    public function unread(): static
    {
        return $this->state(fn () => [
            'is_read' => false,
            'status' => ContactStatus::NEW->value,
        ]);
    }

    public function read(): static
    {
        return $this->state(fn () => [
            'is_read' => true,
            'status' => ContactStatus::ACCEPTED->value,
        ]);
    }

    public function replied(): static
    {
        return $this->state(fn () => [
            'is_read' => true,
            'status' => ContactStatus::COMPLETED->value,
        ]);
    }
}
