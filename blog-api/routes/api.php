<?php
use App\Http\Controllers\BlogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

//baseurl -> localhost:8000/api
Route::get('/blogs', [BlogController::class, 'index']);
Route::post('/blogs', [BlogController::class, 'store']);
//producto/2
Route::get('/blogs/{id}', [\App\Http\Controllers\BlogController::class, 'show']);
Route::put('/blogs/{id}', [\App\Http\Controllers\BlogController::class, 'update']);
Route::delete('/blogs/{id}', [\App\Http\Controllers\BlogController::class, 'destroy']); 
