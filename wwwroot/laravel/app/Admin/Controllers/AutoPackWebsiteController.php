<?php

namespace App\Admin\Controllers;
use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Layout\Content;
use OpenAdmin\Admin\Grid;
use App\Models\PacketSiteCollection;
class AutoPackWebsiteController extends AdminController
{
    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new PacketSiteCollection());
        $grid->column('chain', __('Chain'))->display(function ($chain){
            switch ($chain)
            {
            case 1:
                return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id='.$chain.'>Eth Main Net</span>';
            case 10:
                return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id='.$chain.'>Optismi</span>';
            case 137:
                return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id='.$chain.'>Polygon</span>';
            case 42161:
                return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id='.$chain.'>ARB</span>';
             case 56:
                return '<span class="btn btn-sm btn-info" style="font-size:12px" data-id='.$chain.'>BSC Main Net</span>';
            case 5:
                return '<span class="btn btn-sm btn-info" style="font-size:12px" data-id='.$chain.'>Goerli Test Net</span>';
            default:

            }
        });
        $grid->column('raw_website', __('Website'));
        $grid->column('new_domain', __('Domain'));
        $grid->column('owner', __('Owner'));

        return $grid;
    }

    public function index(Content $content){
        return $content 
        ->title('Websites Management Panel')
        ->description('Description...')
        ->row($this->grid());
        ;
    }


}
