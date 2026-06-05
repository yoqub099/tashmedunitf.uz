<?php

namespace App\Enums;

/**
 * Yangiliklar kategoriyalari
 *
 * Har bir yangilik bitta kategoriyaga tegishli
 */
enum NewsCategory: string
{
    case YANGILIKLAR = 'yangiliklar';        // Yangiliklar
    case TADBIRLAR = 'tadbirlar';            // Tadbirlar
    case KONFERENSIYALAR = 'konferensiyalar'; // Konferensiyalar
    case ELONLAR = 'elonlar';                // E'lonlar
    case VAKANSIYALAR = 'vakansiyalar';      // Vakansiyalar (bo'sh ish o'rinlari)

    public function label(): string
    {
        return match ($this) {
            self::YANGILIKLAR => 'Yangiliklar',
            self::TADBIRLAR => 'Tadbirlar',
            self::KONFERENSIYALAR => 'Konferensiyalar',
            self::ELONLAR => "E'lonlar",
            self::VAKANSIYALAR => 'Vakansiyalar',
        };
    }
}
