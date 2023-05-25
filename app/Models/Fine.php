<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fine extends Model
{
    use HasFactory;

    const STATUS_EFFECTED = 'Effected'; // Deducted from writer account
    const STATUS_CANCELLED = 'Cancelled'; // Cancelled - wont be deducted

    protected $guarded = [];

    // protected $with = ['assigned_order', 'assigned_order.order'];

    protected $appends = ['order', 'amount_formatted', 'date_added_formatted'];


    // Relations
    function assigned_order(){ return $this->belongsTo(AssignedOrder::class); }


    // Scopes
    function scopeEffected($q){ $q->where('status', self::STATUS_EFFECTED); }

    function scopeCancelled($q){ $q->where('status', self::STATUS_CANCELLED); }


    // Accessors
    function getAmountFormattedAttribute(){
        return 'KSh '.number_format($this->amount);
    }

    function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }

    function getOrderAttribute(){
        return $this->assigned_order->order;
    }


    // Helpers
    function isEffected(){ return $this->status == self::STATUS_EFFECTED; }
    function isCancelled(){ return $this->status == self::STATUS_CANCELLED; }
    
    function toArray(){
        return [
            'id' => $this->id,
            'amount' => $this->amount_formatted,
            'order' => $this->order->simpleArray(),
            'date' => $this->date_added_formatted,
            'status' => $this->status,
        ];
    }
}
