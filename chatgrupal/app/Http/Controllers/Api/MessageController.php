<?php

namespace App\Http\Controllers\Api;

use App\Events\MessageSent;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use App\Models\Chat;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, ?Chat $chat = null): JsonResponse
    {
        $query = Message::with(['chat', 'user']);

        if ($chat) {
            $query->where('chat_id', $chat->id);
        } elseif ($request->filled('chat_id')) {
            $query->where('chat_id', $request->integer('chat_id'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->integer('user_id'));
        }

        return response()->json($query->latest()->get());
    }

    public function store(StoreMessageRequest $request, ?Chat $chat = null): JsonResponse
    {
        $data = $request->validated();

        $chatId = $chat?->id ?? ($data['chat_id'] ?? null);

        if (! $chatId) {
            return response()->json(['message' => 'El chat es obligatorio.'], 422);
        }

        $message = Message::create([
            'chat_id' => $chatId,
            'user_id' => $data['user_id'] ?? $request->user()?->id,
            'body' => $data['body'],
        ]);

        $message->load(['chat', 'user']);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }

    public function show(Message $message): JsonResponse
    {
        $message->load(['chat', 'user']);

        return response()->json($message);
    }

    public function update(UpdateMessageRequest $request, Message $message): JsonResponse
    {
        $message->update($request->validated());
        $message->load(['chat', 'user']);

        return response()->json($message);
    }

    public function destroy(Message $message): JsonResponse
    {
        $message->delete();

        return response()->json(null, 204);
    }
}
