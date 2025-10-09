<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

use App\Models\BaseModel;

class Plan extends BaseModel
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reference',
        'original_plan',
        'label',
        'price',
        'type',
        'percentage_discount',
        'storage',
        'lot',
    ];


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'percentage_discount' => 'decimal:2',
        'storage' => 'integer',
        'lot' => 'integer',
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
     * Get the original plan (for annual plans referencing monthly)
     */
    public function originalPlan()
    {
        return $this->belongsTo(Plan::class, 'original_plan', 'reference');
    }

    /**
     * Get the annual variants of this plan (if this is a monthly plan)
     */
    public function annualVariants()
    {
        return $this->hasMany(Plan::class, 'original_plan', 'reference');
    }

    /**
     * Get all user plans using this plan
     */
    public function userPlans()
    {
        return $this->hasMany(UserPlan::class, 'plan_reference', 'reference');
    }
}
