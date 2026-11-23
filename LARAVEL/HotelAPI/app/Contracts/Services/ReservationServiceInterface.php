<?php

namespace App\Contracts\Services;

use App\DTOs\CreateReservationDTO;
use App\Models\Reservation;

interface ReservationServiceInterface
{
    public function makeReservation(CreateReservationDTO $dto): Reservation;
    public function getConfirmation(string|int $identifier): Reservation;
    public function cancelReservation(int $reservationId): bool;
}
