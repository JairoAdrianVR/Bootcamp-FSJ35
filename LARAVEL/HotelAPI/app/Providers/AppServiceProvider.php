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

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentGatewayInterface::class, MockPaymentGateway::class);
        $this->app->bind(RoomRepositoryInterface::class, EloquentRoomRepository::class);
        $this->app->bind(ReservationRepositoryInterface::class, EloquentReservationRepository::class);
        $this->app->bind(ReservationServiceInterface::class, ReservationService::class);
        $this->app->bind(PaymentServiceInterface::class, PaymentProcessingService::class);
        $this->app->bind(NotificationServiceInterface::class, LogNotificationService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
