<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Traits\HasReferenceAsId;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reference',
        'name',
        'avatar',
        'email',
        'role',
        'active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Boot method to auto-generate UUID for reference field
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->reference)) {
                $model->reference = (string) Str::uuid();
            }
        });
    }

    /**
     * Get the user authentication record
     */
    public function userAuth()
    {
        return $this->hasOne(UserAuth::class, 'user_reference', 'reference');
    }

    /**
     * Get all sessions for the user
     */
    public function sessions()
    {
        return $this->hasMany(UserSession::class, 'user_reference', 'reference');
    }

    /**
     * Get all user plans
     */
    public function userPlans()
    {
        return $this->hasMany(UserPlan::class, 'user_reference', 'reference');
    }

    /**
     * Get the active plan for the user
     */
    public function activePlan()
    {
        return $this->hasOne(UserPlan::class, 'user_reference', 'reference')
                    ->where('active', true);
    }

}
