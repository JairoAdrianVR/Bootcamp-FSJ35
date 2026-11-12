<?php

namespace Database\Seeders;

use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Plato;
use Illuminate\Database\Seeder;

class PedidoSeeder extends Seeder
{
    public function run(): void
    {
        $platos = Plato::all();

        if ($platos->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 10; $i++) {
            $pedido = Pedido::create([
                'mesa' => 'Mesa '.random_int(1, 12),
                'estado' => collect(Pedido::ESTADOS)->random(),
                'notas' => random_int(0, 1) ? 'Sin cebolla' : null,
                'total' => 0,
            ]);

            $total = 0;
            $items = $platos->random(min(random_int(1, 4), $platos->count()));

            foreach ($items as $plato) {
                $cantidad = random_int(1, 3);
                $precio = (float) $plato->precio;
                $subtotal = $precio * $cantidad;

                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'plato_id' => $plato->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $pedido->update(['total' => $total]);
        }
    }
}
