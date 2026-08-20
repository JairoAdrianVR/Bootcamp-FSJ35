<?php

use App\Http\Controllers\BlogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


// baseurl -> localhost:8000/api
Route::get('/blogs',[BlogController::class , 'index']);

Route::post('/blog',[BlogController::class, 'store']);

//producto/2
Route::get('/blog/{id}',[BlogController::class, 'show']);

Route::put("/blog/{id}",[BlogController::class, 'update']);

Route::delete("/blog/{id}",[BlogController::class, 'destroy']);




