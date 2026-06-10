<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * ============================================================
 * MEDIA ACCESS LOG — Maxfiy fayllarga kirish auditi
 * ============================================================
 *
 * Shaxsiy ma'lumotlar (pasport, diplom, transkript, CV) uchun
 * O'zbekiston "Shaxsga doir ma'lumotlar" qonuni (ZRU-547) kim,
 * qachon, qaysi faylni ko'rgani/yuklab olganini qayd etishni
 * talab qiladi. Bu jadval o'sha audit izini saqlaydi.
 *
 * FK YO'Q (media_id) — media o'chirilsa ham log saqlanib qoladi.
 * ============================================================
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('media_access_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('media_id')->nullable()->index();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action', 32);                       // download | stream | view
            $table->string('result', 16)->default('allowed');   // allowed | denied
            $table->string('disk', 32)->nullable();
            $table->string('collection_name')->nullable();
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->ipAddress('ip')->nullable();
            $table->string('user_agent', 512)->nullable();
            $table->timestamp('created_at')->nullable()->index();

            $table->index(['model_type', 'model_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media_access_logs');
    }
};
