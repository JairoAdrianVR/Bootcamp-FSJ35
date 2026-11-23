<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\ReservationServiceInterface;
use App\DTOs\CreateReservationDTO;
use App\Exceptions\RoomOccupiedException;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationConfirmationResource;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ReservationController extends BaseApiController
{
    public function __construct(
        protected ReservationServiceInterface $reservationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with(['room.hotel', 'user', 'payment', 'confirmation']);

        if ($request->has('user_id')) {
            $query->where('user_id', $request->query('user_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $reservations = $query->latest()->get();

        return $this->successResponse(
            ReservationResource::collection($reservations),
            'Listado de reservas recuperado exitosamente.'
        );
    }

    /**
     * Realizar una nueva reservación.
     * 
     * Si la habitación está ocupada en la fecha requerida, retorna:
     * - Status 409 Conflict
     * - Mensaje: "Habitación ocupada en la fecha requerida."
     * 
     * Si la habitación está libre, retorna:
     * - Status 201 Created
     * - Mensaje: "Reservación completada"
     * - Entrega el ID de la reservación ('id' y 'reservation_id')
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        try {
            $dto = CreateReservationDTO::fromArray($request->validated());
            $reservation = $this->reservationService->makeReservation($dto);

            return response()->json([
                'success' => true,
                'message' => 'Reservación completada',
                'data' => [
                    'id' => $reservation->id,
                    'reservation_id' => $reservation->id,
                    'reservation_code' => $reservation->reservation_code,
                    'user_id' => $reservation->user_id,
                    'room_id' => $reservation->room_id,
                    'check_in_date' => $reservation->check_in_date?->format('Y-m-d'),
                    'check_out_date' => $reservation->check_out_date?->format('Y-m-d'),
                    'nights_count' => $reservation->nights_count,
                    'guests_count' => $reservation->guests_count,
                    'price_per_night' => (float) $reservation->price_per_night,
                    'total_amount' => (float) $reservation->total_amount,
                    'status' => $reservation->status,
                    'special_requests' => $reservation->special_requests,
                    'created_at' => $reservation->created_at?->toIso8601String(),
                ]
            ], Response::HTTP_CREATED);

        } catch (RoomOccupiedException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Habitación ocupada en la fecha requerida.'
            ], Response::HTTP_CONFLICT);

        } catch (Exception $e) {
            $msg = $e->getMessage();
            if (str_contains(strtolower($msg), 'ocupada') || str_contains(strtolower($msg), 'disponible')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Habitación ocupada en la fecha requerida.'
                ], Response::HTTP_CONFLICT);
            }

            return $this->errorResponse(
                $msg,
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }

    public function confirmation(string|int $identifier): JsonResponse
    {
        try {
            $reservation = $this->reservationService->getConfirmation($identifier);

            return $this->successResponse(
                new ReservationConfirmationResource($reservation),
                'Confirmación de reserva generada exitosamente.'
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                Response::HTTP_NOT_FOUND
            );
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $reservation = $this->reservationService->getConfirmation($id);

            return $this->successResponse(
                new ReservationResource($reservation),
                'Detalle de la reserva recuperado exitosamente.'
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                Response::HTTP_NOT_FOUND
            );
        }
    }
}
