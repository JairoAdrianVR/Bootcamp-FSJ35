<?php

namespace App\Contracts\Repositories;

use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

interface ReservationRepositoryInterface
{
    public function create(array $data): Reservation;
    public function findById(int $id, array $relations = []): ?Reservation;
    public function findByCode(string $code, array $relations = []): ?Reservation;
    public function updateStatus(int $id, string $status): bool;
    public function findByUserId(int $userId): Collection;
}
