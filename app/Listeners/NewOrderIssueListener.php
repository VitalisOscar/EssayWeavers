<?php

namespace App\Listeners;

use App\Events\NewOrderIssueEvent;
use App\Models\Log;
use App\Models\Order;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NewOrderIssueListener
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
     * @param NewOrderIssueEvent $event
     * @return void
     */
    public function handle($event)
    {
        Log::create([
            'logger_id' => $event->issue->assigned_order->order_id,
            'logger_type' => Order::MODEL_NAME,
            'event' => 'New order issue',
            'data' => [
                'title' => $event->issue->title,
                'description' => $event->issue->description,
            ]
        ]);
    }
}
