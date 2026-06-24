<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * ERROR LOGS — Backend + Frontend xatoliklari (/look)
 * ============================================================
 *
 * source = backend   → Laravel exception handler (bootstrap/app.php)
 * source = web|admin → Next.js brauzer xatolari (POST /api/v1/client-errors)
 *
 * fingerprint orqali bir xil xatolar GURUHLANADI (count oshadi) —
 * jadval bitta takrorlanuvchi xato bilan to'lib ketmasligi uchun.
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('error_logs', function (Blueprint $table) {
            $table->id();

            $table->string('source', 16)->default('backend');   // backend | web | admin
            $table->string('level', 16)->default('error');      // error | warning | critical | info
            $table->string('type')->nullable();                  // Exception class yoki JS error turi
            $table->text('message');

            $table->text('file')->nullable();
            $table->integer('line')->nullable();
            $table->text('url')->nullable();
            $table->string('method', 10)->nullable();
            $table->integer('status_code')->nullable();

            // KIM duch keldi (nullable — public/anonim xato ham bo'lishi mumkin)
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('user_name')->nullable();

            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();

            // Stack-trace va qo'shimcha kontekst
            $table->jsonb('context')->nullable();

            // DEDUP — bir xil xatoni guruhlash
            $table->string('fingerprint', 64)->nullable();
            $table->unsignedInteger('count')->default(1);

            $table->timestamps();   // created_at (birinchi ko'rilgan) + updated_at (oxirgi ko'rilgan)

            // INDEXLAR
            $table->index('source');
            $table->index('level');
            $table->index('fingerprint');
            $table->index('created_at');
            $table->index(['source', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('error_logs');
    }
};
