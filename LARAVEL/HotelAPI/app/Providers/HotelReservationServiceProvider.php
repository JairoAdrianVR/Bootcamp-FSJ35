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

class HotelReservationServiceProvider extends ServiceProvider
{
    public array $bindings = [
        PaymentGatewayInterface::class => MockPaymentGateway::class,
        RoomRepositoryInterface::class => EloquentRoomRepository::class,
        ReservationRepositoryInterface::class => EloquentReservationRepository::class,
        ReservationServiceInterface::class => ReservationService::class,
        PaymentServiceInterface::class => PaymentProcessingService::class,
        NotificationServiceInterface::class => LogNotificationService::class,
    ];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        //
    }
}
