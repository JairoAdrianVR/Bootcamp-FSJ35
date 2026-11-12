<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            if (! Auth::attempt($request->only('email', 'password'))) {
                return response()->json(['message' => 'Credenciales invalidas.'], 401);
            }

            $user = $request->user();

            if (! $user || ! $user->is_admin) {
                if ($user) {
                    $user->tokens()->delete();
                }

                return response()->json(['message' => 'Acceso solo para administradores.'], 403);
            }

            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user,
            ]);
        } catch (\Throwable $e) {
            Log::error('Error en login', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo iniciar sesion.'], 500);
        }
    }

    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()?->currentAccessToken()?->delete();

            return response()->json(['message' => 'Sesion cerrada.']);
        } catch (\Throwable $e) {
            Log::error('Error en logout', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo cerrar sesion.'], 500);
        }
    }

    public function me(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            if (! $user) {
                return response()->json(['message' => 'No autenticado.'], 401);
            }

            return response()->json($user);
        } catch (\Throwable $e) {
            Log::error('Error al obtener usuario autenticado', ['exception' => $e->getMessage()]);

            return response()->json(['message' => 'No se pudo obtener el usuario.'], 500);
        }
    }
}
