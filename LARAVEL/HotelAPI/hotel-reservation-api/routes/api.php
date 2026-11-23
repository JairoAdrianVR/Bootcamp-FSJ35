<?php

use App\Http\Controllers\Api\HotelController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\RoomController;
use App\Http\Controllers\Api\SystemController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes - Hotel Reservation System
|--------------------------------------------------------------------------
|
| Contratos de API para el sistema empresarial de reservas y pagos de hotel.
| Cumple con los principios de desacoplamiento y versionado semántico /v1/.
|
*/

// Endpoint de diagnóstico rápido en la raíz de la API
Route::get('/', [SystemController::class, 'info']);

Route::prefix('v1')->group(function () {
    // 0. Endpoints de Sistema para "Levantar" y diagnosticar el proyecto
    Route::get('/', [SystemController::class, 'info'])->name('api.system.info');
    Route::get('/health', [SystemController::class, 'health'])->name('api.system.health');
    Route::post('/setup/seed', [SystemController::class, 'seed'])->name('api.system.seed');

    // 1. Clientes / Usuarios (Usage: Cliente / Usuario)
    Route::get('/users', [UserController::class, 'index'])->name('api.users.index');
    Route::post('/users', [UserController::class, 'store'])->name('api.users.store');
    Route::get('/users/{id}', [UserController::class, 'show'])->name('api.users.show');

    // 2. Hoteles (Usage: Hotel)
    Route::get('/hotels', [HotelController::class, 'index'])->name('api.hotels.index');
    Route::post('/hotels', [HotelController::class, 'store'])->name('api.hotels.store');
    Route::get('/hotels/{id}', [HotelController::class, 'show'])->name('api.hotels.show');

    // 3. Habitaciones (Usage: Habitación)
    // Función Requerida: "Buscar habitaciones disponibles"
    Route::get('/rooms/search', [RoomController::class, 'search'])->name('api.rooms.search');
    Route::get('/rooms', [RoomController::class, 'index'])->name('api.rooms.index');
    Route::post('/rooms', [RoomController::class, 'store'])->name('api.rooms.store');
    Route::get('/rooms/{id}', [RoomController::class, 'show'])->name('api.rooms.show');

    // 4. Reservas (Usage: Reserva)
    // Funciones Requeridas: "Realizar reservas" y "Recibir confirmaciones de reserva"
    Route::get('/reservations', [ReservationController::class, 'index'])->name('api.reservations.index');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('api.reservations.store');
    Route::get('/reservations/{identifier}/confirmation', [ReservationController::class, 'confirmation'])->name('api.reservations.confirmation');
    Route::get('/reservations/{id}', [ReservationController::class, 'show'])->name('api.reservations.show');

    // 5. Pagos (Usage: Pago)
    // Función Requerida: "Gestionar pagos"
    Route::get('/payments', [PaymentController::class, 'index'])->name('api.payments.index');
    Route::post('/payments', [PaymentController::class, 'store'])->name('api.payments.store');
    Route::get('/payments/{id}', [PaymentController::class, 'show'])->name('api.payments.show');
});
