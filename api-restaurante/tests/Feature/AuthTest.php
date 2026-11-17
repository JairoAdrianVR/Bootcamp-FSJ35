<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login(): void
    {
        $user = User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'password',
        ]);

        $response->assertStatus(200)->assertJsonStructure(['token', 'user']);
    }

    public function test_login_fails_with_wrong_credentials(): void
    {
        User::factory()->create([
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        $this->postJson('/api/login', [
            'email' => 'admin@test.com',
            'password' => 'wrong',
        ])->assertStatus(401);
    }

    public function test_non_admin_cannot_login(): void
    {
        User::factory()->create([
            'email' => 'user@test.com',
            'password' => bcrypt('password'),
            'is_admin' => false,
        ]);

        $this->postJson('/api/login', [
            'email' => 'user@test.com',
            'password' => 'password',
        ])->assertStatus(403);
    }

    public function test_me_returns_authenticated_user(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        Sanctum::actingAs($user);

        $this->getJson('/api/me')
            ->assertStatus(200)
            ->assertJsonFragment(['email' => $user->email]);
    }

    public function test_logout_revokes_token(): void
    {
        $user = User::factory()->create(['is_admin' => true]);
        Sanctum::actingAs($user);

        $this->postJson('/api/logout')->assertStatus(200);
    }

    public function test_unauthenticated_access_returns_401(): void
    {
        $this->getJson('/api/categorias')->assertStatus(401);
    }
}
