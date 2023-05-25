<?php

namespace App\Http\Controllers\Admin\Sources;

use App\Http\Controllers\Controller;
use App\Models\Source;
use Illuminate\Http\Request;

class SourcesController extends Controller
{
    function index(Request $request, $type = 'all'){
        $query = Source::query();

        // Filters
        if($type == 'individuals'){
            $query->individual();
        }else if($type == 'platforms'){
            $query->platform();
        }else if($type != 'all'){
            abort(404);
        }

        if($request->filled('search')){
            $query->where('name', 'like', '%'.$request->get('search').'%');
        }

        return $this->json([
            'data' => $query->paginate($request->get('limit', 15))
                ->map(function($item){ return $item->toArray(); })
        ]);
    }

    function single($source){
        return $this->json($source->toArray());
    }

    function add(Request $request){
        $validator = validator($request->all(), [
            'name' => 'required',
            'type' => 'required|in:'.implode(',', Source::TYPES)
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        $source = Source::create([
            'name' => $request->post('name'),
            'type' => $request->post('type'),
        ]);

        if($source->id){
            return $this->json([
                'success' => true,
                'status' => 'Order source has been added successfully'
            ]);
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry'
        ]);
    }

    function update(Request $request, $source){

        $validator = validator($request->all(), [
            'name' => 'required',
            'type' => 'required|in:'.implode(',', Source::TYPES)
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        $source->update([
            'name' => $request->post('name'),
            'type' => $request->post('type'),
        ]);

        return $this->json([
            'success' => true,
            'status' => 'Order source has been updated successfully'
        ]);
    }
}
