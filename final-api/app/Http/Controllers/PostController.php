<?php

namespace App\Http\Controllers;

use App\Models\post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       try{ //
        $posts = post::with('user')->get( );
        return response()->json(['data'=>$posts]);
    }
    catch(\Exception $error){
        return response()->json([$error->getMessage()]);
    }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        try{

        $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'required|string'
        ]);

        //creamos el post 
        $post = post::create([
            'title' => $request->title,
            'content' => $request->content,
            'user_id' => $request->user()->id
        ]);
        return response()->json(['message'=>'Post creado correctamente','data'=>$post],201);

        } 
        catch(\Exception $error){
            return response()->json([$error->getMessage()]);
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $post=post::findOtfail($id);
        request()->validate([
            'title' => 'required|string',
            'content' => 'required|string'
        ]);

        $post->update(request()->all());
        return response()->json(['message'=>'Post actualizado correctamente','data'=>$post]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        try{
$post=post::findOrFail($id);

$post->delete();
return response()->json(['message'=>'Post eliminado correctamente']);
        }
        catch(\Exception $error){
            return response()->json([$error->getMessage()]);
        }
    }
}
