<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tokenlist;

class TestController extends Controller
{
    //
    public function test(Request $request) {
        
        //$input = $request->only('username', 'password');
$user = User::create(request(['name', 'email', 'password']));
        
}
}