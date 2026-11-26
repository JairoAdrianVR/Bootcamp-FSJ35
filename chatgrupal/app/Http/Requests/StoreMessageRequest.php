<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $chatIdRule = $this->route('chat') ? 'nullable' : 'required';

        return [
            'chat_id' => [$chatIdRule, 'integer', 'exists:chats,id'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'body' => ['required', 'string'],
        ];
    }
}
