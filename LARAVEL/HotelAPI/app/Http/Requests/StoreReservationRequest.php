<?php

namespace App\Http\Requests;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normalizar y mapear campos flexibles antes de validar.
     * Permite especificar fecha única ('fecha', 'reservation_date') o rango ('check_in_date', 'check_out_date'),
     * así como 'room_id' o 'habitacion_id'.
     */
    protected function prepareForValidation(): void
    {
        $roomId = $this->input('room_id') 
            ?? $this->input('habitacion_id') 
            ?? $this->input('id_habitacion');

        $checkIn = $this->input('check_in_date') 
            ?? $this->input('fecha') 
            ?? $this->input('reservation_date') 
            ?? $this->input('fecha_reservacion') 
            ?? $this->input('date');

        $checkOut = $this->input('check_out_date') 
            ?? $this->input('fecha_salida') 
            ?? $this->input('fecha_fin');

        // Si solo se proporciona una fecha, se asume una estancia de 1 noche
        if ($checkIn && !$checkOut) {
            try {
                $checkOut = Carbon::parse($checkIn)->addDay()->toDateString();
            } catch (\Exception $e) {
                // Dejar que la regla de validación de fecha atrape el error
            }
        }

        $userId = $this->input('user_id') 
            ?? $this->input('cliente_id') 
            ?? auth()->id() 
            ?? (User::first()?->id ?? 1);

        $guestsCount = $this->input('guests_count') 
            ?? $this->input('huespedes') 
            ?? $this->input('guests') 
            ?? 1;

        $this->merge([
            'room_id' => $roomId,
            'check_in_date' => $checkIn,
            'check_out_date' => $checkOut,
            'user_id' => $userId,
            'guests_count' => $guestsCount,
        ]);
    }

    public function rules(): array
    {
        return [
            'room_id' => ['required', 'integer', 'exists:rooms,id'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['required', 'date', 'after:check_in_date'],
            'user_id' => ['required', 'integer', 'exists:users,id'],
            'guests_count' => ['nullable', 'integer', 'min:1'],
            'special_requests' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'room_id.required' => 'El id de la habitación es obligatorio.',
            'room_id.exists' => 'La habitación especificada no existe.',
            'check_in_date.required' => 'La fecha de reservación es obligatoria.',
            'check_in_date.after_or_equal' => 'La fecha de reservación no puede ser anterior a hoy.',
            'check_out_date.after' => 'La fecha de salida debe ser posterior a la fecha de inicio.',
        ];
    }
}
