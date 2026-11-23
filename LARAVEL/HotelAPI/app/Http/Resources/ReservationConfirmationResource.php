<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationConfirmationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $hotel = $this->room?->hotel;
        $user = $this->user;
        $payment = $this->payment;
        $confirmation = $this->confirmation;

        $confCode = $confirmation?->confirmation_code ?? $this->reservation_code;
        $issuedAt = $confirmation?->issued_at?->toIso8601String() ?? now()->toIso8601String();
        $signature = $confirmation?->verification_hash ?? hash('sha256', $this->reservation_code . ($payment?->gateway_transaction_id ?? 'PENDING'));
        $qr = $confirmation?->qr_payload ?? "CHECKIN://{$hotel?->id}/{$this->reservation_code}";

        return [
            'confirmation_status' => $this->status === 'confirmed' ? 'CONFIRMADA' : strtoupper($this->status),
            'confirmation_code' => $confCode,
            'issued_at' => $issuedAt,
            'hotel' => [
                'name' => $hotel?->name ?? 'Hotel General',
                'star_rating' => $hotel?->star_rating,
                'address' => $hotel?->address,
                'city' => $hotel?->city,
                'country' => $hotel?->country,
                'contact_phone' => $hotel?->phone,
                'contact_email' => $hotel?->email,
            ],
            'client' => [
                'id' => $user?->id,
                'name' => $user?->name,
                'email' => $user?->email,
                'phone' => $user?->phone,
                'identification' => $user?->identification_number,
            ],
            'stay_details' => [
                'room_number' => $this->room?->room_number,
                'room_type' => $this->room?->type,
                'check_in_date' => $this->check_in_date?->format('Y-m-d'),
                'check_out_date' => $this->check_out_date?->format('Y-m-d'),
                'total_nights' => $this->nights_count,
                'guests_registered' => $this->guests_count,
                'special_requests' => $this->special_requests ?? 'Ninguna',
            ],
            'financial_breakdown' => [
                'price_per_night' => (float) $this->price_per_night,
                'nights' => $this->nights_count,
                'currency' => 'USD',
                'subtotal' => (float) $this->total_amount,
                'taxes_included' => true,
                'total_paid' => $payment ? (float) $payment->amount : 0.00,
            ],
            'payment_receipt' => $payment ? [
                'receipt_number' => $payment->payment_reference,
                'status' => $payment->status,
                'method' => $payment->payment_method,
                'gateway_transaction_id' => $payment->gateway_transaction_id,
                'paid_at' => $payment->paid_at?->toIso8601String(),
            ] : null,
            'verification' => [
                'digital_signature' => $signature,
                'qr_payload' => $qr,
            ]
        ];
    }
}
