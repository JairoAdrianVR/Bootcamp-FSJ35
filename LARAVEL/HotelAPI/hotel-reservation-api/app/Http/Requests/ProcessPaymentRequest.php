<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class ProcessPaymentRequest
 * 
 * Validación del contrato de entrada para la gestión de pagos.
 */
class ProcessPaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:credit_card,debit_card,paypal,bank_transfer'],
            'currency' => ['nullable', 'string', 'size:3'],
            'token' => ['nullable', 'string'],
            'customer_email' => ['nullable', 'email'],
        ];
    }

    public function messages(): array
    {
        return [
            'reservation_id.required' => 'El identificador de la reserva es obligatorio.',
            'reservation_id.exists' => 'La reserva especificada no existe.',
            'amount.required' => 'El monto del pago es obligatorio.',
            'payment_method.in' => 'El método de pago debe ser: credit_card, debit_card, paypal o bank_transfer.',
        ];
    }
}
