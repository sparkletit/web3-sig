<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use OpenAdmin\Admin\Admin;
use \App\Models\PacketSiteCollection;
class PermitCollection extends Model
{
    use HasFactory;
    protected $table = 'permit_collection';

public function paginate()
{
    $perPage = Request::get('per_page', 10);

    $page = Request::get('page',1);

    $start = ($page-1)*$perPage;

 //根剧账号角色显示行内容
    if(Admin::user()->isRole('administrator')){
        $sql = 'SELECT * FROM `permit_collection` WHERE 1 limit '.$perPage.' offset '.$start;
        $sql2 = 'SELECT * FROM `permit_collection` WHERE 1';
    }else{
        $PacketSiteCollection = new PacketSiteCollection();
        $websiteObj = $PacketSiteCollection->where('owner', Admin::user()->username);

        $websites = [];
        foreach($websiteObj->get('new_domain') as $website){
            $websites[] = $website['new_domain'];
        }

        $sql = "SELECT * FROM `permit_collection` WHERE `source` in ('$websites[0]') limit $perPage offset $start";
        $sql2 = "SELECT * FROM `permit_collection` WHERE `source` in ('$websites[0]')";
    }


    $result = DB::select($sql);
    $result2 = DB::select($sql2);
 
    $rs = ['rs'=>$result];
    extract($rs);
    $total = sizeof($result2);
    $data = static::hydrate($rs);

    $paginator = new LengthAwarePaginator($data, $total, $perPage);

    $paginator->setPath(url()->current());

    return $paginator;
}

public static function with($relations)
{
    return new static;
}


    
}
