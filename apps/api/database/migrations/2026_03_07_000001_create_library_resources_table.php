<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('library_resources', function (Blueprint $table) {
            $table->id();
            $table->jsonb('title');           // Translatable
            $table->string('slug')->unique();
            $table->jsonb('description')->nullable(); // Translatable
            $table->jsonb('content')->nullable();     // Translatable (batafsil matn)
            $table->string('category');        // e-library | emerald | ichki-kutubxona
            $table->string('type')->nullable(); // kitob, jurnal, maqola, dissertatsiya, ...
            $table->string('url')->nullable(); // tashqi havola (e-library, emerald)
            $table->boolean('is_published')->default(true);
            $table->timestamp('published_at')->nullable();
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();

            // INDEXES
            $table->index('category');
            $table->index('type');
            $table->index('is_published');
            $table->index(['category', 'is_published']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('library_resources');
    }
};
