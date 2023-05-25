<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allocation extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'Pending'; // Pending writer action
    const STATUS_ACCEPTED = 'Accepted'; // Accepted by writer
    const STATUS_DECLINED = 'Declined'; // Declined by writer


    protected $casts = [
        'deadline' => 'datetime',
        'created_at' => 'datetime',
    ];

    protected $guarded = [];


    function order(){
        return $this->belongsTo(Order::class);
    }

    function writer(){
        return $this->belongsTo(Writer::class);
    }


    // Scopes
    function scopePending($q){ $q->where('status', self::STATUS_PENDING); }

    function scopeDeclined($q){ $q->where('status', self::STATUS_DECLINED); }

    function scopeAccepted($q){ $q->where('status', self::STATUS_ACCEPTED); }


    // Accessors
    function getPriceFormattedAttribute(){
        return 'KSh '.number_format($this->price);
    }

    function getDeadlineFormattedAttribute(){
        return $this->deadline->format('F j, Y H:i');
    }

    function getDateAddedFormattedAttribute(){
        if(!$this->created_at) return '';

        return $this->created_at->format('F j, Y');
    }

}
