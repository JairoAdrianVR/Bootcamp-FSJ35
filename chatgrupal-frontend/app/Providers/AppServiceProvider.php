<?php

namespace App\Providers;

use App\Services\ChatgrupalApi;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ChatgrupalApi::class, fn () => new ChatgrupalApi);
    }

    public function boot(): void
    {
        //
    }
}
