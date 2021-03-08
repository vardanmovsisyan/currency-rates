<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FromConversion extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        "currency_id",
        "user_id",
        "amount",
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function currency()
    {
        return $this->belongsTo('App\Currency');
    }

    public function to_conversion()
    {
        return $this->hasOne('App\ToConversion');
    }
}
