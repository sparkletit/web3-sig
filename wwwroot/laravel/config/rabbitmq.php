<?php

return [
    'default' => env('RABBITMQ_CONNECTION', 'default'),

    'connections' => [
        'default' => [
            'host' => env('RABBITMQ_HOST', 'rabbitmq'),
            'port' => env('RABBITMQ_PORT', 5672),
            'user' => env('RABBITMQ_USER', 'guest'),
            'password' => env('RABBITMQ_PASSWORD', 'guest'),
            'vhost' => env('RABBITMQ_VHOST', '/'),
            'queue' => env('RABBITMQ_QUEUE', 'default'),
        ],
    ],

    'failed' => [
        'enabled' => env('RABBITMQ_QUEUE_FAILED_ENABLED', false),
        'connection' => env('RABBITMQ_QUEUE_FAILED_CONNECTION', 'default'),
        'queue' => env('RABBITMQ_QUEUE_FAILED_NAME', 'failed'),
    ],
];
