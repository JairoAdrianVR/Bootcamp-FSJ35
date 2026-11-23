<?php

namespace App\Providers;

use App\Contracts\Gateways\PaymentGatewayInterface;
use App\Contracts\Repositories\ReservationRepositoryInterface;
use App\Contracts\Repositories\RoomRepositoryInterface;
use App\Contracts\Services\NotificationServiceInterface;
use App\Contracts\Services\PaymentServiceInterface;
use App\Contracts\Services\ReservationServiceInterface;
use App\Gateways\MockPaymentGateway;
use App\Repositories\EloquentReservationRepository;
use App\Repositories\EloquentRoomRepository;
use App\Services\LogNotificationService;
use App\Services\PaymentProcessingService;
use App\Services\ReservationService;
use Illuminate\Support\ServiceProvider;

/**
 * Class HotelReservationServiceProvider
 * 
 * Contenedor de Inversión de Control (IoC).
 * Registra y enlaza las abstracciones (interfaces) con sus implementaciones concretas,
 * garantizando el desacoplamiento arquitectónico (Principio DIP de SOLID).
 */
class HotelReservationServiceProvider extends ServiceProvider
{
    /**
     * Mapeo de contratos / interfaces a implementaciones concretas.
     */
    public array $bindings = [
        // Pasarela de Pagos (Adapter Pattern)
        PaymentGatewayInterface::class => MockPaymentGateway::class,

        // Repositorios de Datos (Data Access Abstraction)
        RoomRepositoryInterface::class => EloquentRoomRepository::class,
        ReservationRepositoryInterface::class => EloquentReservationRepository::class,

        // Servicios de Negocio (Business Services)
        ReservationServiceInterface::class => ReservationService::class,
        PaymentServiceInterface::class => PaymentProcessingService::class,
        NotificationServiceInterface::class => LogNotificationService::class,
    ];

    public function register(): void
    {
        // Registro explícito si se requieren configuraciones avanzadas
    }

    public function boot(): void
    {
        //
    }
}
