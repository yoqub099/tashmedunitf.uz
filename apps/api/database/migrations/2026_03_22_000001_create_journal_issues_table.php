<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_issues', function (Blueprint $table) {
            $table->id();
            $table->jsonb('title');                          // Translatable
            $table->string('slug')->unique();
            $table->jsonb('description')->nullable();        // Translatable
            $table->date('date');
            $table->integer('issue_number');
            $table->integer('year');
            $table->boolean('is_current')->default(false);
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->softDeletes();
            $table->timestamps();

            // INDEXES
            $table->index('is_current');
            $table->index('is_published');
            $table->index(['is_current', 'is_published']);
            $table->index(['year', 'issue_number']);
            $table->index('date');
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_issues');
    }
};
