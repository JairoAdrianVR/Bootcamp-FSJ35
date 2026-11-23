<?php

namespace App\Services;

use App\Contracts\Repositories\ReservationRepositoryInterface;
use App\Contracts\Repositories\RoomRepositoryInterface;
use App\Contracts\Services\ReservationServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\DTOs\CreateReservationDTO;
use App\Exceptions\RoomOccupiedException;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class ReservationService implements ReservationServiceInterface
{
    public function __construct(
        protected ReservationRepositoryInterface $reservationRepository,
        protected RoomRepositoryInterface $roomRepository,
        protected NotificationServiceInterface $notificationService
    ) {}

    public function makeReservation(CreateReservationDTO $dto): Reservation
    {
        $checkIn = Carbon::parse($dto->checkInDate);
        $checkOut = Carbon::parse($dto->checkOutDate);

        if ($checkIn->isBefore(Carbon::today())) {
            throw new InvalidArgumentException('La fecha de reservación no puede ser en el pasado.');
        }

        if ($checkOut->lessThanOrEqualTo($checkIn)) {
            throw new InvalidArgumentException('La fecha de salida debe ser posterior a la fecha de inicio.');
        }

        $nightsCount = $checkIn->diffInDays($checkOut);
        if ($nightsCount < 1) {
            throw new InvalidArgumentException('La reserva debe ser de al menos una noche.');
        }

        $room = $this->roomRepository->findById($dto->roomId);
        if (!$room) {
            throw new RuntimeException('La habitación solicitada no existe.');
        }

        if ($room->capacity < $dto->guestsCount) {
            throw new InvalidArgumentException("La habitación seleccionada tiene capacidad máxima para {$room->capacity} personas.");
        }

        // Verificación de disponibilidad sin traslapes
        $isAvailable = $this->roomRepository->isRoomAvailableForDates(
            $dto->roomId,
            $dto->checkInDate,
            $dto->checkOutDate
        );

        if (!$isAvailable) {
            throw new RoomOccupiedException('Habitación ocupada en la fecha requerida.');
        }

        $pricePerNight = (float) $room->price_per_night;
        $totalAmount = $pricePerNight * $nightsCount;

        return DB::transaction(function () use ($dto, $nightsCount, $pricePerNight, $totalAmount) {
            $reservationCode = 'RES-' . strtoupper(Str::random(8));

            $reservation = $this->reservationRepository->create([
                'reservation_code' => $reservationCode,
                'user_id' => $dto->userId,
                'room_id' => $dto->roomId,
                'check_in_date' => $dto->checkInDate,
                'check_out_date' => $dto->checkOutDate,
                'guests_count' => $dto->guestsCount,
                'nights_count' => $nightsCount,
                'price_per_night' => $pricePerNight,
                'total_amount' => $totalAmount,
                'status' => Reservation::STATUS_PENDING_PAYMENT,
                'special_requests' => $dto->specialRequests,
            ]);

            return $reservation->load(['room.hotel', 'user']);
        });
    }

    public function getConfirmation(string|int $identifier): Reservation
    {
        $relations = ['room.hotel', 'user', 'payment', 'confirmation'];

        if (is_numeric($identifier)) {
            $reservation = $this->reservationRepository->findById((int) $identifier, $relations);
        } else {
            $reservation = $this->reservationRepository->findByCode((string) $identifier, $relations);
        }

        if (!$reservation) {
            throw new RuntimeException('No se encontró la reserva especificada.');
        }

        return $reservation;
    }

    public function cancelReservation(int $reservationId): bool
    {
        $reservation = $this->reservationRepository->findById($reservationId);
        if (!$reservation) {
            throw new RuntimeException('Reserva no encontrada.');
        }

        if ($reservation->status === Reservation::STATUS_COMPLETED) {
            throw new RuntimeException('No se puede cancelar una estancia ya completada.');
        }

        return $this->reservationRepository->updateStatus($reservationId, Reservation::STATUS_CANCELLED);
    }
}
