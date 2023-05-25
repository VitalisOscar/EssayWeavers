<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    function index(Request $request, $guard){
        if($guard != 'admin' && $guard != 'writer'){
            abort(404);
        }

        if($request->isMethod('GET')){
            return $this->view($guard == 'admin' ? 'admin.account.login' : 'writer.account.login');
        }

        $validator = validator($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return back()->withInput()->withErrors($validator->errors());
        }

        if(auth($guard)->attempt(
            $request->only(['email', 'password']),
            $request->boolean('remember_me'))
        ){
            if($guard == 'writer' && ($writer = auth('writer')->user()) && !$writer->isActive()){
                return back()->withErrors([
                    'status' => 'Your writer account is disabled'
                ]);
            }

            return redirect()->intended($guard == 'admin' ? '/admin' : '/writer');
        }

        return back()->withInput()->withErrors([
            'status' => 'Login failed. Check the provided credentials and retry'
        ]);

    }

}
