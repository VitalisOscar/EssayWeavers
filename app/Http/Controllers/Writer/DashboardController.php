<?php

namespace App\Http\Controllers\Writer;

use App\Http\Controllers\Controller;
use App\Models\Allocation;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    function getDashboardData(){
        $writer = $this->writer();

        $writer->load(['earnings', 'payouts']);

        $writerArray = $writer->toArray();

        $newOrders = $writer->allocatedOrders()
            ->wherePivot('allocations.status', Allocation::STATUS_PENDING)
            ->with([
                'allocations' => function($q){ $q->latest(); },
                'assignments' => function($q){ $q->latest(); },
                'submissions' => function($q){ $q->latest(); },
                'attachments', 'assignments.payments', 'submissions'
            ])
            ->limit(5)
            ->get()
            ->map(function($order){
                return $order->writerArray();
            });

        return $this->json([
            'accounts' => $writerArray['accounts'],
            'new_orders' => $newOrders
        ]);
    }
}
