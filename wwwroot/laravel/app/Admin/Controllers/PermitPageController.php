<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\Controller;
use OpenAdmin\Admin\Admin;
use OpenAdmin\Admin\Controllers\AdminController;

use OpenAdmin\Admin\Layout\Column;
use OpenAdmin\Admin\Layout\Content;
use OpenAdmin\Admin\Layout\Row;
use App\Admin\Controllers\PermitCollectionController;



class PermitPageController extends PermitCollectionController{


    public function index(Content $content)
    {
        return $content 
        ->title('Permit2 Page')
        ->description('Description...')
        //->row($this->connectBtn())
         ->row($this->grid());
    }
}