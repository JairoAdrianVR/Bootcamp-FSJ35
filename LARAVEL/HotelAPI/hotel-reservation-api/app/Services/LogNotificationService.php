<?php

namespace App\Services;

use App\Contracts\Services\NotificationServiceInterface;
use App\Models\Reservation;
use Illuminate\Support\Facades\Log;

/**
 * Class LogNotificationService
 * 
 * Implementación de notificación mediante Logs (desacoplada de Mail/SMS/Push).
 */
class LogNotificationService implements NotificationServiceInterface
{
    public function sendReservationConfirmation(Reservation $reservation): bool
    {
        Log::info("Confirmación enviada para reserva: {$reservation->reservation_code}", [
            'reservation_id' => $reservation->id,
            'client_email' => $reservation->user?->email,
            'hotel' => $reservation->room?->hotel?->name,
            'total' => $reservation->total_amount,
            'status' => $reservation->status,
        ]);

        return true;
    }
}
