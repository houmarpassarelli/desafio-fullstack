<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

use App\Models\BaseModel;

class UserPlan extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_plans';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reference',
        'user_reference',
        'plan_reference',
        'expires_in',
        'meta_data',
        'active',
        'exchange_type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_in' => 'datetime',
        'meta_data' => 'array',
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
     * Get the user that owns the plan
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_reference', 'reference');
    }

    /**
     * Get the plan details
     */
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_reference', 'reference');
    }

    /**
     * Get the usage statistics for this plan
     */
    public function usage()
    {
        return $this->hasOne(UserPlanUsage::class, 'user_plan_reference', 'reference');
    }
}
