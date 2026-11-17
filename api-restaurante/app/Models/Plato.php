<?php

namespace App\Models;

use Database\Factories\PlatoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class Plato extends Model
{
    /** @use HasFactory<PlatoFactory> */
    use HasFactory;

    protected $fillable = [
        'categoria_id',
        'nombre',
        'descripcion',
        'precio',
        'imagen',
        'disponible',
    ];

    protected function casts(): array
    {
        return [
            'precio' => 'decimal:2',
            'disponible' => 'boolean',
        ];
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    /**
     * Elimina el plato y recalcula los pedidos afectados.
     */
    public function deleteWithDependencies(): void
    {
        DB::transaction(function () {
            $affectedPedidoIds = PedidoItem::where('plato_id', $this->id)
                ->pluck('pedido_id')
                ->unique();

            PedidoItem::where('plato_id', $this->id)->delete();

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

            $this->delete();
        });
    }
}
