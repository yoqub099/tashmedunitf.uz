<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * testimonials.role ustunini string → jsonb ga o'zgartirish
 * Model HasTranslations ishlatadi, shuning uchun jsonb bo'lishi kerak
 */
return new class extends Migration
{
    public function up(): void
    {
        // Avval mavjud string qiymatlarni JSON formatga aylantirish
        DB::statement("ALTER TABLE testimonials ALTER COLUMN role TYPE jsonb USING jsonb_build_object('uz', role, 'ru', role, 'en', role)");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE testimonials ALTER COLUMN role TYPE varchar(255) USING role->>'uz'");
    }
};
