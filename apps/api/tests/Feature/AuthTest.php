<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::create(['name' => 'super-admin', 'guard_name' => 'web']);
        Role::create(['name' => 'admin', 'guard_name' => 'web']);
        Role::create(['name' => 'editor', 'guard_name' => 'web']);
    }

    public function test_login_with_valid_credentials_returns_token(): void
    {
        $user = User::create([
            'name' => 'Test Admin',
            'email' => 'admin@test.local',
            'password' => Hash::make('secret1234'),
        ]);
        $user->assignRole('super-admin');

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'admin@test.local',
            'password' => 'secret1234',
        ]);

        $response->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data' => ['token', 'user' => ['id', 'email', 'roles']]]);
    }

    public function test_login_with_invalid_password_fails(): void
    {
        User::create([
            'name' => 'X',
            'email' => 'user@test.local',
            'password' => Hash::make('correct-password'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'user@test.local',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
        $this->assertStringContainsString("noto'g'ri", $response->json('errors.email.0'));
    }

    public function test_brute_force_lockout_after_5_attempts(): void
    {
        User::create([
            'name' => 'X',
            'email' => 'victim@test.local',
            'password' => Hash::make('correct-password'),
        ]);

        // 5 failed attempts
        for ($i = 1; $i <= 5; $i++) {
            $this->postJson('/api/v1/auth/login', [
                'email' => 'victim@test.local',
                'password' => 'wrong',
            ])->assertStatus(422);
        }

        // 6th attempt — should be locked
        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'victim@test.local',
            'password' => 'correct-password',
        ]);

        $this->assertStringContainsString('Juda ko\'p', $response->json('errors.email.0'));

        // Cleanup
        RateLimiter::clear('login:'.sha1('victim@test.local|127.0.0.1'));
    }

    public function test_forgot_password_always_returns_success(): void
    {
        // Even for non-existent email, should return success (no enumeration)
        $response = $this->postJson('/api/v1/auth/forgot-password', [
            'email' => 'nonexistent@test.local',
        ]);

        $response->assertOk()->assertJson(['success' => true]);
    }

    public function test_me_endpoint_requires_auth(): void
    {
        $this->getJson('/api/v1/auth/me')->assertStatus(401);
    }

    public function test_me_endpoint_returns_user_data(): void
    {
        $user = User::create([
            'name' => 'Me Test',
            'email' => 'me@test.local',
            'password' => Hash::make('secret1234'),
        ]);
        $user->assignRole('admin');
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v1/auth/me');

        $response->assertOk()
            ->assertJsonPath('data.email', 'me@test.local')
            ->assertJsonPath('data.roles.0', 'admin');
    }
}
