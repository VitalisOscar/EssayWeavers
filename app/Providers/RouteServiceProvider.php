<?php

namespace App\Providers;

use App\Models\Allocation;
use App\Models\Bidder;
use App\Models\Order;
use App\Models\Source;
use App\Models\Writer;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    // protected $namespace = 'App\\Http\\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            Route::prefix('api')
                ->middleware('api')
                ->namespace($this->namespace)
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->namespace($this->namespace)
                ->group(base_path('routes/web.php'));
        });

        $this->bindParams();
    }

    private function bindParams(){
        Route::bind('order', function($id){
            if(preg_match('/\/admin\//', URL::current()) && auth('admin')->check()){
                return Order::find($id);
            }

            if(preg_match('/\/writer\//', URL::current()) && auth('writer')->check()){
                return auth('writer')->user()
                    ->allocatedOrders()
                    ->where('orders.id', $id)
                    ->wherePivot('status', '<>', Allocation::STATUS_DECLINED)
                    ->first();
            }

            abort(404);
        });

        Route::bind('writer', function($id){
            if(preg_match('/\/admin\//', URL::current()) && auth('admin')->check()){
                return Writer::find($id);
            }

            abort(404);
        });

        Route::bind('source', function($id){
            if(preg_match('/\/admin\//', URL::current()) && auth('admin')->check()){
                return Source::find($id);
            }

            abort(404);
        });

        Route::bind('bidder', function($id){
            if(preg_match('/\/admin\//', URL::current()) && auth('admin')->check()){
                return Bidder::find($id);
            }

            abort(404);
        });

    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
