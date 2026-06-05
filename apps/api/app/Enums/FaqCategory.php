<?php

namespace App\Enums;

/**
 * FAQ kategoriyalari
 * Type-safe, frontend/admin bilan sinxronlashuvi uchun.
 */
enum FaqCategory: string
{
    case GENERAL = 'general';           // Umumiy savollar
    case ABITURIENT = 'abiturient';     // Abiturientlar uchun
    case TALABA = 'talaba';             // Talabalar uchun
    case QABUL = 'qabul';               // Qabul
    case XALQARO = 'xalqaro';           // Xalqaro hamkorlik
    case FACULTY = 'faculty';           // Fakultet-spesifik
    case UMUMIY = 'umumiy';             // Umumiy (legacy, general bilan bir xil)

    public function label(): string
    {
        return match ($this) {
            self::GENERAL => 'Umumiy',
            self::ABITURIENT => 'Abiturientlarga',
            self::TALABA => 'Talabalarga',
            self::QABUL => 'Qabul savollari',
            self::XALQARO => 'Xalqaro hamkorlik',
            self::FACULTY => 'Fakultet',
            self::UMUMIY => 'Umumiy',
        };
    }

    /**
     * Return list of {value, label} for select inputs.
     */
    public static function options(): array
    {
        return array_map(
            fn (self $c) => ['value' => $c->value, 'label' => $c->label()],
            self::cases()
        );
    }
}
