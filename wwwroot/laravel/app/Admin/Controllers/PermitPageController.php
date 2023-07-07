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
        ->title('Signature Manager')
        ->description('You can manage and query your signature data, and execute permit contract calls.')
        //->row($this->connectBtn())
         ->row($this->grid());
    }
}