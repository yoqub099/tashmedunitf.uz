<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Yetishmayotgan FK va sort_order indexlari — millionlab ma'lumotlar uchun.
 *
 * HIGH: FK indexlari (JOIN tezligi uchun)
 * - staff(department_id)
 * - directions(faculty_id)
 * - conference_registrations(news_id)
 *
 * MEDIUM: Standalone boolean indexlari
 * - student_works(email)
 *
 * LOW: sort_order indexlari
 * - departments(sort_order)
 * - faculties(sort_order)
 * - directions(sort_order)
 */
return new class extends Migration
{
    public function up(): void
    {
        // HIGH: Foreign key indexes for JOIN performance
        if (Schema::hasTable('staff')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'staff' AND indexname = 'idx_staff_department_id'");
            if (empty($exists)) {
                Schema::table('staff', function (Blueprint $table) {
                    $table->index('department_id', 'idx_staff_department_id');
                });
            }
        }

        if (Schema::hasTable('directions')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'directions' AND indexname = 'idx_directions_faculty_id'");
            if (empty($exists)) {
                Schema::table('directions', function (Blueprint $table) {
                    $table->index('faculty_id', 'idx_directions_faculty_id');
                });
            }
        }

        if (Schema::hasTable('conference_registrations')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'conference_registrations' AND indexname = 'idx_conf_reg_news_id'");
            if (empty($exists)) {
                Schema::table('conference_registrations', function (Blueprint $table) {
                    $table->index('news_id', 'idx_conf_reg_news_id');
                });
            }
        }

        // MEDIUM: Search/filter columns
        if (Schema::hasTable('student_works')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'student_works' AND indexname = 'idx_student_works_email'");
            if (empty($exists)) {
                Schema::table('student_works', function (Blueprint $table) {
                    $table->index('email', 'idx_student_works_email');
                });
            }
        }

        // LOW: sort_order indexes for ORDER BY performance
        if (Schema::hasTable('departments')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'departments' AND indexname = 'idx_departments_sort_order'");
            if (empty($exists)) {
                Schema::table('departments', function (Blueprint $table) {
                    $table->index('sort_order', 'idx_departments_sort_order');
                });
            }
        }

        if (Schema::hasTable('faculties')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'faculties' AND indexname = 'idx_faculties_sort_order'");
            if (empty($exists)) {
                Schema::table('faculties', function (Blueprint $table) {
                    $table->index('sort_order', 'idx_faculties_sort_order');
                });
            }
        }

        if (Schema::hasTable('directions')) {
            $exists = DB::select("SELECT 1 FROM pg_indexes WHERE tablename = 'directions' AND indexname = 'idx_directions_sort_order'");
            if (empty($exists)) {
                Schema::table('directions', function (Blueprint $table) {
                    $table->index('sort_order', 'idx_directions_sort_order');
                });
            }
        }
    }

    public function down(): void
    {
        $indexes = [
            'staff' => 'idx_staff_department_id',
            'directions' => 'idx_directions_faculty_id',
            'conference_registrations' => 'idx_conf_reg_news_id',
            'student_works' => 'idx_student_works_email',
            'departments' => 'idx_departments_sort_order',
            'faculties' => 'idx_faculties_sort_order',
            'directions' => 'idx_directions_sort_order',
        ];

        foreach ($indexes as $tableName => $indexName) {
            if (Schema::hasTable($tableName)) {
                DB::statement("DROP INDEX IF EXISTS {$indexName}");
            }
        }
    }
};
