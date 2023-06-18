<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PermitCollection;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;


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
    $data = $permitCollection->where('signature',$permitCollection->signature)->get('id');
      //保存数据到数据库(重复签名不记录)
    if(sizeof($data) <= 0){
        $saveResult =  $permitCollection->save();
    }else{
        $saveResult = false;
    }

    $headers = [
      //  'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Credentials' => false,
        'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS'];
    //$data = ["code"=>'success'];

    return new JsonResponse($saveResult, 200, $headers);
  }


}
