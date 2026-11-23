<?php

namespace App\Contracts\Repositories;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

/**
 * Interface ReservationRepositoryInterface
 * 
 * Contrato de persistencia para la gestión de Reservas.
 */
interface ReservationRepositoryInterface
{
    /**
     * Crea una nueva reserva en el sistema.
     *
     * @param array<string, mixed> $data
     * @return Reservation
     */
    public function create(array $data): Reservation;

    /**
     * Encuentra una reserva por su ID con sus relaciones cargadas.
     *
     * @param int $id
     * @param array<string> $relations
     * @return Reservation|null
     */
    public function findById(int $id, array $relations = []): ?Reservation;

    /**
     * Encuentra una reserva por su código alfanumérico único.
     *
     * @param string $code
     * @param array<string> $relations
     * @return Reservation|null
     */
    public function findByCode(string $code, array $relations = []): ?Reservation;

    /**
     * Actualiza el estado de una reserva.
     *
     * @param int $id
     * @param string $status
     * @return bool
     */
    public function updateStatus(int $id, string $status): bool;

    /**
     * Obtiene el listado de reservas para un usuario.
     *
     * @param int $userId
     * @return Collection<int, Reservation>
     */
    public function findByUserId(int $userId): Collection;
}
