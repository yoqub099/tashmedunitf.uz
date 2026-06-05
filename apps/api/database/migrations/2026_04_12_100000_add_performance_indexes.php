<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Performance indexlari — tez-tez filter/sort qilinadigan ustunlar uchun.
 *
 * - job_applications(is_read, created_at DESC) — admin inbox list + filter
 * - job_applications(email)                     — AllowedFilter email search
 * - career_center_infos(sort_order)              — sorted display
 */
return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('job_applications')) {
            Schema::table('job_applications', function (Blueprint $table) {
                $table->index(['is_read', 'created_at'], 'job_apps_is_read_created_at_idx');
                $table->index('email', 'job_apps_email_idx');
            });
        }

        if (Schema::hasTable('career_center_infos')) {
            Schema::table('career_center_infos', function (Blueprint $table) {
                $table->index('sort_order', 'career_center_infos_sort_order_idx');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('job_applications')) {
            Schema::table('job_applications', function (Blueprint $table) {
                $table->dropIndex('job_apps_is_read_created_at_idx');
                $table->dropIndex('job_apps_email_idx');
            });
        }

        if (Schema::hasTable('career_center_infos')) {
            Schema::table('career_center_infos', function (Blueprint $table) {
                $table->dropIndex('career_center_infos_sort_order_idx');
            });
        }
    }
};
