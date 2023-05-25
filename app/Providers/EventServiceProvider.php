<?php

namespace App\Providers;

use App\Events\NewOrderEvent;
use App\Events\NewOrderIssueEvent;
use App\Events\NewOrderPaymentEvent;
use App\Events\NewOrderSubmissionEvent;
use App\Events\OrderAcceptedEvent;
use App\Events\OrderAllocatedEvent;
use App\Events\OrderAllocationUpdatedEvent;
use App\Events\OrderCancelledEvent;
use App\Events\OrderCompletedEvent;
use App\Events\OrderDeclinedEvent;
use App\Events\OrderPriceUpdatedEvent;
use App\Events\OrderSettledEvent;
use App\Events\WriterDeadlineUpdatedEvent;
use App\Listeners\NewOrderIssueListener;
use App\Listeners\NewOrderListener;
use App\Listeners\NewOrderPaymentListener;
use App\Listeners\NewOrderSubmissionListener;
use App\Listeners\OrderAcceptedListener;
use App\Listeners\OrderAllocatedListener;
use App\Listeners\OrderAllocationUpdatedListener;
use App\Listeners\OrderCancelledListener;
use App\Listeners\OrderCompletedListener;
use App\Listeners\OrderDeclinedListener;
use App\Listeners\OrderPriceUpdatedListener;
use App\Listeners\OrderSettledListener;
use App\Listeners\WriterDeadlineUpdatedListener;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        NewOrderEvent::class => [NewOrderListener::class],
        OrderAllocatedEvent::class => [OrderAllocatedListener::class],
        OrderAllocationUpdatedEvent::class => [OrderAllocationUpdatedListener::class],
        OrderAcceptedEvent::class => [OrderAcceptedListener::class],
        OrderDeclinedEvent::class => [OrderDeclinedListener::class],
        NewOrderIssueEvent::class => [NewOrderIssueListener::class],
        NewOrderSubmissionEvent::class => [NewOrderSubmissionListener::class],
        OrderCompletedEvent::class => [OrderCompletedListener::class],
        OrderSettledEvent::class => [OrderSettledListener::class],
        OrderCancelledEvent::class => [OrderCancelledListener::class],
        NewOrderPaymentEvent::class => [NewOrderPaymentListener::class],
        OrderPriceUpdatedEvent::class => [OrderPriceUpdatedListener::class],
        WriterDeadlineUpdatedEvent::class => [WriterDeadlineUpdatedListener::class],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
