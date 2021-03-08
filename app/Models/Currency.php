<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        "name",
        "rate"
    ];

    public function conversions()
    {
        return $this->hasMany('App\Conversion');
    }
}
