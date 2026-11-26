@extends('layouts.app')

@section('content')
<div class="bg-white p-4 rounded shadow mb-4">
    <h1 class="text-2xl font-bold">{{ $chat['name'] ?? 'Chat' }}</h1>
    <p class="text-gray-500">{{ $chat['description'] ?? '' }}</p>
</div>

<div class="bg-white p-4 rounded shadow mb-4">
    <h2 class="font-bold mb-3">Mensajes</h2>
    @if(empty($messages))
        <p class="text-gray-500">No hay mensajes aun.</p>
    @else
        <ul class="space-y-3">
            @foreach(array_reverse($messages) as $m)
                <li class="border-b pb-2">
                    <div class="flex justify-between">
                        <span class="font-semibold">{{ $m['user']['name'] ?? 'Usuario' }}</span>
                        <span class="text-xs text-gray-400">{{ $m['created_at'] ?? '' }}</span>
                    </div>
                    <p>{{ $m['body'] ?? '' }}</p>
                </li>
            @endforeach
        </ul>
    @endif
</div>

<div class="bg-white p-4 rounded shadow">
    <form method="POST" action="{{ route('messages.store', $chat['id']) }}">
        @csrf
        <textarea name="body" rows="2" class="w-full border rounded px-3 py-2 mb-2" placeholder="Escribe un mensaje..." required></textarea>
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Enviar</button>
    </form>
</div>
@endsection
