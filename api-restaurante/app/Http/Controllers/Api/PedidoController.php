<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePedidoRequest;
use App\Http\Requests\UpdatePedidoRequest;
use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller
{
    public function index(Request $request): mixed
    {
        try {
            $query = Pedido::with('items.plato');

            if ($request->filled('estado')) {
                $query->where('estado', $request->string('estado'));
            }

            if ($request->filled('mesa')) {
                $query->where('mesa', 'like', '%'.$request->string('mesa').'%');
            }

            $pedidos = $query->latest()->paginate();

            return PedidoResource::collection($pedidos);
        } catch (\Throwable $e) {
            Log::error('Error al listar pedidos', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudieron obtener los pedidos.'], 500);
        }
    }

    public function store(StorePedidoRequest $request): mixed
    {
        try {
            $pedido = Pedido::createWithItems($request->validated());

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
