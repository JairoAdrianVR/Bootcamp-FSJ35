<?php

namespace App\Models;

use Database\Factories\CategoriaFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Categoria extends Model
{
    /** @use HasFactory<CategoriaFactory> */
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function platos(): HasMany
    {
        return $this->hasMany(Plato::class);
    }

    /**
     * Elimina la categoria junto con sus platos y recalcula
     * los pedidos afectados, manteniendo la integridad.
     */
    public function deleteWithDependencies(): void
    {
        DB::transaction(function () {
            $platoIds = $this->platos()->pluck('id');

            if ($platoIds->isNotEmpty()) {
                $affectedPedidoIds = PedidoItem::whereIn('plato_id', $platoIds)
                    ->pluck('pedido_id')
                    ->unique();

                PedidoItem::whereIn('plato_id', $platoIds)->delete();

                foreach ($affectedPedidoIds as $pedidoId) {
                    $pedido = Pedido::find($pedidoId);

                    if (! $pedido) {
                        continue;
                    }

                    $remainingItems = $pedido->items()->get();

                    if ($remainingItems->isEmpty()) {
                        $pedido->delete();
                    } else {
                        $pedido->update([
                            'total' => $remainingItems->sum('subtotal'),
                        ]);
                    }
                }

                $this->platos()->delete();
            }

            $this->delete();
        });
    }
}
