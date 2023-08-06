<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use \App\Models\PacketSiteCollection;

class EnableCrossRequestMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $origin = $request->server('HTTP_ORIGIN') ? $request->server('HTTP_ORIGIN') : '';

        $PacketSiteCollection = new PacketSiteCollection();
        $websiteObj = $PacketSiteCollection->get('new_domain');
        $allow_origin = [];
        foreach($websiteObj as $website){
            $allow_origin[] = $website['new_domain'];
        }
        $allow_origin[] = 'http://172.28.112.1'; //telgram 机器人
        $allow_origin[] = 'http://54.236.136.17';
        $allow_origin[] = 'http://34.237.24.169';
        $allow_origin[] = 'http://localhost:3000';

       if (in_array($origin, $allow_origin)) {
            $response->header('Access-Control-Allow-Origin', $origin);
            $response->header('Access-Control-Allow-Headers', 'Origin, Content-Type, Cookie, X-CSRF-TOKEN, Accept, Authorization, X-XSRF-TOKEN');
            $response->header('Access-Control-Expose-Headers', 'Authorization, authenticated');
            $response->header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, OPTIONS');
            $response->header('Access-Control-Allow-Credentials', 'true');
       }
        return $response;
    }

}
