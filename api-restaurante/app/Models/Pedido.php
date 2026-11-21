<?php

namespace App\Models;

use Database\Factories\PedidoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Pedido extends Model
{
    /** @use HasFactory<PedidoFactory> */
    use HasFactory;

    public const ESTADOS = ['pendiente', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

    protected $fillable = [
        'mesa',
        'estado',
        'total',
        'notas',
    ];

    protected function casts(): array
    {
        return [
            'total' => 'decimal:2',
        ];
    }

    public function items(): HasMany
    {
        return $this->hasMany(PedidoItem::class);
    }

    /**
     * Crea un pedido con sus items y calcula el total.
     */
    public static function createWithItems(array $data): self
    {
        return DB::transaction(function () use ($data) {
            $pedido = self::create([
                'mesa' => $data['mesa'] ?? null,
                'notas' => $data['notas'] ?? null,
                'estado' => 'pendiente',
                'total' => 0,
            ]);

            $total = 0;

            foreach ($data['items'] as $item) {
                $plato = Plato::findOrFail($item['plato_id']);
                $cantidad = (int) $item['cantidad'];
                $precio = (float) $plato->precio;
                $subtotal = $precio * $cantidad;

                $pedido->items()->create([
                    'plato_id' => $plato->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $pedido->update(['total' => $total]);

            return $pedido;
        });
    }
}
