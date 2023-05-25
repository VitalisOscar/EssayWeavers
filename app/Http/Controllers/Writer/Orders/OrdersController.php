<?php

namespace App\Http\Controllers\Writer\Orders;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
use Illuminate\Http\Request;

class OrdersController extends Controller
{
    function list(Request $request, $status){
        if(!in_array($status, [
            'allocated', 'active', 'completed', 'need-review', 'cancelled', 'settled'
        ])){
            abort(404);
        }

        if($status == 'allocated'){
            // Get allocated orders which are in pending state
            $orders = $this->writer()->allocatedOrders()
                ->wherePivot('allocations.status', Allocation::STATUS_PENDING);
        }else{
            // Order was assigned at some point
            $orders = $this->writer()->assignedOrders();

            if($status == 'active') $orders->active();
            else if($status == 'completed') $orders->completed();
            else if($status == 'cancelled') $orders->cancelled();
            else if($status == 'settled') $orders->settled();
            else if($status == 'need-review') $orders->needReview();
        }

        return $this->json([
            'data' => $orders->with([
                    'allocations' => function($q){ $q->latest(); },
                    'assignments' => function($q){ $q->latest(); },
                    'submissions' => function($q){ $q->latest(); },
                    'attachments', 'assignments.payments', 'submissions'
                ])
                ->paginate($request->get('limit', 15))
                ->map(function($order){
                    return $order->writerArray();
                })
            ]);
    }
}
