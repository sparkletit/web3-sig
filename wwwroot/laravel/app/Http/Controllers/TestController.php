<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tokenlist;
class TestController extends Controller
{
    //
    public function test(Request $request) {
        
        //$input = $request->only('username', 'password');
$rs = Tokenlist::where('id','1')->get();
        foreach($rs as $k=>$item){
            dd($item['address']);
        }
    }
}
