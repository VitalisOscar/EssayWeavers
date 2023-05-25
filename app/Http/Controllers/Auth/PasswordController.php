<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Rules\CorrectPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PasswordController extends Controller
{
    function index(Request $request, $guard){
        if($guard != 'admin' && $guard != 'writer'){
            abort(404);
        }

        $user = auth($guard)->user();

        $validator = validator($request->all(), [
            'current_password' =>  ['required', new CorrectPassword($user)],
            'new_password' =>  'required',
            'confirm_password' =>  'required|same:new_password',
        ]);

        if($validator->fails()){
            return $this->json([
                'success' => false,
                'status' => 'Please fix the highlighted errors',
                'errors' => $validator->errors()
            ]);
        }

        // Update password
        $user->password = Hash::make($request->post('new_password'));
        $user->save();

        return $this->json([
            'success' => true,
            'status' => 'Your password has been successfully updated',
        ]);
    }

}
