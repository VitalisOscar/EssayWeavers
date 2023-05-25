<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssignedOrder extends Model
{
    use HasFactory;

    protected $guarded = [];

    const STATUS_IN_PROGRESS = 'In Progress'; // writer is still working on it
    const STATUS_COMPLETED = 'Completed'; // Order was completed and settled
    const STATUS_CANCELLED = 'Cancelled'; // Order was cancelled after it had been assigned

    protected $casts = [
        'deadline' => 'datetime',
        'created_at' => 'datetime',
    ];


    // Relations
    function order(){
        return $this->belongsTo(Order::class);
    }

    function writer(){
        return $this->belongsTo(Writer::class);
    }

    function payments(){
        return $this->hasMany(OrderPayment::class);
    }

    function submissions(){
        return $this->hasMany(Submission::class);
    }



    function getPriceAttribute(){
        return $this->payments->sum('amount');
    }

    function getDeadlineFormattedAttribute(){
        return $this->deadline->format('F j, Y H:i');
    }

    function getPriceFormattedAttribute(){
        return 'KSh '.number_format($this->price);
    }

}
