@extends('layouts.app')

@section('content')
<div class="grid md:grid-cols-3 gap-6">
    <div class="md:col-span-1 bg-white p-4 rounded shadow">
        <h2 class="font-bold mb-3">Nuevo chat</h2>
        <form method="POST" action="{{ route('chats.store') }}">
            @csrf
            <input type="text" name="name" placeholder="Nombre" class="w-full border rounded px-3 py-2 mb-2" required>
            <textarea name="description" placeholder="Descripcion" class="w-full border rounded px-3 py-2 mb-2"></textarea>
            <button type="submit" class="w-full bg-indigo-600 text-white py-2 rounded">Crear</button>
        </form>
    </div>
    <div class="md:col-span-2 bg-white p-4 rounded shadow">
        <h2 class="font-bold mb-3">Chats</h2>
        @if(empty($chats))
            <p class="text-gray-500">No hay chats disponibles.</p>
        @else
            <ul class="divide-y">
                @foreach($chats as $chat)
                    <li class="py-3 flex justify-between items-center">
                        <div>
                            <a href="{{ route('chats.show', $chat['id']) }}" class="font-semibold text-indigo-600 hover:underline">
                                {{ $chat['name'] ?? 'Chat #'.$chat['id'] }}
                            </a>
                            <p class="text-sm text-gray-500">{{ $chat['description'] ?? '' }}</p>
                        </div>
                        <form method="POST" action="{{ route('chats.destroy', $chat['id']) }}" onsubmit="return confirm('Eliminar chat?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="text-red-600 text-sm">Eliminar</button>
                        </form>
                    </li>
                @endforeach
            </ul>
        @endif
    </div>
</div>
@endsection
