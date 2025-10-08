<?php

namespace App\Models\Traits;

trait HasReferenceAsId
{
    // Hide real fields
    protected $hidden = ['reference', 'id'];

    // Add virtual field
    protected $appends = ['id'];

    // Replaces 'id' with 'reference' in responses
    public function getIdAttribute()
    {
        return $this->attributes['reference'] ?? null;
    }
}