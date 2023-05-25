<?php

namespace App\Http\Controllers\Writer\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LoginController extends Controller
{
    function index(Request $request){
        if($request->isMethod('GET')){
            return $this->view('writer.account.login');
        }

        $validator = validator($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if($validator->fails()){
            return back()->withInput()->withErrors($validator->errors());
        }

        if(auth('writer')->attempt(
            $request->only(['email', 'password']),
            $request->boolean('remember_me'))
        ){
            return redirect()->intended('writer.dashboard');
        }

        return back()->withInput()->withErrors([
            'status' => 'Login failed. Check the provided credentials and retry'
        ]);

    }
    
}
