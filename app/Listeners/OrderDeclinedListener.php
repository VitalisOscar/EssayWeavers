<?php

namespace App\Listeners;

use App\Events\OrderDeclinedEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderDeclinedListener
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
     * @param OrderDeclinedEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->allocation->order->id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'Order declined'
        ]);
    }
}
