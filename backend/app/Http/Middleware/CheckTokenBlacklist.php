<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class CheckTokenBlacklist
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = JWTAuth::parseToken()->getToken();
            $tokenHash = hash('sha256', $token); // هش کردن توکن

            $blacklisted = DB::table('token_blacklist')
                ->where('token_hash', $tokenHash)
                ->where('expires_at', '>', now())
                ->exists();

            if ($blacklisted) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'توکن باطل شده است',
                    'meta' => [
                        'api_version' => '1.0.0',
                        'response_time' => now()->toDateTimeString(),
                    ],
                ], 401);
            }

            return $next($request);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'توکن نامعتبر است',
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 401);
        }
    }
}