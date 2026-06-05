<?php

namespace App\Enums;

/**
 * Fayl tiplari (media yuklash uchun)
 */
enum FileType: string
{
    case IMAGE = 'image';
    case VIDEO = 'video';
    case AUDIO = 'audio';
    case DOCUMENT = 'document';
    case BOOK = 'book';
    case ARCHIVE = 'archive';
    case PRESENTATION = 'presentation';
    case SPREADSHEET = 'spreadsheet';

    public function label(): string
    {
        return match ($this) {
            self::IMAGE => 'Rasm',
            self::VIDEO => 'Video',
            self::AUDIO => 'Audio',
            self::DOCUMENT => 'Hujjat',
            self::BOOK => 'Kitob',
            self::ARCHIVE => 'Arxiv',
            self::PRESENTATION => 'Prezentatsiya',
            self::SPREADSHEET => 'Elektron jadval',
        };
    }

    public function maxSizeMB(): int
    {
        return match ($this) {
            self::IMAGE => 10,
            self::VIDEO => 500,
            self::AUDIO => 100,
            self::DOCUMENT => 100,
            self::BOOK => 200,
            self::ARCHIVE => 500,
            self::PRESENTATION => 200,
            self::SPREADSHEET => 50,
        };
    }
}
