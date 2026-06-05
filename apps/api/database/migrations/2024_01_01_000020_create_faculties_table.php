<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('faculties', function (Blueprint $table) {
            $table->id();
            $table->json('name');
            $table->json('description')->nullable();
            $table->string('level')->index();
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('directions', function (Blueprint $table) {
            $table->foreignId('faculty_id')->nullable()->after('id')->constrained('faculties')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('directions', function (Blueprint $table) {
            $table->dropForeign(['faculty_id']);
            $table->dropColumn(['faculty_id']);
        });

        Schema::dropIfExists('faculties');
    }
};
