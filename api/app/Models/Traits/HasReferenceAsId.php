<?php

namespace App\Models\Traits;

trait HasReferenceAsId
{
    /**
     * Initialize the trait
     * Laravel automatically calls this method when the trait is used
     */
    public function initializeHasReferenceAsId()
    {
        // Esconde 'reference' real (mas mantém 'id' para ser sobrescrito)
        $this->hidden = array_merge($this->hidden ?? [], ['reference']);

        // Adiciona campo virtual 'id'
        $this->appends = array_merge($this->appends ?? [], ['id']);
    }

    // Substitui 'id' com 'reference' nas respostas JSON
    public function getIdAttribute()
    {
        return $this->attributes['reference'] ?? null;
    }
}
