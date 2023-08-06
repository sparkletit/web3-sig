<?php

namespace App\Admin\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransferRatios extends Model
{
    use HasFactory;
    protected $table = 'transfer_ratios';
    protected $casts = [
        'toaddress' =>'json',
    ];
}
