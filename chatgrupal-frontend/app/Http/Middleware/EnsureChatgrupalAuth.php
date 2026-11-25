<?php

namespace App\Http\Middleware;

use App\Services\ChatgrupalApi;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureChatgrupalAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $api = app(ChatgrupalApi::class);

        if (! $api->token()) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesion.');
        }

        return $next($request);
    }
}
