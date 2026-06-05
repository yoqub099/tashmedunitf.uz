<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
        env('ADMIN_URL', 'http://localhost:3001'),
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
    ],

    'allowed_origins_patterns' => [
        '#^https?://(localhost|127\.0\.0\.1)(:\d+)?$#',
    ],

    'allowed_headers' => ['Content-Type', 'Authorization', 'Accept', 'Accept-Language', 'X-Requested-With', 'Cache-Control', 'Pragma'],

    'exposed_headers' => ['X-Total-Count', 'X-Page', 'X-Per-Page'],

    'max_age' => 86400,

    'supports_credentials' => true,

];
