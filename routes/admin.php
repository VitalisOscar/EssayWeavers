<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\Orders\OrdersController;
use App\Http\Controllers\Admin\Orders\OrdersDataController;
use App\Http\Controllers\Admin\Orders\SingleOrderController;
use App\Http\Controllers\Admin\Payments\PaymentsController;
use App\Http\Controllers\Admin\Payments\PaymentsDataController;
use App\Http\Controllers\Admin\Sources\SourcesController;
use App\Http\Controllers\Admin\Writers\WritersController;
use App\Http\Controllers\Admin\Writers\WritersDataController;
use Illuminate\Support\Facades\Route;

// Dashboard
Route::get('dashboard-data', [DashboardController::class, 'getDashboardData'])->name('.dashboard_data');


// Writers
Route::prefix('writers')
->name('writers.')
->group(function(){

    Route::get('all', [WritersController::class, 'index'])->name('all');
    Route::any('add', [WritersController::class, 'add'])->name('add');

    Route::get('single/{writer}', [WritersController::class, 'single'])->name('single');
    Route::post('single/{writer}/update', [WritersController::class, 'update'])->name('single.update');

});

// Payments
Route::prefix('payments')
->name('payments.')
->group(function(){

    Route::get('all', [PaymentsController::class, 'index'])->name('all');
    Route::any('add', [PaymentsController::class, 'add'])->name('add');

});

// Sources
Route::prefix('sources')
->name('sources.')
->group(function(){

    Route::any('add', [SourcesController::class, 'add'])->name('add');
    Route::any('view/{source}', [SourcesController::class, 'add'])->name('single');
    Route::get('{type?}', [SourcesController::class, 'index'])->name('all');

    Route::get('single/{source}', [SourcesController::class, 'single'])->name('single');
    Route::post('single/{source}/update', [SourcesController::class, 'update'])->name('single.update');

});

// Orders
Route::prefix('orders')
->name('orders.')
->group(function(){

    Route::any('add', [OrdersController::class, 'add'])->name('add');
    Route::get('list', [OrdersController::class, 'index'])->name('all');

    Route::prefix('single/{order}')
    ->name('single')
    ->group(function(){

        Route::any('', [SingleOrderController::class, 'index']);
        Route::post('allocate', [SingleOrderController::class, 'allocateWriter'])->name('.allocate');
        Route::post('delete-allocation', [SingleOrderController::class, 'deleteAllocation'])->name('.delete-allocation');
        Route::post('add-issue', [SingleOrderController::class, 'addIssue'])->name('.add_issue');
        Route::post('settle', [SingleOrderController::class, 'settleOrder'])->name('.settle');
        Route::post('cancel', [SingleOrderController::class, 'cancelOrder'])->name('.cancel');
        Route::post('add-payment', [SingleOrderController::class, 'addPayment'])->name('.add-payment');
        Route::post('edit-order-price', [SingleOrderController::class, 'editOrderPrice'])->name('.edit-order-price');
        Route::post('edit-writer-deadline', [SingleOrderController::class, 'editWriterDeadline'])->name('.edit-writer-deadline');
        Route::post('edit-order', [SingleOrderController::class, 'editRequirements'])->name('.edit-order');

    });

});

// Data
Route::prefix('data')
->name('data.')
->group(function(){

    Route::prefix('payments')
    ->name('payments')
    ->group(function(){

        Route::get('recepient_types', [PaymentsDataController::class, 'recepientTypes'])->name('.recepient_types');
        Route::get('recepients', [PaymentsDataController::class, 'recepients'])->name('.recepients');

    });

    Route::prefix('orders')
    ->name('orders')
    ->group(function(){

        Route::get('sources', [OrdersDataController::class, 'sources'])->name('.sources');
        Route::get('source_types', [OrdersDataController::class, 'sourceTypes'])->name('.source_types');

    });

    Route::prefix('writers')
    ->name('writers')
    ->group(function(){

        Route::get('all', [WritersDataController::class, 'listWriters'])->name('.writers');

    });

});
