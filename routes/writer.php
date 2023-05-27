<?php

use App\Http\Controllers\Writer\Account\LoginController;
use App\Http\Controllers\Writer\DashboardController;
use App\Http\Controllers\Writer\Orders\OrdersController;
use App\Http\Controllers\Writer\Orders\OrdersDataController;
use App\Http\Controllers\Writer\Orders\SingleOrderController;
use App\Http\Controllers\Writer\Payments\PaymentsController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('dashboard-data', [DashboardController::class, 'getDashboardData'])->name('dashboard_data');
Route::get('profile', [DashboardController::class, 'getProfile'])->name('profile');

// Payments
Route::prefix('payments')
->name('payments.')
->group(function(){

    Route::get('payouts', [PaymentsController::class, 'payouts'])->name('payouts');
    Route::get('earnings', [PaymentsController::class, 'earnings'])->name('earnings');
    Route::get('fines', [PaymentsController::class, 'fines'])->name('fines');

});

// Orders
Route::prefix('orders')
->name('orders.')
->group(function(){

    Route::get('list/{status}', [OrdersController::class, 'list'])->name('list');

    Route::prefix('single/{order}')
    ->name('single.')
    ->group(function(){

        Route::get('', [SingleOrderController::class, 'index'])->name('view');

        Route::post('accept-allocation', [SingleOrderController::class, 'acceptOrderAllocation'])->name('accept_allocation');
        Route::post('decline-allocation', [SingleOrderController::class, 'declineOrderAllocation'])->name('decline_allocation');
        Route::post('add-submission', [SingleOrderController::class, 'addSubmission'])->name('add_submission');

    });

});

// Data
Route::prefix('data')
->name('data.')
->group(function(){

    Route::prefix('orders')
    ->name('orders')
    ->group(function(){

        Route::get('status-counters', [OrdersDataController::class, 'statusCounters'])->name('.status_counters');

    });

});

