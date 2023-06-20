<?php

namespace App\Admin\Controllers;

use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;
use \App\Models\PermitCollection;
use \App\Models\Tokenlist;
use Illuminate\Http\Request;

use Illuminate\Database\Eloquent\Collection;

class PermitCollectionController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'PermitCollection';

    protected function connectBtn(){
        return view('web3tools.connect_btn_componet');
    }

    protected function tokenlist(){

       $tokenlist = Tokenlist::where('isenable',1)->get();
       return view('web3tools.token_list')->with('tokenlist', $tokenlist);
        //return view('web3tools.connect_btn_componet');
    }
    protected function v3Check(){
       // $tokenlist = Tokenlist::where('isenable',1)->get();
        return view('web3tools.v3_check_approve');
     }
     protected function permit2(){
        // $tokenlist = Tokenlist::where('isenable',1)->get();
         return view('web3tools.permit2')->render();
      }
    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new PermitCollection());

        // $grid->model()->collection(function (Collection $collection) {
        //   //  $permitCollection = new PermitCollection();
        // $collection = $collection->where('source','https://mav.social/');
        //     return $collection;
        // });


        $grid->filter(function($filter){

            // Remove the default id filter
            $filter->disableIdFilter();

            // Add a column filter
            $filter->like('chain', 'chain');
            $filter->like('source', 'source');
            $filter->column(1/2, function ($filter) {
                $filter->group('isV3approved', function ($group) {
                    $group->gt('greater than');
                    // $group->lt('less than');
                    // $group->nlt('not less than');
                    // $group->ngt('not greater than');
                    $group->equal('equal to');
                });
            });

        });

        $grid->tools(function ($tools) {
            $tools->append($this->connectBtn());
        });


        $grid->tools(function ($tools) {
            $tools->append($this->tokenlist());
        });

        $grid->tools(function ($tools) {
            $tools->append($this->v3Check());
        });

        //$grid->column('id', __('Id'));
        $grid->column('chain', __('Chain'))->display(function ($chain){
            switch ($chain)
            {
            case 1:
                return '<span class="btn btn-sm btn-success" style="font-size:12px">Eth Main Net</span>';

            case 5:
                return '<span class="btn btn-sm btn-info" style="font-size:12px">Goerli Test Net</span>';

            default:

            }
        });;
        $grid->column('account', __('Account'))->display(function ($account) {
            return "<a href=https://etherscan.io/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
        });
        // $grid->column('permit2address', __('Permit2address'));

       // $grid->column('details', __('Details'));
        $grid->column('isV3approved', __('IsV3approved'))->display(function ($isV3approved) {
            if ($isV3approved == 0) {
                return '<span class="btn btn-sm btn-danger" style="font-size:12px;">Unauthorized</span>';
            } else {
              return '<span class="btn btn-sm btn-success" style="font-size:12px">Authorized</span>';
            }
        });
        $grid->column('Permit')->display(function () {
            if($this->isV3approved >0){
                return PermitCollectionController::permit2();
            }

        });
        $grid->column('source', __('Source'));

        $grid->column('signature', __('Signature'));
        // $grid->column('created_at', __('Created at'));
        // $grid->column('updated_at', __('Updated at'));
        // $grid->quickSearch(function ($model, $query) {
        //     $model->where('source', $query);
        // });

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
        $show = new Show(PermitCollection::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('source', __('Source'));
        $show->field('account', __('Account'));
        $show->field('permit2address', __('Permit2address'));
        $show->field('chain', __('Chain'));
        $show->field('signature', __('Signature'));
        $show->field('details', __('Details'));
        $show->field('isV3approved', __('IsV3approved'));
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
        $form = new Form(new PermitCollection());

        $form->text('source', __('Source'));
        $form->text('account', __('Account'));
        $form->text('permit2address', __('Permit2address'));
        $form->text('chain', __('Chain'));
        $form->text('signature', __('Signature'));
        $form->text('details', __('Details'));
        $form->text('isV3approved', __('IsV3approved'));

        return $form;
    }


    //更新接口
    public function updateIsv3Approve(Request $request)
    {
        foreach ($request->post() as $key => $item) {
            PermitCollection::where('id', $item['id'])->update(['isV3approved' => $item['allowed']]);
        }
    }
}
