<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TokenV3Collection extends Model
{
    use HasFactory;
    protected $table = 'token_v3_approved';
}
