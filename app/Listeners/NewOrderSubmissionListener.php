<?php

namespace App\Listeners;

use App\Events\NewOrderSubmissionEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewOrderSubmissionListener
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
     * @param NewOrderSubmissionEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->submission->assigned_order->order_id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'New order submission'
        ]);
    }
}
