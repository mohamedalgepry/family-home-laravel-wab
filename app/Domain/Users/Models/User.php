<?php

namespace App\Domain\Users\Models;

use App\Domain\Listings\Models\Project;
use App\Domain\Listings\Models\Unit;
use App\Domain\Points\Models\PointsTransaction;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'manager_id',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'points_balance' => 'integer',
            'initial_monthly_balance' => 'integer',
        ];
    }

    public function manager()
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    public function agents()
    {
        return $this->hasMany(self::class, 'manager_id');
    }

    public function projects()
    {
        return $this->hasMany(Project::class, 'user_id');
    }

    public function units()
    {
        return $this->hasMany(Unit::class, 'user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'agent_id');
    }

    public function pointsTransactions()
    {
        return $this->hasMany(PointsTransaction::class, 'manager_id');
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    public function isAgent(): bool
    {
        return $this->role === 'agent';
    }

    public function profile(): HasOne
    {
        return $this->hasOne(AgentProfile::class);
    }

    public function scopeManagers(Builder $query): Builder
    {
        return $query->where('role', 'manager');
    }

    public function scopeAgents(Builder $query): Builder
    {
        return $query->where('role', 'agent');
    }
}
