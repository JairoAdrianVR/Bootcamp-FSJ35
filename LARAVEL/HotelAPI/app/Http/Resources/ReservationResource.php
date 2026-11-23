<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'reservation_code' => $this->reservation_code,
            'user_id' => $this->user_id,
            'room_id' => $this->room_id,
            'check_in_date' => $this->check_in_date?->format('Y-m-d'),
            'check_out_date' => $this->check_out_date?->format('Y-m-d'),
            'nights_count' => $this->nights_count,
            'guests_count' => $this->guests_count,
            'price_per_night' => (float) $this->price_per_night,
            'total_amount' => (float) $this->total_amount,
            'status' => $this->status,
            'special_requests' => $this->special_requests,
            'created_at' => $this->created_at?->toIso8601String(),
            'room' => new RoomResource($this->whenLoaded('room')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
        ];
    }
}
