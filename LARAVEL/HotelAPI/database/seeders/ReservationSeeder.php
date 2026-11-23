<?php

namespace Database\Seeders;

use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

/**
 * Class ReservationSeeder
 * 
 * Seeder de Correlación:
 * Vincula Clientes con Habitaciones a través de Reservaciones y Pagos.
 * Modela diversos escenarios de negocio:
 * 1. Reservas confirmadas con pago completado (Vouchers listos para consulta).
 * 2. Reservas pendientes de pago (Listas para probar el endpoint POST /api/v1/payments).
 * 3. Reservas que ocupan fechas (Para validar el filtro de disponibilidad de /rooms/search).
 * 4. Reservas completadas e históricas.
 * 5. Reservas canceladas.
 */
class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        // Recuperar Clientes
        $carlos = User::where('email', 'carlos.mendoza@example.com')->first();
        $sofia = User::where('email', 'sofia.reyes@example.com')->first();
        $alejandro = User::where('email', 'alejandro.rivera@example.com')->first();
        $mariana = User::where('email', 'mariana.gomez@example.com')->first();
        $roberto = User::where('email', 'roberto.lemus@example.com')->first();
        $elena = User::where('email', 'elena.morales@example.com')->first();

        // Recuperar Habitaciones
        $room101 = Room::where('room_number', '101')->first();
        $room102 = Room::where('room_number', '102')->first();
        $room103 = Room::where('room_number', '103')->first();
        $room201 = Room::where('room_number', '201')->first();
        $roomB01 = Room::where('room_number', 'B-01')->first();
        $roomM01 = Room::where('room_number', 'M-01')->first();

        if (!$carlos || !$room101) {
            return;
        }

        // =========================================================================
        // CORRELACIÓN 1: Carlos Mendoza -> Habitación 101 (Hotel Real)
        // Escenario: Confirmada y Pagada con Tarjeta de Crédito Visa
        // =========================================================================
        $code1 = 'RES-CONF-001';
        $res1 = Reservation::firstOrCreate(
            ['reservation_code' => $code1],
            [
                'user_id' => $carlos->id,
                'room_id' => $room101->id,
                'check_in_date' => Carbon::now()->addDays(5)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(9)->toDateString(), // 4 noches
                'guests_count' => 1,
                'nights_count' => 4,
                'price_per_night' => (float) $room101->price_per_night, // 85.00
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

        // =========================================================================
        // CORRELACIÓN 2: Sofía Reyes -> Habitación B-01 (Costa Bella)
        // Escenario: Confirmada y Pagada mediante PayPal
        // =========================================================================
        $code2 = 'RES-CONF-002';
        $res2 = Reservation::firstOrCreate(
            ['reservation_code' => $code2],
            [
                'user_id' => $sofia->id,
                'room_id' => $roomB01->id,
                'check_in_date' => Carbon::now()->addDays(12)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(15)->toDateString(), // 3 noches
                'guests_count' => 2,
                'nights_count' => 3,
                'price_per_night' => (float) $roomB01->price_per_night, // 175.00
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

        // =========================================================================
        // CORRELACIÓN 3: Alejandro Rivera -> Habitación 201 (Master Suite Hotel Real)
        // Escenario: PENDIENTE DE PAGO (Ideal para probar POST /api/v1/payments)
        // =========================================================================
        $code3 = 'RES-PEND-101';
        Reservation::firstOrCreate(
            ['reservation_code' => $code3],
            [
                'user_id' => $alejandro->id,
                'room_id' => $room201->id,
                'check_in_date' => Carbon::now()->addDays(18)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(23)->toDateString(), // 5 noches
                'guests_count' => 3,
                'nights_count' => 5,
                'price_per_night' => (float) $room201->price_per_night, // 250.00
                'total_amount' => 1250.00,
                'status' => Reservation::STATUS_PENDING_PAYMENT,
                'special_requests' => 'Requiere servicio de transporte VIP desde el aeropuerto.',
            ]
        );

        // =========================================================================
        // CORRELACIÓN 4: Mariana Gómez -> Habitación 102 (Doble Hotel Real)
        // Escenario: Confirmada y Pagada con MasterCard
        // =========================================================================
        $code4 = 'RES-CONF-003';
        $res4 = Reservation::firstOrCreate(
            ['reservation_code' => $code4],
            [
                'user_id' => $mariana->id,
                'room_id' => $room102->id,
                'check_in_date' => Carbon::now()->addDays(6)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(10)->toDateString(), // 4 noches
                'guests_count' => 2,
                'nights_count' => 4,
                'price_per_night' => (float) $room102->price_per_night, // 130.00
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

        // =========================================================================
        // CORRELACIÓN 5: Roberto Lemus -> Habitación M-01 (Miramundo)
        // Escenario: PENDIENTE DE PAGO (Prueba de reserva en cabaña de montaña)
        // =========================================================================
        $code5 = 'RES-PEND-102';
        Reservation::firstOrCreate(
            ['reservation_code' => $code5],
            [
                'user_id' => $roberto->id,
                'room_id' => $roomM01->id,
                'check_in_date' => Carbon::now()->addDays(25)->toDateString(),
                'check_out_date' => Carbon::now()->addDays(29)->toDateString(), // 4 noches
                'guests_count' => 2,
                'nights_count' => 4,
                'price_per_night' => (float) $roomM01->price_per_night, // 160.00
                'total_amount' => 640.00,
                'status' => Reservation::STATUS_PENDING_PAYMENT,
                'special_requests' => 'Cabaña con leña adicional para la chimenea.',
            ]
        );

        // =========================================================================
        // CORRELACIÓN 6: Elena Morales -> Habitación 101 (Hotel Real)
        // Escenario: Histórica completada (Fechas pasadas)
        // =========================================================================
        $code6 = 'RES-HIST-901';
        $res6 = Reservation::firstOrCreate(
            ['reservation_code' => $code6],
            [
                'user_id' => $elena->id,
                'room_id' => $room101->id,
                'check_in_date' => Carbon::now()->subDays(20)->toDateString(),
                'check_out_date' => Carbon::now()->subDays(17)->toDateString(), // 3 noches
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

        // =========================================================================
        // CORRELACIÓN 7: Carlos Mendoza -> Habitación 103 (Hotel Real)
        // Escenario: CANCELADA (Libera la habitación sin bloquear el calendario)
        // =========================================================================
        $code7 = 'RES-CANC-001';
        Reservation::firstOrCreate(
            ['reservation_code' => $code7],
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
