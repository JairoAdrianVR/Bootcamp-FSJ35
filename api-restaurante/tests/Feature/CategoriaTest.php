<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoriaTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_list_categorias(): void
    {
        Categoria::factory()->count(3)->create();
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/categorias')->assertStatus(200)->assertJsonCount(3, 'data');
    }

    public function test_admin_can_create_categoria(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/categorias', [
            'nombre' => 'Bebidas',
            'descripcion' => 'Refrescos',
        ])->assertStatus(201)->assertJsonFragment(['nombre' => 'Bebidas']);
    }

    public function test_create_categoria_requires_nombre(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/categorias', [])->assertStatus(422);
    }

    public function test_admin_can_show_categoria(): void
    {
        $categoria = Categoria::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/categorias/'.$categoria->id)->assertStatus(200);
    }

    public function test_admin_can_update_categoria(): void
    {
        $categoria = Categoria::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->patchJson('/api/categorias/'.$categoria->id, [
            'nombre' => 'Actualizada',
        ])->assertStatus(200)->assertJsonFragment(['nombre' => 'Actualizada']);
    }

    public function test_admin_can_delete_categoria(): void
    {
        $categoria = Categoria::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->deleteJson('/api/categorias/'.$categoria->id)->assertStatus(204);
    }

    public function test_non_admin_cannot_access_categorias(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        Sanctum::actingAs($user);

        $this->getJson('/api/categorias')->assertStatus(403);
    }
}
