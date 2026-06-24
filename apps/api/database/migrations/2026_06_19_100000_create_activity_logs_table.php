<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * ACTIVITY LOGS — Admin faoliyati auditi (/look kuzatuv markazi)
 * ============================================================
 *
 * Kim (super-admin / admin / editor) qaysi kontentni qachon yaratdi,
 * o'zgartirdi yoki o'chirdi — ESKI → YANGI qiymat bilan.
 * Login/logout va media operatsiyalari ham shu jadvalga yoziladi
 * (log_name bo'yicha ajraladi: content | auth | media).
 *
 * Dizayn MediaAccessLog'ga o'xshash:
 *  - Append-only (faqat created_at)
 *  - causer nomi/roli DENORMALIZATSIYA qilingan (user o'chirilsa ham
 *    kim ekani jurnalda saqlanib qoladi)
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            $table->string('log_name', 32)->default('content');   // content | auth | media
            $table->string('event', 40);                           // created|updated|deleted|restored|force_deleted|login|logout|login_failed|media_uploaded|media_deleted
            $table->string('description')->nullable();

            // KIM — denormalizatsiya (user o'chirilsa ham saqlanadi)
            $table->foreignId('causer_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('causer_name')->nullable();
            $table->string('causer_role', 32)->nullable();

            // NIMA USTIDA (subject)
            $table->string('subject_type')->nullable();            // News, Department, Staff, ...
            $table->unsignedBigInteger('subject_id')->nullable();
            $table->string('subject_label')->nullable();           // inson o'qishi uchun: "Yangilik: ..."

            // O'ZGARISH (faqat o'zgargan maydonlar)
            $table->jsonb('old_values')->nullable();
            $table->jsonb('new_values')->nullable();
            $table->jsonb('properties')->nullable();

            // SO'ROV KONTEKSTI
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->string('url', 1024)->nullable();
            $table->string('method', 10)->nullable();

            $table->timestamp('created_at')->nullable();

            // INDEXLAR — feed va filtrlar uchun
            $table->index('log_name');
            $table->index('event');
            $table->index('created_at');
            $table->index(['causer_id', 'created_at']);
            $table->index(['subject_type', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
