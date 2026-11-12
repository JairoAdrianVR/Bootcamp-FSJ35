<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Requests\UpdateCategoriaRequest;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use App\Models\Pedido;
use App\Models\PedidoItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CategoriaController extends Controller
{
    public function index(): mixed
    {
        try {
            $categorias = Categoria::withCount('platos')->latest()->paginate();

            return CategoriaResource::collection($categorias);
        } catch (\Throwable $e) {
            Log::error('Error al listar categorias', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudieron obtener las categorias.'], 500);
        }
    }

    public function store(StoreCategoriaRequest $request): mixed
    {
        try {
            $categoria = Categoria::create($request->validated());

            return new CategoriaResource($categoria);
        } catch (\Throwable $e) {
            Log::error('Error al crear categoria', ['exception' => $e->getMessage(), 'data' => $request->all()]);

            return response()->json(['message' => 'No se pudo crear la categoria.'], 500);
        }
    }

    public function show(Categoria $categoria): mixed
    {
        try {
            $categoria->loadCount('platos');

            return new CategoriaResource($categoria);
        } catch (\Throwable $e) {
            Log::error('Error al obtener categoria', ['exception' => $e->getMessage(), 'id' => $categoria->id]);

            return response()->json(['message' => 'No se pudo obtener la categoria.'], 500);
        }
    }

    public function update(UpdateCategoriaRequest $request, Categoria $categoria): mixed
    {
        try {
            $categoria->update($request->validated());

            return new CategoriaResource($categoria);
        } catch (\Throwable $e) {
            Log::error('Error al actualizar categoria', ['exception' => $e->getMessage(), 'id' => $categoria->id]);

            return response()->json(['message' => 'No se pudo actualizar la categoria.'], 500);
        }
    }

    public function destroy(Categoria $categoria): mixed
    {
        try {
            DB::transaction(function () use ($categoria) {
                $platoIds = $categoria->platos()->pluck('id');

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

                    $categoria->platos()->delete();
                }

                $categoria->delete();
            });

            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Error al eliminar categoria', ['exception' => $e->getMessage(), 'id' => $categoria->id]);

            return response()->json(['message' => 'No se pudo eliminar la categoria.'], 500);
        }
    }
}
