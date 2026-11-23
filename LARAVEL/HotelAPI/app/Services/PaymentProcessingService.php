<?php

namespace App\Services;

use App\Contracts\Gateways\PaymentGatewayInterface;
use App\Contracts\Repositories\ReservationRepositoryInterface;
use App\Contracts\Services\PaymentServiceInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\DTOs\ProcessPaymentDTO;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\ReservationConfirmation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use InvalidArgumentException;
use RuntimeException;

class PaymentProcessingService implements PaymentServiceInterface
{
    public function __construct(
        protected ReservationRepositoryInterface $reservationRepository,
        protected PaymentGatewayInterface $paymentGateway,
        protected NotificationServiceInterface $notificationService
    ) {}

    public function processPayment(ProcessPaymentDTO $dto): Payment
    {
        $reservation = $this->reservationRepository->findById($dto->reservationId, ['user', 'room.hotel', 'payment', 'confirmation']);

        if (!$reservation) {
            throw new RuntimeException('La reserva no existe.');
        }

        if ($reservation->status === Reservation::STATUS_CONFIRMED) {
            throw new InvalidArgumentException('Esta reserva ya se encuentra pagada y confirmada.');
        }

        if ($reservation->status === Reservation::STATUS_CANCELLED) {
            throw new InvalidArgumentException('No se puede procesar pago para una reserva cancelada.');
        }

        if (abs($dto->amount - (float) $reservation->total_amount) > 0.01) {
            throw new InvalidArgumentException(
                "El monto enviado ({$dto->amount}) no coincide con el total de la reserva ({$reservation->total_amount})."
            );
        }

        $paymentResult = $this->paymentGateway->charge($dto);

        if (!$paymentResult->isSuccess) {
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

            // Actualizar estado de la reserva a confirmado
            $this->reservationRepository->updateStatus($reservation->id, Reservation::STATUS_CONFIRMED);
            $reservation->refresh();

            // Emitir comprobante formal de confirmación
            $confCode = 'CNF-' . strtoupper(Str::random(8));
            ReservationConfirmation::create([
                'reservation_id' => $reservation->id,
                'confirmation_code' => $confCode,
                'verification_hash' => hash('sha256', $confCode . $paymentResult->transactionId),
                'qr_payload' => "CHECKIN://{$reservation->room?->hotel_id}/{$confCode}",
                'issued_at' => now(),
                'status' => ReservationConfirmation::STATUS_ACTIVE,
                'notes' => 'Comprobante y voucher emitido tras autorización de pago.',
            ]);

            $this->notificationService->sendReservationConfirmation($reservation);

            return $payment->load(['reservation.confirmation']);
        });
    }
}
