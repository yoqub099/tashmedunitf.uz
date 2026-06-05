<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('translations', function (Blueprint $table) {
            $table->id();
            $table->string('key', 255)->unique();           // nav.home, hero.title, footer.copyright, ...
            $table->string('group', 100)->index();           // nav, hero, footer, common, ...
            $table->json('value');                            // {"uz": "...", "ru": "...", "en": "..."}
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('translations');
    }
};
