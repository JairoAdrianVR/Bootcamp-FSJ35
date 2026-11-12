<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePlatoRequest;
use App\Http\Requests\UpdatePlatoRequest;
use App\Http\Resources\PlatoResource;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Plato;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PlatoController extends Controller
{
    public function index(): mixed
    {
        try {
            $platos = Plato::with('categoria')->latest()->paginate();

            return PlatoResource::collection($platos);
        } catch (\Throwable $e) {
            Log::error('Error al listar platos', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudieron obtener los platos.'], 500);
        }
    }

    public function store(StorePlatoRequest $request): mixed
    {
        try {
            $plato = Plato::create($request->validated());

            return new PlatoResource($plato->load('categoria'));
        } catch (\Throwable $e) {
            Log::error('Error al crear plato', ['exception' => $e->getMessage(), 'data' => $request->all()]);

            return response()->json(['message' => 'No se pudo crear el plato.'], 500);
        }
    }

    public function show(Plato $plato): mixed
    {
        try {
            return new PlatoResource($plato->load('categoria'));
        } catch (\Throwable $e) {
            Log::error('Error al obtener plato', ['exception' => $e->getMessage(), 'id' => $plato->id]);

            return response()->json(['message' => 'No se pudo obtener el plato.'], 500);
        }
    }

    public function update(UpdatePlatoRequest $request, Plato $plato): mixed
    {
        try {
            $plato->update($request->validated());

            return new PlatoResource($plato->load('categoria'));
        } catch (\Throwable $e) {
            Log::error('Error al actualizar plato', ['exception' => $e->getMessage(), 'id' => $plato->id]);

            return response()->json(['message' => 'No se pudo actualizar el plato.'], 500);
        }
    }

    public function destroy(Plato $plato): mixed
    {
        try {
            DB::transaction(function () use ($plato) {
                $affectedPedidoIds = PedidoItem::where('plato_id', $plato->id)
                    ->pluck('pedido_id')
                    ->unique();

                PedidoItem::where('plato_id', $plato->id)->delete();

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

                $plato->delete();
            });

            return response()->noContent();
        } catch (\Throwable $e) {
            Log::error('Error al eliminar plato', ['exception' => $e->getMessage(), 'id' => $plato->id]);

            return response()->json(['message' => 'No se pudo eliminar el plato.'], 500);
        }
    }
}
