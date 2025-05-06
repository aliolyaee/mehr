<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;

class AuthenticateWithJwt
{
    public function handle(Request $request, Closure $next)
    {
        try {
            // Read token from cookie
            $token = $request->cookie('jwt');

            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'توکن ارائه نشده است',
                ], 401);
            }

            // Set token in JWTAuth
            JWTAuth::setToken($token);

            // Authenticate token
            if (!$user = JWTAuth::authenticate()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'توکن نامعتبر است',
                ], 401);
            }

            // Set user in Auth system
            Auth::setUser($user);

        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'توکن منقضی شده است',
            ], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'توکن نامعتبر است',
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطای احراز هویت',
                'errors' => $e->getMessage(),
            ], 500);
        }

        return $next($request);
    }
}