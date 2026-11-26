<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'chat_id' => ['sometimes', 'required', 'integer', 'exists:chats,id'],
            'user_id' => ['sometimes', 'required', 'integer', 'exists:users,id'],
            'body' => ['sometimes', 'required', 'string'],
        ];
    }
}
