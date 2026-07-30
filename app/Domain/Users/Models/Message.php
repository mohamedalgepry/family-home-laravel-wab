<?php

namespace App\Domain\Users\Models;

use App\Domain\Listings\Models\Unit;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'unit_id', 'agent_id', 'client_name', 'client_phone',
        'client_email', 'content', 'status', 'replied_at',
    ];

    protected function casts(): array
    {
        return [
            'replied_at' => 'datetime',
        ];
    }

    protected function serializeDate(\DateTimeInterface $date): string
    {
        return $date->format('Y-m-d H:i');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }

    public function scopeForAgent(Builder $query, User $agent): Builder
    {
        return $query->where('agent_id', $agent->id);
    }
}
