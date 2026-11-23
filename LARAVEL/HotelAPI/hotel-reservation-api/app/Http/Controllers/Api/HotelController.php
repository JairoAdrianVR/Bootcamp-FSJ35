<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\HotelResource;
use App\Models\Hotel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class HotelController
 * 
 * Controlador de consulta y gestión de Hoteles.
 */
class HotelController extends BaseApiController
{
    /**
     * Listar todos los hoteles activos.
     * GET /api/v1/hotels
     */
    public function index(): JsonResponse
    {
        $hotels = Hotel::where('is_active', true)->with('rooms')->get();

        return $this->successResponse(
            HotelResource::collection($hotels),
            'Hoteles recuperados exitosamente.'
        );
    }

    /**
     * Ver un hotel específico.
     * GET /api/v1/hotels/{id}
     */
    public function show(int $id): JsonResponse
    {
        $hotel = Hotel::with('rooms')->find($id);

        if (!$hotel) {
            return $this->errorResponse('Hotel no encontrado.', Response::HTTP_NOT_FOUND);
        }

        return $this->successResponse(
            new HotelResource($hotel),
            'Detalle de hotel recuperado exitosamente.'
        );
    }

    /**
     * Registrar un nuevo hotel.
     * POST /api/v1/hotels
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'country' => 'required|string|max:100',
            'phone' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:100',
            'star_rating' => 'nullable|integer|min:1|max:5',
        ]);

        $hotel = Hotel::create($validated);

        return $this->successResponse(new HotelResource($hotel), 'Hotel registrado exitosamente.', Response::HTTP_CREATED);
    }
}
