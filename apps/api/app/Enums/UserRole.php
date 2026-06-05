<?php

namespace App\Enums;

/**
 * Foydalanuvchi rollari
 *
 * Spatie Permission bilan sinxronlashtirilgan
 */
enum UserRole: string
{
    case SUPER_ADMIN = 'super-admin';   // To'liq huquq
    case ADMIN = 'admin';               // Kontent boshqaruv
    case EDITOR = 'editor';             // Faqat tahrirlash

    public function label(): string
    {
        return match ($this) {
            self::SUPER_ADMIN => 'Super Admin',
            self::ADMIN => 'Admin',
            self::EDITOR => 'Muharrir',
        };
    }

    /**
     * Berilgan ruxsatlar
     */
    public function permissions(): array
    {
        return match ($this) {
            self::SUPER_ADMIN => ['*'],
            self::ADMIN => [
                'news.create', 'news.update', 'news.delete',
                'departments.create', 'departments.update', 'departments.delete',
                'staff.create', 'staff.update', 'staff.delete',
                'directions.create', 'directions.update', 'directions.delete',
                'faqs.create', 'faqs.update', 'faqs.delete',
                'banners.create', 'banners.update', 'banners.delete',
                'partners.create', 'partners.update', 'partners.delete',
                'testimonials.create', 'testimonials.update', 'testimonials.delete',
                'pages.create', 'pages.update', 'pages.delete',
                'contacts.read', 'contacts.delete',
                'media.upload', 'media.delete',
            ],
            self::EDITOR => [
                'news.create', 'news.update',
                'departments.update',
                'staff.update',
                'faqs.create', 'faqs.update',
                'media.upload',
            ],
        };
    }
}
