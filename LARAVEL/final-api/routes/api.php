<?php

use App\Http\Controllers\PostController;
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

Route::get('/posts',[PostController::class, 'index']);

//Endpoints Protegidos por sanctum
Route::middleware('auth:sanctum')->group( function(){

Route::post('/posts',[PostController::class, 'store']);

Route::put('/posts/{id}',[PostController::class, 'update']);

Route::delete('/posts/{id}',[PostController::class,'destroy']);

Route::put('/posts/{id}/restore', [PostController::class, 'restore']);

});

