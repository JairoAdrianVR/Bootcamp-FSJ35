<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
}
