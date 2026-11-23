<?php

namespace App\Repositories;

use App\Contracts\Repositories\ReservationRepositoryInterface;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

/**
 * Class EloquentReservationRepository
 * 
 * Implementación de persistencia para reservas usando Eloquent.
 */
class EloquentReservationRepository implements ReservationRepositoryInterface
{
    public function create(array $data): Reservation
    {
        return Reservation::create($data);
    }

    public function findById(int $id, array $relations = []): ?Reservation
    {
        $query = Reservation::query();
        if (!empty($relations)) {
            $query->with($relations);
        }
        return $query->find($id);
    }

    public function findByCode(string $code, array $relations = []): ?Reservation
    {
        $query = Reservation::query()->where('reservation_code', $code);
        if (!empty($relations)) {
            $query->with($relations);
        }
        return $query->first();
    }

    public function updateStatus(int $id, string $status): bool
    {
        $reservation = Reservation::find($id);
        if (!$reservation) {
            return false;
        }

        $reservation->status = $status;
        return $reservation->save();
    }

    public function findByUserId(int $userId): Collection
    {
        return Reservation::with(['room.hotel', 'payment'])
            ->where('user_id', $userId)
            ->latest()
            ->get();
    }
}
