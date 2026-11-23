<?php

namespace App\Gateways;

use App\Contracts\Gateways\PaymentGatewayInterface;
use App\DTOs\ProcessPaymentDTO;
use App\DTOs\PaymentResultDTO;
use Illuminate\Support\Str;

/**
 * Class MockPaymentGateway
 * 
 * Implementación desacoplada del contrato PaymentGatewayInterface.
 * Simula la interacción con pasarelas externas (Stripe, PayPal, etc.).
 */
class MockPaymentGateway implements PaymentGatewayInterface
{
    /**
     * Procesa el cobro simulando una pasarela externa.
     */
    public function charge(ProcessPaymentDTO $paymentDTO): PaymentResultDTO
    {
        // Validación de simulación: tokens que empiezan con 'tok_fail' provocan rechazo
        if ($paymentDTO->token && str_starts_with($paymentDTO->token, 'tok_fail')) {
            return PaymentResultDTO::failure(
                'Transacción declinada por la entidad emisora (Fondos insuficientes o tarjeta inválida).',
                ['error_code' => 'card_declined']
            );
        }

        // Simulación exitosa
        $gatewayTxId = 'txn_' . strtoupper(Str::random(16));

        return PaymentResultDTO::success(
            transactionId: $gatewayTxId,
            message: 'Pago procesado exitosamente por pasarela externa.',
            raw: [
                'provider' => 'EnterpriseMockGateway',
                'amount_cents' => (int) ($paymentDTO->amount * 100),
                'currency' => $paymentDTO->currency,
                'method' => $paymentDTO->paymentMethod,
                'timestamp' => now()->toIso8601String()
            ]
        );
    }

    /**
     * Simulación de reembolso.
     */
    public function refund(string $transactionId, float $amount): bool
    {
        return true;
    }
}
