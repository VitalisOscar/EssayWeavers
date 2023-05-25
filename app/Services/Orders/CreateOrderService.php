<?php

namespace App\Services\Orders;

use App\Models\Order;
use App\Services\Service;
use Exception;
use Illuminate\Support\Facades\DB;

class CreateOrderService extends Service{

    protected function execute(){
        $request = request();

        // Check if the order is being allocated now
        $allocating = $request->filled('writer_id');

        // Create the order
        $order = Order::create([
            'title' => $request->post('title'),
            'source_id' => $request->post('source_id'),
            'requirements' => $request->post('requirements'),
            'price' => $request->post('price'),
            'deadline' => $request->post('deadline'),
            'status' => $allocating ? Order::STATUS_ALLOCATED : Order::STATUS_NEW
        ]);

        // Save attachments

        // Allocate to writer
        if($allocating){

        }
    }

}
