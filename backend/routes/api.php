<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;


Route::post('/register', [AuthController::class, 'register'])->name('auth.register');
Route::post('/validate', [AuthController::class, 'verifyEmail'])->name('auth.verify-email');
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api')->name('auth.logout');
