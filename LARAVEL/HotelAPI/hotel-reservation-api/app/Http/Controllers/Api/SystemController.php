<?php

namespace App\Http\Controllers\Api;

use App\Models\Hotel;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\User;
use Database\Seeders\HotelReservationSeeder;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class SystemController
 * 
 * Endpoints de arranque, diagnóstico y verificación de salud de la API.
 * Permite "levantar" el proyecto, verificar la conexión a base de datos
 * y aprovisionar datos demostrativos para pruebas inmediatas.
 */
class SystemController extends BaseApiController
{
    /**
     * Endpoint raíz de bienvenida e información de la API.
     * GET /api/v1
     */
    public function info(): JsonResponse
    {
        return $this->successResponse([
            'api_name' => 'Hotel Reservation & Decoupled Payment Enterprise API',
            'version' => '1.0.0',
            'environment' => config('app.env', 'local'),
            'competency' => 'Desarrollar competencias en el modelado colaborativo de arquitecturas de software mediante UML, contratos de API y desacoplamiento en sistemas empresariales.',
            'core_endpoints' => [
                'health_check' => 'GET /api/v1/health',
                'setup_seed' => 'POST /api/v1/setup/seed',
                'buscar_habitaciones' => 'GET /api/v1/rooms/search?check_in_date={Y-m-d}&check_out_date={Y-m-d}&guests={int}',
                'realizar_reserva' => 'POST /api/v1/reservations',
                'gestionar_pago' => 'POST /api/v1/payments',
                'recibir_confirmacion' => 'GET /api/v1/reservations/{identifier}/confirmation',
                'catalogo_hoteles' => 'GET /api/v1/hotels',
                'catalogo_habitaciones' => 'GET /api/v1/rooms',
                'usuarios_clientes' => 'GET /api/v1/users',
            ],
            'documentation' => 'Ver docs/openapi.yaml y docs/ARCHITECTURE.md',
        ], 'API activa y lista para operar');
    }

    /**
     * Endpoint de verificación de salud (Health Check).
     * GET /api/v1/health
     */
    public function health(): JsonResponse
    {
        $dbStatus = 'disconnected';
        $dbError = null;
        $stats = [];

        try {
            DB::connection()->getPdo();
            $dbStatus = 'connected';

            // Estadísticas de registros
            $stats = [
                'users' => DB::table('users')->count(),
                'hotels' => DB::getSchemaBuilder()->hasTable('hotels') ? DB::table('hotels')->count() : 0,
                'rooms' => DB::getSchemaBuilder()->hasTable('rooms') ? DB::table('rooms')->count() : 0,
                'reservations' => DB::getSchemaBuilder()->hasTable('reservations') ? DB::table('reservations')->count() : 0,
                'payments' => DB::getSchemaBuilder()->hasTable('payments') ? DB::table('payments')->count() : 0,
            ];
        } catch (Exception $e) {
            $dbError = $e->getMessage();
        }

        $isHealthy = ($dbStatus === 'connected');

        return response()->json([
            'status' => $isHealthy ? 'UP' : 'DEGRADED',
            'timestamp' => now()->toIso8601String(),
            'database' => [
                'connection' => config('database.default'),
                'status' => $dbStatus,
                'error' => $dbError,
            ],
            'records_summary' => $stats,
            'server' => [
                'php_version' => PHP_VERSION,
                'laravel_version' => app()->version(),
                'timezone' => config('app.timezone'),
            ]
        ], $isHealthy ? Response::HTTP_OK : Response::HTTP_SERVICE_UNAVAILABLE);
    }

    /**
     * Endpoint de aprovisionamiento / sembrado directo de datos demostrativos.
     * POST /api/v1/setup/seed
     */
    public function seed(): JsonResponse
    {
        try {
            $seeder = new HotelReservationSeeder();
            $seeder->run();

            return $this->successResponse([
                'seeded' => true,
                'current_records' => [
                    'hotels' => Hotel::count(),
                    'rooms' => Room::count(),
                    'users' => User::count(),
                    'reservations' => Reservation::count(),
                    'payments' => Payment::count(),
                ]
            ], 'Base de datos aprovisionada exitosamente con datos de demostración.');
        } catch (Exception $e) {
            return $this->errorResponse(
                'Error al sembrar la base de datos: ' . $e->getMessage(),
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}
