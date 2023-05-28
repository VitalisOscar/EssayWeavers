<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BidderPayment;
use App\Models\Order;
use App\Models\OrderPayment;
use App\Models\Payout;
use App\Models\Writer;

class DashboardController extends Controller
{
    function getDashboardData(){
        $clearedPayments = OrderPayment::cleared()->sum('amount') +
            BidderPayment::cleared()->sum('amount');
        $earnedPayments = Order::settled()->sum('price');

        $netProfit = $earnedPayments - $clearedPayments;
        $writers = Writer::count();
        $totalOrders = Order::count();
        $settledOrders = Order::settled()->count();

        return $this->json([
            'net_profit' => 'KES '.number_format($netProfit),
            'writers' => number_format($writers),
            'total_orders' => number_format($totalOrders),
            'settled_orders' => number_format($settledOrders),
        ]);
    }

    function getProfile(){
        $admin = $this->admin();

        return $this->json([
            'data' => $admin ? $admin->simpleArray() : null
        ]);
    }
}
