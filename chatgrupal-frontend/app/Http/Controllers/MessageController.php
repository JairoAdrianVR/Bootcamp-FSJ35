<?php

namespace App\Http\Controllers;

use App\Services\ChatgrupalApi;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, int $chat, ChatgrupalApi $api)
    {
        $request->validate([
            'body' => ['required', 'string'],
        ]);

        $api->sendMessage($chat, $request->body);

        return redirect()->route('chats.show', $chat);
    }

    public function destroy(int $id, ChatgrupalApi $api)
    {
        $api->deleteMessage($id);

        return back();
    }
}
