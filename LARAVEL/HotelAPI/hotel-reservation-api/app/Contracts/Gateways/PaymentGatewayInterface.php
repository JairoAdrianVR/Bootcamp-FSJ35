<?php

namespace App\Contracts\Gateways;

use App\DTOs\ProcessPaymentDTO;
use App\DTOs\PaymentResultDTO;

/**
 * Interface PaymentGatewayInterface
 * 
 * Contrato de pasarela de pago desacoplada (Patrón Adapter / Gateway).
 * Permite cambiar la implementación del proveedor de pagos (Stripe, PayPal, Mock)
 * sin modificar la lógica de negocio ni la capa de persistencia.
 */
interface PaymentGatewayInterface
{
    /**
     * Procesa un cobro con el proveedor de pagos externo.
     *
     * @param ProcessPaymentDTO $paymentDTO
     * @return PaymentResultDTO
     */
    public function charge(ProcessPaymentDTO $paymentDTO): PaymentResultDTO;

    /**
     * Reembolsa una transacción previa.
     *
     * @param string $transactionId
     * @param float $amount
     * @return bool
     */
    public function refund(string $transactionId, float $amount): bool;
}
