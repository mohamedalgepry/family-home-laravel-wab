<?php

namespace App\Domain\Points\Models;

use App\Domain\Listings\Models\Unit;
use App\Domain\Users\Models\User;
use Illuminate\Database\Eloquent\Model;

class PointsTransaction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'manager_id', 'unit_id', 'points', 'type', 'balance_after',
        'notes', 'performed_by', 'created_at',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
            'balance_after' => 'integer',
            'created_at' => 'datetime',
        ];
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function performer()
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
