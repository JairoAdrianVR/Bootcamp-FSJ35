<?php

namespace Database\Factories;

use App\Models\Categoria;
use App\Models\Plato;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Plato>
 */
class PlatoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'categoria_id' => Categoria::factory(),
            'nombre' => $this->faker->words(3, true),
            'descripcion' => $this->faker->optional()->sentence(),
            'precio' => $this->faker->randomFloat(2, 5, 100),
            'imagen' => $this->faker->optional()->imageUrl(640, 480, 'food'),
            'disponible' => $this->faker->boolean(85),
        ];
    }
}
