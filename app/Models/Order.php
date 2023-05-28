<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    const MODEL_NAME = 'Order';

    const STATUS_NEW = 'New'; // Unallocated
    const STATUS_ALLOCATED = 'Allocated'; // Allocated to a writer, not yet accepted by writer
    const STATUS_ACTIVE = 'Active'; // Writer working on it
    const STATUS_COMPLETED = 'Completed'; // Solution submitted by writer
    const STATUS_SETTLED = 'Settled'; // Order finalized, perhaps payment from source even received
    const STATUS_CANCELLED = 'Cancelled'; // Cancelled by writer or admin, won't be worked on

    protected $guarded = [];

    protected $with = ['attachments'];

    protected $casts = [
        'deadline' => 'datetime',
    ];

    protected $appends = [
        'date_added_formatted', 'deadline_formatted',
        'price_formatted', 'current_writer'
    ];


    function source(){
        return $this->belongsTo(Source::class);
    }

    function bidder(){
        return $this->belongsTo(Bidder::class);
    }

    function allocated_writers(){
        return $this->belongsToMany(Writer::class, 'allocations');
    }

    function allocations(){
        return $this->hasMany(Allocation::class);
    }

    function assignments(){
        return $this->hasMany(AssignedOrder::class);
    }

    function assigned_writers(){
        return $this->belongsToMany(Writer::class, 'assigned_orders');
    }

    function cancellations(){
        return $this->hasMany(Cancellation::class);
    }

    function logs(){
        return $this->morphMany(Log::class, 'logger');
    }

    function issues(){
        return $this->hasManyThrough(Issue::class, AssignedOrder::class);
    }

    function payments(){
        return $this->hasManyThrough(OrderPayment::class, AssignedOrder::class);
    }

    function bidder_payment(){
        return $this->hasOne(BidderPayment::class);
    }

    function attachments(){
        return $this->morphMany(Attachment::class, 'parent');
    }

    function submissions(){
        return $this->hasManyThrough(Submission::class, AssignedOrder::class);
    }


    // Scopes
    function scopeNew($q){ $q->where('orders.status', self::STATUS_NEW); }

    function scopeAllocated($q){ $q->where('orders.status', self::STATUS_ALLOCATED); }

    function scopeActive($q){ $q->where('orders.status', self::STATUS_ACTIVE); }

    function scopeCompleted($q){ $q->where('orders.status', self::STATUS_COMPLETED); }

    function scopeSettled($q){ $q->where('orders.status', self::STATUS_SETTLED); }

    function scopeCancelled($q){ $q->where('orders.status', self::STATUS_CANCELLED); }

    function scopeNeedReview($q){
        // Has some new issues
        $q->whereHas('issues', function($issues){
            $issues->new();
        });
    }


    // Accessors
    function getCurrentWriterAttribute(){
        if($this->isNew()){
            return null;
        }

        if($this->isAllocated()){
            return $this->allocated_writers->first();
        }

        return $this->assigned_writers->first();
    }

    function getCurrentAllocationAttribute(){
        if($this->isAllocated()){
            return $this->allocations
                ->sortByDesc('created_at')
                ->where('status', '<>', Allocation::STATUS_DECLINED)
                ->first();
        }

        // return $this->assignments
        //     ->sortByDesc('created_at')
        //     ->first();
    }

    function getPriceFormattedAttribute(){
        return 'KSh '.number_format($this->price);
    }

    function getDeadlineFormattedAttribute(){
        return $this->deadline->format('F j, Y H:i');
    }

    public function getDateAddedFormattedAttribute(){
        return $this->created_at->format('F j, Y');
    }


    // Helpers
    function deadlineElapsed(){
        return now()->isAfter($this->deadline);
    }

    function deadlineNear(){
        return !$this->deadlineElapsed() &&
            now()->diffInHours($this->deadline) < 24;
    }

    function isNew(){ return $this->status == self::STATUS_NEW; }

    function isAllocated(){ return $this->status == self::STATUS_ALLOCATED; }

    function isActive(){ return $this->status == self::STATUS_ACTIVE; }

    function isCompleted(){ return $this->status == self::STATUS_COMPLETED; }

    function isSettled(){ return $this->status == self::STATUS_SETTLED; }

    function isCancelled(){ return $this->status == self::STATUS_CANCELLED; }

    function loadFresh(){
        $this->load([
            'source', 'allocated_writers', 'assigned_writers',
            'logs', 'attachments', 'allocations', 'assignments',
            'assignments.payments', 'assignments.payments.order',
            'submissions' => function($q){
                $q->latest();
            },
        ]);

        return $this;
    }

    function adminFresh(){
        $this->load([
            'source', 'bidder', 'bidder_payment', 'logs', 'attachments', 'allocations.writer',
            'assignments.writer', 'assignments.payments',
            'allocations' => function($q){
                $q->latest();
            },
            'assignments' => function($q){
                $q->latest();
            },
            'submissions' => function($q){
                $q->latest();
            },
        ]);

        return $this->adminArray();
    }

    function writerFresh(){
        $this->load([
            'allocations' => function($q){
                $q->latest();
            },
            'assignments' => function($q){
                $q->latest();
            },
            'submissions' => function($q){
                $q->latest();
            },
            'attachments', 'assignments.payments'
        ]);

        return $this->writerArray();
    }

    function adminArray(){
        if($this->isAllocated()){
            $allocation = $this->allocations
                ->sortByDesc('created_at')
                ->where('status', '<>', Allocation::STATUS_DECLINED)
                ->first();
        }else{
            $allocation = $this->assignments
                ->sortByDesc('created_at')
                ->first();
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'price_raw' => $this->price,
            'price_formatted' => $this->price_formatted,
            'deadline_raw' => $this->deadline,
            'deadline_formatted' => $this->deadline_formatted,
            'current_writer' => isset($allocation, $allocation->writer) ?
                $allocation->writer->toArray() : null,
            'writer_price_raw' => $allocation->price ?? null,
            'writer_price_formatted' => $allocation->price_formatted ?? null,
            'writer_deadline_raw' => $allocation->deadline ?? null,
            'writer_deadline_formatted' => $allocation->deadline_formatted ?? null,
            'requirements' => $this->requirements,
            'source' => $this->source->toArray(),
            'bidder_commission' => $this->bidder_payment ? $this->bidder_payment->amount : 0,
            'bidder_commission_formatted' => number_format($this->bidder_payment ? $this->bidder_payment->amount : 0),
            'bidder' => $this->bidder ? $this->bidder->toArray() : [],
            'date' => $this->date_added_formatted,
            'status' => $this->status,
            'attachments' => $this->attachments->map(function($attachment){
                return $attachment->toArray();
            }),
            'submissions' => $this->submissions->map(function($submission){
                return $submission->toArray();
            })
        ];
    }

    function writerArray(){
        if($this->isAllocated()){
            $allocation = $this->allocations
                ->sortByDesc('created_at')
                ->where('status', '<>', Allocation::STATUS_DECLINED)
                ->first();
        }else{
            $allocation = $this->assignments
                ->sortByDesc('created_at')
                ->first();
        }

        return [
            'id' => $this->id,
            'title' => $this->title,
            'price_raw' => $allocation->price ?? null,
            'price_formatted' => $allocation->price_formatted ?? null,
            'deadline_raw' => $allocation->deadline ?? null,
            'deadline_formatted' => $allocation->deadline_formatted ?? null,
            'requirements' => $this->requirements,
            'date' => $this->date_added_formatted,
            'status' => $this->status,
            'attachments' => $this->attachments->map(function($attachment){
                return $attachment->toArray();
            }),
            'submissions' => $this->submissions->map(function($submission){
                return $submission->toArray();
            })
        ];
    }

    function simpleArray(){
        return [
            'id' => $this->id,
            'title' => $this->title,
        ];
    }
}
