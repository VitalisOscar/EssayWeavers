<?php

namespace App\Listeners;

use App\Events\OrderSettledEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderSettledListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param OrderSettledEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->order->id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'Order settled'
        ]);
    }
}
