<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BidderPayment extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'Pending'; // Order is still in progress
    const STATUS_CANCELLED = 'Cancelled'; // Cancelled - wont be paid
    const STATUS_CLEARED = 'Cleared'; // Topped up to bidder's account


    protected $guarded = [];

    protected $appends = ['order', 'amount_formatted', 'date_added_formatted'];


    // Relations
    function bidder(){ return $this->belongsTo(Bidder::class); }

    function order(){ return $this->belongsTo(Order::class); }


    // Scopes
    function scopePending($q){ $q->where('status', self::STATUS_PENDING); }

    function scopeCancelled($q){ $q->where('status', self::STATUS_CANCELLED); }

    function scopeCleared($q){ $q->where('status', self::STATUS_CLEARED); }


    // Accessors
    function getAmountFormattedAttribute(){
        return 'KSh '.number_format($this->amount);
    }

    function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }


    // Helpers
    function isPending(){ return $this->status == self::STATUS_PENDING; }
    function isCancelled(){ return $this->status == self::STATUS_CANCELLED; }
    function isCleared(){ return $this->status == self::STATUS_CLEARED; }


    function toArray(){
        return [
            'id' => $this->id,
            'amount' => $this->amount_formatted,
            'date' => $this->date_added_formatted,
            'type' => $this->type,
            'status' => $this->status,
            'order' => $this->order->simpleArray(),
        ];
    }
}
