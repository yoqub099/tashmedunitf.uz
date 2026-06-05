<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('directions', function (Blueprint $table) {
            $table->bigInteger('price_daytime')->nullable()->after('duration');
            $table->bigInteger('price_remote')->nullable()->after('price_daytime');
        });
    }

    public function down(): void
    {
        Schema::table('directions', function (Blueprint $table) {
            $table->dropColumn(['price_daytime', 'price_remote']);
        });
    }
};
