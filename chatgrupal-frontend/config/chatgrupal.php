<?php

return [
    'url' => env('CHATGRUPAL_API_URL', 'http://127.0.0.1:8000/api'),
    'reverb' => [
        'key' => env('CHATGRUPAL_REVERB_KEY'),
        'host' => env('CHATGRUPAL_REVERB_HOST', '127.0.0.1'),
        'port' => env('CHATGRUPAL_REVERB_PORT', 8080),
        'scheme' => env('CHATGRUPAL_REVERB_SCHEME', 'http'),
    ],
];
