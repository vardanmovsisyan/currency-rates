<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ToConversion extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        "currency_id",
        "from_conversion_id",
        "amount",
    ];

    public function currency()
    {
        return $this->belongsTo('App\Currency');
    }

    public function from_conversion()
    {
        return $this->belongsTo('App\FromConversion');
    }
}
