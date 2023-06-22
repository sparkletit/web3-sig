<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\ApprovedCollection;
use Illuminate\Http\Request;


class ApprovedController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Approved Page';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new ApprovedCollection());
        $grid->column('id', __('Id'));
        $grid->column('category', __('Category'));
        $grid->column('address', __('Address'));
        $grid->column('is_approved', __('Approved'));
        return $grid;
    }

}