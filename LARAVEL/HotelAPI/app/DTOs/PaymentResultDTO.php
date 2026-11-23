<?php

namespace App\DTOs;

class PaymentResultDTO
{
    public function __construct(
        public readonly bool $isSuccess,
        public readonly string $transactionId,
        public readonly string $status,
        public readonly ?string $message = null,
        public readonly array $rawResponse = []
    ) {}

    public static function success(string $transactionId, string $message = 'Pago procesado exitosamente', array $raw = []): self
    {
        return new self(
            isSuccess: true,
            transactionId: $transactionId,
            status: 'completed',
            message: $message,
            rawResponse: $raw
        );
    }

    public static function failure(string $message, array $raw = []): self
    {
        return new self(
            isSuccess: false,
            transactionId: 'FAILED-' . uniqid(),
            status: 'failed',
            message: $message,
            rawResponse: $raw
        );
    }
}
