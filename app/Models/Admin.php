<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
{
    use HasFactory;

    public function getDateAddedFormattedAttribute(){
        if(!$this->created_at) return '';

        return $this->created_at->format('F j, Y');
    }

    function simpleArray(){
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'date' => $this->date_added_formatted
        ];
    }
}
