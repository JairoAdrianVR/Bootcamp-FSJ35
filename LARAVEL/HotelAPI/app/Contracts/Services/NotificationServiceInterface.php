<?php

namespace App\Contracts\Services;

use App\Models\Reservation;

interface NotificationServiceInterface
{
    public function sendReservationConfirmation(Reservation $reservation): bool;
}
