<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RedirectWriterIfDisabled
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $writer = $request->user('writer');

        if(!($writer && $writer->isActive())){
            auth('writer')->logout();

            if (! $request->expectsJson()) {
                return redirect()->route('login', 'writer');
            }else{
                return response()->json([
                    'success' => false,
                    'status' => 'Your writer account is disabled',
                    'data' => null
                ]);
            }
        }

        return $next($request);
    }
}
