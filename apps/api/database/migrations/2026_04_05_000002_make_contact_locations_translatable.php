<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Convert name: string → json (translatable)
        // Convert address: text → json (translatable)

        // Step 1: Get existing data
        $locations = DB::table('contact_locations')->get();

        // Step 2: Change columns to json
        Schema::table('contact_locations', function (Blueprint $table) {
            $table->json('name_new')->nullable();
            $table->json('address_new')->nullable();
        });

        // Step 3: Migrate existing data into json format
        foreach ($locations as $loc) {
            DB::table('contact_locations')
                ->where('id', $loc->id)
                ->update([
                    'name_new' => json_encode(['uz' => $loc->name, 'ru' => '', 'en' => '']),
                    'address_new' => json_encode(['uz' => $loc->address, 'ru' => '', 'en' => '']),
                ]);
        }

        // Step 4: Drop old columns, rename new ones
        Schema::table('contact_locations', function (Blueprint $table) {
            $table->dropColumn(['name', 'address']);
        });

        Schema::table('contact_locations', function (Blueprint $table) {
            $table->renameColumn('name_new', 'name');
            $table->renameColumn('address_new', 'address');
        });
    }

    public function down(): void
    {
        Schema::table('contact_locations', function (Blueprint $table) {
            $table->string('name_old')->nullable();
            $table->text('address_old')->nullable();
        });

        $locations = DB::table('contact_locations')->get();
        foreach ($locations as $loc) {
            $name = json_decode($loc->name, true);
            $address = json_decode($loc->address, true);
            DB::table('contact_locations')
                ->where('id', $loc->id)
                ->update([
                    'name_old' => $name['uz'] ?? '',
                    'address_old' => $address['uz'] ?? '',
                ]);
        }

        Schema::table('contact_locations', function (Blueprint $table) {
            $table->dropColumn(['name', 'address']);
        });

        Schema::table('contact_locations', function (Blueprint $table) {
            $table->renameColumn('name_old', 'name');
            $table->renameColumn('address_old', 'address');
        });
    }
};
