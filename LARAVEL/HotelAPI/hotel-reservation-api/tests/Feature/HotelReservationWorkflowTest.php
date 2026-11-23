<?php

namespace Tests\Feature;

use App\Contracts\Gateways\PaymentGatewayInterface;
use App\DTOs\PaymentResultDTO;
use App\Models\Hotel;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Tests\TestCase;

/**
 * Class HotelReservationWorkflowTest
 * 
 * Pruebas de integración del flujo completo:
 * 1. Búsqueda de habitaciones disponibles
 * 2. Creación de reserva
 * 3. Gestión y procesamiento de pago desacoplado
 * 4. Obtención de comprobante de confirmación
 */
class HotelReservationWorkflowTest extends TestCase
{
    use RefreshDatabase;

    protected User $client;
    protected Hotel $hotel;
    protected Room $room101;
    protected Room $room102;

    protected function setUp(): void
    {
        parent::setUp();

        $this->client = User::factory()->create([
            'name' => 'Carlos Mendoza',
            'email' => 'carlos@example.com',
            'phone' => '+503 7123-4567',
            'identification_number' => '05123456-7',
        ]);

        $this->hotel = Hotel::create([
            'name' => 'Gran Hotel Real',
            'description' => 'Hotel de prueba',
            'address' => 'Bulevar Principal #100',
            'city' => 'San Salvador',
            'country' => 'El Salvador',
            'phone' => '+503 2222-3333',
            'email' => 'real@hotel.com',
            'star_rating' => 5,
            'is_active' => true,
        ]);

        $this->room101 = Room::create([
            'hotel_id' => $this->hotel->id,
            'room_number' => '101',
            'type' => 'single',
            'capacity' => 1,
            'price_per_night' => 80.00,
            'status' => 'available',
        ]);

        $this->room102 = Room::create([
            'hotel_id' => $this->hotel->id,
            'room_number' => '102',
            'type' => 'double',
            'capacity' => 2,
            'price_per_night' => 120.00,
            'status' => 'available',
        ]);
    }

    /**
     * Prueba: Buscar habitaciones disponibles excluyendo aquellas con reservas traslapadas.
     */
    public function test_can_search_available_rooms_and_exclude_overlapping_reservations(): void
    {
        // Habitación 101 ya está reservada para el 2026-12-10 al 2026-12-15
        Reservation::create([
            'reservation_code' => 'RES-EXISTING-1',
            'user_id' => $this->client->id,
            'room_id' => $this->room101->id,
            'check_in_date' => '2026-12-10',
            'check_out_date' => '2026-12-15',
            'guests_count' => 1,
            'nights_count' => 5,
            'price_per_night' => 80.00,
            'total_amount' => 400.00,
            'status' => Reservation::STATUS_CONFIRMED,
        ]);

        // Consulta que choca con la reserva de la 101 (2026-12-12 al 2026-12-14)
        $response = $this->getJson('/api/v1/rooms/search?' . http_build_query([
            'check_in_date' => '2026-12-12',
            'check_out_date' => '2026-12-14',
            'guests' => 1,
        ]));

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $roomIds = collect($response->json('data'))->pluck('id')->all();

        // Habitación 101 no debe aparecer porque está ocupada
        $this->assertNotContains($this->room101->id, $roomIds);
        // Habitación 102 debe aparecer disponible
        $this->assertContains($this->room102->id, $roomIds);
    }

    /**
     * Prueba: Realizar una reserva con cálculo correcto de noches y monto total.
     */
    public function test_can_make_a_reservation_successfully(): void
    {
        $payload = [
            'user_id' => $this->client->id,
            'room_id' => $this->room102->id,
            'check_in_date' => '2026-12-20',
            'check_out_date' => '2026-12-23', // 3 noches
            'guests_count' => 2,
            'special_requests' => 'Cama matrimonial por favor.',
        ];

        $response = $this->postJson('/api/v1/reservations', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.nights_count', 3)
                 ->assertJsonPath('data.total_amount', 360.00) // 3 noches * $120
                 ->assertJsonPath('data.status', 'pending_payment');

        $this->assertDatabaseHas('reservations', [
            'user_id' => $this->client->id,
            'room_id' => $this->room102->id,
            'total_amount' => 360.00,
            'status' => 'pending_payment',
        ]);
    }

    /**
     * Prueba: Gestionar y procesar pago desacoplado mediante el Gateway.
     */
    public function test_can_process_payment_and_confirm_reservation(): void
    {
        $reservation = Reservation::create([
            'reservation_code' => 'RES-TEST-PAY',
            'user_id' => $this->client->id,
            'room_id' => $this->room102->id,
            'check_in_date' => '2026-12-20',
            'check_out_date' => '2026-12-22',
            'guests_count' => 2,
            'nights_count' => 2,
            'price_per_night' => 120.00,
            'total_amount' => 240.00,
            'status' => Reservation::STATUS_PENDING_PAYMENT,
        ]);

        $paymentPayload = [
            'reservation_id' => $reservation->id,
            'amount' => 240.00,
            'payment_method' => 'credit_card',
            'currency' => 'USD',
            'token' => 'tok_valid_visa_123',
            'customer_email' => 'carlos@example.com',
        ];

        $response = $this->postJson('/api/v1/payments', $paymentPayload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.status', 'completed')
                 ->assertJsonPath('data.amount', 240.00);

        // La reserva debe haber cambiado su estado a confirmed
        $this->assertEquals(Reservation::STATUS_CONFIRMED, $reservation->fresh()->status);

        $this->assertDatabaseHas('payments', [
            'reservation_id' => $reservation->id,
            'amount' => 240.00,
            'status' => 'completed',
        ]);
    }

    /**
     * Prueba: Recibir comprobante oficial de confirmación de reserva.
     */
    public function test_can_receive_reservation_confirmation_voucher(): void
    {
        $reservation = Reservation::create([
            'reservation_code' => 'RES-CONFIRM-999',
            'user_id' => $this->client->id,
            'room_id' => $this->room102->id,
            'check_in_date' => '2026-12-20',
            'check_out_date' => '2026-12-22',
            'guests_count' => 2,
            'nights_count' => 2,
            'price_per_night' => 120.00,
            'total_amount' => 240.00,
            'status' => Reservation::STATUS_CONFIRMED,
        ]);

        Payment::create([
            'payment_reference' => 'PAY-CONFIRM-999',
            'reservation_id' => $reservation->id,
            'amount' => 240.00,
            'currency' => 'USD',
            'payment_method' => 'credit_card',
            'status' => Payment::STATUS_COMPLETED,
            'gateway_transaction_id' => 'txn_GATEWAY_ABC123',
            'paid_at' => now(),
        ]);

        $response = $this->getJson("/api/v1/reservations/{$reservation->reservation_code}/confirmation");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.confirmation_status', 'CONFIRMADA')
                 ->assertJsonPath('data.confirmation_code', 'RES-CONFIRM-999')
                 ->assertJsonPath('data.hotel.name', 'Gran Hotel Real')
                 ->assertJsonPath('data.client.email', 'carlos@example.com')
                 ->assertJsonPath('data.stay_details.room_number', '102')
                 ->assertJsonPath('data.financial_breakdown.total_paid', 240.00)
                 ->assertJsonPath('data.payment_receipt.receipt_number', 'PAY-CONFIRM-999');
    }
}
