<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
        $blog = Blog::all();

        return response()->json(
            [
                'data' => $blog
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $blog = Blog::create($request->all());
 
        return response ( )->json(
            [
                'mensaje'=> 'Blog creado correctamente',
                'data' => $blog
            ],201
        );
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
         // buscamos un recurso en especifico
       $blog = Blog::findOrFail($id); 

       return response()->json(
        [
            'data' => $blog
        ]
       );

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
         // buscamos un recurso en especifico
        $blog = Blog::findOrFail($id); 
        
        // actualizar un recurso
        $blog->update($request->all());

        return response()->json(
            [
                'id' => $id,
                'data-request' => $request->all(),
                'data-response' => $blog
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //buscar el recurso a eliminar
        $blog = Blog::findOrFail($id); 

        $blog->delete();

        return response()->json(
            [
                'mensaje' => 'Producto eliminado correctamente'
            ]
        );
    }
}
