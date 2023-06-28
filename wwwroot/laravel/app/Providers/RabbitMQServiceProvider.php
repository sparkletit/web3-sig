<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use PhpAmqpLib\Connection\AMQPStreamConnection;

class RabbitMQServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('rabbitmq', function ($app) {
            $config = $app['config']['rabbitmq']['connections']['default'];
            //dd($config);
            return new AMQPStreamConnection(
                $config['host'],
                $config['port'],
                $config['user'],
                $config['password']
            );
        });
    }
}
