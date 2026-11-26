@extends('layouts.app')

@section('content')
<div class="bg-white p-6 rounded shadow">
    <h1 class="text-2xl font-bold mb-2">Dashboard</h1>
    <p class="text-gray-600 mb-4">Bienvenido al frontend de ChatGrupal.</p>
    <div class="flex gap-3">
        <a href="{{ route('chats.index') }}" class="bg-indigo-600 text-white px-4 py-2 rounded">Ver chats</a>
        <a href="{{ route('profile.show') }}" class="bg-gray-200 px-4 py-2 rounded">Mi perfil</a>
    </div>
</div>
@endsection
