<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use App\Admin\Models\TransferRatios;

class TransferRatiosController extends AdminController{
protected $title = 'TransferRatios';
    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new TransferRatios());
        $grid->column('id', __('Id'));
        $grid->column('owner', __('owner'));
        //$grid->column('toaddress', __('toaddress'));
        $grid->column('toaddress')->display(function () {
            $display = "";
            foreach ($this->toaddress as $key=>$val){
                $display .= '<div class="btn btn-light">'. $val['address'] .'</div> <div class="btn btn-info">' . $val['ratios'] .'%</div>'."<br/><br/>";
            }

             return $display;
        });
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));

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
        $show = new Show(TransferRatios::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('owner', __('owner'));
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
        $form = new Form(new TransferRatios());

            $form->text('owner', __('owner'));
            $form->table('toaddress', function ($table) {
                $table->text('address')->icon("icon-key");
                $table->text('ratios');
                $table->text('desc')->icon("icon-info-circle");
            })->verticalAlign("middle");

        return $form;
    }
}