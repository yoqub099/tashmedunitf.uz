<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();

            // Asosiy ariza ma'lumotlari
            $table->string('name');
            $table->string('last_name');
            $table->string('middle_name')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->string('position');
            $table->string('company')->nullable();
            $table->string('salary')->nullable();
            $table->date('birthday')->nullable();
            $table->string('skype')->nullable();

            // Qo'shimcha ma'lumot
            $table->string('citizenship')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('extra_email')->nullable();
            $table->string('social_media_link')->nullable();
            $table->boolean('is_convicted')->default(false);
            $table->string('how_find_vacancy')->nullable();
            $table->boolean('is_currently_working')->default(false);
            $table->text('applied_before_comment')->nullable();
            $table->text('relative_detail_at_university')->nullable();
            $table->text('skills')->nullable();
            $table->text('additional_info')->nullable();
            $table->string('research_identifier')->nullable();
            $table->string('degree')->nullable();
            $table->boolean('is_currently_in_uzbekistan')->default(true);
            $table->boolean('is_previously_worked_at_university')->default(false);
            $table->text('about_motivation')->nullable();

            // Admin boshqaruv
            $table->boolean('is_read')->default(false)->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};
