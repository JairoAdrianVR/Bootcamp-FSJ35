<?php

namespace Database\Seeders;

use App\Models\Reservation;
use App\Models\ReservationConfirmation;
use Illuminate\Database\Seeder;

/**
 * Class ReservationConfirmationSeeder
 * 
 * Seeder de Confirmaciones de Reserva:
 * Genera comprobantes y vouchers formales con firma digital y código QR
 * para las reservas en estado confirmado o completado.
 */
class ReservationConfirmationSeeder extends Seeder
{
    public function run(): void
    {
        $confirmedReservations = Reservation::with(['room.hotel', 'payment'])
            ->whereIn('status', [Reservation::STATUS_CONFIRMED, Reservation::STATUS_COMPLETED])
            ->get();

        foreach ($confirmedReservations as $reservation) {
            $confCode = str_replace(['RES-', 'RES'], 'CNF-', $reservation->reservation_code);
            $txId = $reservation->payment?->gateway_transaction_id ?? 'TXN-GEN-' . $reservation->id;
            $hotelId = $reservation->room?->hotel_id ?? 1;

            ReservationConfirmation::firstOrCreate(
                ['reservation_id' => $reservation->id],
                [
                    'confirmation_code' => $confCode,
                    'verification_hash' => hash('sha256', $confCode . $txId),
                    'qr_payload' => "CHECKIN://{$hotelId}/{$confCode}",
                    'issued_at' => $reservation->payment?->paid_at ?? now(),
                    'status' => $reservation->status === Reservation::STATUS_COMPLETED
                        ? ReservationConfirmation::STATUS_CHECKED_IN
                        : ReservationConfirmation::STATUS_ACTIVE,
                    'notes' => 'Comprobante formal emitido y verificado por la pasarela de pagos.',
                ]
            );
        }
    }
}
