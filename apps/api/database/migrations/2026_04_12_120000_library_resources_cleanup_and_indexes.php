<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Library Resources tozalash + performance indexlari.
 * - deleted_at column olib tashlanadi (SoftDeletes ishlatilmaydi, forceDelete ishlatiladi)
 * - published_at ustuniga index qo'shiladi (public filter uchun)
 * - title JSONB ga GIN index qo'shiladi (ILIKE search tezligi uchun)
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('library_resources')) {
            Schema::table('library_resources', function (Blueprint $table) {
                if (Schema::hasColumn('library_resources', 'deleted_at')) {
                    $table->dropSoftDeletes();
                }
            });

            Schema::table('library_resources', function (Blueprint $table) {
                $table->index('published_at', 'lib_res_published_at_idx');
            });

            // PostgreSQL GIN index on translatable JSONB title
            try {
                DB::statement('CREATE INDEX IF NOT EXISTS lib_res_title_gin_idx ON library_resources USING GIN (title jsonb_path_ops)');
            } catch (\Throwable $e) {
                \Log::warning('Could not create GIN index on title', ['error' => $e->getMessage()]);
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('library_resources')) {
            try {
                DB::statement('DROP INDEX IF EXISTS lib_res_title_gin_idx');
            } catch (\Throwable $e) {
            }

            Schema::table('library_resources', function (Blueprint $table) {
                $table->dropIndex('lib_res_published_at_idx');
                $table->softDeletes();
            });
        }
    }
};
