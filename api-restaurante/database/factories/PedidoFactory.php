<?php

namespace Database\Factories;

use App\Models\Pedido;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pedido>
 */
class PedidoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'mesa' => 'Mesa '.fake()->numberBetween(1, 12),
            'estado' => 'pendiente',
            'total' => 0,
            'notas' => fake()->optional()->sentence(),
        ];
    }
}
