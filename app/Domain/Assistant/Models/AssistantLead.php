<?php

namespace App\Domain\Assistant\Models;

use Illuminate\Database\Eloquent\Model;

class AssistantLead extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'context',
        'status',
        'chat_history',
        'lead_score',
        'lead_status'
    ];

    protected $casts = [
        'chat_history' => 'array'
    ];
}
