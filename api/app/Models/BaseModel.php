<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\HasReferenceAsId;

class BaseModel extends Model
{
    use HasReferenceAsId;
}
