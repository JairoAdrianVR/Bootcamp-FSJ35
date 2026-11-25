<?php

namespace App\Http\Controllers;

use App\Services\ChatgrupalApi;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(ChatgrupalApi $api)
    {
        $chats = $api->chats();

        return view('chats.index', compact('chats'));
    }

    public function show(int $id, ChatgrupalApi $api)
    {
        $chat = $api->chat($id);
        $messages = $api->messages($id);

        return view('chats.show', compact('chat', 'messages'));
    }

    public function store(Request $request, ChatgrupalApi $api)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
        ]);

        $chat = $api->createChat($request->only(['name', 'description']));

        if (! $chat) {
            return back()->withErrors(['name' => 'No se pudo crear el chat.'])->withInput();
        }

        return redirect()->route('chats.show', $chat['id'] ?? 0);
    }

    public function destroy(int $id, ChatgrupalApi $api)
    {
        $api->deleteChat($id);

        return redirect()->route('chats.index');
    }
}
