<?php

namespace App\Listeners;

use App\Events\OrderAllocationUpdatedEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderAllocationUpdatedListener
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
     * @param OrderAllocationUpdatedEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->allocation->order_id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'Order allocation updated',
            'data' => $event->allocation
        ]);
    }
}
