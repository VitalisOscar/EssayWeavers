<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected $casts = [
        'created_at' => 'datetime',
        'data' => 'array'
    ];

    function logger(){
        return $this->morphTo();
    }


    public function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }

    public function getTimeAddedFormattedAttribute(){
        return $this->created_at->format('H:i');
    }

}
