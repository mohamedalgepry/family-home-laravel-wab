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
        'name', 'slug', 'email', 'password', 'manager_id',
    ];

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->slug)) {
                $user->slug = static::generateUniqueSlug($user->name);
            }
        });

        static::updating(function ($user) {
            if ($user->isDirty('name') && empty($user->slug)) {
                $user->slug = static::generateUniqueSlug($user->name);
            }
        });
    }

    public static function generateUniqueSlug(string $name): string
    {
        $baseSlug = \Illuminate\Support\Str::slug($name);
        if (empty($baseSlug)) {
            $baseSlug = 'user'; // fallback for fully arabic names if slug fails, although Str::slug supports arabic somewhat, it's better to be safe. But wait, Laravel's Str::slug supports Arabic natively in recent versions, but sometimes we need to pass a dictionary. Actually, Laravel 9+ supports Arabic well.
        }
        $slug = $baseSlug;
        $count = 1;
        
        while (static::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $count;
            $count++;
        }
        
        return $slug;
    }

    protected $hidden = ['password', 'remember_token'];

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Domain\Users\Notifications\ResetPasswordNotification($token));
    }

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
