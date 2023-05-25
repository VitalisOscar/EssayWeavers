<?php

namespace App\Http\Controllers\Writer\Payments;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    function payouts(Request $request){
        $payments = $this->writer()
            ->payouts();

        if($request->filled('sort')){
            if($request->get('sort') == 'lowest-amount'){
                $payments->orderBy('amount', 'asc');
            }else if($request->get('sort') == 'highest-amount'){
                $payments->orderBy('amount', 'desc');
            }if($request->get('sort') == 'oldest'){
                $payments->oldest();
            }else{
                $payments->latest();
            }
        }else{
            $payments->latest();
        }

        return $this->json([
            'data' => $payments->paginate($request->get('limit', 15))
                ->map(function($item){ return $item->toArray(); })
        ]);
    }

    function fines(Request $request){
        $fines = $this->writer()
            ->fines()
            ->with(['order']);

        if($request->filled('sort')){
            if($request->get('sort') == 'lowest-amount'){
                $fines->orderBy('amount', 'asc');
            }else if($request->get('sort') == 'highest-amount'){
                $fines->orderBy('amount', 'desc');
            }if($request->get('sort') == 'oldest'){
                $fines->oldest();
            }else{
                $fines->latest();
            }
        }else{
            $fines->latest();
        }

        return $this->json([
            'data' => $fines->paginate($request->get('limit', 15))
                ->map(function($item){ return $item->toArray(); })
        ]);
    }

    function earnings(Request $request){
        $earnings = $this->writer()
            ->earnings()
            ->with(['assigned_order', 'assigned_order.order']);

        if($request->filled('sort')){
            if($request->get('sort') == 'lowest-amount'){
                $earnings->orderBy('amount', 'asc');
            }else if($request->get('sort') == 'highest-amount'){
                $earnings->orderBy('amount', 'desc');
            }if($request->get('sort') == 'oldest'){
                $earnings->oldest();
            }else{
                $earnings->latest();
            }
        }else{
            $earnings->latest();
        }

        return $this->json([
            'data' => $earnings->paginate($request->get('limit', 15))
                ->map(function($item){ return $item->toArray(); })
        ]);
    }
}
