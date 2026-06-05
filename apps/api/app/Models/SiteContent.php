<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class SiteContent extends Model
{
    use HasTranslations;

    protected $fillable = [
        'key',
        'section',
        'value',
        'type',
    ];

    public array $translatable = ['value'];

    /**
     * Bo'lim bo'yicha kontentlarni olish
     */
    public function scopeSection($query, string $section)
    {
        return $query->where('section', $section);
    }

    /**
     * Kalit bo'yicha kontentni olish
     */
    public static function getByKey(string $key, string $default = ''): string
    {
        $content = static::where('key', $key)->first();

        return $content ? $content->value : $default;
    }

    /**
     * Bo'lim bo'yicha barcha kontentlarni key => value formatda olish
     */
    public static function getSection(string $section): array
    {
        return static::where('section', $section)
            ->get()
            ->mapWithKeys(fn ($item) => [$item->key => $item->getTranslations('value')])
            ->toArray();
    }
}
