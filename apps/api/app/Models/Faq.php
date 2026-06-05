<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasFactory, HasTranslations, SoftDeletes;

    protected $fillable = [
        'question',
        'answer',
        'category',
        'faculty_id',
        'is_active',
        'sort_order',
    ];

    protected $attributes = [
        'is_active' => true,
        'sort_order' => 0,
    ];

    public array $translatable = ['question', 'answer'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // ========================================
    // RELATIONSHIPS
    // ========================================

    public function faculty()
    {
        return $this->belongsTo(\App\Models\Faculty::class);
    }

    // ========================================
    // SCOPES — Index optimized
    // ========================================

    /**
     * PARTIAL INDEX: idx_faqs_category_active_sort
     */
    public function scopeByCategory($query, string $category)
    {
        return $query->where('is_active', true)
            ->where('category', $category)
            ->orderBy('sort_order');
    }

    /**
     * GIN INDEX: idx_faqs_question_gin
     */
    public function scopeSearchQuestion($query, string $search, string $locale = 'uz')
    {
        return $query->whereRaw(
            'question @> ?::jsonb',
            [json_encode([$locale => $search])]
        );
    }
}
