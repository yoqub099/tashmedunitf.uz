<?php

namespace App\Enums;

enum LibraryCategory: string
{
    case BADIIY_ADABIYOTLAR = 'badiiy-adabiyotlar';
    case ILMIY_ADABIYOTLAR = 'ilmiy-adabiyotlar';
    case OQUV_RESURSLARI = 'oquv-resurslari';

    public function label(): string
    {
        return match ($this) {
            self::BADIIY_ADABIYOTLAR => 'Badiiy adabiyotlar',
            self::ILMIY_ADABIYOTLAR => 'Ilmiy adabiyotlar',
            self::OQUV_RESURSLARI => "O'quv resurslari",
        };
    }
}
