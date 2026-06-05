<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * SoftDeletes — O'chirilgan ma'lumotlarni qaytarish imkoniyati
 *
 * NIMA UCHUN KERAK:
 * - Admin xato o'chirsa → qaytarish mumkin
 * - Audit trail (qachon kim o'chirdi)
 * - Arxiv sifatida saqlash
 *
 * MUHIM: deleted_at NULL bo'lsa → aktiv
 *         deleted_at sana bo'lsa → o'chirilgan (ko'rinmaydi)
 */
return new class extends Migration
{
    public function up(): void
    {
        $tables = [
            'news',
            'departments',
            'staff',
            'directions',
            'faqs',
            'banners',
            'partners',
            'testimonials',
            'pages',
            'contact_messages',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    public function down(): void
    {
        $tables = [
            'news',
            'departments',
            'staff',
            'directions',
            'faqs',
            'banners',
            'partners',
            'testimonials',
            'pages',
            'contact_messages',
        ];

        foreach ($tables as $table) {
            Schema::table($table, function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
