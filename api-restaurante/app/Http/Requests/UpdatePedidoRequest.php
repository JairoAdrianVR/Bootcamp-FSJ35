<?php

namespace App\Http\Requests;

use App\Models\Pedido;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePedidoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'mesa' => ['sometimes', 'nullable', 'string', 'max:50'],
            'estado' => ['sometimes', 'required', 'string', Rule::in(Pedido::ESTADOS)],
            'notas' => ['nullable', 'string'],
        ];
    }
}
