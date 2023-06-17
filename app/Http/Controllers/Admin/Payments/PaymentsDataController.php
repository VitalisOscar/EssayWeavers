<?php

namespace App\Http\Controllers\Admin\Payments;

use App\Http\Controllers\Controller;
use App\Models\Bidder;
use App\Models\Writer;
use Illuminate\Http\Request;

class PaymentsDataController extends Controller
{
    function recepientTypes(Request $request){
        $data = [
            'Writer', 'Bidder'
        ];

        if($request->get('raw')){
            return $data;
        }

        return $this->json($data);
    }

    function recepients(Request $request){
        $recepients = collect([]);

        if(strtolower($request->get('recepient_type')) == 'writer'){
            $recepients = Writer::with(['earnings', 'payouts'])
                ->get()
                ->map(function($writer){
                    return $writer->toArray();
                });
        }

        if(strtolower($request->get('recepient_type')) == 'bidder'){
            $recepients = Bidder::with(['payouts', 'payments'])
                ->get()
                ->map(function($writer){
                    return $writer->toArray();
                });
        }

        if($request->get('raw')) return $recepients;

        return $this->json($recepients);
    }
}
