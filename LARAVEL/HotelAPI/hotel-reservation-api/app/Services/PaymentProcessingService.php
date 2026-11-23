<?php

namespace App\Services;

use App\Contracts\Gateways\PaymentGatewayInterface;
use App\Contracts\Repositories\ReservationRepositoryInterface;
use App\Contracts\Services\PaymentServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\DTOs\ProcessPaymentDTO;
use App\Models\Payment;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

/**
 * Class PaymentProcessingService
 * 
 * Orquestador del flujo de pago desacoplado.
 */
class PaymentProcessingService implements PaymentServiceInterface
{
    public function __construct(
        protected ReservationRepositoryInterface $reservationRepository,
        protected PaymentGatewayInterface $paymentGateway,
        protected NotificationServiceInterface $notificationService
    ) {}

    /**
     * Procesa un pago contra la pasarela y actualiza la reserva a CONFIRMADA.
     */
    public function processPayment(ProcessPaymentDTO $dto): Payment
    {
        $reservation = $this->reservationRepository->findById($dto->reservationId, ['user', 'room.hotel', 'payment']);

        if (!$reservation) {
            throw new RuntimeException('La reserva no existe.');
        }

        if ($reservation->status === Reservation::STATUS_CONFIRMED) {
            throw new InvalidArgumentException('Esta reserva ya se encuentra pagada y confirmada.');
        }

        if ($reservation->status === Reservation::STATUS_CANCELLED) {
            throw new InvalidArgumentException('No se puede procesar pago para una reserva cancelada.');
        }

        // Validación de monto
        if (abs($dto->amount - (float) $reservation->total_amount) > 0.01) {
            throw new InvalidArgumentException(
                "El monto enviado ({$dto->amount}) no coincide con el total de la reserva ({$reservation->total_amount})."
            );
        }

        // Llamar a la pasarela de pagos externa (Adapter Pattern)
        $paymentResult = $this->paymentGateway->charge($dto);

        if (!$paymentResult->isSuccess) {
            // Registrar intento fallido
            Payment::create([
                'payment_reference' => 'PAY-ERR-' . strtoupper(Str::random(8)),
                'reservation_id' => $reservation->id,
                'amount' => $dto->amount,
                'currency' => $dto->currency,
                'payment_method' => $dto->paymentMethod,
                'status' => Payment::STATUS_FAILED,
                'gateway_transaction_id' => $paymentResult->transactionId,
                'payment_details' => $paymentResult->rawResponse,
            ]);

            throw new RuntimeException("Error en la pasarela de pagos: {$paymentResult->message}");
        }

        // Transacción exitosa: guardar pago y confirmar reserva
        return DB::transaction(function () use ($reservation, $dto, $paymentResult) {
            $paymentReference = 'PAY-' . strtoupper(Str::random(10));

            $payment = Payment::create([
                'payment_reference' => $paymentReference,
                'reservation_id' => $reservation->id,
                'amount' => $dto->amount,
                'currency' => $dto->currency,
                'payment_method' => $dto->paymentMethod,
                'status' => Payment::STATUS_COMPLETED,
                'gateway_transaction_id' => $paymentResult->transactionId,
                'paid_at' => now(),
                'payment_details' => $paymentResult->rawResponse,
            ]);

            // Actualizar estado de la reserva
            $this->reservationRepository->updateStatus($reservation->id, Reservation::STATUS_CONFIRMED);
            $reservation->refresh();

            // Notificación desacoplada de confirmación
            $this->notificationService->sendReservationConfirmation($reservation);

            return $payment->load('reservation');
        });
    }
}
