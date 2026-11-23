<?php

namespace App\Http\Controllers\Api;

use App\DTOs\RoomSearchCriteriaDTO;
use App\Http\Requests\SearchRoomsRequest;
use App\Http\Resources\RoomResource;
use App\Models\Room;
use App\Services\RoomSearchService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoomController extends BaseApiController
{
    public function __construct(
        protected RoomSearchService $searchService
    ) {}

    public function search(SearchRoomsRequest $request): JsonResponse
    {
        try {
            $criteria = RoomSearchCriteriaDTO::fromArray($request->validated());
            $rooms = $this->searchService->search($criteria);

            return $this->successResponse(
                RoomResource::collection($rooms),
                'Habitaciones disponibles encontradas exitosamente.'
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }

    public function index(Request $request): JsonResponse
    {
        $query = Room::with('hotel');

        if ($request->has('hotel_id')) {
            $query->where('hotel_id', $request->query('hotel_id'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->query('type'));
        }

        $rooms = $query->get();

        return $this->successResponse(
            RoomResource::collection($rooms),
            'Catálogo de habitaciones recuperado exitosamente.'
        );
    }

    public function show(int $id): JsonResponse
    {
        $room = Room::with('hotel')->find($id);

        if (!$room) {
            return $this->errorResponse('Habitación no encontrada.', Response::HTTP_NOT_FOUND);
        }

        return $this->successResponse(new RoomResource($room), 'Detalle de habitación recuperado.');
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'hotel_id' => 'required|exists:hotels,id',
            'room_number' => 'required|string|max:20',
            'type' => 'required|in:single,double,suite,deluxe',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'status' => 'nullable|in:available,maintenance,inactive',
        ]);

        $room = Room::create($validated);

        return $this->successResponse(new RoomResource($room), 'Habitación registrada exitosamente.', Response::HTTP_CREATED);
    }
}
