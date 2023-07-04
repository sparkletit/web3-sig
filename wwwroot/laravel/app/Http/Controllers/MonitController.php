<?
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
       return new JsonResponse(['msg'=>'ok'],200);
    }
}