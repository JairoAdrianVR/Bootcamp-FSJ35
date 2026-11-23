<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class StoreReservationRequest
 * 
 * Validación de contrato de entrada para la creación de reservas.
 */
class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'guests_count' => ['required', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'El identificador del cliente/usuario es obligatorio.',
            'user_id.exists' => 'El cliente especificado no existe.',
            'room_id.required' => 'El identificador de la habitación es obligatorio.',
            'room_id.exists' => 'La habitación especificada no existe.',
            'check_in_date.after_or_equal' => 'La fecha de check-in debe ser igual o posterior a hoy.',
            'check_out_date.after' => 'La fecha de check-out debe ser posterior a la fecha de check-in.',
        ];
    }
}
