<?php

namespace App\Contracts\Services;

use App\DTOs\ProcessPaymentDTO;
use App\Models\Payment;

interface PaymentServiceInterface
{
    public function processPayment(ProcessPaymentDTO $dto): Payment;
}
