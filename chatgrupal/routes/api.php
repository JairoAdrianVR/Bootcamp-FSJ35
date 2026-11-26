<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\ProfileController;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::get('user', [AuthController::class, 'me']);

    Route::apiResource('chats', ChatController::class);
    Route::apiResource('messages', MessageController::class);
    Route::apiResource('profiles', ProfileController::class);

    // Perfil del usuario autenticado
    Route::get('profile', [ProfileController::class, 'current']);
    Route::put('profile', [ProfileController::class, 'updateCurrent']);
    Route::patch('profile', [ProfileController::class, 'updateCurrent']);

    // Mensajes anidados por chat
    Route::get('chats/{chat}/messages', [MessageController::class, 'index']);
    Route::post('chats/{chat}/messages', [MessageController::class, 'store']);
});
