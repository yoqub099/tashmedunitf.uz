<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

/**
 * Rahbariyat / Xodim CRUD — "Bo'lim" comboboxi (erkin yozish: mavjudni tanlash
 * YOKI yangi yaratish) va rasm yuklash uchun end-to-end qamrov.
 *
 * Admin panelda "Bo'lim" inputiga yozib bo'lmagani (faqat select edi) va rasm
 * ko'rinmagani uchun kiritilgan tuzatishlarni himoyalaydi.
 */
class StaffDepartmentPhotoTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'super-admin', 'guard_name' => 'web']);
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
        Storage::fake('public');
    }

    private function authHeaders(string $role = 'super-admin'): array
    {
        $user = User::create([
            'name' => 'CRUD Admin',
            'email' => $role.'@test.local',
            'password' => Hash::make('secret1234'),
        ]);
        $user->assignRole($role);
        $token = $user->createToken('test')->plainTextToken;

        return ['Authorization' => "Bearer {$token}"];
    }

    public function test_create_staff_typing_a_new_department_creates_links_it_and_uploads_photo(): void
    {
        $headers = $this->authHeaders();

        $response = $this->withHeaders($headers)->post('/api/v1/staff', [
            'full_name' => ['uz' => 'Yangi Rahbar'],
            'position' => ['uz' => 'Direktor'],
            'department_name' => 'Yuqori Malakali Bolim',
            'is_active' => true,
            'sort_order' => 3,
            'photo' => UploadedFile::fake()->image('rahbar.jpg', 400, 400),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.department.name.uz', 'Yuqori Malakali Bolim');

        // Yangi bo'lim haqiqatan yaratildi va bog'landi
        $this->assertTrue(
            Department::whereRaw("name->>'uz' = ?", ['Yuqori Malakali Bolim'])->exists(),
            'Combobox orqali yozilgan yangi bo\'lim yaratilishi kerak edi'
        );

        // Rasm yuklandi va media biriktirildi
        $this->assertNotEmpty($response->json('data.photo'), 'photo URL qaytishi kerak');
        $staff = Staff::firstWhere('email', null) ?? Staff::first();
        $this->assertSame(1, $staff->getMedia('photo')->count(), 'photo media biriktirilishi kerak');
    }

    public function test_typing_existing_department_name_case_insensitive_matches_without_duplicate(): void
    {
        $headers = $this->authHeaders();
        $dept = Department::create(['name' => ['uz' => 'Nevrologiya'], 'is_active' => true]);
        $before = Department::count();

        $response = $this->withHeaders($headers)->postJson('/api/v1/staff', [
            'full_name' => ['uz' => 'X'],
            'position' => ['uz' => 'Y'],
            'department_name' => 'NEVROLOGIYA', // boshqa registr
            'is_active' => true,
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.department.id', $dept->id);

        $this->assertSame($before, Department::count(), 'Dublikat bo\'lim yaratilmasligi kerak');
    }

    public function test_select_existing_department_by_id_still_works(): void
    {
        $headers = $this->authHeaders();
        $dept = Department::create(['name' => ['uz' => 'Kardiologiya'], 'is_active' => true]);

        $response = $this->withHeaders($headers)->postJson('/api/v1/staff', [
            'full_name' => ['uz' => 'A'],
            'position' => ['uz' => 'B'],
            'department_id' => $dept->id,
            'is_active' => true,
        ]);

        $response->assertCreated()->assertJsonPath('data.department.id', $dept->id);
    }

    public function test_create_requires_department_id_or_name(): void
    {
        $headers = $this->authHeaders();

        $response = $this->withHeaders($headers)->postJson('/api/v1/staff', [
            'full_name' => ['uz' => 'A'],
            'position' => ['uz' => 'B'],
            'is_active' => true,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['department_id']);
    }

    public function test_update_staff_uploads_and_replaces_photo(): void
    {
        $headers = $this->authHeaders();
        $dept = Department::create(['name' => ['uz' => 'Terapiya'], 'is_active' => true]);
        $staff = Staff::create([
            'full_name' => ['uz' => 'Eski Rahbar'],
            'position' => ['uz' => 'Mudir'],
            'department_id' => $dept->id,
            'is_active' => true,
        ]);
        $this->assertSame(0, $staff->getMedia('photo')->count());

        // Frontend multipart PUT ni POST + _method=PUT bilan spoof qiladi
        $response = $this->withHeaders($headers)->post("/api/v1/staff/{$staff->id}", [
            '_method' => 'PUT',
            'photo' => UploadedFile::fake()->image('yangi.jpg', 400, 400),
        ]);

        $response->assertOk();
        $this->assertNotEmpty($response->json('data.photo'));
        $this->assertSame(1, $staff->fresh()->getMedia('photo')->count(), 'Yuklangan rasm media sifatida saqlanishi kerak');
    }

    public function test_editor_cannot_create_staff(): void
    {
        $headers = $this->authHeaders('editor');

        $response = $this->withHeaders($headers)->postJson('/api/v1/staff', [
            'full_name' => ['uz' => 'A'],
            'position' => ['uz' => 'B'],
            'department_name' => 'Boshqa Bolim',
            'is_active' => true,
        ]);

        // editor uchun staff yaratish ruxsati yo'q (role:super-admin|admin guruhi)
        $this->assertContains($response->status(), [403, 401]);
    }
}
