<?php

namespace App\DTOs;

class ProcessPaymentDTO
{
    public function __construct(
        public readonly int $reservationId,
        public readonly float $amount,
        public readonly string $paymentMethod,
        public readonly string $currency = 'USD',
        public readonly ?string $token = null,
        public readonly ?string $customerEmail = null,
        public readonly array $metadata = []
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            reservationId: (int) $data['reservation_id'],
            amount: (float) $data['amount'],
            paymentMethod: $data['payment_method'],
            currency: $data['currency'] ?? 'USD',
            token: $data['token'] ?? null,
            customerEmail: $data['customer_email'] ?? null,
            metadata: $data['metadata'] ?? []
        );
    }
}
