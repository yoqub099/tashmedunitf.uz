<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * testimonials.role ustunidagi ikkilangan JSON qiymatlarni tuzatish
 *
 * Oldingi migratsiya varchar → jsonb konvertatsiyasida
 * har bir til uchun qiymat string sifatida saqlangan edi (ichida yana JSON).
 * Bu migratsiya ichki JSON stringlarni parse qilib, to'g'ri qiymatga aylantiradi.
 *
 * Oldingi holat: {"uz": "{\"uz\":\"Matn\"}", "ru": "{\"uz\":\"Matn\"}", "en": "{\"uz\":\"Matn\"}"}
 * Kerakli holat:  {"uz": "Matn", "ru": "Matn", "en": "Matn"}
 */
return new class extends Migration
{
    public function up(): void
    {
        $rows = DB::table('testimonials')->select('id', 'role')->get();

        foreach ($rows as $row) {
            $role = json_decode($row->role, true);

            if (! is_array($role)) {
                continue;
            }

            $fixed = [];
            foreach (['uz', 'ru', 'en'] as $locale) {
                $value = $role[$locale] ?? null;

                if (is_string($value)) {
                    // Ichki JSON stringni parse qilish
                    $inner = json_decode($value, true);
                    if (is_array($inner)) {
                        // Ichki JSON dan birinchi qiymatni olish
                        $fixed[$locale] = reset($inner) ?: $value;
                    } else {
                        $fixed[$locale] = $value;
                    }
                } else {
                    $fixed[$locale] = $value;
                }
            }

            DB::table('testimonials')
                ->where('id', $row->id)
                ->update(['role' => json_encode($fixed, JSON_UNESCAPED_UNICODE)]);
        }
    }

    public function down(): void
    {
        // Qaytarish imkonsiz — eski noto'g'ri formatga qaytarish kerak emas
    }
};
