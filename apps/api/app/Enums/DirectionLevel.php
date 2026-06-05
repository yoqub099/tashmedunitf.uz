<?php

namespace App\Enums;

/**
 * Ta'lim yo'nalishlari darajasi
 */
enum DirectionLevel: string
{
    case BACHELOR = 'bakalavriat';      // Bakalavr
    case MASTER = 'magistratura';       // Magistratura
    case RESIDENCY = 'ordinatura';      // Ordinatura (tibbiyot)

    public function label(): string
    {
        return match ($this) {
            self::BACHELOR => 'Bakalavriat',
            self::MASTER => 'Magistratura',
            self::RESIDENCY => 'Klinik ordinatura',
        };
    }

    public function duration(): string
    {
        return match ($this) {
            self::BACHELOR => '5-6 yil',
            self::MASTER => '2 yil',
            self::RESIDENCY => '2-3 yil',
        };
    }
}
