<?php

namespace App\Admin\Controllers;
use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Layout\Column;
use OpenAdmin\Admin\Layout\Content;
use OpenAdmin\Admin\Layout\Row;
use App\Admin\Forms\AutoWebpacketFrom;

class AutoPackWebsiteController extends AdminController
{
    public function index(Content $content){
        return $content 
        ->title('Auto Webpacket Page')
        ->description('Description...')
        ->row(new AutoWebpacketFrom());
        ;
    }


}
