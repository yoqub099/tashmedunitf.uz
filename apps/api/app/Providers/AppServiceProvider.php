<?php

namespace App\Providers;

use App\Models\Banner;
use App\Models\CareerCenterInfo;
use App\Models\ContactLocation;
use App\Models\ContactMessage;
use App\Models\Department;
use App\Models\Direction;
use App\Models\Faculty;
use App\Models\Faq;
use App\Models\JournalIssue;
use App\Models\LibraryResource;
use App\Models\News;
use App\Models\Page;
use App\Models\Partner;
use App\Models\SiteContent;
use App\Models\SiteMedia;
use App\Models\Staff;
use App\Models\StudentLifePhoto;
use App\Models\StudentWork;
use App\Models\TalentedStudent;
use App\Models\Testimonial;
use App\Models\Translation;
use App\Observers\AuditObserver;
use App\Observers\ContactMessageObserver;
use App\Observers\ModelCacheObserver;
use App\Observers\NewsObserver;
use App\Services\CacheService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // ============================================
        // PERFORMANCE SAFETY — N+1 oldini olish
        // ============================================
        // Development: N+1 bo'lsa exception chiqaradi (bug oldindan topiladi)
        // Production: N+1 bo'lsa log yozadi (sayt buzilmaydi)
        Model::preventLazyLoading(! app()->isProduction());

        // Massoviy tayinlashda himoya
        Model::preventSilentlyDiscardingAttributes(! app()->isProduction());

        // ============================================
        // MODEL OBSERVERS — Cache tozalash + Log
        // ============================================
        News::observe(NewsObserver::class);
        ContactMessage::observe(ContactMessageObserver::class);

        // Boshqa modellar uchun universal observer
        Department::observe(new ModelCacheObserver(CacheService::PREFIX_DEPARTMENTS));
        Staff::observe(new ModelCacheObserver(CacheService::PREFIX_STAFF));
        Direction::observe(new ModelCacheObserver(CacheService::PREFIX_DIRECTIONS));
        Faq::observe(new ModelCacheObserver(CacheService::PREFIX_FAQS));
        Banner::observe(new ModelCacheObserver(CacheService::PREFIX_BANNERS));
        Partner::observe(new ModelCacheObserver(CacheService::PREFIX_PARTNERS));
        Testimonial::observe(new ModelCacheObserver(CacheService::PREFIX_TESTIMONIALS));
        Page::observe(new ModelCacheObserver(CacheService::PREFIX_PAGES));
        Page::observe(new ModelCacheObserver(CacheService::PREFIX_NAV));
        Faculty::observe(new ModelCacheObserver(CacheService::PREFIX_FACULTIES));
        SiteContent::observe(new ModelCacheObserver(CacheService::PREFIX_SITE_CONTENTS));
        ContactLocation::observe(new ModelCacheObserver(CacheService::PREFIX_CONTACT_LOCATIONS));
        LibraryResource::observe(new ModelCacheObserver(CacheService::PREFIX_LIBRARY_RESOURCES));
        JournalIssue::observe(new ModelCacheObserver(CacheService::PREFIX_JOURNAL_ISSUES));
        Translation::observe(new ModelCacheObserver(CacheService::PREFIX_TRANSLATIONS));
        StudentWork::observe(new ModelCacheObserver(CacheService::PREFIX_STUDENT_WORKS));
        CareerCenterInfo::observe(new ModelCacheObserver(CacheService::PREFIX_CAREER_CENTER_INFOS));
        SiteMedia::observe(new ModelCacheObserver(CacheService::PREFIX_SITE_MEDIA));
        StudentLifePhoto::observe(new ModelCacheObserver(CacheService::PREFIX_STUDENT_LIFE_PHOTOS));
        TalentedStudent::observe(new ModelCacheObserver(CacheService::PREFIX_TALENTED_STUDENTS));

        // ============================================
        // AUDIT — /look kuzatuv markazi (kim nimani o'zgartirdi)
        // ============================================
        // Har bir content modelga generic AuditObserver: created/updated/
        // deleted/restored hodisalarini ESKI→YANGI qiymat bilan yozadi.
        foreach ([
            \App\Models\News::class,
            \App\Models\Department::class,
            \App\Models\Staff::class,
            \App\Models\Direction::class,
            \App\Models\Faq::class,
            \App\Models\Banner::class,
            \App\Models\Partner::class,
            \App\Models\Testimonial::class,
            \App\Models\Page::class,
            \App\Models\Faculty::class,
            \App\Models\SiteContent::class,
            \App\Models\SiteMedia::class,
            \App\Models\ContactLocation::class,
            \App\Models\LibraryResource::class,
            \App\Models\JournalIssue::class,
            \App\Models\Translation::class,
            \App\Models\CareerCenterInfo::class,
            \App\Models\StudentLifePhoto::class,
            \App\Models\TalentedStudent::class,
            \App\Models\User::class,
            \App\Models\ContactMessage::class,
            \App\Models\ConferenceRegistration::class,
            \App\Models\JobApplication::class,
            \App\Models\StudentWork::class,
        ] as $auditable) {
            $auditable::observe(AuditObserver::class);
        }

        // ============================================
        // MEDIA XAVFSIZLIGI — maxfiy fayllarga kirish ruxsati
        // ============================================
        // Markazlashgan tekshiruv: hozircha rol asosida (super-admin/admin).
        // Talaba hujjatlari (transkript/diplom) kelganda shu YAGONA joyni
        // per-collection / per-faculty darajasiga kengaytirish kifoya.
        Gate::define('access-private-media', function ($user, ?Media $media = null): bool {
            return method_exists($user, 'hasAnyRole')
                && $user->hasAnyRole(['super-admin', 'admin']);
        });
    }
}
