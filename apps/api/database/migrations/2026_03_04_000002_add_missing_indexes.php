<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Yetishmayotgan indekslarni qo'shish — performance & query optimization
 */
return new class extends Migration
{
    public function up(): void
    {
        // contact_messages.email — admin qidirish uchun
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->index('email');
        });

        // contact_locations — is_active + sort_order (Active + Ordered scope)
        Schema::table('contact_locations', function (Blueprint $table) {
            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('contact_messages', function (Blueprint $table) {
            $table->dropIndex(['email']);
        });

        Schema::table('contact_locations', function (Blueprint $table) {
            $table->dropIndex(['is_active', 'sort_order']);
        });
    }
};
