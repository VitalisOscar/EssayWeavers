<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Issue extends Model
{
    use HasFactory;

    const MODEL_NAME = 'Issue';

    const STATUS_NEW = 'New'; // Not addressed
    const STATUS_RESOLVED = 'Resolved'; // Marked as resolved
    const STATUS_UNRESOLVABLE = 'Unresolvable'; // Cannot be resolved
    
    protected $guarded = [];

    protected $appends = [
        'date_added_formatted'
    ];


    // Relations
    function assigned_order(){
        return $this->belongsTo(AssignedOrder::class);
    }


    // Scopes
    function scopeNew($q){ $q->where('issues.status', self::STATUS_NEW); }

    function scopeResolved($q){ $q->where('issues.status', self::STATUS_RESOLVED); }

    function scopeUnresolvable($q){ $q->where('issues.status', self::STATUS_UNRESOLVABLE); }

}
