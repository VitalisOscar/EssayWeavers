<?php

namespace App\Http\Controllers\Admin\Payments;

use App\Http\Controllers\Controller;
use App\Models\Payout;
use App\Models\Writer;
use Illuminate\Http\Request;

class PaymentsController extends Controller
{
    function index(Request $request){
        $query = Payout::latest();

        // Filters
        if($request->filled('search')){
//            $query->whereHas('recepient', function($recepient) use($request){
//                $recepient->where(function($q) use($request){
//                    $q->where('name', 'like', '%'.$request->get('search').'%')
//                        ->orWhere(function($q1) use($request){
//                            $q1->where('recepient_type', Writer::MODEL_NAME)
//                                ->orWhere(function($q3) use($request){
//                                    $q3->orWhere('phone', 'like', '%'.$request->get('search').'%')
//                                        ->orWhere('email', 'like', '%'.$request->get('search').'%');
//                                });
//                        });
//                });
//            });
        }

        return $this->json($query->paginate($request->get('limit', 15)));
    }

    function add(Request $request){
        $data = app(PaymentsDataController::class);

        $request->request->add(['raw' => 1]);
        $recepientTypes = $data->recepientTypes($request);
        $recepients = $data->recepients($request)->pluck('id')->toArray();

        $validator = validator($request->all(), [
            'recepient_type' => 'required|in:'.implode(',', $recepientTypes),
            'recepient_id' => 'required|in:'.implode(',',$recepients),
            'amount' => 'required|numeric|min:1'
        ], [
            'recepient_id.in' => 'Select a valid recepient'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'errors' => $validator->errors(),
                'status' => 'Please fix the highlighted errors'
            ]);
        }

        $writer = Payout::create([
            'amount' => $request->post('amount'),
            'recepient_id' => $request->post('recepient_id'),
            'recepient_type' => $request->post('recepient_type'),
        ]);

        if($writer->id){
            return $this->json([
                'success' => true,
                'status' => 'Payment has been recorded successfully'
            ]);
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'
        ]);
    }
}
