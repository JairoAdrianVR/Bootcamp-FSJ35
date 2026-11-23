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
        //
        $blog = Blog::create($request->all());
        return response()->json(
            [
                'mensaje' => 'Blog creado correctamente',
                'data' => $blog
            ],201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        return response()->json(
            [
                'data' => $blog
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $blog->update($request->all());

       return response()->json(
        [
            'data' => $blog
        ]
       );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        $blog->delete();
        return response()->json(
            [
                'mensaje' => 'Blog eliminado correctamente'
            ]
        );
    }
}
