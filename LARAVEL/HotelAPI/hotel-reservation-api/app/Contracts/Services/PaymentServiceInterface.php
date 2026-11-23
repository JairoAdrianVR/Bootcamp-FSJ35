<?php

namespace App\Contracts\Services;

use App\DTOs\ProcessPaymentDTO;
use App\Models\Payment;

/**
 * Interface PaymentServiceInterface
 * 
 * Contrato del servicio de Pagos que coordina la validación de montos,
 * la pasarela de pagos desacoplada y la transición de estado de la reserva.
 */
interface PaymentServiceInterface
{
    /**
     * Procesa y registra un pago para una reserva pendiente.
     *
     * @param ProcessPaymentDTO $dto
     * @return Payment
     */
    public function processPayment(ProcessPaymentDTO $dto): Payment;
}
