<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $carlos = User::where('email', 'carlos.mendoza@example.com')->first();
        $sofia = User::where('email', 'sofia.reyes@example.com')->first();
        $alejandro = User::where('email', 'alejandro.rivera@example.com')->first();
        $mariana = User::where('email', 'mariana.gomez@example.com')->first();
        $roberto = User::where('email', 'roberto.lemus@example.com')->first();
        $elena = User::where('email', 'elena.morales@example.com')->first();

        $room101 = Room::where('room_number', '101')->first();
        $room102 = Room::where('room_number', '102')->first();
        $room103 = Room::where('room_number', '103')->first();
        $room201 = Room::where('room_number', '201')->first();
        $roomB01 = Room::where('room_number', 'B-01')->first();
        $roomM01 = Room::where('room_number', 'M-01')->first();

        if (!$carlos || !$room101) {
            return;
        }

        // 1. Carlos Mendoza -> Room 101 (Confirmada y Pagada con Visa)
        $res1 = Reservation::firstOrCreate(
            ['reservation_code' => 'RES-CONF-001'],
            [
                'user_id' => $carlos->id,
                'room_id' => $room101->id,
                'check_in_date' => Carbon::now()->addDays(5)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(9)->toDateString(),
                'guests_count' => 1,
                'nights_count' => 4,
                'price_per_night' => (float) $room101->price_per_night,
                'total_amount' => 340.00,
                'status' => Reservation::STATUS_CONFIRMED,
                'special_requests' => 'Llegada tarde a las 9:00 PM. Solicita plancha de ropa.',
            ]
        );

        Payment::firstOrCreate(
            ['payment_reference' => 'PAY-VISA-778899'],
            [
                'reservation_id' => $res1->id,
                'amount' => 340.00,
                'currency' => 'USD',
                'payment_method' => 'credit_card',
                'status' => Payment::STATUS_COMPLETED,
                'gateway_transaction_id' => 'txn_STRIPE_VISA_882910',
                'paid_at' => Carbon::now()->subHours(2),
                'payment_details' => [
                    'card_brand' => 'Visa',
                    'last4' => '4242',
                    'client_name' => $carlos->name,
                ],
            ]
        );

        // 2. Sofía Reyes -> Room B-01 (Confirmada y Pagada con PayPal)
        $res2 = Reservation::firstOrCreate(
            ['reservation_code' => 'RES-CONF-002'],
            [
                'user_id' => $sofia->id,
                'room_id' => $roomB01->id,
                'check_in_date' => Carbon::now()->addDays(12)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(15)->toDateString(),
                'guests_count' => 2,
                'nights_count' => 3,
                'price_per_night' => (float) $roomB01->price_per_night,
                'total_amount' => 525.00,
                'status' => Reservation::STATUS_CONFIRMED,
                'special_requests' => 'Celebración de aniversario. Decoración con frutas en la habitación.',
            ]
        );

        Payment::firstOrCreate(
            ['payment_reference' => 'PAY-PAYPAL-441122'],
            [
                'reservation_id' => $res2->id,
                'amount' => 525.00,
                'currency' => 'USD',
                'payment_method' => 'paypal',
                'status' => Payment::STATUS_COMPLETED,
                'gateway_transaction_id' => 'PAYID-MK89230192',
                'paid_at' => Carbon::now()->subMinutes(45),
                'payment_details' => [
                    'paypal_payer_id' => 'PAYER-SOFIA-99',
                    'payer_email' => $sofia->email,
                ],
            ]
        );

        // 3. Alejandro Rivera -> Room 201 (Pendiente de pago)
        Reservation::firstOrCreate(
            ['reservation_code' => 'RES-PEND-101'],
            [
                'user_id' => $alejandro->id,
                'room_id' => $room201->id,
                'check_in_date' => Carbon::now()->addDays(18)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(23)->toDateString(),
                'guests_count' => 3,
                'nights_count' => 5,
                'price_per_night' => (float) $room201->price_per_night,
                'total_amount' => 1250.00,
                'status' => Reservation::STATUS_PENDING_PAYMENT,
                'special_requests' => 'Requiere servicio de transporte VIP desde el aeropuerto.',
            ]
        );

        // 4. Mariana Gómez -> Room 102 (Confirmada y Pagada con MasterCard)
        $res4 = Reservation::firstOrCreate(
            ['reservation_code' => 'RES-CONF-003'],
            [
                'user_id' => $mariana->id,
                'room_id' => $room102->id,
                'check_in_date' => Carbon::now()->addDays(6)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(10)->toDateString(),
                'guests_count' => 2,
                'nights_count' => 4,
                'price_per_night' => (float) $room102->price_per_night,
                'total_amount' => 520.00,
                'status' => Reservation::STATUS_CONFIRMED,
                'special_requests' => 'Dos camas separadas por favor.',
            ]
        );

        Payment::firstOrCreate(
            ['payment_reference' => 'PAY-MC-556677'],
            [
                'reservation_id' => $res4->id,
                'amount' => 520.00,
                'currency' => 'USD',
                'payment_method' => 'credit_card',
                'status' => Payment::STATUS_COMPLETED,
                'gateway_transaction_id' => 'txn_MASTERCARD_331189',
                'paid_at' => Carbon::now()->subHours(5),
                'payment_details' => [
                    'card_brand' => 'MasterCard',
                    'last4' => '5105',
                ],
            ]
        );

        // 5. Roberto Lemus -> Room M-01 (Pendiente de pago)
        Reservation::firstOrCreate(
            ['reservation_code' => 'RES-PEND-102'],
            [
                'user_id' => $roberto->id,
                'room_id' => $roomM01->id,
                'check_in_date' => Carbon::now()->addDays(25)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(29)->toDateString(),
                'guests_count' => 2,
                'nights_count' => 4,
                'price_per_night' => (float) $roomM01->price_per_night,
                'total_amount' => 640.00,
                'status' => Reservation::STATUS_PENDING_PAYMENT,
                'special_requests' => 'Cabaña con leña adicional para la chimenea.',
            ]
        );

        // 6. Elena Morales -> Room 101 (Histórica completada)
        $res6 = Reservation::firstOrCreate(
            ['reservation_code' => 'RES-HIST-901'],
            [
                'user_id' => $elena->id,
                'room_id' => $room101->id,
                'check_in_date' => Carbon::now()->subDays(20)->toDateString(),
                'check_out_date' => Carbon::now()->subDays(17)->toDateString(),
                'guests_count' => 1,
                'nights_count' => 3,
                'price_per_night' => 85.00,
                'total_amount' => 255.00,
                'status' => Reservation::STATUS_COMPLETED,
                'special_requests' => 'Habitación silenciosa para viaje de trabajo.',
            ]
        );

        Payment::firstOrCreate(
            ['payment_reference' => 'PAY-HIST-112233'],
            [
                'reservation_id' => $res6->id,
                'amount' => 255.00,
                'currency' => 'USD',
                'payment_method' => 'debit_card',
                'status' => Payment::STATUS_COMPLETED,
                'gateway_transaction_id' => 'txn_DEBIT_PAST_771928',
                'paid_at' => Carbon::now()->subDays(20),
                'payment_details' => [
                    'card_brand' => 'Visa Débito',
                    'last4' => '9081',
                ],
            ]
        );

        // 7. Carlos Mendoza -> Room 103 (Cancelada)
        Reservation::firstOrCreate(
            ['reservation_code' => 'RES-CANC-001'],
            [
                'user_id' => $carlos->id,
                'room_id' => $room103->id,
                'check_in_date' => Carbon::now()->addDays(14)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(17)->toDateString(),
                'guests_count' => 2,
                'nights_count' => 3,
                'price_per_night' => (float) $room103->price_per_night,
                'total_amount' => 435.00,
                'status' => Reservation::STATUS_CANCELLED,
                'special_requests' => 'Cancelado por cambio de vuelo.',
            ]
        );
    }
}
