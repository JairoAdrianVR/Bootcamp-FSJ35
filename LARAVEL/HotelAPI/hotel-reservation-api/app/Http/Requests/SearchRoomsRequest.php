<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Class SearchRoomsRequest
 * 
 * Validación del contrato de entrada para la búsqueda de habitaciones disponibles.
 */
class SearchRoomsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'hotel_id' => ['nullable', 'integer', 'exists:hotels,id'],
            'city' => ['nullable', 'string', 'max:100'],
            'guests' => ['nullable', 'integer', 'min:1', 'max:10'],
            'type' => ['nullable', 'string', 'in:single,double,suite,deluxe'],
            'min_price' => ['nullable', 'numeric', 'min:0'],
            'max_price' => ['nullable', 'numeric', 'gte:min_price'],
        ];
    }

    public function messages(): array
    {
        return [
            'check_in_date.required' => 'La fecha de check-in es obligatoria.',
            'check_in_date.after_or_equal' => 'La fecha de check-in no puede ser anterior al día de hoy.',
            'check_out_date.required' => 'La fecha de check-out es obligatoria.',
            'check_out_date.after' => 'La fecha de check-out debe ser estrictamente posterior a la fecha de check-in.',
            'hotel_id.exists' => 'El hotel especificado no existe.',
        ];
    }
}
