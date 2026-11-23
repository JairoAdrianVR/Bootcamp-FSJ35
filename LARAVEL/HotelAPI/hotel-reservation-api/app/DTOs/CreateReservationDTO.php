<?php

namespace App\DTOs;

/**
 * Class CreateReservationDTO
 * 
 * Contrato de datos para la creación de una reserva.
 */
class CreateReservationDTO
{
    public function __construct(
        public readonly int $userId,
        public readonly int $roomId,
        public readonly string $checkInDate,
        public readonly string $checkOutDate,
        public readonly int $guestsCount,
        public readonly ?string $specialRequests = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            userId: (int) $data['user_id'],
            roomId: (int) $data['room_id'],
            checkInDate: $data['check_in_date'],
            checkOutDate: $data['check_out_date'],
            guestsCount: (int) ($data['guests_count'] ?? 1),
            specialRequests: $data['special_requests'] ?? null
        );
    }
}
