<?php

namespace App\Listeners;

use App\Events\WriterDeadlineUpdatedEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class WriterDeadlineUpdatedListener
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
     * @param WriterDeadlineUpdatedEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->order->id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'Writer deadline updated'
        ]);
    }
}
