<?php

namespace App\Domain\Users\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgentProfile extends Model
{
    protected $fillable = [
        'user_id',
        'avatar',
        'phone',
        'whatsapp',
        'facebook',
        'linkedin',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
