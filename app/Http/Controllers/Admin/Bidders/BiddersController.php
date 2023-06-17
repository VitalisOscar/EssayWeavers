<?php

namespace App\Http\Controllers\Admin\Bidders;

use App\Http\Controllers\Controller;
use App\Models\Bidder;
use Illuminate\Http\Request;

class BiddersController extends Controller
{
    function index(Request $request){
        $query = Bidder::with(['orders', 'payouts', 'payments']);

        if($request->filled('search')){
            $query->where('name', 'like', '%'.$request->get('search').'%');
        }

        return $this->json([
            'data' => $query->paginate($request->get('limit', 15))
                ->map(function($item){ return $item->toArray(); })
        ]);
    }

    function single($bidder){
        $bidder->load(['orders', 'payouts', 'payments']);

        return $this->json($bidder->toArray());
    }

    function add(Request $request){
        $validator = validator($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'commission_rate' => 'required|numeric|min:0'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        $bidder = Bidder::create([
            'name' => $request->post('name'),
            'email' => $request->post('email'),
            'commission_rate' => $request->post('commission_rate'),
        ]);

        if($bidder->id){
            return $this->json([
                'success' => true,
                'status' => 'Bidder has been added successfully'
            ]);
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'
        ]);
    }

    function update(Request $request, $bidder){

        $validator = validator($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'commission_rate' => 'required|numeric|min:0'
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        $bidder->update([
            'name' => $request->post('name'),
            'email' => $request->post('email'),
            'commission_rate' => $request->post('commission_rate'),
        ]);

        return $this->json([
            'success' => true,
            'status' => 'Bidder has been updated successfully'
        ]);
    }
}
