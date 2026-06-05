<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CareerCenterInfoController;
use App\Http\Controllers\Api\ConferenceRegistrationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\ContactLocationController;
use App\Http\Controllers\Api\DepartmentController;
use App\Http\Controllers\Api\DirectionController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\JobApplicationController;
use App\Http\Controllers\Api\JournalIssueController;
use App\Http\Controllers\Api\LibraryResourceController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PageController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\SearchController;
use App\Http\Controllers\Api\SiteContentController;
use App\Http\Controllers\Api\SiteMediaController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentLifePhotoController;
use App\Http\Controllers\Api\StudentWorkController;
use App\Http\Controllers\Api\TalentedStudentController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\TranslationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Middleware\ApiPerformance;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — TDTUTF
|--------------------------------------------------------------------------
*/

// ---- Health check (Docker / monitoring) ----
Route::middleware('throttle:10,1')->get('health', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbOk = true;
    } catch (\Throwable) {
        $dbOk = false;
    }

    $cacheOk = true;
    try {
        \Illuminate\Support\Facades\Cache::put('health_check', true, 10);
        \Illuminate\Support\Facades\Cache::forget('health_check');
    } catch (\Throwable) {
        $cacheOk = false;
    }

    $status = $dbOk && $cacheOk ? 'healthy' : 'degraded';

    return response()->json([
        'status' => $status,
        'timestamp' => now()->toIso8601String(),
        'services' => [
            'database' => $dbOk ? 'up' : 'down',
            'cache' => $cacheOk ? 'up' : 'down',
        ],
        'version' => config('app.version', '1.0.0'),
    ], $dbOk ? 200 : 503);
})->name('health');

