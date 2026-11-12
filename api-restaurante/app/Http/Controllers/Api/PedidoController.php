<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use App\Models\Plato;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller
{
    public function index(): mixed
    {
        try {
            $pedidos = Pedido::with('items.plato')->latest()->paginate();

            return PedidoResource::collection($pedidos);
        } catch (\Throwable $e) {
            Log::error('Error al listar pedidos', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudieron obtener los pedidos.'], 500);
        }
    }

    public function store(StorePedidoRequest $request): mixed
    {
        try {
            $pedido = DB::transaction(function () use ($request) {
                $pedido = Pedido::create([
                    'mesa' => $request->input('mesa'),
                    'notas' => $request->input('notas'),
                    'estado' => 'pendiente',
                    'total' => 0,
                ]);

                $total = 0;

                foreach ($request->input('items') as $item) {
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

            return new PedidoResource($pedido->load('items.plato'));
        } catch (ModelNotFoundException $e) {
            Log::error('Plato no encontrado al crear pedido', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'Uno de los platos indicados no existe.'], 404);
        } catch (\Throwable $e) {
            Log::error('Error al crear pedido', ['exception' => $e->getMessage(), 'data' => $request->all()]);

            return response()->json(['message' => 'No se pudo crear el pedido.'], 500);
        }
    }

    public function show(Pedido $pedido): mixed
    {
        try {
            return new PedidoResource($pedido->load('items.plato'));
        } catch (\Throwable $e) {
            Log::error('Error al obtener pedido', ['exception' => $e->getMessage(), 'id' => $pedido->id]);

            return response()->json(['message' => 'No se pudo obtener el pedido.'], 500);
        }
    }

    public function update(UpdatePedidoRequest $request, Pedido $pedido): mixed
    {
        try {
            $pedido->update($request->validated());

            return new PedidoResource($pedido->load('items.plato'));
        } catch (\Throwable $e) {
            Log::error('Error al actualizar pedido', ['exception' => $e->getMessage(), 'id' => $pedido->id]);

            return response()->json(['message' => 'No se pudo actualizar el pedido.'], 500);
        }
    }

    public function destroy(Pedido $pedido): mixed
    {
        try {
            $pedido->delete();

            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Error al eliminar pedido', ['exception' => $e->getMessage(), 'id' => $pedido->id]);

            return response()->json(['message' => 'No se pudo eliminar el pedido.'], 500);
        }
    }
}
