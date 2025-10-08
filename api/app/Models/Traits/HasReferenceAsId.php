<?php

namespace App\Models\Traits;

trait HasReferenceAsId
{
    // Esconde 'reference' e 'id' reais
    protected $hidden = ['reference', 'id'];

    // Adiciona campo virtual
    protected $appends = ['id'];

    // Substitui 'id' com 'reference' nas respostas JSON
    public function getIdAttribute()
    {
        return $this->attributes['reference'] ?? null;
    }
}
