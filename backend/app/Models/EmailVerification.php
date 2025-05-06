<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailVerification extends Model
{
    protected $fillable = [
        'email',
        'code',
        'user_data',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];
}