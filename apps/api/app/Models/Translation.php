<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

class Translation extends Model
{
    use HasTranslations;

    protected $fillable = [
        'key',
        'group',
        'value',
    ];

    public array $translatable = ['value'];

    /**
     * Guruh bo'yicha tarjimalarni olish
     */
    public function scopeGroup($query, string $group)
    {
        return $query->where('group', $group);
    }

    /**
     * Qidiruv — kalit yoki qiymat bo'yicha
     */
    public function scopeSearch($query, string $term)
    {
        return $query->where(function ($q) use ($term) {
            $q->where('key', 'ILIKE', "%{$term}%")
                ->orWhere('value->uz', 'ILIKE', "%{$term}%")
                ->orWhere('value->ru', 'ILIKE', "%{$term}%")
                ->orWhere('value->en', 'ILIKE', "%{$term}%");
        });
    }

    /**
     * Barcha tarjimalarni key => translations formatda olish
     *
     * @return array<string, array{uz: string, ru: string|null, en: string|null}>
     */
    public static function getAllAsMap(): array
    {
        return static::query()
            ->orderBy('group')
            ->orderBy('key')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->key => $item->getTranslations('value')])
            ->toArray();
    }
}
