<?php

namespace App\Contracts\Gateways;

use App\DTOs\ProcessPaymentDTO;
use App\DTOs\PaymentResultDTO;

interface PaymentGatewayInterface
{
    public function charge(ProcessPaymentDTO $paymentDTO): PaymentResultDTO;
    public function refund(string $transactionId, float $amount): bool;
}
