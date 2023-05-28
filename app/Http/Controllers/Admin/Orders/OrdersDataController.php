<?php

namespace App\Http\Controllers\Admin\Orders;

use App\Http\Controllers\Controller;
use App\Models\Bidder;
use App\Models\Source;
use Illuminate\Http\Request;

class OrdersDataController extends Controller
{
    function sourceTypes(Request $request){
        $data = [
            'Platform', 'Individual'
        ];

        if($request->get('raw')){
            return $data;
        }

        return $this->json($data);
    }

    function sources(Request $request){
        $query = Source::query();

        if($request->filled('type')){
            $type = strtolower($request->get('type'));

            if($type == 'platform') $query->platform();
            if($type == 'individual') $query->individual();
        }

        $data = $query->get();

        if($request->get('raw')){
            return $data;
        }

        return $this->json($data);
    }

    function bidders(Request $request){
        $data = Bidder::all();

        if($request->get('raw')){
            return $data;
        }

        return $this->json($data);
    }

}
