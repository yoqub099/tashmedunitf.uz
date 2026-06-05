<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('site_contents', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();             // hero_heading, hero_mission_title, ...
            $table->string('section')->index();           // hero, footer, about, ...
            $table->json('value');                         // {"uz": "...", "ru": "...", "en": "..."}
            $table->string('type')->default('text');       // text, textarea, number, html
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('site_contents');
    }
};
