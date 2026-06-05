<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * StudentWork tozalash + performance indexlari.
 * - deleted_at column olib tashlanadi (SoftDeletes ishlatilmaydi)
 * - (is_read, created_at) compound index admin inbox filter/sort uchun
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('student_works')) {
            Schema::table('student_works', function (Blueprint $table) {
                if (Schema::hasColumn('student_works', 'deleted_at')) {
                    $table->dropSoftDeletes();
                }
            });

            Schema::table('student_works', function (Blueprint $table) {
                $table->index(['is_read', 'created_at'], 'student_works_is_read_created_at_idx');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('student_works')) {
            Schema::table('student_works', function (Blueprint $table) {
                $table->dropIndex('student_works_is_read_created_at_idx');
                $table->softDeletes();
            });
        }
    }
};
