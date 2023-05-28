<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bidder extends Model
{
    use HasFactory;

    const MODEL_NAME = 'Bidder';

    protected $guarded = [];

    protected $appends = ['date_added_formatted'];


    // Relations
    function orders(){
        return $this->hasMany(Order::class);
    }

    function payouts(){
        return $this->morphMany(Payout::class, 'recepient');
    }

    function payments(){
        return $this->hasMany(BidderPayment::class);
    }


    // ACcessors
    public function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }



    function toArray(){
        $totalOrders = 0;
        $totalOrderValue = 0;
        $totalCommission = 0;
        $totalPaid = 0;
        $totalPending = 0;

        if($this->relationLoaded('orders')){
            $totalOrders = $this->orders->count();
            $totalOrderValue = $this->orders->sum('price');
        }

        if($this->relationLoaded('payouts')){
            $totalPaid = $this->payouts->sum('amount');
        }

        if($this->relationLoaded('payments')){
            $totalCommission = $this->payments->where('status', '<>', BidderPayment::STATUS_CANCELLED)->sum('amount');
            $totalPending = $this->payments->where('status', BidderPayment::STATUS_PENDING)->sum('amount');
        }

        $totalAvailable = $totalCommission - $totalPaid - $totalPending;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'commission_rate' => $this->commission_rate,
            'commission_rate_formatted' => $this->commission_rate.'%',
            'date' => $this->date_added_formatted,
            'performance' => [
                'total_orders' => $totalOrders,
                'total_orders_formatted' => number_format($totalOrders),
                'total_order_value' => $totalOrderValue,
                'total_order_value_formatted' => number_format($totalOrderValue),
                'total_commission' => $totalCommission,
                'total_commission_formatted' => number_format($totalCommission),
                'total_commission_paid' => $totalPaid,
                'total_commission_paid_formatted' => number_format($totalPaid),
                'total_commission_pending' => $totalPending,
                'total_commission_pending_formatted' => number_format($totalPending),
                'total_commission_available' => $totalAvailable,
                'total_commission_available_formatted' => number_format($totalAvailable),
            ]
        ];
    }

}
