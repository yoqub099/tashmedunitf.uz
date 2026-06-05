<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->foreignId('faculty_id')->nullable()->after('category')
                ->constrained('faculties')->nullOnDelete();
            $table->index(['faculty_id', 'category', 'is_active', 'sort_order'], 'idx_faqs_faculty_category');
        });
    }

    public function down(): void
    {
        Schema::table('faqs', function (Blueprint $table) {
            $table->dropIndex('idx_faqs_faculty_category');
            $table->dropForeign(['faculty_id']);
            $table->dropColumn('faculty_id');
        });
    }
};
