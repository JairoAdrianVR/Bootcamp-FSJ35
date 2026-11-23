<?php

namespace App\Services;

use App\Contracts\Repositories\RoomRepositoryInterface;
use App\DTOs\RoomSearchCriteriaDTO;
use Illuminate\Database\Eloquent\Collection;
use InvalidArgumentException;

/**
 * Class RoomSearchService
 * 
 * Orquestador desacoplado para la consulta de disponibilidad de habitaciones.
 */
class RoomSearchService
{
    public function __construct(
        protected RoomRepositoryInterface $roomRepository
    ) {}

    /**
     * Valida criterios y busca habitaciones libres.
     */
    public function search(RoomSearchCriteriaDTO $criteria): Collection
    {
        // Validación de coherencia de fechas
        if (strtotime($criteria->checkInDate) >= strtotime($criteria->checkOutDate)) {
            throw new InvalidArgumentException('La fecha de check-out debe ser posterior a la fecha de check-in.');
        }

        return $this->roomRepository->findAvailableRooms($criteria);
    }
}