// ---- Public routes (no auth required) ----
Route::prefix('v1')->middleware([ApiPerformance::class, 'throttle:120,1'])->group(function () {

    // Auth
    Route::post('auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:20,1')
        ->name('auth.login');

    // Password reset (public — send reset link + confirm reset)
    Route::post('auth/forgot-password', [PasswordResetController::class, 'forgot'])
        ->middleware('throttle:10,1')
        ->name('auth.forgot-password');
    Route::post('auth/reset-password', [PasswordResetController::class, 'reset'])
        ->middleware('throttle:10,1')
        ->name('auth.reset-password');

    // News
    Route::get('news', [NewsController::class, 'index'])->name('news.index');
    Route::get('news/{identifier}', [NewsController::class, 'show'])->name('news.show');

    // Departments
    Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index');
    Route::get('departments/{slug}', [DepartmentController::class, 'show'])->name('departments.show');

    // Staff
    Route::get('staff', [StaffController::class, 'index'])->name('staff.index');
    Route::get('staff/{id}', [StaffController::class, 'show'])->name('staff.show');

    // Faculties
    Route::get('faculties', [FacultyController::class, 'index'])->name('faculties.index');
    Route::get('faculties/{id}', [FacultyController::class, 'show'])->name('faculties.show');

    // Directions
    Route::get('directions', [DirectionController::class, 'index'])->name('directions.index');
    Route::get('directions/{id}', [DirectionController::class, 'show'])->name('directions.show');

    // FAQ
    Route::get('faqs', [FaqController::class, 'index'])->name('faqs.index');
    Route::get('faqs/{id}', [FaqController::class, 'show'])->name('faqs.show');

    // Testimonials
    Route::get('testimonials', [TestimonialController::class, 'index'])->name('testimonials.index');

    // Talented Students
    Route::get('talented-students', [TalentedStudentController::class, 'index'])->name('talented-students.index');

    // Career Center Info
    Route::get('career-center-infos', [CareerCenterInfoController::class, 'index'])->name('career-center-infos.index');

    // Student Life Photos
    Route::get('student-life-photos', [StudentLifePhotoController::class, 'index'])->name('student-life-photos.index');

    // Site Media (public — key bo'yicha)
    Route::get('site-media', [SiteMediaController::class, 'index'])->name('site-media.index');
    Route::get('site-media/{key}', [SiteMediaController::class, 'showByKey'])->name('site-media.show-by-key');

    // Partners
    Route::get('partners', [PartnerController::class, 'index'])->name('partners.index');

    // Banners (controller ichida optional auth tekshiradi)
    Route::get('banners', [BannerController::class, 'index'])->name('banners.index');

    // Pages — aniq routelar {slug} dan OLDIN bo'lishi kerak
    Route::get('pages/navigation', [PageController::class, 'navigation'])->name('pages.navigation');
    Route::get('pages/tree', [PageController::class, 'tree'])->name('pages.tree');
    Route::get('pages/by-path/{path}', [PageController::class, 'findByPath'])->where('path', '.*')->name('pages.by-path');
    Route::get('pages', [PageController::class, 'index'])->name('pages.index');
    Route::get('pages/{slug}', [PageController::class, 'show'])->name('pages.show');

    // Contact — public xabar yuborish
    Route::post('contact', [ContactController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('contact.store');

    // Contact — public statistika
    Route::get('contact/stats', [ContactController::class, 'stats'])->name('contact.stats');

    // Conference Registration — public ro'yxatdan o'tish
    Route::post('conference-registrations', [ConferenceRegistrationController::class, 'store'])
        ->middleware('throttle:10,1')
        ->name('conference-registrations.store');

    // Job Applications — public ishga ariza
    Route::post('job-applications', [JobApplicationController::class, 'store'])
        ->middleware('throttle:10,5')
        ->name('job-applications.store');

    // Student Works — public talaba ishi yuborish
    Route::post('student-works', [StudentWorkController::class, 'store'])
        ->middleware('throttle:10,5')
        ->name('student-works.store');

    // Library Resources — public
    Route::get('library-resources/categories', [LibraryResourceController::class, 'categories'])->name('library-resources.categories');
    Route::get('library-resources', [LibraryResourceController::class, 'index'])->name('library-resources.index');
    Route::get('library-resources/{identifier}', [LibraryResourceController::class, 'show'])->name('library-resources.show');

    // Journal Issues — public
    Route::get('journal-issues', [JournalIssueController::class, 'index'])->name('journal-issues.index');
    Route::get('journal-issues/{identifier}', [JournalIssueController::class, 'show'])->name('journal-issues.show');

    // Contact Locations — public + admin (controller ichida optional auth tekshiradi)
    Route::get('contact-locations', [ContactLocationController::class, 'index'])->name('contact-locations.index');

    // Global Search (GIN INDEX ishlatadi)
    Route::get('search', SearchController::class)
        ->middleware('throttle:30,1')
        ->name('search');

    // Translations — public (barcha tarjimalar flat map)
    Route::get('translations', [TranslationController::class, 'publicIndex'])->name('translations.public');

    // Site Contents — public (bo'lim bo'yicha)
    Route::get('site-contents/{section}', [SiteContentController::class, 'index'])->name('site-contents.index');

    // Media — ochiq ko'rish (rasmlar, hujjatlar)
    Route::get('media/{modelType}/{modelId}', [MediaController::class, 'show'])
        ->where('modelType', 'news|department|staff|direction|banner|partner|page|journal-issue')
        ->name('media.show');

    // ---- Protected routes (auth required) ----
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::post('auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
        Route::get('auth/me', [AuthController::class, 'me'])->name('auth.me');

        // ============================================
        // SUPER ADMIN — faqat super-admin roli
        // ============================================
        Route::middleware('role:super-admin')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
            Route::get('users/{id}', [UserController::class, 'show'])->name('users.show');
            Route::put('users/{id}', [UserController::class, 'update'])->name('users.update');
            Route::delete('users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        // ============================================
        // ADMIN Routes — super-admin yoki admin roli kerak
        // ============================================
        Route::middleware('role:super-admin|admin')->group(function () {

            // Media boshqaruv
            Route::get('media/download/{id}', [MediaController::class, 'download'])->name('media.download');
            Route::get('media/stream/{id}', [MediaController::class, 'stream'])->name('media.stream');
            Route::post('media/upload', [MediaController::class, 'upload'])->name('media.upload');
            Route::delete('media/{id}', [MediaController::class, 'destroy'])->name('media.destroy');
            Route::get('media/stats', [MediaController::class, 'stats'])->name('media.stats');

            // NEWS CRUD
            Route::post('news', [NewsController::class, 'store'])->name('news.store');
            Route::put('news/{id}', [NewsController::class, 'update'])->name('news.update');
            Route::delete('news/{id}', [NewsController::class, 'destroy'])->name('news.destroy');

            // DEPARTMENTS CRUD
            Route::post('departments', [DepartmentController::class, 'store'])->name('departments.store');
            Route::put('departments/{id}', [DepartmentController::class, 'update'])->name('departments.update');
            Route::delete('departments/{id}', [DepartmentController::class, 'destroy'])->name('departments.destroy');

            // STAFF CRUD
            Route::post('staff', [StaffController::class, 'store'])->name('staff.store');
            Route::put('staff/{id}', [StaffController::class, 'update'])->name('staff.update');
            Route::delete('staff/{id}', [StaffController::class, 'destroy'])->name('staff.destroy');

            // FACULTIES CRUD
            Route::post('faculties', [FacultyController::class, 'store'])->name('faculties.store');
            Route::put('faculties/{id}', [FacultyController::class, 'update'])->name('faculties.update');
            Route::delete('faculties/{id}', [FacultyController::class, 'destroy'])->name('faculties.destroy');

            // DIRECTIONS CRUD
            Route::post('directions', [DirectionController::class, 'store'])->name('directions.store');
            Route::put('directions/{id}', [DirectionController::class, 'update'])->name('directions.update');
            Route::delete('directions/{id}', [DirectionController::class, 'destroy'])->name('directions.destroy');

            // FAQ CRUD
            Route::post('faqs', [FaqController::class, 'store'])->name('faqs.store');
            Route::put('faqs/{id}', [FaqController::class, 'update'])->name('faqs.update');
            Route::delete('faqs/{id}', [FaqController::class, 'destroy'])->name('faqs.destroy');

            // BANNERS CRUD
            Route::get('banners/{id}', [BannerController::class, 'show'])->name('banners.show');
            Route::post('banners', [BannerController::class, 'store'])->name('banners.store');
            Route::put('banners/{id}', [BannerController::class, 'update'])->name('banners.update');
            Route::delete('banners/{id}', [BannerController::class, 'destroy'])->name('banners.destroy');

            // PARTNERS CRUD
            Route::get('partners/{id}', [PartnerController::class, 'show'])->name('partners.show');
            Route::post('partners', [PartnerController::class, 'store'])->name('partners.store');
            Route::put('partners/{id}', [PartnerController::class, 'update'])->name('partners.update');
            Route::delete('partners/{id}', [PartnerController::class, 'destroy'])->name('partners.destroy');

            // TESTIMONIALS CRUD
            Route::get('testimonials/{id}', [TestimonialController::class, 'show'])->name('testimonials.show');
            Route::post('testimonials', [TestimonialController::class, 'store'])->name('testimonials.store');
            Route::put('testimonials/{id}', [TestimonialController::class, 'update'])->name('testimonials.update');
            Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy'])->name('testimonials.destroy');

            // PAGES CRUD + Tree management
            Route::put('pages/reorder', [PageController::class, 'reorder'])->name('pages.reorder');
            Route::post('pages', [PageController::class, 'store'])->name('pages.store');
            Route::put('pages/{id}', [PageController::class, 'update'])->name('pages.update');
            Route::delete('pages/{id}', [PageController::class, 'destroy'])->name('pages.destroy');

            // CONFERENCE REGISTRATIONS — Admin boshqaruvi
            Route::get('conference-registrations', [ConferenceRegistrationController::class, 'index'])->name('conference-registrations.index');
            Route::get('conference-registrations/unread/count', [ConferenceRegistrationController::class, 'unreadCount'])->name('conference-registrations.unread-count');
            Route::get('conference-registrations/{id}', [ConferenceRegistrationController::class, 'show'])->name('conference-registrations.show');
            Route::delete('conference-registrations/{id}', [ConferenceRegistrationController::class, 'destroy'])->name('conference-registrations.destroy');

            // JOB APPLICATIONS — Admin boshqaruvi
            Route::get('job-applications', [JobApplicationController::class, 'index'])->name('job-applications.index');
            Route::get('job-applications/unread/count', [JobApplicationController::class, 'unreadCount'])->name('job-applications.unread-count');
            Route::get('job-applications/{id}', [JobApplicationController::class, 'show'])->name('job-applications.show');
            Route::delete('job-applications/{id}', [JobApplicationController::class, 'destroy'])->name('job-applications.destroy');

            // CONTACT MESSAGES — Admin boshqaruvi
            Route::get('contacts', [ContactController::class, 'index'])->name('contacts.index');
            Route::get('contacts/unread/count', [ContactController::class, 'unreadCount'])->name('contacts.unread-count');
            Route::get('contacts/{id}', [ContactController::class, 'show'])->name('contacts.show');
            Route::put('contacts/{id}', [ContactController::class, 'update'])->name('contacts.update');
            Route::delete('contacts/{id}', [ContactController::class, 'destroy'])->name('contacts.destroy');

            // STUDENT WORKS — Admin boshqaruvi
            Route::get('student-works', [StudentWorkController::class, 'index'])->name('student-works.index');
            Route::get('student-works/unread/count', [StudentWorkController::class, 'unreadCount'])->name('student-works.unread-count');
            Route::get('student-works/{id}', [StudentWorkController::class, 'show'])->name('student-works.show');
            Route::delete('student-works/{id}', [StudentWorkController::class, 'destroy'])->name('student-works.destroy');

            // CONTACT LOCATIONS — Admin CRUD (GET /contact-locations public routeda)
            Route::get('contact-locations/{id}', [ContactLocationController::class, 'show'])->name('contact-locations.show');
            Route::post('contact-locations', [ContactLocationController::class, 'store'])->name('contact-locations.store');
            Route::put('contact-locations/{id}', [ContactLocationController::class, 'update'])->name('contact-locations.update');
            Route::delete('contact-locations/{id}', [ContactLocationController::class, 'destroy'])->name('contact-locations.destroy');

            // TALENTED STUDENTS CRUD
            Route::get('talented-students/{id}', [TalentedStudentController::class, 'show'])->name('talented-students.show');
            Route::post('talented-students', [TalentedStudentController::class, 'store'])->name('talented-students.store');
            Route::put('talented-students/{id}', [TalentedStudentController::class, 'update'])->name('talented-students.update');
            Route::delete('talented-students/{id}', [TalentedStudentController::class, 'destroy'])->name('talented-students.destroy');

            // CAREER CENTER INFOS CRUD
            Route::get('career-center-infos/{id}', [CareerCenterInfoController::class, 'show'])->name('career-center-infos.show');
            Route::post('career-center-infos', [CareerCenterInfoController::class, 'store'])->name('career-center-infos.store');
            Route::put('career-center-infos/{id}', [CareerCenterInfoController::class, 'update'])->name('career-center-infos.update');
            Route::delete('career-center-infos/{id}', [CareerCenterInfoController::class, 'destroy'])->name('career-center-infos.destroy');

            // STUDENT LIFE PHOTOS CRUD
            Route::get('student-life-photos/{id}', [StudentLifePhotoController::class, 'show'])->name('student-life-photos.show');
            Route::post('student-life-photos', [StudentLifePhotoController::class, 'store'])->name('student-life-photos.store');
            Route::put('student-life-photos/{id}', [StudentLifePhotoController::class, 'update'])->name('student-life-photos.update');
            Route::delete('student-life-photos/{id}', [StudentLifePhotoController::class, 'destroy'])->name('student-life-photos.destroy');

            // LIBRARY RESOURCES CRUD
            Route::get('library-resources/{id}', [LibraryResourceController::class, 'show'])->where('id', '[0-9]+')->name('library-resources.admin-show');
            Route::post('library-resources', [LibraryResourceController::class, 'store'])->name('library-resources.store');
            Route::put('library-resources/{id}', [LibraryResourceController::class, 'update'])->name('library-resources.update');
            Route::delete('library-resources/{id}', [LibraryResourceController::class, 'destroy'])->name('library-resources.destroy');

            // JOURNAL ISSUES CRUD
            Route::get('journal-issues/{id}', [JournalIssueController::class, 'show'])->where('id', '[0-9]+')->name('journal-issues.admin-show');
            Route::post('journal-issues', [JournalIssueController::class, 'store'])->name('journal-issues.store');
            Route::put('journal-issues/{id}', [JournalIssueController::class, 'update'])->name('journal-issues.update');
            Route::delete('journal-issues/{id}', [JournalIssueController::class, 'destroy'])->name('journal-issues.destroy');

            // SITE MEDIA CRUD
            Route::get('site-media/{id}', [SiteMediaController::class, 'show'])->where('id', '[0-9]+')->name('site-media.show');
            Route::post('site-media', [SiteMediaController::class, 'store'])->name('site-media.store');
            Route::put('site-media/{id}', [SiteMediaController::class, 'update'])->name('site-media.update');
            Route::delete('site-media/{id}', [SiteMediaController::class, 'destroy'])->name('site-media.destroy');

            // TRANSLATIONS CRUD
            Route::get('translations/admin', [TranslationController::class, 'index'])->name('translations.index');
            Route::post('translations', [TranslationController::class, 'store'])->name('translations.store');
            Route::post('translations/bulk-import', [TranslationController::class, 'bulkImport'])->name('translations.bulk-import');
            Route::get('translations/{id}', [TranslationController::class, 'show'])->name('translations.show');
            Route::put('translations/{id}', [TranslationController::class, 'update'])->name('translations.update');
            Route::delete('translations/{id}', [TranslationController::class, 'destroy'])->name('translations.destroy');

            // SITE CONTENTS — Admin boshqaruvi
            Route::get('site-contents', [SiteContentController::class, 'adminIndex'])->name('site-contents.admin-index');
            Route::put('site-contents', [SiteContentController::class, 'upsert'])->name('site-contents.upsert');
            Route::put('site-contents/batch', [SiteContentController::class, 'batchUpsert'])->name('site-contents.batch-upsert');
            Route::post('site-contents/upload-image', [SiteContentController::class, 'uploadImage'])->name('site-contents.upload-image');
            Route::delete('site-contents/{key}', [SiteContentController::class, 'destroy'])->name('site-contents.destroy');
        });
    });
});
