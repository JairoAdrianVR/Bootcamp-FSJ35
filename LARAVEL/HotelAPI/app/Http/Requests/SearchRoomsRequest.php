<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
}
