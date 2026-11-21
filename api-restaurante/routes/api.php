<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\PlatoController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

// Menu publico (solo lectura) para clientes
Route::prefix('menu')->group(function () {
    Route::get('categorias', [MenuController::class, 'categorias']);
    Route::get('platos', [MenuController::class, 'platos']);
    Route::get('platos/{plato}', [MenuController::class, 'plato']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::apiResource('categorias', CategoriaController::class);
    Route::apiResource('platos', PlatoController::class);
    Route::apiResource('pedidos', PedidoController::class);
});
