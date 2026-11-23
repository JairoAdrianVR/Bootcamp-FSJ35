<?php

namespace App\Contracts\Repositories;

use App\DTOs\RoomSearchCriteriaDTO;
use App\Models\Room;
use Illuminate\Database\Eloquent\Collection;

interface RoomRepositoryInterface
{
    public function findAvailableRooms(RoomSearchCriteriaDTO $criteria): Collection;
    public function findById(int $id): ?Room;
    public function isRoomAvailableForDates(int $roomId, string $checkIn, string $checkOut): bool;
}
