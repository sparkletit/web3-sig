<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\Tokenlist;

class TokenlistController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Tokenlist';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Tokenlist());

 //       $grid->column('id', __('Id'));
 
        $grid->column('Token Name')->display(function () {

            switch($this->chain){
                case 1:
                    $prefix = 'https://etherscan.io/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-success\" target=\"__blank\">$this->name</a>";

                case 5:
                    $prefix = 'https://goerli.etherscan.io/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-dark\" target=\"__blank\">$this->name</a>";

                case 10:
                    $prefix = 'https://optimistic.etherscan.io/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-danger\" target=\"__blank\">$this->name</a>";

                case 137:
                    $prefix = 'https://polygonscan.com/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-warning\" target=\"__blank\">$this->name</a>";

                case 42161:
                    $prefix = 'https://arbiscan.io/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-success\" target=\"__blank\">$this->name</a>";

                case 56:
                    $prefix = 'https://bscscan.com/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-info\" target=\"__blank\">$this->name</a>";
                case 8453:
                    $prefix = 'https://basescan.org/address/';
                    $url = $prefix . $this->address;
                return  "<a href=$url class=\"btn btn-info\" target=\"__blank\">$this->name</a>";

                default:
                return "null";
            }
        });
        $grid->column('address', __('Token Address'));
        // $grid->column('name', __('Name'));
        // $grid->column('abi', __('Abi'));
        $grid->column('isenable', __('Isenable'));
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
        $show = new Show(Tokenlist::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('chain', __('Chain'));
        $show->field('address', __('Address'));
        $show->field('name', __('Name'));
        $show->field('abi', __('Abi'));
        $show->field('isenable', __('Isenable'));
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
        $form = new Form(new Tokenlist());

        $form->number('chain', __('Chain'));
        $form->text('address', __('Address'));
        $form->text('name', __('Name'));
        $form->textarea('abi', __('Abi'));
        $form->switch('isenable', __('Isenable'));

        return $form;
    }
}
