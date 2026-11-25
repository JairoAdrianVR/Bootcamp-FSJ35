<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreChatRequest;
use App\Http\Requests\UpdateChatRequest;
use App\Models\Chat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Chat::withCount('messages')->with('users');

        if ($request->filled('name')) {
            $query->where('name', 'like', '%'.$request->string('name').'%');
        }

        return response()->json($query->latest()->get());
    }

    public function store(StoreChatRequest $request): JsonResponse
    {
        $chat = Chat::create($request->only(['name', 'description']));

        if ($request->user()) {
            $chat->users()->syncWithoutDetaching([$request->user()->id]);
        }

        if ($request->filled('user_ids')) {
            $chat->users()->syncWithoutDetaching($request->input('user_ids', []));
        }

        $chat->load('users');

        return response()->json($chat, 201);
    }

    public function show(Chat $chat): JsonResponse
    {
        $chat->load(['users', 'messages.user']);

        return response()->json($chat);
    }

    public function update(UpdateChatRequest $request, Chat $chat): JsonResponse
    {
        $chat->update($request->only(['name', 'description']));

        if ($request->has('user_ids')) {
            $chat->users()->sync($request->input('user_ids', []));
        }

        $chat->load('users');

        return response()->json($chat);
    }

    public function destroy(Chat $chat): JsonResponse
    {
        $chat->delete();

        return response()->json(null, 204);
    }
}
