<?php

namespace App\Http\Controllers\Api;

use App\Contracts\Services\ReservationServiceInterface;
use App\DTOs\CreateReservationDTO;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationConfirmationResource;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class ReservationController
 * 
 * Controlador de Reservas.
 * Cumple con las funciones:
 * - "Realizar reservas"
 * - "Recibir confirmaciones de reserva"
 */
class ReservationController extends BaseApiController
{
    public function __construct(
        protected ReservationServiceInterface $reservationService
    ) {}

    /**
     * Listar reservas existentes con filtros opcionales.
     * GET /api/v1/reservations
     */
    public function index(Request $request): JsonResponse
    {
        $query = Reservation::with(['room.hotel', 'user', 'payment']);

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
     * Realizar una nueva reserva de habitación.
     * POST /api/v1/reservations
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        try {
            $dto = CreateReservationDTO::fromArray($request->validated());
            $reservation = $this->reservationService->makeReservation($dto);

            return $this->successResponse(
                new ReservationResource($reservation),
                'Reserva creada exitosamente en estado pendiente de pago.',
                Response::HTTP_CREATED
            );
        } catch (Exception $e) {
            return $this->errorResponse(
                $e->getMessage(),
                Response::HTTP_UNPROCESSABLE_ENTITY
            );
        }
    }

    /**
     * Recibir confirmación formal de reserva con todos los detalles.
     * GET /api/v1/reservations/{identifier}/confirmation
     */
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

    /**
     * Consulta general de reserva por ID.
     * GET /api/v1/reservations/{id}
     */
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
