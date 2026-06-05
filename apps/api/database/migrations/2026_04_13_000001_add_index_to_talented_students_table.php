<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('talented_students', function (Blueprint $table) {
            $table->index(['is_active', 'sort_order'], 'talented_students_active_sort_idx');
        });
    }

    public function down(): void
    {
        Schema::table('talented_students', function (Blueprint $table) {
            $table->dropIndex('talented_students_active_sort_idx');
        });
    }
};
