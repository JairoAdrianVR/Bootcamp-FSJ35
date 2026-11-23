<?php

namespace App\Repositories;

use App\Contracts\Repositories\RoomRepositoryInterface;
use App\DTOs\RoomSearchCriteriaDTO;
use App\Models\Room;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Collection;

class EloquentRoomRepository implements RoomRepositoryInterface
{
    public function findAvailableRooms(RoomSearchCriteriaDTO $criteria): Collection
    {
        $query = Room::query()
            ->with('hotel')
            ->where('status', 'available');

        if ($criteria->hotelId) {
            $query->where('hotel_id', $criteria->hotelId);
        }

        if ($criteria->city) {
            $query->whereHas('hotel', function ($q) use ($criteria) {
                $q->where('city', 'like', '%' . $criteria->city . '%');
            });
        }

        if ($criteria->guests) {
            $query->where('capacity', '>=', $criteria->guests);
        }

        if ($criteria->type) {
            $query->where('type', $criteria->type);
        }

        if ($criteria->minPrice !== null) {
            $query->where('price_per_night', '>=', $criteria->minPrice);
        }

        if ($criteria->maxPrice !== null) {
            $query->where('price_per_night', '<=', $criteria->maxPrice);
        }

        $checkIn = $criteria->checkInDate;
        $checkOut = $criteria->checkOutDate;

        $query->whereDoesntHave('reservations', function ($q) use ($checkIn, $checkOut) {
            $q->whereIn('status', [Reservation::STATUS_PENDING_PAYMENT, Reservation::STATUS_CONFIRMED])
              ->where(function ($dateSubQuery) use ($checkIn, $checkOut) {
                  $dateSubQuery->where('check_in_date', '<', $checkOut)
                               ->where('check_out_date', '>', $checkIn);
              });
        });

        return $query->get();
    }

    public function findById(int $id): ?Room
    {
        return Room::with('hotel')->find($id);
    }

    public function isRoomAvailableForDates(int $roomId, string $checkIn, string $checkOut): bool
    {
        $room = Room::find($roomId);
        if (!$room || $room->status !== 'available') {
            return false;
        }

        $overlapExists = Reservation::query()
            ->where('room_id', $roomId)
            ->whereIn('status', [Reservation::STATUS_PENDING_PAYMENT, Reservation::STATUS_CONFIRMED])
            ->where(function ($q) use ($checkIn, $checkOut) {
                $q->where('check_in_date', '<', $checkOut)
                  ->where('check_out_date', '>', $checkIn);
            })
            ->exists();

        return !$overlapExists;
    }
}
