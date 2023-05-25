<?php

namespace App\Http\Controllers\Writer\Orders;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
use Illuminate\Http\Request;

class OrdersDataController extends Controller
{
    function statusCounters(Request $request){
        $writer = $this->writer();

        $newOrders = $writer->allocatedOrders()
                ->wherePivot('allocations.status', Allocation::STATUS_PENDING)
                ->count();

        $needReview = $writer->assignedOrders()
                ->needReview()
                ->count();

        return $this->json([
            'new' => $newOrders,
            'need_review' => $needReview
        ]);
    }
}
