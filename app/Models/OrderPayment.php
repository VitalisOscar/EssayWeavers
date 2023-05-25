<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderPayment extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'Pending'; // Order is still in progress
    const STATUS_CANCELLED = 'Cancelled'; // Cancelled - wont be paid
    const STATUS_CLEARED = 'Cleared'; // Topped up to writer's account

    const TYPE_PAYMENT = 'Order Payment';
    const TYPE_SUPPLEMENTARY_PAYMENT = 'Supplementary Payment';
    const TYPE_TIP = 'Tip';
    const TYPES = [self::TYPE_TIP, self::TYPE_SUPPLEMENTARY_PAYMENT];

    
    protected $guarded = [];

    protected $appends = ['order', 'amount_formatted', 'date_added_formatted'];


    // Relations
    function assigned_order(){ return $this->belongsTo(AssignedOrder::class); }


    // Scopes
    function scopePending($q){ $q->where('status', self::STATUS_PENDING); }

    function scopeCancelled($q){ $q->where('status', self::STATUS_CANCELLED); }

    function scopeCleared($q){ $q->where('status', self::STATUS_CLEARED); }

    function scopePayment($q){ $q->where('type', self::TYPE_PAYMENT); }

    function scopeSupplementary($q){ $q->where('type', self::TYPE_SUPPLEMENTARY_PAYMENT); }
    
    function scopeTip($q){ $q->where('type', self::TYPE_TIP); }


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
    function isPending(){ return $this->status == self::STATUS_PENDING; }
    function isCancelled(){ return $this->status == self::STATUS_CANCELLED; }
    function isCleared(){ return $this->status == self::STATUS_CLEARED; }
    
    function isPayment(){ return $this->type == self::TYPE_PAYMENT; }
    function isSupplementary(){ return $this->type == self::TYPE_SUPPLEMENTARY_PAYMENT; }
    function isTip(){ return $this->type == self::TYPE_TIP; }

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
