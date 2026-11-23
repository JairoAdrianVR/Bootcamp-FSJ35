<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class BaseApiController
 * 
 * Controlador base para la estandarización de contratos de respuesta HTTP.
 */
abstract class BaseApiController extends Controller
{
    /**
     * Respuesta exitosa estandarizada.
     */
    protected function successResponse(mixed $data, string $message = 'Operación exitosa', int $status = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    /**
     * Respuesta de error estandarizada.
     */
    protected function errorResponse(string $message, int $status = Response::HTTP_BAD_REQUEST, mixed $errors = null): JsonResponse
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $status);
    }
}
