<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Source extends Model
{
    use HasFactory;

    const TYPE_PLATFORM = 'Platform';
    const TYPE_INDIVIDUAL = 'Individual';

    const TYPES = [self::TYPE_PLATFORM, self::TYPE_INDIVIDUAL];

    protected $guarded = [];

    protected $appends = ['date_added_formatted'];


    // Relations
    function orders(){
        return $this->hasMany(Order::class);
    }


    // Scopes
    function scopeIndividual($q){
        $q->where('type', self::TYPE_INDIVIDUAL);
    }

    function scopePlatform($q){
        $q->where('type', self::TYPE_PLATFORM);
    }


    // ACcessors
    public function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }



    function toArray(){
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'date' => $this->date_Added_formatted,
        ];
    }

}
