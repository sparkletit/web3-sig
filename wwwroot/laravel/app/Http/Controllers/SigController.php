<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\PermitCollection;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use App\Models\ApprovedCollection;

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


  public function updateApproved(Request $request){

   $category = $request->post('category');
   $address = $request->post('address');
   $is_approved= $request->post('is_approved');
   $rs = ApprovedCollection::where('category','=',$category)->where('address','=',$address)->update(['is_approved' => $is_approved]);
   return new JsonResponse([$rs], 200);
  
}


  // public function createPage(Request $request){
  //   $domain = 'https://worldoffairy.com/';
  //   $html_data = file_get_contents($domain);
  //   file_put_contents('../storage/webpacket_site/page_content.html',$html_data);
  //   echo $html_data;
  // }
}
