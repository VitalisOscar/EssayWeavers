<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $with = ['recepient'];

    protected $appends = ['amount_formatted', 'date_added_formatted', 'recepient_name'];

    function recepient(){
        return $this->morphTo();
    }


    // Accessors
    function getAmountFormattedAttribute(){
        return 'KES '.number_format($this->amount);
    }

    function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }

    function getRecepientNameAttribute(){
        return $this->recepient->name;
    }


    function toArray(){
        return [
            'id' => $this->id,
            'amount' => $this->amount_formatted,
            'recepient_type' => $this->recepient_type,
            'recepient_name' => $this->recepient->name,
            'date' => $this->date_added_formatted,
        ];
    }

}
