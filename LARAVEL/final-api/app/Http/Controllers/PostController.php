<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Exception;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try{
        // obtener todos los posts

       $posts = Post::with(['user'])->get();

        return response()->json([
            'data' => $posts
        ]);
        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
                ]);
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
                'title' => 'required|string',
                'content' => 'required|string'
            ]);

            //Creamos el post
            $post = Post::create([
                'title' => $request->title,
                'content' => $request->content,
                'user_id' => $request->user()->id
            ]);

            return response()->json([
                'message' => 'Post created successfully',
                'data' => $post
            ],201);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
                ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            // Buscamos el post por su id
            $post = Post::findOrFail($id);

            $request->validate([
                'title' => 'required|string',
                'content' => 'required|string'
            ]);

            $post->update($request->all());

            return response()->json([
                'message' => 'Post updated successfully',
                'data' => $post
            ]);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
                ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $post = Post::findOrFail($id);

            $post->delete();

            return response()->json([
                'message' => 'Post deleted successfully'
            ]);

        }catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
                ]);
        };
    }

    public function restore(Request $request, string $id){
       
        try{
        $post = Post::onlyTrashed()->findOrFail($id);

        $post->restore();

        return response()->json([
            'message' => 'Post restored successfully'
        ]);
        } catch(\Exception $error){
            return response()->json([
                'message' => $error->getMessage()
                ]);
        };
    }
}
