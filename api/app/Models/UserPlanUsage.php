<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Str;

use App\Models\BaseModel;

class UserPlanUsage extends BaseModel
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'user_plan_usages';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'reference',
        'user_plan_reference',
        'lot_used',
        'storage_used',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'lot_used' => 'integer',
        'storage_used' => 'integer',
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
     * Get the user plan that this usage belongs to
     */
    public function userPlan()
    {
        return $this->belongsTo(UserPlan::class, 'user_plan_reference', 'reference');
    }
}
