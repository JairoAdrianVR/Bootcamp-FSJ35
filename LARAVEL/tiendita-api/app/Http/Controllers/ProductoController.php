<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //testeamos si anda el index
        // producto::all -> es un metodo que ya viene desde el modelo
        // este metodo va a ejecutar el select * from y viene desde Eloquent
        $productos = Producto::all();


        //echo "holiwis";
        /* retornar la respuesta de eloquent pero antes la vamos a parsear o
        transformar a objeto o json. 
        
        */
        return response()->json(
            [
                'data' => $productos
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     * $_POST -> Es $request
     * 
     */
    public function store(Request $request)
    {
        //testar si llegan los datos
        //return $request->all();

        //procesar los datos para poder guardarlos
        $producto = Producto::create($request->all());
        
        return response( )->json(
            [
                'mensaje'=> 'Producto creado correctamente',
                'data' => $producto
            ],201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // buscamos un recurso en especifico
       $producto = Producto::findOrFail($id); 

       return response()->json(
        [
            'data' => $producto
        ]
       );

    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // buscamos un recurso en especifico
        $producto = Producto::findOrFail($id); 
        
        // actualizar un recurso
        $producto->update($request->all());

        return response()->json(
            [
                'id' => $id,
                'data-request' => $request->all(),
                'data-response' => $producto
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //buscar el recurso a eliminar
        $producto = Producto::findOrFail($id); 

        $producto->delete();

        Producto::resetAutoincrement();

        return response()->json(
            [
                'mensaje' => 'Producto eliminado correctamente'
            ]
        );
    }
}
