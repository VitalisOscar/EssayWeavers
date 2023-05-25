<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cancellation extends Model
{
    protected $guarded = [];

    protected $appends = ['date_added_formatted'];


    function order(){ return $this->belongsTo(Order::class); }


    public function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y H:i');
    }
}
