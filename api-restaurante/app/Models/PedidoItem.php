<?php

namespace App\Models;

use Database\Factories\PedidoItemFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoItem extends Model
{
    /** @use HasFactory<PedidoItemFactory> */
    use HasFactory;

    protected $fillable = [
        'pedido_id',
        'plato_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    protected function casts(): array
    {
        return [
            'cantidad' => 'integer',
            'precio_unitario' => 'decimal:2',
            'subtotal' => 'decimal:2',
        ];
    }

    public function pedido(): BelongsTo
    {
        return $this->belongsTo(Pedido::class);
    }

    public function plato(): BelongsTo
    {
        return $this->belongsTo(Plato::class);
    }
}
