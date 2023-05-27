<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Writer;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Route;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    function view($view = null, $data = []){
        $data = array_merge($data, [
            'user' => auth()->user(),
            'current_route' => Route::current()
        ]);

        return view($view, $data);
    }

    /**
     * @return Writer
     */
    function writer(){
        return auth('writer')->user();
    }

    /**
     * @return Admin
     */
    function admin(){
        return auth('admin')->user();
    }

    function json($data){
        return response()->json($data);
    }

}
