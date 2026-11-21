<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\Plato;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PlatoTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_list_platos(): void
    {
        $categoria = Categoria::factory()->create();
        Plato::factory()->count(2)->create(['categoria_id' => $categoria->id]);
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/platos')->assertStatus(200)->assertJsonCount(2, 'data');
    }

    public function test_admin_can_filter_platos_by_categoria(): void
    {
        $cat1 = Categoria::factory()->create();
        $cat2 = Categoria::factory()->create();
        Plato::factory()->create(['categoria_id' => $cat1->id]);
        Plato::factory()->create(['categoria_id' => $cat2->id]);
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/platos?categoria_id='.$cat1->id)
            ->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }

    public function test_admin_can_create_plato(): void
    {
        $categoria = Categoria::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/platos', [
            'categoria_id' => $categoria->id,
            'nombre' => 'Pizza',
            'precio' => 12.50,
        ])->assertStatus(201)->assertJsonFragment(['nombre' => 'Pizza']);
    }

    public function test_create_plato_requires_fields(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/platos', [])->assertStatus(422);
    }

    public function test_admin_can_show_plato(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id]);
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/platos/'.$plato->id)->assertStatus(200);
    }

    public function test_admin_can_update_plato(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id]);
        Sanctum::actingAs($this->admin());

        $this->patchJson('/api/platos/'.$plato->id, [
            'precio' => 15.00,
        ])->assertStatus(200);
    }

    public function test_admin_can_delete_plato(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id]);
        Sanctum::actingAs($this->admin());

        $this->deleteJson('/api/platos/'.$plato->id)->assertStatus(204);
    }

    public function test_show_nonexistent_plato_returns_404(): void
    {
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/platos/9999')->assertStatus(404);
    }
}
