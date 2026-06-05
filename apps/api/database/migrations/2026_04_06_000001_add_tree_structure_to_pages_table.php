<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->unsignedBigInteger('parent_id')->nullable()->after('id');
            $table->integer('sort_order')->default(0)->after('is_published');
            $table->smallInteger('depth')->default(0)->after('sort_order');
            $table->string('path')->nullable()->after('depth');
            $table->boolean('is_nav_item')->default(false)->after('path');
            $table->string('page_type')->default('content')->after('is_nav_item');
            $table->string('external_url')->nullable()->after('page_type');
            $table->string('nav_icon', 50)->nullable()->after('external_url');

            // Foreign key
            $table->foreign('parent_id')
                ->references('id')
                ->on('pages')
                ->onDelete('cascade');

            // Indexes
            $table->index(['parent_id', 'sort_order']);
            $table->index('path');
        });
    }

    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropIndex(['parent_id', 'sort_order']);
            $table->dropIndex(['path']);
            $table->dropColumn([
                'parent_id',
                'sort_order',
                'depth',
                'path',
                'is_nav_item',
                'page_type',
                'external_url',
                'nav_icon',
            ]);
        });
    }
};
