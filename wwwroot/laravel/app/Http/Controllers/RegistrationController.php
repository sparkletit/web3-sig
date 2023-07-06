<?php

namespace App\Http\Controllers;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class RegistrationController extends Controller
{
    public function create(request $request)
    {
        $address = $request->input('address');
        $username = substr($address , 0 , 3).substr($address , -6);
        $password = $this->random_code_type(8,"alpha-number-sign");

        $userModel = config('admin.database.users_model');

        $adminModel = new $userModel;

        $adminModel->username = $address;
        $adminModel->name = $username;
        $adminModel->password = Hash::make($password);
        $roleId = 2;
        try{
            $adminModel->save();
            $adminModel->roles()->attach([$roleId]);
        }catch(Exception $error){
            return new JsonResponse(['code'=>0,'data'=> $error],200);
        }
 
        $response_data = [
            'username'=>$address,
            'password'=>$password
        ];
       return new JsonResponse(['code'=>1,'data'=>$response_data],200);
    }

function random_code_type($length = 8,$type = 'alpha-number'){
  $code_arr = array(
    'alpha' => 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    'number'=> '0123456789',
    'sign'  => '#$%@*-_',
  );

  $type_arr = explode('-',$type);

  foreach($type_arr as $t){
    if( ! array_key_exists($t,$code_arr)){
      trigger_error("Can not generate type ($t) code");
    }
  }

  $chars = '';

  foreach($type_arr as $t){
    $chars .= $code_arr[$t];
  }
  $chars = str_shuffle($chars);
  $number = $length > strlen($chars) - 1 ? strlen($chars) - 1:$length;
  return substr($chars,0,$number);
} 


}