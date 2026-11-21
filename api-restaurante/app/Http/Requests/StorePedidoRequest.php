<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mesa' => ['nullable', 'string', 'max:50'],
            'notas' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.plato_id' => ['required', 'integer', 'exists:platos,id'],
            'items.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }
}
