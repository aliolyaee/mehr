<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\EmailVerification;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validation
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:users,name',
                'email' => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
            ]);

            // Generate 6-digit code
            $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

            // Store temporary user data and verification code
            EmailVerification::updateOrCreate(
                ['email' => $request->email],
                [
                    'code' => $code,
                    'user_data' => json_encode([
                        'name' => $request->name,
                        'email' => $request->email,
                        'password' => Hash::make($request->password),
                    ]),
                    'expires_at' => Carbon::now()->addMinutes(30), // Expires in 30 minutes
                ]
            );

            // Send email
            Mail::send('emails.email_verification', ['code' => $code], function ($message) use ($request) {
                $message->to($request->email)->subject('کد تأیید ایمیل');
            });

            return response()->json([
                'status' => 'success',
                'message' => 'کد تأیید به ایمیل شما ارسال شد. لطفاً کد را وارد کنید.',
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 200);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطا در اعتبارسنجی',
                'errors' => $e->errors(),
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطای سرور',
                'errors' => $e->getMessage(),
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        try {
            // Validation
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'code' => 'required|string|size:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'خطا در اعتبارسنجی',
                    'errors' => $validator->errors(),
                    'meta' => [
                        'api_version' => '1.0.0',
                        'response_time' => now()->toDateTimeString(),
                    ],
                ], 422);
            }

            // Check verification code
            $verification = EmailVerification::where('email', $request->email)
                                            ->where('code', $request->code)
                                            ->first();

            if (!$verification) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'کد تأیید یا ایمیل نامعتبر است',
                    'meta' => [
                        'api_version' => '1.0.0',
                        'response_time' => now()->toDateTimeString(),
                    ],
                ], 400);
            }

            // Check code expiration
            if (Carbon::now()->gt($verification->expires_at)) {
                $verification->delete();
                return response()->json([
                    'status' => 'error',
                    'message' => 'کد تأیید منقضی شده است. لطفاً دوباره ثبت‌نام کنید.',
                    'meta' => [
                        'api_version' => '1.0.0',
                        'response_time' => now()->toDateTimeString(),
                    ],
                ], 400);
            }

            // Register user
            $userData = json_decode($verification->user_data, true);
            $user = User::create([
                'name' => $userData['name'],
                'email' => $userData['email'],
                'password' => $userData['password'],
            ]);

            // Delete verification record
            $verification->delete();

            // Generate token
            $token = JWTAuth::fromUser($user);

            // Store token in secure cookie
            $cookie = cookie('jwt', $token, config('jwt.ttl'), '/', null, true, true, false, 'Strict');

            // Success response
            return response()->json([
                'status' => 'success',
                'message' => 'ایمیل تأیید شد و ثبت‌نام با موفقیت انجام شد',
                'data' => [
                    'user' => new UserResource($user),
                    'auth' => [
                        'token' => $token,
                        'type' => 'Bearer',
                        'expires_in' => config('jwt.ttl', 60) * 60,
                    ],
                ],
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 201)->withCookie($cookie);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطای سرور',
                'errors' => $e->getMessage(),
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string|min:6',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $credentials = $request->only('email', 'password');

            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'ایمیل یا رمز عبور اشتباه است',
                ], 401);
            }

            $user = Auth::user();

            // Store token in secure cookie
            $cookie = cookie('jwt', $token, config('jwt.ttl'), '/', null, true, true, false, 'Strict');

            return response()->json([
                'status' => 'success',
                'message' => 'ورود با موفقیت انجام شد',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'auth' => [
                        'token' => $token,
                        'type' => 'bearer',
                    ],
                ],
            ], 200)->withCookie($cookie);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطای سرور',
                'errors' => $e->getMessage(),
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::parseToken()->getToken();
            $payload = JWTAuth::setToken($token)->getPayload();
            $expiresAt = \Carbon\Carbon::createFromTimestamp($payload->get('exp'));
            $tokenHash = hash('sha256', $token);

            DB::table('token_blacklist')->insert([
                'token' => $token,
                'token_hash' => $tokenHash,
                'expires_at' => $expiresAt,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            JWTAuth::invalidate($token);

            // Clear the cookie
            $cookie = cookie()->forget('jwt');

            return response()->json([
                'status' => 'success',
                'message' => 'خروج با موفقیت انجام شد',
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 200)->withCookie($cookie);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'توکن نامعتبر است',
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'خطای سرور',
                'errors' => $e->getMessage(),
                'meta' => [
                    'api_version' => '1.0.0',
                    'response_time' => now()->toDateTimeString(),
                ],
            ], 500);
        }
    }
}