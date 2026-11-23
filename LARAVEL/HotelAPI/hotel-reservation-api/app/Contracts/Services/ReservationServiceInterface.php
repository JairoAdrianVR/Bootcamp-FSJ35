<?php

namespace App\Contracts\Services;

use App\DTOs\CreateReservationDTO;
use App\Models\Reservation;

/**
 * Interface ReservationServiceInterface
 * 
 * Contrato del servicio de Reservas que encapsula la lógica del negocio:
 * cálculo de noches, totales, validación de traslape y emisión de eventos.
 */
interface ReservationServiceInterface
{
    /**
     * Realiza una nueva reserva validando disponibilidad y calculando montos.
     *
     * @param CreateReservationDTO $dto
     * @return Reservation
     */
    public function makeReservation(CreateReservationDTO $dto): Reservation;

    /**
     * Obtiene los datos detallados de confirmación de una reserva.
     *
     * @param string|int $identifier ID o reservation_code
     * @return Reservation
     */
    public function getConfirmation(string|int $identifier): Reservation;

    /**
     * Cancela una reserva si las políticas de cancelación lo permiten.
     *
     * @param int $reservationId
     * @return bool
     */
    public function cancelReservation(int $reservationId): bool;
}
