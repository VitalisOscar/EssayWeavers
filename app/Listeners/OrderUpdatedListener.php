<?php

namespace App\Listeners;

use App\Events\OrderUpdatedEvent;
use App\Models\Log;
use App\Models\Order;
use App\Notifications\OrderUpdatedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class OrderUpdatedListener
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
     * @param OrderUpdatedEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->order->id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'Order updated'
        ]);

        $event->order->current_writer->notify(new OrderUpdatedNotification($event->order));
    }
}
