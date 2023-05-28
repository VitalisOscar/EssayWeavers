<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('admin/{path?}', function () {
    return view('admin.app');
})
->where('path', '.*')
->middleware('auth:admin');


Route::get('writer/{path?}', function () {
    return view('writer.app');
})
->where('path', '.*')
->middleware('auth:writer', 'active');

Route::get('login/{guard}', [LoginController::class, 'index'])->name('login');
Route::post('login/{guard}', [LoginController::class, 'index'])->name('login');

Route::post('account/update-password/{guard}', [PasswordController::class, 'index'])
    ->name('update_password')->middleware('active');
Route::get('logout/{guard}', function($guard){
    auth($guard)->logout();
    return redirect()->route('login', $guard);
})->name('logout');

Route::prefix('ajax/admin')
->middleware('auth:admin')
->name('admin.')
->group(base_path('routes/admin.php'));

Route::prefix('ajax/writer')
->middleware(['auth:writer', 'active'])
->name('writer.')
->group(base_path('routes/writer.php'));

Route::get('settings', \App\Http\Controllers\SettingsController::class)
    ->name('settings')
    ->middleware('auth:admin');

Route::get('attachment/{attachment}', [\App\Http\Controllers\AttachmentsController::class, 'getAttachment'])
    ->name('download_attachment')
    ->middleware('auth:writer,admin');
