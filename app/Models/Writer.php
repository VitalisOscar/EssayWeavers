<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Writer extends Authenticatable
{
    use HasFactory, Notifiable;

    const MODEL_NAME = 'Writer';

    const STATUS_ACTIVE = 'Active';
    const STATUS_DISABLED = 'Disabled';

    protected $guarded = [];

    protected $appends = ['date_added_formatted'];


    // Relations
    function payouts(){
        return $this->morphMany(Payout::class, 'recepient');
    }

    function earnings(){
        return $this->hasManyThrough(OrderPayment::class, AssignedOrder::class);
    }

    function fines(){
        return $this->hasManyThrough(Fine::class, AssignedOrder::class);
    }

    function allocatedOrders(){
        return $this->belongsToMany(Order::class, 'allocations')->withPivot([
            'deadline', 'price', 'status'
        ]);
    }

    function allocations(){
        return $this->hasMany(Allocation::class);
    }

    function assignedOrders(){
        return $this->belongsToMany(Order::class, 'assigned_orders')->withPivot([
            'deadline', 'status'
        ]);
    }


    // Scopes
    public function scopeActive($query){
        return $query->where('status', self::STATUS_ACTIVE);
    }

    public function scopeDisabled($query){
        return $query->where('status', self::STATUS_DISABLED);
    }


    // Accessors
    public function getDateAddedFormattedAttribute(){
        if(!$this->created_at) return '';

        return $this->created_at->format('F j, Y');
    }


    // Helpers
    public function isActive(){
        return $this->status == self::STATUS_ACTIVE;
    }

    function getPendingEarnings(){
        return $this->earnings
            ->where('status', OrderPayment::STATUS_PENDING)
            ->sum('amount');
    }

    function getCancelledEarnings(){
        return $this->earnings
            ->where('status', OrderPayment::STATUS_CANCELLED)
            ->sum('amount');
    }

    function getClearedEarnings(){
        return $this->earnings
            ->where('status', OrderPayment::STATUS_CLEARED)
            ->sum('amount');
    }

    function getTotalPayouts(){
        return $this->payouts
            ->sum('amount');
    }

    function toArray(){
        $clearedEarnings = 0;
        $cancelledEarnings = 0;
        $pendingEarnings = 0;
        $totalPayouts = 0;

        if($this->relationLoaded('earnings') && $this->relationLoaded('payouts')){
            $clearedEarnings = $this->getClearedEarnings();
            $cancelledEarnings = $this->getCancelledEarnings();
            $pendingEarnings = $this->getPendingEarnings();
            $totalPayouts = $this->getTotalPayouts();
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'date' => $this->date_added_formatted,
            'cpp' => $this->cpp,
            'cpp_formatted' => 'KES '.number_format($this->cpp),
            'accounts' => [
                'pending' => $pendingEarnings,
                'pending_formatted' => 'KES '.number_format($pendingEarnings),

                'cancelled' => $cancelledEarnings,
                'cancelled_formatted' => 'KES '.number_format($cancelledEarnings),

                'cleared' => $clearedEarnings,
                'cleared_formatted' => number_format($clearedEarnings),

                'paid_out' => $totalPayouts,
                'paid_out_formatted' => 'KES '.number_format($totalPayouts),

                'available' => $clearedEarnings - $totalPayouts,
                'available_formatted' => 'KES '.number_format($clearedEarnings - $totalPayouts),
            ],
        ];
    }

    function simpleArray(){

        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'status' => $this->status,
            'date' => $this->date_added_formatted
        ];
    }
}
