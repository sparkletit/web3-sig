<?php

namespace App\Admin\Controllers;
use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Layout\Content;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
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

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(PacketSiteCollection::findOrFail($id));

        $show->field('id', __('Id'));

        $show->field('raw_website', __('Website'));
        $show->field('new_domain', __('Domain'));
        $show->field('owner', __('Owner'));

        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new PacketSiteCollection());

        $form->text('source', __('Source'));
        $form->text('raw_website', __('Website'));
        $form->text('new_domain', __('Domain'));
        $form->text('owner', __('Owner'));

        return $form;
    }

    public function index(Content $content){
        return $content 
        ->title('Websites Management Panel')
        ->description('Description...')
        ->row($this->grid());
        ;
    }


}
