<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    const MODEL_NAME = 'Submission';

    protected $casts = [
        'created_at' => 'datetime',
        'is_final' => 'boolean'
    ];

    protected $guarded = [];

    protected $appends = ['date_added_formatted'];

    protected $with = ['attachments'];


    // Relations
    function attachments(){
        return $this->morphMany(Attachment::class, 'parent');
    }

    function assigned_order(){
        return $this->belongsTo(AssignedOrder::class);
    }


    // Accessors
    function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y H:i');
    }



    function toArray(){
        return [
            'id' => $this->id,
            'answer' => $this->answer,
            'is_final' => $this->is_final,
            'attachments' => $this->attachments->map(function($attachment){
                return $attachment->toArray();
            }),
            'date' => $this->date_added_formatted,
            'date_raw' => $this->created_at,
        ];
    }

}
