<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('library_resources')
            ->where('category', 'e-library')
            ->update(['category' => 'badiiy-adabiyotlar']);

        DB::table('library_resources')
            ->where('category', 'emerald')
            ->update(['category' => 'ilmiy-adabiyotlar']);

        DB::table('library_resources')
            ->where('category', 'ichki-kutubxona')
            ->update(['category' => 'oquv-resurslari']);
    }

    public function down(): void
    {
        DB::table('library_resources')
            ->where('category', 'badiiy-adabiyotlar')
            ->update(['category' => 'e-library']);

        DB::table('library_resources')
            ->where('category', 'ilmiy-adabiyotlar')
            ->update(['category' => 'emerald']);

        DB::table('library_resources')
            ->where('category', 'oquv-resurslari')
            ->update(['category' => 'ichki-kutubxona']);
    }
};
