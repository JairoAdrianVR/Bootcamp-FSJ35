<?php

use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// Endpoints PUBLICOS -> rutas que puede acceder cualquier
// son los que no necesitan Token de autenticacion 
Route::post('/register',[UserController::class, 'register']);
Route::post('/login',[UserController::class, 'login']);

