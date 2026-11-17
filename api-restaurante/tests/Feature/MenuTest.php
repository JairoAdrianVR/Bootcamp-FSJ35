<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\Plato;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MenuTest extends TestCase
{
    use RefreshDatabase;

    public function test_menu_categorias_returns_only_available_platos(): void
    {
        $categoria = Categoria::factory()->create();
        Plato::factory()->create(['categoria_id' => $categoria->id, 'disponible' => true]);
        Plato::factory()->create(['categoria_id' => $categoria->id, 'disponible' => false]);

        $response = $this->getJson('/api/menu/categorias');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('0.platos'));
    }

    public function test_menu_platos_filters_by_categoria(): void
    {
        $cat1 = Categoria::factory()->create();
        $cat2 = Categoria::factory()->create();
        Plato::factory()->create(['categoria_id' => $cat1->id, 'disponible' => true]);
        Plato::factory()->create(['categoria_id' => $cat2->id, 'disponible' => true]);

        $response = $this->getJson('/api/menu/platos?categoria_id='.$cat1->id);

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_menu_plato_available_returns_200(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id, 'disponible' => true]);

        $this->getJson('/api/menu/platos/'.$plato->id)->assertStatus(200);
    }

    public function test_menu_plato_unavailable_returns_404(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id, 'disponible' => false]);

        $this->getJson('/api/menu/platos/'.$plato->id)->assertStatus(404);
    }
}
