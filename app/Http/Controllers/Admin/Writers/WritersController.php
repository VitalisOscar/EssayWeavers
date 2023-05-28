<?php

namespace App\Http\Controllers\Admin\Writers;

use App\Http\Controllers\Controller;
use App\Models\Writer;
use App\Notifications\NewWriterAccountNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class WritersController extends Controller
{
    function index(Request $request, $status = 'all'){
        $status = $request->get('status');

        $query = Writer::with(['earnings', 'payouts']);

        if($status == 'active'){
            $query = Writer::active();
        }else if($status == 'disabled'){
            $query = Writer::disabled();
        }

        // Filters
        if($request->filled('search')){
            $query->where(function($q) use($request){
                $q->where('name', 'like', '%'.$request->get('search').'%')
                    ->orWhere('phone', 'like', '%'.$request->get('search').'%')
                    ->orWhere('email', 'like', '%'.$request->get('search').'%');
            });
        }

        return $this->json($query->paginate($request->get('limit', 15)));
    }

    function single($writer){
        return $this->json($writer);
    }

    function add(Request $request){
        try {
            DB::beginTransaction();

            $validator = validator($request->all(), [
                'name' => 'required',
                'phone' => 'required|unique:writers',
                'email' => 'required|email|unique:writers',
                'password' => 'required',
            ]);

            if ($validator->fails()) {
                return $this->json([
                    'success' => false,
                    'errors' => $validator->errors(),
                    'status' => 'Please fix the highlighted errors'
                ]);
            }

            $writer = Writer::create([
                'name' => $request->post('name'),
                'email' => $request->post('email'),
                'phone' => $request->post('phone'),
                'password' => Hash::make($request->post('password')),
                'status' => Writer::STATUS_ACTIVE
            ]);

            $writer->notify(new NewWriterAccountNotification(
                    $writer,
                    $request->post('password'))
            );

            if ($writer->id) {
                DB::commit();

                return $this->json([
                    'success' => true,
                    'status' => 'Writer account created successfully'
                ]);
            }

            DB::rollBack();
        }catch(\Exception $e){
            DB::rollBack();
        }

        return $this->json([
            'success' => false,
            'status' => 'Something went wrong. Please retry: '.$e->getMessage()
        ]);
    }

    function update(Request $request, $writer){
        $validator = validator($request->all(), [
            'name' => 'required',
            'phone' => 'required|unique:writers,phone,'.$writer->id,
            'email' => 'required|email|unique:writers,email,'.$writer->id,
            'password' => 'nullable',
            'status' => 'required|in:Active,Disabled',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'errors' => $validator->errors(),
                'status' => 'Please fix the highlighted errors'
            ]);
        }

        $writer->update([
            'name' => $request->post('name'),
            'email' => $request->post('email'),
            'phone' => $request->post('phone'),
            'password' => $request->filled('password') ?
                Hash::make($request->post('password')) : $writer->password,
            'status' => $request->post('status')
        ]);

        return $this->json([
            'success' => true,
            'status' => 'Writer account updated successfully'
        ]);
    }
}
