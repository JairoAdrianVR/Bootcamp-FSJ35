<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\Plato;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PedidoTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['is_admin' => true]);
    }

    public function test_admin_can_list_pedidos(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id]);
        \App\Models\Pedido::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/pedidos')->assertStatus(200);
    }

    public function test_admin_can_filter_pedidos_by_estado(): void
    {
        \App\Models\Pedido::factory()->create(['estado' => 'listo']);
        \App\Models\Pedido::factory()->create(['estado' => 'pendiente']);
        Sanctum::actingAs($this->admin());

        $response = $this->getJson('/api/pedidos?estado=listo');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_admin_can_create_pedido(): void
    {
        $categoria = Categoria::factory()->create();
        $plato = Plato::factory()->create(['categoria_id' => $categoria->id, 'precio' => 10.00]);
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/pedidos', [
            'mesa' => 'Mesa 1',
            'notas' => 'Sin cebolla',
            'items' => [
                ['plato_id' => $plato->id, 'cantidad' => 2],
            ],
        ])->assertStatus(201)->assertJsonFragment(['mesa' => 'Mesa 1']);
    }

    public function test_create_pedido_requires_items(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/pedidos', [])->assertStatus(422);
    }

    public function test_create_pedido_with_invalid_plato_returns_422(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/pedidos', [
            'items' => [
                ['plato_id' => 9999, 'cantidad' => 1],
            ],
        ])->assertStatus(422);
    }

    public function test_admin_can_show_pedido(): void
    {
        $pedido = \App\Models\Pedido::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/pedidos/'.$pedido->id)->assertStatus(200);
    }

    public function test_admin_can_update_pedido_estado(): void
    {
        $pedido = \App\Models\Pedido::factory()->create(['estado' => 'pendiente']);
        Sanctum::actingAs($this->admin());

        $this->patchJson('/api/pedidos/'.$pedido->id, [
            'estado' => 'listo',
        ])->assertStatus(200)->assertJsonFragment(['estado' => 'listo']);
    }

    public function test_admin_can_delete_pedido(): void
    {
        $pedido = \App\Models\Pedido::factory()->create();
        Sanctum::actingAs($this->admin());

        $this->deleteJson('/api/pedidos/'.$pedido->id)->assertStatus(204);
    }

    public function test_show_nonexistent_pedido_returns_404(): void
    {
        Sanctum::actingAs($this->admin());

        $this->getJson('/api/pedidos/9999')->assertStatus(404);
    }
}
