<?php

namespace App\Contracts\Repositories;

use App\DTOs\RoomSearchCriteriaDTO;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

/**
 * Interface RoomRepositoryInterface
 * 
 * Contrato de repositorio para la entidad Habitación.
 * Aísla las consultas de disponibilidad y catálogo del motor de base de datos o ORM.
 */
interface RoomRepositoryInterface
{
    /**
     * Busca habitaciones disponibles según los criterios de búsqueda (fechas, capacidad, hotel, precio).
     *
     * @param RoomSearchCriteriaDTO $criteria
     * @return Collection<int, Room>
     */
    public function findAvailableRooms(RoomSearchCriteriaDTO $criteria): Collection;

    /**
     * Obtiene una habitación por su ID.
     *
     * @param int $id
     * @return Room|null
     */
    public function findById(int $id): ?Room;

    /**
     * Verifica si una habitación específica está disponible para un rango de fechas.
     *
     * @param int $roomId
     * @param string $checkIn
     * @param string $checkOut
     * @return bool
     */
    public function isRoomAvailableForDates(int $roomId, string $checkIn, string $checkOut): bool;
}
