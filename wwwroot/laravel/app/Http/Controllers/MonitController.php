<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PermitCollection;
use Illuminate\Routing\Controller as BaseController;
use PhpAmqpLib\Message\AMQPMessage;
use Illuminate\Support\Facades\App;
use \App\Models\PacketSiteCollection;

class MonitController extends BaseController
{
    public function index(Request $request)  {

      //将机器人消息存进消息队列
      $connection = App::make('rabbitmq');
      $channel = $connection->channel();
      $queue = 'monit_message';
      $channel->queue_declare($queue, false, true, false, false);
      $messageData = [
        'monitData'=>[
            'chainId' => $request->input('chainId'),
            'address' => $request->input('address'),
        ],
          // 'chatData' =>[
          //   'bot_chatid' => 'test'
          // ]
      ];
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


      return new JsonResponse(['code'=>1,'message' => 'Message published successfully.'], 200,['encoding' => 'utf-8']);
    }
}
