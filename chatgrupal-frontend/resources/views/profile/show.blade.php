@extends('layouts.app')

@section('content')
<div class="bg-white p-6 rounded shadow max-w-lg">
    <h1 class="text-2xl font-bold mb-4">Mi perfil</h1>
    @if($user)
        <p class="mb-4 text-gray-600">{{ $user['name'] ?? '' }} ({{ $user['email'] ?? '' }})</p>
    @endif
    <form method="POST" action="{{ route('profile.update') }}">
        @csrf
        @method('PUT')
        @php $p = $profile ?? []; @endphp
        <div class="mb-3">
            <label class="block text-sm mb-1">Telefono</label>
            <input type="text" name="phone" value="{{ $p['phone'] ?? '' }}" class="w-full border rounded px-3 py-2">
        </div>
        <div class="mb-3">
            <label class="block text-sm mb-1">Departamento</label>
            <input type="text" name="department" value="{{ $p['department'] ?? '' }}" class="w-full border rounded px-3 py-2">
        </div>
        <div class="mb-3">
            <label class="block text-sm mb-1">Cargo</label>
            <input type="text" name="position" value="{{ $p['position'] ?? '' }}" class="w-full border rounded px-3 py-2">
        </div>
        <div class="mb-3">
            <label class="block text-sm mb-1">Bio</label>
            <textarea name="bio" class="w-full border rounded px-3 py-2">{{ $p['bio'] ?? '' }}</textarea>
        </div>
        <div class="mb-4">
            <label class="block text-sm mb-1">Estado</label>
            <input type="text" name="status" value="{{ $p['status'] ?? '' }}" class="w-full border rounded px-3 py-2">
        </div>
        <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Guardar</button>
    </form>
</div>
@endsection
