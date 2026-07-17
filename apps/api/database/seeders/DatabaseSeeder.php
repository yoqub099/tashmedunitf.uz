<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ---- Permissions yaratish ----
        $permissions = [
            'news.view', 'news.create', 'news.edit', 'news.delete',
            'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
            'staff.view', 'staff.create', 'staff.edit', 'staff.delete',
            'directions.view', 'directions.create', 'directions.edit', 'directions.delete',
            'faqs.view', 'faqs.create', 'faqs.edit', 'faqs.delete',
            'banners.view', 'banners.create', 'banners.edit', 'banners.delete',
            'partners.view', 'partners.create', 'partners.edit', 'partners.delete',
            'testimonials.view', 'testimonials.create', 'testimonials.edit', 'testimonials.delete',
            'pages.view', 'pages.create', 'pages.edit', 'pages.delete',
            'contacts.view', 'contacts.delete',
            'media.upload', 'media.delete', 'media.stats',
            'users.view', 'users.create', 'users.edit', 'users.delete',
            'settings.view', 'settings.edit',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // ---- Roles yaratish ----
        $superAdmin = Role::firstOrCreate(['name' => 'super-admin', 'guard_name' => 'web']);
        $admin = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $editor = Role::firstOrCreate(['name' => 'editor', 'guard_name' => 'web']);

        // Super-admin — barcha ruxsatlar
        $superAdmin->syncPermissions($permissions);

        // Admin — CRUD (foydalanuvchilar boshqaruvidan tashqari)
        $admin->syncPermissions(array_filter($permissions, fn ($p) => ! str_starts_with($p, 'users.') && ! str_starts_with($p, 'settings.')));

        // Editor — faqat ko'rish va tahrirlash
        $editor->syncPermissions(array_filter($permissions, fn ($p) => str_ends_with($p, '.view') || str_ends_with($p, '.edit') || str_ends_with($p, '.create')));

        // ---- Super Admin user ----
        $user = User::firstOrCreate(
            ['email' => 'admin@tdtutf.uz'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make(env('ADMIN_PASSWORD') ?: throw new \RuntimeException('ADMIN_PASSWORD env variable is required')),
                'phone' => '+998901234567',
            ]
        );

        if (! $user->hasRole('super-admin')) {
            $user->assignRole($superAdmin);
        }

        $this->command->info('✅ Roles, permissions va super-admin yaratildi!');
        $this->command->info('📧 Email: admin@tdtutf.uz');

        // ---- Content seeders ----
        $this->call([
            DepartmentSeeder::class,
            StaffSeeder::class,
            NewsSeeder::class,
            DirectionSeeder::class,
            FacultySeeder::class,
            FaqSeeder::class,
            ContentSeeder::class,
            SiteContentSeeder::class,
            ContactLocationSeeder::class,
            PageSeeder::class,
            NavigationSeeder::class,
            MediaSeeder::class,
            TalentedStudentSeeder::class,
        ]);

        $this->command->info('🎉 Barcha ma\'lumotlar muvaffaqiyatli yaratildi!');
    }
}
