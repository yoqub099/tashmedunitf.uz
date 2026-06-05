<?php

namespace App\Enums;

/**
 * Kontakt xabar holatlari
 */
enum ContactStatus: string
{
    case NEW = 'new';              // Yangi murojaat
    case ACCEPTED = 'accepted';    // Qabul qilingan
    case COMPLETED = 'completed';  // Bajarilgan

    public function label(): string
    {
        return match ($this) {
            self::NEW => 'Yangi',
            self::ACCEPTED => 'Qabul qilindi',
            self::COMPLETED => 'Bajarildi',
        };
    }
}
