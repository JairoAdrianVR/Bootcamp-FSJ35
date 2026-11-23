<?php

namespace App\Contracts\Services;

use App\Models\Reservation;

/**
 * Interface NotificationServiceInterface
 * 
 * Desacopla la lógica de notificación (Email, SMS, Push, Webhooks)
 * de los servicios de reserva y pago.
 */
interface NotificationServiceInterface
{
    /**
     * Envía la confirmación formal de la reserva al cliente.
     *
     * @param Reservation $reservation
     * @return bool
     */
    public function sendReservationConfirmation(Reservation $reservation): bool;
}
