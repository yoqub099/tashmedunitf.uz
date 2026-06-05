<?php

namespace Database\Seeders;

use App\Models\Translation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TranslationSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/translations.json');

        if (! file_exists($path)) {
            $this->command->error("translations.json topilmadi: {$path}");
            $this->command->info('Avval `node frontend/scripts/export-i18n.js` ni ishga tushiring.');

            return;
        }

        $entries = json_decode(file_get_contents($path), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->command->error('translations.json ni o\'qishda xatolik: '.json_last_error_msg());

            return;
        }

        $total = count($entries);
        $created = 0;
        $updated = 0;

        DB::transaction(function () use ($entries, &$created, &$updated) {
            foreach ($entries as $entry) {
                $translation = Translation::updateOrCreate(
                    ['key' => $entry['key']],
                    [
                        'group' => $entry['group'],
                        'value' => $entry['value'],
                    ]
                );

                if ($translation->wasRecentlyCreated) {
                    $created++;
                } else {
                    $updated++;
                }
            }
        });

        $this->command->info("Tarjimalar yuklandi: {$total} ta (yangi: {$created}, yangilangan: {$updated})");
    }
}
