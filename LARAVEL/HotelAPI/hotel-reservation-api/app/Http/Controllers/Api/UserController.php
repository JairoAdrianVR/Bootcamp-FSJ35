<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class UserController
 * 
 * Gestión de Clientes / Usuarios del sistema hotelero.
 */
class UserController extends BaseApiController
{
    /**
     * Listar todos los clientes.
     * GET /api/v1/users
     */
    public function index(): JsonResponse
    {
        $users = User::select(['id', 'name', 'email', 'phone', 'identification_number', 'role', 'created_at'])->get();

        return $this->successResponse($users, 'Listado de usuarios/clientes recuperado.');
    }

    /**
     * Registrar un nuevo cliente.
     * POST /api/v1/users
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:30',
            'identification_number' => 'nullable|string|max:30',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password'] ?? 'secret123'),
            'phone' => $validated['phone'] ?? null,
            'identification_number' => $validated['identification_number'] ?? null,
            'role' => 'customer',
        ]);

        return $this->successResponse($user, 'Cliente registrado exitosamente.', Response::HTTP_CREATED);
    }

    /**
     * Ver detalle de un cliente con sus reservas.
     * GET /api/v1/users/{id}
     */
    public function show(int $id): JsonResponse
    {
        $user = User::with(['reservations.room.hotel', 'reservations.payment'])->find($id);

        if (!$user) {
            return $this->errorResponse('Cliente no encontrado.', Response::HTTP_NOT_FOUND);
        }

        return $this->successResponse($user, 'Detalle de cliente recuperado.');
    }
}
