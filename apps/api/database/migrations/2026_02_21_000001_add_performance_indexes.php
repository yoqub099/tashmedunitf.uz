<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * TDTUTF Database Performance Optimization
     *
     * 1. JSON -> JSONB konvertatsiya (2-5x tezroq qidiruv)
     * 2. GIN indexes — JSONB ustunlarda tezkor qidiruv
     * 3. Composite indexes — ko'p ustunli so'rovlar uchun
     * 4. Partial indexes — faqat kerakli qatorlarda index
     * 5. BRIN indexes — vaqt bo'yicha tartiblangan jadvallar uchun
     * 6. Statistika — query planner uchun aniqlik
     */
    public function up(): void
    {
        // =====================================================
        // STEP 1: JSON -> JSONB konvertatsiya (MUHIM!)
        // JSONB 2-5x tez ishlaydi, GIN index qo'yish mumkin
        // =====================================================

        $jsonbConversions = [
            ['news', 'title'],
            ['news', 'excerpt'],
            ['news', 'content'],
            ['departments', 'name'],
            ['departments', 'description'],
            ['departments', 'head_name'],
            ['departments', 'head_title'],
            ['staff', 'full_name'],
            ['staff', 'position'],
            ['staff', 'bio'],
            ['directions', 'name'],
            ['directions', 'description'],
            ['faqs', 'question'],
            ['faqs', 'answer'],
            ['testimonials', 'name'],
            ['testimonials', 'text'],
            ['banners', 'title'],
            ['banners', 'subtitle'],
            ['banners', 'button_text'],
            ['pages', 'title'],
            ['pages', 'content'],
        ];

        foreach ($jsonbConversions as [$table, $column]) {
            DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE jsonb USING {$column}::jsonb");
        }

        // =====================================================
        // STEP 2: GIN INDEXES — JSONB qidiruv uchun
        // =====================================================

        DB::statement('CREATE INDEX IF NOT EXISTS idx_news_title_gin ON news USING GIN (title jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_news_content_gin ON news USING GIN (content jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_departments_name_gin ON departments USING GIN (name jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_staff_fullname_gin ON staff USING GIN (full_name jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_directions_name_gin ON directions USING GIN (name jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_faqs_question_gin ON faqs USING GIN (question jsonb_path_ops)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pages_title_gin ON pages USING GIN (title jsonb_path_ops)');

        // =====================================================
        // STEP 3: COMPOSITE & PARTIAL INDEXES
        // =====================================================

        DB::statement('CREATE INDEX IF NOT EXISTS idx_news_published_date ON news (published_at DESC) WHERE is_published = true AND published_at IS NOT NULL');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_news_category_published ON news (category, published_at DESC) WHERE is_published = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_departments_active_sort ON departments (sort_order ASC, id) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_staff_dept_active_sort ON staff (department_id, sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_directions_level_active_sort ON directions (level, sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_faqs_category_active_sort ON faqs (category, sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_testimonials_active_sort ON testimonials (sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_partners_active_sort ON partners (sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_banners_active_sort ON banners (sort_order ASC) WHERE is_active = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_contact_unread_date ON contact_messages (created_at DESC) WHERE is_read = false');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_pages_slug_published ON pages (slug) WHERE is_published = true');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_media_model_collection ON media (model_type, model_id, collection_name)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_tokens_active ON personal_access_tokens (tokenable_type, tokenable_id, expires_at)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_sessions_user_activity ON sessions (user_id, last_activity DESC) WHERE user_id IS NOT NULL');

        // =====================================================
        // STEP 4: BRIN INDEXES — vaqt bo'yicha
        // =====================================================

        DB::statement('CREATE INDEX IF NOT EXISTS idx_news_created_brin ON news USING BRIN (created_at)');
        DB::statement('CREATE INDEX IF NOT EXISTS idx_contact_created_brin ON contact_messages USING BRIN (created_at)');

        // =====================================================
        // STEP 5: STATISTIKA — query planner uchun
        // =====================================================

        DB::statement('ALTER TABLE news ALTER COLUMN title SET STATISTICS 1000');
        DB::statement('ALTER TABLE news ALTER COLUMN published_at SET STATISTICS 1000');
        DB::statement('ALTER TABLE departments ALTER COLUMN name SET STATISTICS 500');
        DB::statement('ALTER TABLE staff ALTER COLUMN full_name SET STATISTICS 500');
        DB::statement('ALTER TABLE directions ALTER COLUMN name SET STATISTICS 500');

        // ANALYZE — statistika yangilash
        DB::statement('ANALYZE news');
        DB::statement('ANALYZE departments');
        DB::statement('ANALYZE staff');
        DB::statement('ANALYZE directions');
        DB::statement('ANALYZE faqs');
        DB::statement('ANALYZE pages');
        DB::statement('ANALYZE media');
    }

    public function down(): void
    {
        // Indexlarni o'chirish
        $indexes = [
            'idx_news_title_gin', 'idx_news_content_gin', 'idx_news_published_date',
            'idx_news_category_published', 'idx_news_created_brin',
            'idx_departments_name_gin', 'idx_departments_active_sort',
            'idx_staff_fullname_gin', 'idx_staff_dept_active_sort',
            'idx_directions_name_gin', 'idx_directions_level_active_sort',
            'idx_faqs_question_gin', 'idx_faqs_category_active_sort',
            'idx_testimonials_active_sort', 'idx_partners_active_sort',
            'idx_banners_active_sort', 'idx_contact_unread_date',
            'idx_contact_created_brin', 'idx_pages_slug_published',
            'idx_pages_title_gin', 'idx_media_model_collection',
            'idx_tokens_active', 'idx_sessions_user_activity',
        ];

        foreach ($indexes as $index) {
            DB::statement("DROP INDEX IF EXISTS {$index}");
        }

        // JSONB -> JSON qaytarish
        $jsonConversions = [
            ['news', 'title'], ['news', 'excerpt'], ['news', 'content'],
            ['departments', 'name'], ['departments', 'description'],
            ['departments', 'head_name'], ['departments', 'head_title'],
            ['staff', 'full_name'], ['staff', 'position'], ['staff', 'bio'],
            ['directions', 'name'], ['directions', 'description'],
            ['faqs', 'question'], ['faqs', 'answer'],
            ['testimonials', 'name'], ['testimonials', 'text'],
            ['banners', 'title'], ['banners', 'subtitle'], ['banners', 'button_text'],
            ['pages', 'title'], ['pages', 'content'],
        ];

        foreach ($jsonConversions as [$table, $column]) {
            DB::statement("ALTER TABLE {$table} ALTER COLUMN {$column} TYPE json USING {$column}::json");
        }
    }
};
