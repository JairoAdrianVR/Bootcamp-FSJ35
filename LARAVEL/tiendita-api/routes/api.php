<?php

use App\Http\Controllers\ProductoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// baseurl -> localhost:8000/api
Route::get('/productos',[ProductoController::class , 'index']);

Route::post('/producto',[ProductoController::class, 'store']);

//producto/2
Route::get('/producto/{id}',[ProductoController::class, 'show']);