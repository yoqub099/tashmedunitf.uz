<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Normalize remaining translatable/content columns from `json` to `jsonb`
 * and add GIN (jsonb_path_ops) indexes on core searchable translatable fields.
 *
 * Several translatable columns were left as plain `json`, which cannot be
 * GIN-indexed and behaves inconsistently with the rest of the schema (which
 * uses `jsonb` for all {uz,ru,en} translatable data). This migration makes the
 * data layer uniform and indexes the faculties/talented_students search fields.
 *
 * The `json -> jsonb` cast is lossless for {uz,ru,en} payloads (key order is
 * irrelevant for translation maps). Spatie\Translatable casts read both types
 * transparently, so application behaviour is unchanged.
 *
 * Note: the Spatie `media` table json columns (custom_properties,
 * generated_conversions, manipulations, responsive_images) are intentionally
 * left untouched — they are framework-managed.
 */
return new class extends Migration {
    /** @var array<int, array{0:string,1:string}> table+column pairs to convert */
    private array $columns = [
        ['faculties', 'name'],
        ['faculties', 'description'],
        ['career_center_infos', 'title'],
        ['career_center_infos', 'subtitle'],
        ['career_center_infos', 'content'],
        ['career_center_infos', 'address'],
        ['contact_locations', 'name'],
        ['contact_locations', 'address'],
        ['talented_students', 'name'],
        ['talented_students', 'description'],
        ['student_life_photos', 'title'],
        ['site_contents', 'value'],
        ['translations', 'value'],
        ['directions', 'exam_subjects'],
    ];

    /** @var array<int, array{0:string,1:string,2:string}> index name, table, column */
    private array $ginIndexes = [
        ['idx_faculties_name_gin', 'faculties', 'name'],
        ['idx_faculties_description_gin', 'faculties', 'description'],
        ['idx_talented_students_name_gin', 'talented_students', 'name'],
    ];

    public function up(): void
    {
        foreach ($this->columns as [$table, $column]) {
            DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE jsonb USING {$column}::jsonb");
        }

        foreach ($this->ginIndexes as [$index, $table, $column]) {
            DB::statement("CREATE INDEX IF NOT EXISTS {$index} ON public.{$table} USING gin ({$column} jsonb_path_ops)");
        }
    }

    public function down(): void
    {
        foreach ($this->ginIndexes as [$index]) {
            DB::statement("DROP INDEX IF EXISTS {$index}");
        }

        foreach ($this->columns as [$table, $column]) {
            DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE json USING {$column}::json");
        }
    }
};
