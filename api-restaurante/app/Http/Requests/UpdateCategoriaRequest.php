<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoriaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nombre' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('categorias', 'nombre')->ignore($this->route('categoria'))],
            'descripcion' => ['nullable', 'string'],
        ];
    }
}
