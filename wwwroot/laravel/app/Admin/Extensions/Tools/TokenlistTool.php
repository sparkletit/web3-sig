<?php

namespace App\Admin\Extensions\Tools;

use OpenAdmin\Admin\Admin;
use OpenAdmin\Admin\Grid\Tools\AbstractTool;
use Illuminate\Support\Facades\Request;
use \App\Models\Tokenlist;
use \App\Admin\Controllers\PermitCollectionController;
class TokenlistTool extends AbstractTool
{
    protected function tokenlist(){
        $tokenlist = Tokenlist::where('isenable',1)->get();
        return view('web3tools.token_list')->with('tokenlist', $tokenlist);
          //return view('web3tools.connect_btn_componet');
      }

    protected function script()
    {
        $url = Request::fullUrlWithQuery(['token' => '_token_']);

        return <<<EOT
            document.querySelectorAll('select').forEach(el => {
                el.addEventListener('change',function () {
                    var url = "$url".replace('_token_', this.value);
                    admin.ajax.navigate(url);
                })
            });
            EOT;
    }

    public static function tokenAddressValue(){
        return Request::get('token');
    }

    public function render()
    {

        Admin::script($this->script());
        $options = Tokenlist::where('isenable',1)->get();
        
        return view('web3tools.token_list')->with('tokenlist', $options);
    }
}