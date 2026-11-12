<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Plato;
use Illuminate\Database\Seeder;

class PlatoSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = Categoria::all();

        if ($categorias->isEmpty()) {
            return;
        }

        Plato::factory()
            ->count(20)
            ->create(fn () => ['categoria_id' => $categorias->random()->id]);
    }
}
