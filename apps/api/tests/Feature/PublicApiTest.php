<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_health_endpoint_returns_healthy(): void
    {
        $this->getJson('/api/health')
            ->assertOk()
            ->assertJsonPath('status', 'healthy')
            ->assertJsonStructure(['status', 'timestamp', 'services', 'version']);
    }

    public function test_public_news_index_works_without_auth(): void
    {
        $this->getJson('/api/v1/news')
            ->assertOk()
            ->assertJson(['success' => true])
            ->assertJsonStructure(['data', 'meta' => ['current_page', 'total', 'per_page']]);
    }

    public function test_public_departments_index_works(): void
    {
        $this->getJson('/api/v1/departments')
            ->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_public_faculties_index_works(): void
    {
        $this->getJson('/api/v1/faculties')
            ->assertOk()
            ->assertJson(['success' => true]);
    }

    public function test_admin_endpoint_requires_auth(): void
    {
        $this->postJson('/api/v1/news', [])->assertStatus(401);
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $this->postJson('/api/v1/contact', [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'subject', 'message']);
    }
}
