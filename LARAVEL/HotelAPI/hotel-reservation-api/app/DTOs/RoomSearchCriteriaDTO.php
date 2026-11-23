<?php

namespace App\DTOs;

/**
 * Class RoomSearchCriteriaDTO
 * 
 * Objeto inmutable de transferencia de datos para la búsqueda de habitaciones.
 * Desacopla la petición HTTP del repositorio/servicio.
 */
class RoomSearchCriteriaDTO
{
    public function __construct(
        public readonly string $checkInDate,
        public readonly string $checkOutDate,
        public readonly ?int $hotelId = null,
        public readonly ?string $city = null,
        public readonly ?int $guests = 1,
        public readonly ?string $type = null,
        public readonly ?float $minPrice = null,
        public readonly ?float $maxPrice = null
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            checkInDate: $data['check_in_date'],
            checkOutDate: $data['check_out_date'],
            hotelId: isset($data['hotel_id']) ? (int) $data['hotel_id'] : null,
            city: $data['city'] ?? null,
            guests: isset($data['guests']) ? (int) $data['guests'] : 1,
            type: $data['type'] ?? null,
            minPrice: isset($data['min_price']) ? (float) $data['min_price'] : null,
            maxPrice: isset($data['max_price']) ? (float) $data['max_price'] : null,
        );
    }
}
