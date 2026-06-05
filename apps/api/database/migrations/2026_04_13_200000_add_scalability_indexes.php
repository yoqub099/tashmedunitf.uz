<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Scalability indexes — tez-tez so'rov qilinadigan jadvallar uchun.
 *
 * - student_life_photos(is_active, sort_order) — active photos sorted listing
 * - site_media(is_active)                      — active media filter
 * - contact_messages partial index on is_read  — fast unread count
 * - translations(group, key) unique            — composite uniqueness
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('student_life_photos')) {
            Schema::table('student_life_photos', function (Blueprint $table) {
                $table->index(['is_active', 'sort_order'], 'student_life_photos_active_sort_idx');
            });
        }

        if (Schema::hasTable('site_media')) {
            Schema::table('site_media', function (Blueprint $table) {
                $table->index('is_active', 'site_media_is_active_idx');
            });
        }

        // Partial index on contact_messages for fast unread count queries
        if (Schema::hasTable('contact_messages')) {
            DB::statement(
                'CREATE INDEX IF NOT EXISTS contact_messages_unread_partial_idx
                 ON contact_messages (id)
                 WHERE is_read = false'
            );
        }

        // Unique composite on translations(group, key) — skip if already exists
        if (Schema::hasTable('translations')) {
            $indexExists = DB::select(
                "SELECT 1 FROM pg_indexes WHERE tablename = 'translations' AND indexname = 'translations_group_key_unique'"
            );

            if (empty($indexExists)) {
                Schema::table('translations', function (Blueprint $table) {
                    $table->unique(['group', 'key'], 'translations_group_key_unique');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('student_life_photos')) {
            Schema::table('student_life_photos', function (Blueprint $table) {
                $table->dropIndex('student_life_photos_active_sort_idx');
            });
        }

        if (Schema::hasTable('site_media')) {
            Schema::table('site_media', function (Blueprint $table) {
                $table->dropIndex('site_media_is_active_idx');
            });
        }

        if (Schema::hasTable('contact_messages')) {
            DB::statement('DROP INDEX IF EXISTS contact_messages_unread_partial_idx');
        }

        if (Schema::hasTable('translations')) {
            $indexExists = DB::select(
                "SELECT 1 FROM pg_indexes WHERE tablename = 'translations' AND indexname = 'translations_group_key_unique'"
            );

            if (! empty($indexExists)) {
                Schema::table('translations', function (Blueprint $table) {
                    $table->dropUnique('translations_group_key_unique');
                });
            }
        }
    }
};
