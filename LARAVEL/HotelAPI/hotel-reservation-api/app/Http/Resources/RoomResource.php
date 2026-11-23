<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class RoomResource
 * 
 * Contrato de salida para la entidad Habitación.
 */
class RoomResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'hotel_id' => $this->hotel_id,
            'room_number' => $this->room_number,
            'type' => $this->type,
            'capacity' => $this->capacity,
            'price_per_night' => (float) $this->price_per_night,
            'description' => $this->description,
            'status' => $this->status,
            'hotel' => new HotelResource($this->whenLoaded('hotel')),
        ];
    }
}
