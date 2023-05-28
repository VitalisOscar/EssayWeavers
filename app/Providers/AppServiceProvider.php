<?php

namespace App\Providers;

use App\Models\Bidder;
use App\Models\Order;
use App\Models\Submission;
use App\Models\Writer;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        Relation::morphMap([
            Writer::MODEL_NAME => Writer::class,
            Bidder::MODEL_NAME => Bidder::class,

            Order::MODEL_NAME => Order::class,
            Submission::MODEL_NAME => Submission::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
