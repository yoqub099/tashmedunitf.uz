<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('talented_students', function (Blueprint $table) {
            $table->id();
            $table->json('name');           // translatable
            $table->json('description');    // translatable
            $table->boolean('is_active')->default(true)->index();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('talented_students');
    }
};
