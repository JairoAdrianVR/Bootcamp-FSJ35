<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\PlatoResource;
use App\Models\Categoria;
use App\Models\Plato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MenuController extends Controller
{
    public function categorias(): mixed
    {
        try {
            $categorias = Categoria::with(['platos' => function ($query) {
                $query->where('disponible', true);
            }])
                ->whereHas('platos', function ($query) {
                    $query->where('disponible', true);
                })
                ->get();

            return response()->json($categorias);
        } catch (\Throwable $e) {
            Log::error('Error al obtener menu de categorias', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo obtener el menu.'], 500);
        }
    }

    public function platos(Request $request): mixed
    {
        try {
            $query = Plato::with('categoria')->where('disponible', true);

            if ($request->filled('categoria_id')) {
                $query->where('categoria_id', $request->integer('categoria_id'));
            }

            if ($request->filled('buscar')) {
                $query->where('nombre', 'like', '%'.$request->string('buscar').'%');
            }

            $platos = $query->latest()->paginate();

            return PlatoResource::collection($platos);
        } catch (\Throwable $e) {
            Log::error('Error al obtener menu de platos', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo obtener el menu.'], 500);
        }
    }

    public function plato(Plato $plato): mixed
    {
        try {
            if (! $plato->disponible) {
                return response()->json(['message' => 'Plato no disponible.'], 404);
            }

            return new PlatoResource($plato->load('categoria'));
        } catch (\Throwable $e) {
            Log::error('Error al obtener plato del menu', ['exception' => $e->getMessage(), 'id' => $plato->id]);

            return response()->json(['message' => 'No se pudo obtener el plato.'], 500);
        }
    }
}
