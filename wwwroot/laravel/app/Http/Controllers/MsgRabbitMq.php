<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\App;
use PhpAmqpLib\Message\AMQPMessage;
use Illuminate\Http\JsonResponse;
    
class MsgRabbitMq extends BaseController{
    public static function pushMsg($queue='default',$messageData){
        if(empty($messageData)) return;
        $connection = App::make('rabbitmq');
        $channel = $connection->channel();  
        $channel->queue_declare($queue, false, true, false, false);
        $message = new AMQPMessage(json_encode($messageData));
        try {
            $result = $channel->basic_publish($message, '', $queue);
        } catch (\Exception $e) {
            $channel->close();
            $connection->close();
            return new JsonResponse(['code'=>0,'message' => 'Failed to Publish Message','details'=>$e->getMessage()], 200,['encoding' => 'utf-8']);
        }
        $channel->close();
        $connection->close();
    }
}
