<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProductController extends Controller
{
    //crear registro de libro 
    public function create(Request $request){
    $libro = $request->validate([
        'titulo' => 'required|string|max:100|min:5',
        'autor' => 'required|string|max:200',
        'editorial' => 'required|string|max:200',
        'anio_publicacion' => 'required|integer|min:1900|max:2024',
        'genero' => 'required|string|max:100',
        'descripcion' => 'nullable|string|max:500'
    ]);

    return response()->json([
        'message' => 'Libro creado',
        'libro' => $libro
    ],201);
    }
}
